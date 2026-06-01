'use client'

import { Loader2 } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
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
    const t = useTranslations('Auth')
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
                toast.success(`${message} ${t('redirecting')}`)
                refetch()
                router.push(callbackURL)
            } else {
                toast.error(message)
            }

            setIsLoading(false)
        } catch (error) {
            toast.error(`${error as string} ${t('signupError')}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="bg-linear-to-r border-red-900 from-slate-900 via-purple-900 to-slate-900">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                        {t('welcomeSignup')}
                    </CardTitle>
                    <CardDescription>
                        {t('signupWithGoogleDesc')}
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
                                        {t('signupWithGoogle')}
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
                                                        {t('userName')}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder={t(
                                                                'userNamePlaceholder'
                                                            )}
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
                                        <FormField
                                            control={form.control}
                                            name="fullName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {t('fullName')}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder={t(
                                                                'fullNamePlaceholder'
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
                                            t('signUp')
                                        )}
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    {t('alreadyHaveAccount')}{' '}
                                    <Link
                                        className="underline underline-offset-4"
                                        href={`/login${callbackURL !== '/account' ? `?callbackURL=${encodeURIComponent(callbackURL)}` : ''}`}
                                    >
                                        {t('login')}
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
