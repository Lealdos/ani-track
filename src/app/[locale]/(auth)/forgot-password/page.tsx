'use client'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resetPassword, signIn } from '@/lib/Auth/auth-clients'
import { Link } from '@/i18n/navigation'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { useEffect, useState } from 'react'

export default function ResetPasswordPage() {
    const t = useTranslations('Auth')
    const tc = useTranslations('Common')
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const tokenParam = searchParams.get('token')
        if (!tokenParam) {
            setError(t('invalidToken'))
        } else {
            setToken(tokenParam)
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError(t('passwordsNoMatch'))
            return
        }

        if (password.length < 8) {
            setError(t('passwordTooShort'))
            return
        }

        if (!token) {
            setError(t('invalidResetToken'))
            return
        }

        setLoading(true)

        try {
            const result = await resetPassword({
                newPassword: password,
                token,
            })

            if (result.error) {
                setError(result.error.message || t('failedReset'))
            } else {
                setSuccess(true)
                setTimeout(() => {
                    router.push('/login')
                }, 2000)
            }
        } catch (err) {
            setError(t('genericError'))
            console.error('Reset password error:', err)
        } finally {
            setLoading(false)
        }
    }

    if (!token && !error) {
        return (
            <div className="flex items-center justify-center">
                <p>{tc('loading')}</p>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center p-4">
            <Card className="w-full max-w-3xl border-purple-800">
                <CardHeader>
                    <CardTitle>{t('resetPassword')}</CardTitle>
                    <CardDescription>{t('enterNewPassword')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">{t('newPassword')}</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={!token}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                {t('confirmNewPassword')}
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                                disabled={!token}
                            />
                        </div>
                        {error && (
                            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
                                {error}
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading || !token}
                        >
                            {loading ? t('resetting') : t('resetPassword')}
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="w-full bg-transparent"
                        >
                            <Link href="/login">{t('backToLogin')}</Link>
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
