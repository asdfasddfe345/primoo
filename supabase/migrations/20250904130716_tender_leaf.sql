/*
  # PrimoJobs 2.0 Database Schema

  This migration creates the complete database schema for PrimoJobs 2.0.
  
  ## New Tables
  1. **profiles** - Extended user profiles
  2. **jobs** - Job listings with full-text search
  3. **webinars** - Webinar management
  4. **blog_posts** - Blog content with SEO
  5. **services** - Career services marketplace
  6. **job_applications** - Job application tracking
  7. **webinar_registrations** - Webinar registration tracking

  ## Features
  - Full-text search with tsvector columns
  - Row Level Security (RLS)
  - Enums for type safety
  - Indexes for performance
  - Sample data for testing
*/

-- Create enums
DO $$ BEGIN
  CREATE TYPE job_type AS ENUM ('full-time', 'part-time', 'contract', 'internship');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE experience_level AS ENUM ('entry-level', 'associate', 'mid-senior', 'director', 'executive');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE work_mode AS ENUM ('on-site', 'remote', 'hybrid');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE webinar_status AS ENUM ('upcoming', 'live', 'recorded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE blog_category AS ENUM ('career-advice', 'interview-tips', 'tech-trends', 'industry-news');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE service_category AS ENUM ('resume-review', 'mock-interview', 'career-coaching', 'skill-development');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('job_seeker', 'employer', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'job_seeker',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company_name TEXT NOT NULL,
  location TEXT,
  job_type job_type NOT NULL,
  experience_level experience_level NOT NULL,
  work_mode work_mode NOT NULL,
  salary_min NUMERIC,
  salary_max NUMERIC,
  currency TEXT DEFAULT 'USD',
  tech_stack TEXT[] DEFAULT '{}',
  application_link TEXT,
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', title || ' ' || company_name || ' ' || description || ' ' || array_to_string(tech_stack, ' '))
  ) STORED
);

-- Create webinars table
CREATE TABLE IF NOT EXISTS webinars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  speaker_name TEXT,
  speaker_bio TEXT,
  webinar_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER,
  status webinar_status DEFAULT 'upcoming',
  live_link TEXT,
  replay_link TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  category blog_category NOT NULL,
  tags TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT TRUE,
  seo_title TEXT,
  seo_description TEXT,
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', title || ' ' || content || ' ' || array_to_string(tags, ' '))
  ) STORED
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category service_category NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending',
  UNIQUE(job_id, user_id)
);

