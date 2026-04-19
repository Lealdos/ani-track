'use client'

import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
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
import { signIn as emailSignIn } from '@/server/userAuth'

import {
    userLoginSchema,
    UserLoginSchemaType,
} from '@/lib/validations/userSchema'
import { Google } from '@/components/ui/svgs/google'
import { PasswordInput } from '@/components/shared/forms/PasswordInput'

export default function SignInForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const { refetch } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const form = useForm<UserLoginSchemaType>({
        resolver: zodResolver(userLoginSchema),
        defaultValues: {
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
    //    console.log(form.formState.errors) <-- For debugging purposes check validation errors of react-hook-form
    async function onSubmit(values: UserLoginSchemaType) {
        setIsLoading(true)
        const { success, message } = await emailSignIn(
            values.email,
            values.password
        )

        if (success) {
            toast.success(
                `${message as string} Please check your email for verification.`
            )
            refetch()
            router.push('/account')
        } else {
            toast.error(message as string)
        }

        setIsLoading(false)
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="border-border/50 bg-card">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl text-foreground">Welcome back</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Login with your Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            className="space-y-8"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <div className="ju grid items-center gap-6 align-middle">
                                <Button
                                    className="m-auto w-fit p-2"
                                    onClick={signInWithGoogle}
                                    type="button"
                                    variant="outline"
                                >
                                    <Google className="mr-2" />
                                    Sign in with Google
                                </Button>

                                <div className="grid gap-6">
                                    <div className="flex flex-col gap-6 text-center text-sm">
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
                                                    <PasswordInput
                                                        label="Password"
                                                        name="password"
                                                        control={form.control}
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
                                        className="w-full bg-primary hover:bg-primary/90"
                                        disabled={isLoading}
                                        type="submit"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            'Login'
                                        )}
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    you don't have an account?{' '}
                                    <Link
                                        className="underline underline-offset-4"
                                        href="/sign-up"
                                    >
                                        Signup
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
