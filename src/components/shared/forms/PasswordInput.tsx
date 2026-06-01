'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Eye, EyeOff } from 'lucide-react'
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface PasswordInputProps {
    label: string
    field: any
}

export function PasswordInput({
    label,

    field,
}: PasswordInputProps) {
    const t = useTranslations('Forms')
    const [showPassword, setShowPassword] = useState(false)
    return (
        <FormItem>
            <FormLabel className="md:text-xl">{label}</FormLabel>
            <FormControl>
                <div className="relative">
                    <Input
                        placeholder={t('passwordPlaceholder')}
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        className="border-gray-600 bg-purple-950/70 text-white placeholder-white focus:ring-red-700 md:text-lg"
                    />
                    {showPassword ? (
                        <EyeOff
                            className="text-muted-foreground absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowPassword(false)}
                        />
                    ) : (
                        <Eye
                            className="text-muted-foreground absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowPassword(true)}
                        />
                    )}
                </div>
            </FormControl>
            <FormMessage className="text-white" />
        </FormItem>
    )
}
