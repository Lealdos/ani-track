// Shared between <Header/> and <HeaderFallback/>. The fallback stands in for
// the real header while its Suspense boundary is pending, and the two must
// paint identically or the swap shows up as the header "fading in" — so the
// geometry lives here once instead of being copied into both.

// `site-header-shell` is not a utility: globals.css uses it to give the header
// its own view-transition-name, keeping it out of the root snapshot.
export const wrapperBase =
    'site-header-shell fixed left-1/2 top-0 z-20 -translate-x-1/2 items-center justify-center rounded-full'

export const wrapperAtTop = 'w-full max-w-full'

export const wrapperScrolled =
    'w-93 animate-rotate-border bg-conic/[from_var(--border-angle)] max-w-md translate-y-6 from-purple-800 from-80% via-red-600 via-90% to-purple-500 to-100% p-[2.5px] md:w-full md:max-w-3xl xl:max-w-6xl'

export const barBase =
    'bg-gradient-noir flex h-16 w-full items-center justify-between md:h-16'

export const barAtTop = 'border-b px-2 backdrop-blur md:px-40'

export const barScrolled = 'rounded-full shadow-md backdrop-blur md:px-20'

export const barInner = 'mx-auto flex w-full items-center justify-between gap-4'

export const logo =
    'gradient-home-name font-gothic p-2 text-base font-bold italic text-transparent md:text-2xl'

export const searchWrap = 'relative flex w-full items-center justify-center'

export const searchIcon =
    'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-200'

export const searchField =
    'h-10 w-full rounded-lg border border-b-red-500 border-l-red-500 border-r-red-700 border-t-red-700 bg-black/40 p-2 pl-10 pr-10 text-sm text-white placeholder:text-gray-400'

// The in-flow spacer that reserves room for the fixed bar.
export const spacer = 'h-16 w-full'
