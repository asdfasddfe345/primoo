```typescript
    import Link from 'next/link'
    import { Button } from '@/components/ui/button'
    import { SearchBar } from '@/components/search/search-bar'
    import { UserMenu } from '@/components/auth/user-menu'
    import { createClient } from '@/lib/supabase/server'
    import { BriefcaseIcon, CalendarDays, BookOpen, Users } from 'lucide-react'
    import { AuthStatus } from '@/components/auth/auth-status'; // Import the new AuthStatus component

    export async function Navbar() {
      // Remove the direct Supabase client creation and user fetching from here
      // const supabase = createClient()
      // const { data: { user } } = await supabase.auth.getUser()

      return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <div className="mr-4 hidden md:flex">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <BriefcaseIcon className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">PrimoJobs</span>
              </Link>
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <Link href="/jobs" className="hover:text-primary transition-colors">
                  Jobs
                </Link>
                <Link href="/webinars" className="hover:text-primary transition-colors">
                  Webinars
                </Link>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
                <Link href="/services" className="hover:text-primary transition-colors">
                  Services
                </Link>
              </nav>
            </div>

            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <div className="w-full flex-1 md:w-auto md:flex-none">
                <SearchBar />
              </div>
              <div className="flex items-center space-x-2">
                {/* Render the AuthStatus component here */}
                <AuthStatus />
              </div>
            </div>
          </div>
        </header>
      )
    }
    ```