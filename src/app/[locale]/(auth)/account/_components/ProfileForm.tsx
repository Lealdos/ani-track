'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from '@/lib/Auth/auth-clients'
import { useForm, useWatch } from 'react-hook-form'
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
    const t = useTranslations('Account')
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

    const watchedImage = useWatch({ control: form.control, name: 'image' })

    useEffect(() => {
        form.reset({
            name: session?.user?.name || user?.name || '',
            userName: session?.user?.userName || user?.userName || '',
            email: session?.user?.email || user?.email || '',
            image: (session?.user?.image as string) || user?.image || undefined,
        })
    }, [session, form, user?.name, user?.userName, user?.email, user?.image])
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
                throw new Error(error.message || t('profileUpdateFailed'))
            }

            // Refetch session to update client state
            globalThis.location.reload()

            toast.success(t('profileUpdated'))
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : t('profileUpdateFailed')
            )
        }
    }

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 1024 * 1024) {
            toast.error(t('imageTooLarge'))
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
        <Card className="bg-linear-to-bl min-h-80 border-gray-700 border-b-red-900 from-rose-950 via-violet-950 to-rose-950 p-8">
            <div className="space-y-8">
                {/* Edit Profile Header */}
                <div className="text-center">
                    <h2 className="mb-8 text-2xl font-semibold text-white">
                        {t('editProfile')}
                    </h2>

                    {/* Avatar Section */}
                    <div className="mb-8 flex flex-col items-center gap-4">
                        <div className="relative h-32 w-32">
                            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-gray-600 bg-gray-700">
                                {watchedImage || session?.user?.image ? (
                                    <Image
                                        src={
                                            (watchedImage as string) ||
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
                                className="absolute bottom-0 right-0 rounded-full bg-cyan-400 p-2 text-gray-900 transition-colors hover:bg-cyan-500"
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
                                {t('uploadPhoto')}
                            </p>
                            <p className="mt-1 text-xs text-gray-300">
                                {t('photoHint')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="justify-center-safe flex flex-col space-y-6"
                    >
                        {/* Username */}
                        <FormField
                            control={form.control}
                            name="userName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg text-gray-300">
                                        {t('username')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t(
                                                'usernamePlaceholder'
                                            )}
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
                                        {t('displayName')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t(
                                                'displayNamePlaceholder'
                                            )}
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
                                        {t('emailAddress')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t(
                                                'emailAddressPlaceholder'
                                            )}
                                            type="email"
                                            disabled
                                            className="cursor-not-allowed border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-500 md:text-lg"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs text-gray-400 md:text-sm">
                                        {t('emailChangeHint')}
                                    </FormDescription>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className="bg-linear-to-br mx-auto w-fit rounded-lg border border-red-600 from-red-900 via-slate-900/80 to-red-900 py-2 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {form.formState.isSubmitting
                                ? t('updating')
                                : t('updateProfile')}
                        </Button>
                    </form>
                </Form>
            </div>
        </Card>
    )
}