-- Create webinar_registrations table
CREATE TABLE IF NOT EXISTS webinar_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webinar_id UUID NOT NULL REFERENCES webinars(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(webinar_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON jobs;
DROP POLICY IF EXISTS "Employers can insert jobs" ON jobs;
DROP POLICY IF EXISTS "Employers can update own jobs" ON jobs;
DROP POLICY IF EXISTS "Admins can manage all jobs" ON jobs;

DROP POLICY IF EXISTS "Webinars are viewable by everyone" ON webinars;
DROP POLICY IF EXISTS "Admins can manage webinars" ON webinars;

DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON blog_posts;
DROP POLICY IF EXISTS "Authors can manage own posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can manage all blog posts" ON blog_posts;

DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
DROP POLICY IF EXISTS "Providers can manage own services" ON services;
DROP POLICY IF EXISTS "Admins can manage all services" ON services;

DROP POLICY IF EXISTS "Users can view own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can insert own applications" ON job_applications;

DROP POLICY IF EXISTS "Users can view own registrations" ON webinar_registrations;
DROP POLICY IF EXISTS "Users can insert own registrations" ON webinar_registrations;

-- Create RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for jobs
CREATE POLICY "Jobs are viewable by everyone" ON jobs
  FOR SELECT USING (is_active = true OR auth.uid() = employer_id);

CREATE POLICY "Employers can insert jobs" ON jobs
  FOR INSERT WITH CHECK (
    auth.uid() = employer_id AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('employer', 'admin')
    )
  );

CREATE POLICY "Employers can update own jobs" ON jobs
  FOR UPDATE USING (
    auth.uid() = employer_id OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all jobs" ON jobs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for webinars
CREATE POLICY "Webinars are viewable by everyone" ON webinars
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage webinars" ON webinars
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for blog_posts
CREATE POLICY "Published blog posts are viewable by everyone" ON blog_posts
  FOR SELECT USING (is_published = true OR auth.uid() = author_id);

CREATE POLICY "Authors can manage own posts" ON blog_posts
  FOR ALL USING (
    auth.uid() = author_id OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for services
CREATE POLICY "Services are viewable by everyone" ON services
  FOR SELECT USING (is_active = true OR auth.uid() = provider_id);

CREATE POLICY "Providers can manage own services" ON services
  FOR ALL USING (
    auth.uid() = provider_id OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for job_applications
CREATE POLICY "Users can view own applications" ON job_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON job_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for webinar_registrations
CREATE POLICY "Users can view own registrations" ON webinar_registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own registrations" ON webinar_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_search_vector ON jobs USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_jobs_company_name ON jobs (company_name);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs (location);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs (job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON jobs (experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_work_mode ON jobs (work_mode);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON jobs (posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs (is_active);

CREATE INDEX IF NOT EXISTS idx_blog_posts_search_vector ON blog_posts USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts (category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON blog_posts (is_published);

CREATE INDEX IF NOT EXISTS idx_webinars_date ON webinars (webinar_date);
CREATE INDEX IF NOT EXISTS idx_webinars_status ON webinars (status);

CREATE INDEX IF NOT EXISTS idx_services_category ON services (category);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services (is_active);

CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications (user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications (job_id);

CREATE INDEX IF NOT EXISTS idx_webinar_registrations_user_id ON webinar_registrations (user_id);
CREATE INDEX IF NOT EXISTS idx_webinar_registrations_webinar_id ON webinar_registrations (webinar_id);

-- Insert sample data for testing
DO $$
DECLARE
    admin_id UUID;
    employer_id UUID;
    job_id UUID;
    blog_id UUID;
    webinar_id UUID;
BEGIN
    -- Create sample admin profile (this will be created when admin user signs up)
    -- The auth.users entry will be created by Supabase Auth
    
    -- Insert sample jobs (using a placeholder employer_id that will be replaced when real users sign up)
    INSERT INTO jobs (
        employer_id, title, description, company_name, location, job_type, 
        experience_level, work_mode, salary_min, salary_max, tech_stack
    ) VALUES 
    (
        gen_random_uuid(), -- Placeholder employer_id
        'Senior Full Stack Developer',
        'We are looking for an experienced Full Stack Developer to join our dynamic team. You will work on cutting-edge projects using modern technologies like React, Node.js, and PostgreSQL. The ideal candidate has 5+ years of experience and a passion for building scalable web applications.',
        'TechCorp Solutions',
        'San Francisco, CA',
        'full-time',
        'mid-senior',
        'hybrid',
        120000,
        180000,
        ARRAY['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS']
    ),
    (
        gen_random_uuid(), -- Placeholder employer_id
        'Frontend Developer Intern',
        'Join our team as a Frontend Developer Intern and gain hands-on experience with modern web technologies. You will work alongside senior developers to build user-friendly interfaces using React and TypeScript.',
        'StartupXYZ',
        'Remote',
        'internship',
        'entry-level',
        'remote',
        NULL,
        NULL,
        ARRAY['React', 'JavaScript', 'HTML', 'CSS', 'Git']
    ),
    (
        gen_random_uuid(), -- Placeholder employer_id
        'DevOps Engineer',
        'We need a skilled DevOps Engineer to help us scale our infrastructure. You will work with Kubernetes, Docker, and cloud platforms to ensure our applications run smoothly and efficiently.',
        'CloudNine Systems',
        'New York, NY',
        'full-time',
        'associate',
        'on-site',
        90000,
        130000,
        ARRAY['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Jenkins']
    );

    -- Insert sample webinars
    INSERT INTO webinars (
        title, description, speaker_name, speaker_bio, webinar_date, 
        duration_minutes, status, thumbnail_url
    ) VALUES 
    (
        'Mastering Technical Interviews',
        'Learn proven strategies to ace your technical interviews. This comprehensive webinar covers common coding questions, system design principles, and behavioral interview techniques.',
        'Sarah Johnson',
        'Senior Engineering Manager at Google with 10+ years of experience in hiring and developing technical talent.',
        NOW() + INTERVAL '7 days',
        90,
        'upcoming',
        'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'
    ),
    (
        'Building Your Personal Brand in Tech',
        'Discover how to build a strong personal brand that will help you stand out in the competitive tech industry. Learn about networking, content creation, and career advancement strategies.',
        'Michael Chen',
        'Tech Career Coach and former Engineering Director at Microsoft.',
        NOW() + INTERVAL '14 days',
        60,
        'upcoming',
        'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg'
    ),
    (
        'Remote Work Best Practices',
        'A recorded session covering the best practices for working effectively in a remote environment. Topics include communication, productivity, and work-life balance.',
        'Emma Davis',
        'Remote Work Consultant and author of "The Remote Professional".',
        NOW() - INTERVAL '30 days',
        75,
        'recorded',
        'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg'
    );

    -- Insert sample blog posts
    INSERT INTO blog_posts (
        author_id, title, slug, content, category, tags, 
        thumbnail_url, seo_title, seo_description
    ) VALUES 
    (
        gen_random_uuid(), -- Placeholder author_id
        '10 Essential Skills Every Developer Should Master in 2024',
        '10-essential-skills-every-developer-should-master-in-2024',
        '# 10 Essential Skills Every Developer Should Master in 2024

The tech industry is constantly evolving, and as a developer, staying current with the latest skills and technologies is crucial for career success. Here are the 10 essential skills that every developer should focus on mastering in 2024.

## 1. Cloud Computing

Understanding cloud platforms like AWS, Azure, and Google Cloud Platform is no longer optional. Companies are increasingly moving their infrastructure to the cloud, and developers who can design, deploy, and manage cloud-based applications are in high demand.

## 2. DevOps and CI/CD

The ability to automate deployment processes and understand the entire software development lifecycle is invaluable. Learn tools like Docker, Kubernetes, Jenkins, and GitLab CI/CD.

## 3. AI/ML Integration

With the rise of AI tools like ChatGPT and Copilot, developers need to understand how to integrate AI capabilities into their applications and leverage these tools to increase productivity.

*Continue reading for the remaining 7 skills...*',
        'tech-trends',
        ARRAY['programming', 'career-advice', '2024', 'skills', 'development'],
        'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
        'Essential Developer Skills 2024 | Career Growth Guide',
        'Discover the 10 most important skills every developer should master in 2024 to advance their career and stay competitive in the tech industry.'
    ),
    (
        gen_random_uuid(), -- Placeholder author_id
        'How to Negotiate Your Salary as a Software Developer',
        'how-to-negotiate-your-salary-as-a-software-developer',
        '# How to Negotiate Your Salary as a Software Developer

Salary negotiation can be intimidating, but it''s a crucial skill that can significantly impact your career earnings. Here''s a comprehensive guide on how to negotiate your salary effectively as a software developer.

## Research is Key

Before entering any negotiation, you need to know your worth in the market. Use resources like:
- Glassdoor and PayScale
- Levels.fyi for tech companies
- Local salary surveys
- Networking with peers in similar roles

## Timing Matters

The best time to negotiate is:
- During the job offer process
- At performance reviews
- When taking on additional responsibilities
- After completing major projects

## Building Your Case

Document your achievements and prepare specific examples of your value to the company...

*Continue reading for detailed negotiation strategies...*',
        'career-advice',
        ARRAY['salary', 'negotiation', 'career-growth', 'software-developer'],
        'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',
        'Software Developer Salary Negotiation Guide | Get Paid What You''re Worth',
        'Learn proven strategies to negotiate your salary as a software developer. Increase your earning potential with our comprehensive negotiation guide.'
    );

    -- Insert sample services
    INSERT INTO services (
        provider_id, name, description, category, price, image_url
    ) VALUES 
    (
        gen_random_uuid(), -- Placeholder provider_id
        'Professional Resume Review',
        'Get your resume reviewed by experienced tech recruiters and hiring managers. We''ll provide detailed feedback on content, formatting, and ATS optimization to help you land more interviews.',
        'resume-review',
        149.99,
        'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg'
    ),
    (
        gen_random_uuid(), -- Placeholder provider_id
        '1-on-1 Career Coaching Session',
        'Work with experienced career coaches to define your career goals, create actionable plans, and overcome career challenges. Perfect for career transitions and professional growth.',
        'career-coaching',
        299.99,
        'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg'
    ),
    (
        gen_random_uuid(), -- Placeholder provider_id
        'Technical Interview Practice',
        'Practice technical interviews with experienced engineers from top tech companies. Get real-time feedback on your coding skills, problem-solving approach, and communication.',
        'mock-interview',
        199.99,
        'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg'
    );

END $$;