import Link from 'next/link'
import { BriefcaseIcon } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <BriefcaseIcon className="h-5 w-5 text-primary" />
              <span className="font-bold">PrimoJobs</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your premier job portal for career growth and opportunities.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium">For Job Seekers</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/jobs" className="text-sm text-muted-foreground hover:text-primary">
                Browse Jobs
              </Link>
              <Link href="/webinars" className="text-sm text-muted-foreground hover:text-primary">
                Career Webinars
              </Link>
              <Link href="/services" className="text-sm text-muted-foreground hover:text-primary">
                Career Services
              </Link>
            </nav>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium">For Employers</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/employer/post-job" className="text-sm text-muted-foreground hover:text-primary">
                Post a Job
              </Link>
              <Link href="/employer/pricing" className="text-sm text-muted-foreground hover:text-primary">
                Pricing
              </Link>
              <Link href="/employer/contact" className="text-sm text-muted-foreground hover:text-primary">
                Contact Sales
              </Link>
            </nav>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Resources</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">
                Blog
              </Link>
              <Link href="/help" className="text-sm text-muted-foreground hover:text-primary">
                Help Center
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} PrimoJobs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}