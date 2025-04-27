// import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="flex flex-col items-center justify-center gap-4 border-t bg-gradient-to-bl from-slate-900 via-purple-900 to-slate-900">
            <div className="flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose md:text-left">
                        Built with Next.js and Tailwind CSS. Powered by Jikan
                        API.
                    </p>
                </div>
                {/* <div className="flex gap-4">
                    <Link
                        href="/about"
                        className="text-sm font-medium underline-offset-4 hover:underline"
                    >
                        About
                    </Link>
                    <Link
                        href="/terms"
                        className="text-sm font-medium underline-offset-4 hover:underline"
                    >
                        Terms
                    </Link>
                    <Link
                        href="/privacy"
                        className="text-sm font-medium underline-offset-4 hover:underline"
                    >
                        Privacy
                    </Link>
                </div> */}
            </div>
        </footer>
    )
}
