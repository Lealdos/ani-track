'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    })

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
                throw new Error(error.message || 'Failed to update password')
            }

            toast.success('Password updated successfully!')
            form.reset()
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to update password'
            )
        }
    }

    const toggleVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }))
    }

    return (
        <Card className="min-h-80 border-gray-700 border-b-red-900 bg-linear-to-r from-slate-900 via-purple-900 to-slate-900 p-8">
            <div className="mx-auto max-w-md">
                <h2 className="mb-8 text-center text-2xl font-semibold text-white">
                    Change Password
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
                                    label="Current Password"
                                    name="currentPassword"
                                    control={form.control}
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
                                    label="New Password"
                                    name="newPassword"
                                    control={form.control}
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
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    control={form.control}
                                    field={field}
                                />
                            )}
                        />

                        {/* Password Requirements */}
                        <div className="rounded-lg bg-gray-700 p-4 text-sm text-gray-300">
                            <p className="mb-2 font-semibold">
                                Password Requirements:
                            </p>
                            <ul className="list-inside list-disc space-y-1">
                                <li>At least 8 characters</li>
                                <li>Passwords must match</li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className="w-full rounded-lg border border-red-600 bg-linear-to-br from-red-900 via-slate-900/80 to-red-900 py-2 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {form.formState.isSubmitting
                                ? 'Updating...'
                                : 'Update Password'}
                        </Button>
                    </form>
                </Form>
            </div>
        </Card>
    )
}
