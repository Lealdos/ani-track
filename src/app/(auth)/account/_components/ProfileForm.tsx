'use client'

import { useEffect, useRef } from 'react'
import { useSession } from '@/lib/Auth/auth-clients'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import Image from 'next/image'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    profileFormSchema,
    type ProfileFormValuesType,
} from '@/lib/validations/profileSchema'

interface User {
    id?: string
    name?: string
    userName?: string
    email?: string
    image?: string | null
}

export function ProfileForm({ user }: { user?: User }) {
    const { data: session } = useSession()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<ProfileFormValuesType>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: session?.user?.name || user?.name || '',
            userName: session?.user?.userName || user?.userName || '',
            email: session?.user?.email || user?.email || '',
            image: (session?.user?.image as string) || user?.image || undefined,
        },
    })

    useEffect(() => {
        form.reset({
            name: session?.user?.name || user?.name || '',
            userName: session?.user?.userName || user?.userName || '',
            email: session?.user?.email || user?.email || '',
            image: (session?.user?.image as string) || user?.image || undefined,
        })
    }, [session])
    const onSubmit = async (values: ProfileFormValuesType) => {
        const preview = form.getValues('image')

        try {
            const response = await fetch('/api/users/update-profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    userName: values.userName,
                    email: values.email,
                    image: preview,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to update profile')
            }

            // Refetch session to update client state
            globalThis.location.reload()

            toast.success('Profile updated successfully!')
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to update profile'
            )
        }
    }

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 1024 * 1024) {
            toast.error('Image must be less than 1MB')
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            const result = reader.result as string
            form.setValue('image', result)
        }
        reader.readAsDataURL(file)
    }

    return (
        <Card className="min-h-80 border-gray-700 border-b-red-900 bg-linear-to-bl from-rose-950 via-violet-950 to-rose-950 p-8">
            <div className="space-y-8">
                {/* Edit Profile Header */}
                <div className="text-center">
                    <h2 className="mb-8 text-2xl font-semibold text-white">
                        Edit Profile
                    </h2>

                    {/* Avatar Section */}
                    <div className="mb-8 flex flex-col items-center gap-4">
                        <div className="relative h-32 w-32">
                            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-gray-600 bg-gray-700">
                                {form.watch('image') || session?.user?.image ? (
                                    <Image
                                        src={
                                            (form.watch('image') as string) ||
                                            (session?.user?.image as string)
                                        }
                                        alt="Profile"
                                        width={128}
                                        height={128}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <svg
                                        className="h-16 w-16 text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute right-0 bottom-0 rounded-full bg-cyan-400 p-2 text-gray-900 transition-colors hover:bg-cyan-500"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <div className="text-center">
                            <p className="cursor-pointer text-sm font-medium text-cyan-400 hover:text-cyan-300">
                                Upload profile photo
                            </p>
                            <p className="mt-1 text-xs text-gray-300">
                                Only images, maximum 1 MB
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col justify-center-safe space-y-6"
                    >
                        {/* Username */}
                        <FormField
                            control={form.control}
                            name="userName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg text-gray-300">
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter username"
                                            className="border-gray-600 bg-violet-950/50 text-white placeholder-gray-500 focus:ring-red-700 md:text-lg"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Display Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg text-gray-300">
                                        Display Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter display name"
                                            className="border-gray-600 bg-violet-950/50 text-white placeholder-gray-500 focus:ring-red-700 md:text-lg"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg text-gray-300">
                                        Email Address
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter email address"
                                            type="email"
                                            disabled
                                            className="cursor-not-allowed border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-500 md:text-lg"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs text-gray-400 md:text-sm">
                                        If you change your email, you will
                                        receive a new verification email.
                                    </FormDescription>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className="mx-auto w-fit rounded-lg border border-red-600 bg-linear-to-br from-red-900 via-slate-900/80 to-red-900 py-2 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {form.formState.isSubmitting
                                ? 'Updating...'
                                : 'Update Profile'}
                        </Button>
                    </form>
                </Form>
            </div>
        </Card>
    )
}
