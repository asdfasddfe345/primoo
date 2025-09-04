export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          role: 'job_seeker' | 'employer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'job_seeker' | 'employer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'job_seeker' | 'employer' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          employer_id: string
          title: string
          description: string
          company_name: string
          location: string | null
          job_type: 'full-time' | 'part-time' | 'contract' | 'internship'
          experience_level: 'entry-level' | 'associate' | 'mid-senior' | 'director' | 'executive'
          work_mode: 'on-site' | 'remote' | 'hybrid'
          salary_min: number | null
          salary_max: number | null
          currency: string
          tech_stack: string[]
          application_link: string | null
          posted_at: string
          expires_at: string | null
          is_active: boolean
          search_vector: unknown | null
        }
        Insert: {
          id?: string
          employer_id: string
          title: string
          description: string
          company_name: string
          location?: string | null
          job_type: 'full-time' | 'part-time' | 'contract' | 'internship'
          experience_level: 'entry-level' | 'associate' | 'mid-senior' | 'director' | 'executive'
          work_mode: 'on-site' | 'remote' | 'hybrid'
          salary_min?: number | null
          salary_max?: number | null
          currency?: string
          tech_stack?: string[]
          application_link?: string | null
          posted_at?: string
          expires_at?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          employer_id?: string
          title?: string
          description?: string
          company_name?: string
          location?: string | null
          job_type?: 'full-time' | 'part-time' | 'contract' | 'internship'
          experience_level?: 'entry-level' | 'associate' | 'mid-senior' | 'director' | 'executive'
          work_mode?: 'on-site' | 'remote' | 'hybrid'
          salary_min?: number | null
          salary_max?: number | null
          currency?: string
          tech_stack?: string[]
          application_link?: string | null
          posted_at?: string
          expires_at?: string | null
          is_active?: boolean
        }
      }
      webinars: {
        Row: {
          id: string
          title: string
          description: string
          speaker_name: string | null
          speaker_bio: string | null
          webinar_date: string
          duration_minutes: number | null
          status: 'upcoming' | 'live' | 'recorded'
          live_link: string | null
          replay_link: string | null
          thumbnail_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          speaker_name?: string | null
          speaker_bio?: string | null
          webinar_date: string
          duration_minutes?: number | null
          status?: 'upcoming' | 'live' | 'recorded'
          live_link?: string | null
          replay_link?: string | null
          thumbnail_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          speaker_name?: string | null
          speaker_bio?: string | null
          webinar_date?: string
          duration_minutes?: number | null
          status?: 'upcoming' | 'live' | 'recorded'
          live_link?: string | null
          replay_link?: string | null
          thumbnail_url?: string | null
          created_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          author_id: string
          title: string
          slug: string
          content: string
          category: 'career-advice' | 'interview-tips' | 'tech-trends' | 'industry-news'
          tags: string[]
          thumbnail_url: string | null
          published_at: string
          is_published: boolean
          seo_title: string | null
          seo_description: string | null
          search_vector: unknown | null
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          slug: string
          content: string
          category: 'career-advice' | 'interview-tips' | 'tech-trends' | 'industry-news'
          tags?: string[]
          thumbnail_url?: string | null
          published_at?: string
          is_published?: boolean
          seo_title?: string | null
          seo_description?: string | null
        }
        Update: {
          id?: string
          author_id?: string
          title?: string
          slug?: string
          content?: string
          category?: 'career-advice' | 'interview-tips' | 'tech-trends' | 'industry-news'
          tags?: string[]
          thumbnail_url?: string | null
          published_at?: string
          is_published?: boolean
          seo_title?: string | null
          seo_description?: string | null
        }
      }
      services: {
        Row: {
          id: string
          provider_id: string
          name: string
          description: string
          category: 'resume-review' | 'mock-interview' | 'career-coaching' | 'skill-development'
          price: number
          currency: string
          image_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          name: string
          description: string
          category: 'resume-review' | 'mock-interview' | 'career-coaching' | 'skill-development'
          price: number
          currency?: string
          image_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          provider_id?: string
          name?: string
          description?: string
          category?: 'resume-review' | 'mock-interview' | 'career-coaching' | 'skill-development'
          price?: number
          currency?: string
          image_url?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      job_applications: {
        Row: {
          id: string
          job_id: string
          user_id: string
          applied_at: string
          status: string
        }
        Insert: {
          id?: string
          job_id: string
          user_id: string
          applied_at?: string
          status?: string
        }
        Update: {
          id?: string
          job_id?: string
          user_id?: string
          applied_at?: string
          status?: string
        }
      }
      webinar_registrations: {
        Row: {
          id: string
          webinar_id: string
          user_id: string
          registered_at: string
        }
        Insert: {
          id?: string
          webinar_id: string
          user_id: string
          registered_at?: string
        }
        Update: {
          id?: string
          webinar_id?: string
          user_id?: string
          registered_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      job_type: 'full-time' | 'part-time' | 'contract' | 'internship'
      experience_level: 'entry-level' | 'associate' | 'mid-senior' | 'director' | 'executive'
      work_mode: 'on-site' | 'remote' | 'hybrid'
      webinar_status: 'upcoming' | 'live' | 'recorded'
      blog_category: 'career-advice' | 'interview-tips' | 'tech-trends' | 'industry-news'
      service_category: 'resume-review' | 'mock-interview' | 'career-coaching' | 'skill-development'
      user_role: 'job_seeker' | 'employer' | 'admin'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}