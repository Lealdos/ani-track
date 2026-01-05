'use client'

import { useState } from 'react'
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
    name: string
    control: any
    field: any
}

export function PasswordInput({
    label,
    name,
    control,
    field,
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false)
    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <div className="relative">
                    <Input
                        placeholder="enter your password"
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        className="border-gray-600 bg-gray-700 text-white placeholder-gray-500 focus:ring-red-700"
                    />
                    {showPassword ? (
                        <EyeOff
                            className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowPassword(false)}
                        />
                    ) : (
                        <Eye
                            className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowPassword(true)}
                        />
                    )}
                </div>
            </FormControl>
            <FormMessage className="text-red-400" />
        </FormItem>
    )
}
