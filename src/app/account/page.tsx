import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { ProfileForm } from './_components/ProfileForm'
import { PasswordForm } from './_components/PasswordForm'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { User, Lock } from 'lucide-react'

export default async function UserAccountPage() {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
        redirect('/login')
    }

    return (
        <div className="container mx-auto max-w-2xl px-4 py-12">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    My Account
                </h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences
                </p>
            </div>

            <div className="rounded-xl bg-card border border-border/50 p-6">
                <Tabs defaultValue="information" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 rounded-lg bg-secondary/50 p-1">
                        <TabsTrigger
                            value="information"
                            className="flex items-center gap-2 rounded-md data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground transition-all"
                        >
                            <User className="size-4" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger
                            value="password"
                            className="flex items-center gap-2 rounded-md data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground transition-all"
                        >
                            <Lock className="size-4" />
                            Security
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="information" className="mt-6">
                        <ProfileForm user={session?.user} />
                    </TabsContent>

                    <TabsContent value="password" className="mt-6">
                        <PasswordForm />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
