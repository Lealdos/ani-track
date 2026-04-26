'use client'

import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signIn, useSession } from '@/lib/Auth/auth-clients'
import { cn } from '@/lib/utils'
import { signUp } from '@/server/userAuth'

import {
    userRegistrationSchema,
    UserRegistrationSchemaType,
} from '@/lib/validations/userSchema'
import { Google } from '@/components/ui/svgs/google'
import { PasswordInput } from '@/components/shared/forms/PasswordInput'
import { useRouter, useSearchParams } from 'next/navigation'

export function SignUpForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const { refetch } = useSession()

    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackURL = searchParams.get('callbackURL') || '/account'

    const form = useForm<UserRegistrationSchemaType>({
        resolver: zodResolver(userRegistrationSchema),
        defaultValues: {
            userName: '',
            email: '',
            password: '',
            fullName: '',
        },
    })

    const signInWithGoogle = async () => {
        await signIn.social({
            provider: 'google',
            callbackURL,
        })
    }
    //    console.log(form.formState.errors) <-- For debugging purposes check validation errors of react-hook-form
    async function onSubmit(values: UserRegistrationSchemaType) {
        setIsLoading(true)
        try {
            const { success, message } = await signUp({
                email: values.email,
                password: values.password,
                username: values.userName,
                fullName: values.fullName,
            })

            if (success) {
                toast.success(
                    `${message} Please check your email for verification.`
                )
                refetch()
                router.push(callbackURL)
            } else {
                toast.error(message)
            }

            setIsLoading(false)
        } catch (error) {
            toast.error(`${error as string} An error occurred during sign up.`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="border-red-900 bg-linear-to-r from-slate-900 via-purple-900 to-slate-900">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                        Welcome 'o hai io!'
                    </CardTitle>
                    <CardDescription>
                        Signup with your Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            className="space-y-8"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-4">
                                    <Button
                                        className="m-auto w-fit p-2"
                                        onClick={signInWithGoogle}
                                        type="button"
                                        variant="outline"
                                    >
                                        <Google className="mr-2" />
                                        Signup with Google
                                    </Button>
                                </div>

                                <div className="grid gap-6">
                                    <div className="flex flex-col gap-6 text-center text-sm">
                                        <FormField
                                            control={form.control}
                                            name="userName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        User name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="AnimeFan123"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-red-600" />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="m@example.com"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="fullName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Full Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="john doe"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid gap-3">
                                        <div className="flex flex-col gap-2">
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <PasswordInput
                                                        label="Password"
                                                        field={field}
                                                    />
                                                )}
                                            />
                                            <Link
                                                className="ml-auto text-sm underline-offset-4 hover:underline"
                                                href="/forgot-password"
                                            >
                                                Forgot your password?
                                            </Link>
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full bg-purple-600 hover:bg-purple-700"
                                        disabled={isLoading}
                                        type="submit"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            'Sign up'
                                        )}
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Already have an account?{' '}
                                    <Link
                                        className="underline underline-offset-4"
                                        href={`/login${callbackURL !== '/account' ? `?callbackURL=${encodeURIComponent(callbackURL)}` : ''}`}
                                    >
                                        Login
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <div className="text-center text-xs text-balance text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
                By clicking continue, you agree to our{' '}
                <Link href="#">Terms of Service</Link> and{' '}
                <Link href="#">Privacy Policy</Link>.
            </div>
        </div>
    )
}
