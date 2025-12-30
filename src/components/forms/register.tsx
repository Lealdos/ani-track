'use client'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
import { signIn } from '@/lib/Auth/auth-clients'
import { cn } from '@/lib/utils/utils'
import { signUp } from '@/server/userAuth'

import {
    userRegistrationSchema,
    UserRegistrationSchemaType,
} from '@/lib/validations/userSchema'
import { Google } from '../ui/svgs/google'
import { GoogleWordmark } from '../ui/svgs/googleWordmark'

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()
    const form = useForm<UserRegistrationSchemaType>({
        resolver: zodResolver(userRegistrationSchema),
        defaultValues: {
            userName: '',
            email: '',
            password: '',
        },
    })

    const signInWithGoogle = async () => {
        await signIn.social({
            provider: 'google',
            callbackURL: '/',
        })
    }

    async function onSubmit(values: UserRegistrationSchemaType) {
        setIsLoading(true)

        const { success, message } = await signUp(
            values.email,
            values.password,
            values.userName
        )

        if (success) {
            toast.success(
                `${message as string} Please check your email for verification.`
            )
            router.push('/dashboard')
        } else {
            toast.error(message as string)
        }

        setIsLoading(false)
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="border-red-900 bg-linear-to-r from-slate-900 via-purple-900 to-slate-900">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
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
                                        className="w-full"
                                        onClick={signInWithGoogle}
                                        type="button"
                                        variant="outline"
                                    >
                                        Signup with Google
                                    </Button>
                                </div>

                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <FormField
                                            control={form.control}
                                            name="userName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Username
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="AnimeFan123"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
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
                                    </div>
                                    <div className="grid gap-3">
                                        <div className="flex flex-col gap-2">
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Password
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="********"
                                                                {...field}
                                                                type="password"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
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
                                        className="w-full"
                                        disabled={isLoading}
                                        type="submit"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            'Signup'
                                        )}
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Already have an account?{' '}
                                    <Link
                                        className="underline underline-offset-4"
                                        href="/login"
                                    >
                                        Login
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our{' '}
                <Link href="#">Terms of Service</Link> and{' '}
                <Link href="#">Privacy Policy</Link>.
            </div>
        </div>
    )
}
