import 'server-only'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { BriefcaseIcon, MapPinIcon, CalendarIcon, BookOpenIcon, UsersIcon } from 'lucide-react'
import { formatSalary, timeAgo } from '@/lib/utils'
import Image from 'next/image'

export default async function HomePage() {
  const supabase = createClient(cookies())

  // Fetch latest jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('posted_at', { ascending: false })
    .limit(6)

  // Fetch upcoming webinars
  const { data: webinars } = await supabase
    .from('webinars')
    .select('*')
    .in('status', ['upcoming', 'live'])
    .order('webinar_date', { ascending: true })
    .limit(3)

  // Fetch recent blog posts
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Find Your Dream Job with <span className="text-primary">PrimoJobs</span>
            </h1>
            <p className="mb-8 text-xl text-gray-600">
              Discover thousands of opportunities, join expert-led webinars, and accelerate your career growth
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/webinars">View Webinars</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-lg opacity-90">Active Jobs</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">5,000+</div>
              <div className="text-lg opacity-90">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50,000+</div>
              <div className="text-lg opacity-90">Job Seekers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-lg opacity-90">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Latest Job Opportunities</h2>
            <p className="text-xl text-gray-600">Discover your next career move from top companies</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {jobs?.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
                      <CardDescription className="font-medium">{job.company_name}</CardDescription>
                    </div>
                    <Badge variant="secondary">{job.job_type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {job.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <BriefcaseIcon className="h-4 w-4 mr-1" />
                      {job.experience_level}
                    </div>
                    {(job.salary_min || job.salary_max) && (
                      <div className="text-sm font-medium text-green-600">
                        {formatSalary(job.salary_min, job.salary_max, job.currency)}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {job.tech_stack.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {job.tech_stack.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.tech_stack.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm text-gray-500">{timeAgo(job.posted_at)}</span>
                    <Button size="sm" asChild>
                      <Link href={`/jobs/${job.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/jobs">View All Jobs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Webinars Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Upcoming Career Webinars</h2>
            <p className="text-xl text-gray-600">Learn from industry experts and advance your career</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {webinars?.map((webinar) => (
              <Card key={webinar.id} className="hover:shadow-lg transition-shadow">
                {webinar.thumbnail_url && (
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <Image
                      src={webinar.thumbnail_url}
                      alt={webinar.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2">{webinar.title}</CardTitle>
                  {webinar.speaker_name && (
                    <CardDescription>By {webinar.speaker_name}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {new Date(webinar.webinar_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    {webinar.duration_minutes && (
                      <div className="text-sm text-gray-600">
                        Duration: {webinar.duration_minutes} minutes
                      </div>
                    )}
                    <Badge 
                      variant={webinar.status === 'live' ? 'destructive' : 'secondary'}
                    >
                      {webinar.status === 'live' ? 'LIVE NOW' : 'UPCOMING'}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/webinars/${webinar.id}`}>
                      {webinar.status === 'live' ? 'Join Now' : 'Register'}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/webinars">View All Webinars</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Career Insights & Advice</h2>
            <p className="text-xl text-gray-600">Stay updated with the latest industry trends and career tips</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {blogPosts?.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                {post.thumbnail_url && (
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <Image
                      src={post.thumbnail_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpenIcon className="h-4 w-4 mr-1" />
                      {timeAgo(post.published_at)}
                    </div>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href={`/blog/${post.slug}`}>Read More</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/blog">Read All Posts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Career Journey?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of professionals who have found their dream jobs through PrimoJobs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/signup">Create Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}