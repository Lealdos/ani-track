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
        <div className="mx-auto my-6 max-w-2xl min-w-lg rounded-lg px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-center text-4xl font-bold text-white">
                My Account
            </h1>

            <Tabs defaultValue="information" className="w-full">
                <TabsList className="grid w-full grid-cols-2 border-b border-gray-900 bg-linear-to-r from-slate-900 via-purple-900 to-slate-900">
                    <TabsTrigger
                        value="information"
                        className="text-gray-300 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-500"
                    >
                        Information
                    </TabsTrigger>
                    <TabsTrigger
                        value="password"
                        className="text-gray-300 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-500"
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
