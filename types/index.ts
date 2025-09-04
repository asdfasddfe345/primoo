export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship'
export type ExperienceLevel = 'entry-level' | 'associate' | 'mid-senior' | 'director' | 'executive'
export type WorkMode = 'on-site' | 'remote' | 'hybrid'
export type WebinarStatus = 'upcoming' | 'live' | 'recorded'
export type BlogCategory = 'career-advice' | 'interview-tips' | 'tech-trends' | 'industry-news'
export type ServiceCategory = 'resume-review' | 'mock-interview' | 'career-coaching' | 'skill-development'
export type UserRole = 'job_seeker' | 'employer' | 'admin'

export interface Job {
  id: string
  employer_id: string
  title: string
  description: string
  company_name: string
  location?: string
  job_type: JobType
  experience_level: ExperienceLevel
  work_mode: WorkMode
  salary_min?: number
  salary_max?: number
  currency: string
  tech_stack: string[]
  application_link?: string
  posted_at: string
  expires_at?: string
  is_active: boolean
}

export interface Profile {
  id: string
  full_name?: string
  avatar_url?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Webinar {
  id: string
  title: string
  description: string
  speaker_name?: string
  speaker_bio?: string
  webinar_date: string
  duration_minutes?: number
  status: WebinarStatus
  live_link?: string
  replay_link?: string
  thumbnail_url?: string
  created_at: string
}

export interface BlogPost {
  id: string
  author_id: string
  title: string
  slug: string
  content: string
  category: BlogCategory
  tags: string[]
  thumbnail_url?: string
  published_at: string
  is_published: boolean
  seo_title?: string
  seo_description?: string
}

export interface Service {
  id: string
  provider_id: string
  name: string
  description: string
  category: ServiceCategory
  price: number
  currency: string
  image_url?: string
  is_active: boolean
  created_at: string
}

export interface JobFilters {
  search?: string
  job_type?: JobType
  experience_level?: ExperienceLevel
  work_mode?: WorkMode
  location?: string
  tech_stack?: string[]
  salary_min?: number
  salary_max?: number
}