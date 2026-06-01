'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { Form, FormField } from '@/components/ui/form'
import {
    passwordFormSchema,
    type PasswordFormValuesType,
} from '@/lib/validations/profileSchema'
import { PasswordInput } from '@/components/shared/forms/PasswordInput'

export function PasswordForm() {
    const t = useTranslations('Account')
    const form = useForm<PasswordFormValuesType>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (values: PasswordFormValuesType) => {
        try {
            const response = await fetch('/api/users/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || t('passwordUpdateFailed'))
            }

            toast.success(t('passwordUpdated'))
            form.reset()
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : t('passwordUpdateFailed')
            )
        }
    }

    return (
        <Card className="min-h-92 bg-linear-to-br border-gray-950 border-b-red-900 from-rose-950 via-fuchsia-950 to-rose-900 p-8">
            <div className="mx-auto max-w-md">
                <h2 className="mb-8 text-center text-2xl font-semibold text-cyan-400/95 md:text-3xl">
                    {t('changePassword')}
                </h2>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Current Password */}
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <PasswordInput
                                    label={t('currentPassword')}
                                    field={field}
                                />
                            )}
                        />

                        {/* New Password */}
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <PasswordInput
                                    label={t('newPassword')}
                                    field={field}
                                />
                            )}
                        />

                        {/* Confirm Password */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <PasswordInput
                                    label={t('confirmNewPassword')}
                                    field={field}
                                />
                            )}
                        />

                        {/* Password Requirements */}
                        <div className="rounded-lg bg-gray-950/70 p-4 text-sm text-gray-300 md:text-base">
                            <p className="mb-2 font-semibold">
                                {t('passwordRequirements')}
                            </p>
                            <ul className="list-inside list-disc space-y-1">
                                <li>{t('reqMinChars')}</li>
                                <li>{t('reqMatch')}</li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className="bg-linear-to-br w-full rounded-lg border border-red-600 from-red-900 via-slate-900/80 to-red-900 py-2 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
                        >
                            {form.formState.isSubmitting
                                ? t('updating')
                                : t('updatePassword')}
                        </Button>
                    </form>
                </Form>
            </div>
        </Card>
    )
}
