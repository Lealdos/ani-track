'use client'

import { Loader2 } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
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
    const t = useTranslations('Auth')
    const { refetch } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackURL = searchParams.get('callbackURL') || '/account'
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
            callbackURL,
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
            toast.success(`${message} ${t('redirecting')}`)
            refetch()
            router.push(callbackURL || '/account')
        } else {
            toast.error(message || t('loginFailed'))
        }

        setIsLoading(false)
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="bg-linear-to-br border-red-900 from-slate-900 via-purple-900 to-slate-900">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                        {t('welcomeBack')}
                    </CardTitle>
                    <CardDescription>
                        {t('loginWithGoogleDesc')}
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
                                    {t('signInWithGoogle')}
                                </Button>

                                <div className="grid gap-6">
                                    <div className="flex flex-col gap-6 text-center text-sm">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {t('email')}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder={t(
                                                                'emailPlaceholder'
                                                            )}
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
                                                        label={t('password')}
                                                        field={field}
                                                    />
                                                )}
                                            />
                                            <Link
                                                className="ml-auto text-sm underline-offset-4 hover:underline"
                                                href="/forgot-password"
                                            >
                                                {t('forgotPassword')}
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
                                            t('login')
                                        )}
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    {t('noAccount')}{' '}
                                    <Link
                                        className="underline underline-offset-4"
                                        href={`/sign-up${callbackURL !== '/account' ? `?callbackURL=${encodeURIComponent(callbackURL)}` : ''}`}
                                    >
                                        {t('signupLink')}
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary text-balance text-center text-xs">
                {t('termsPrefix')} <Link href="#">{t('termsOfService')}</Link>{' '}
                {t('and')} <Link href="#">{t('privacyPolicy')}</Link>.
            </div>
        </div>
    )
}
