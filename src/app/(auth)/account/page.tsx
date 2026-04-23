import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { ProfileForm } from './_components/ProfileForm'
import { PasswordForm } from './_components/PasswordForm'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export default async function UserAccountPage() {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
        redirect('/login')
    }

    return (
        <div className="mx-auto my-6 min-h-screen max-w-2xl rounded-lg px-4 py-12 sm:px-6 md:min-w-lg lg:px-8">
            <h1 className="gradient-home-name mb-8 p-2 text-center font-gothic text-4xl font-bold text-transparent italic">
                My Account
            </h1>

            <Tabs defaultValue="information" className="w-full">
                <TabsList className="grid w-full grid-cols-2 border-b border-gray-900 bg-linear-to-r from-violet-950 via-rose-900 to-violet-950">
                    <TabsTrigger
                        value="information"
                        className="text-gray-200 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-cyan-400"
                    >
                        Information
                    </TabsTrigger>
                    <TabsTrigger
                        value="password"
                        className="text-gray-200 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-cyan-400"
                    >
                        Password
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="information" className="mt-8">
                    <ProfileForm user={session?.user} />
                </TabsContent>

                <TabsContent value="password" className="mt-8">
                    <PasswordForm />
                </TabsContent>
            </Tabs>
        </div>
    )
}
