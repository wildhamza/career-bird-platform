-- The Career Bird Database Schema

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'professor', 'admin');

-- Create enum for application status
CREATE TYPE public.application_status AS ENUM ('draft', 'submitted', 'under_review', 'shortlisted', 'interview', 'accepted', 'rejected');

-- Create enum for degree level
CREATE TYPE public.degree_level AS ENUM ('bachelors', 'masters', 'phd', 'postdoc');

-- Create enum for grant type
CREATE TYPE public.grant_type AS ENUM ('scholarship', 'fellowship', 'research_grant', 'travel_grant');

-- User Roles Table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Universities Table
CREATE TABLE public.universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT,
  logo_url TEXT,
  website TEXT,
  ranking INT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;

-- Universities are publicly readable
CREATE POLICY "Universities are viewable by everyone"
  ON public.universities FOR SELECT
  USING (true);

-- Profiles Table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  nationality TEXT,
  current_country TEXT,
  current_city TEXT,
  bio TEXT,
  
  -- Academic Info (for students)
  current_degree degree_level,
  field_of_study TEXT,
  university_id UUID REFERENCES public.universities(id),
  university_name TEXT, -- Free text field for university name (academic history)
  university_country TEXT, -- Country of the university (academic history)
  gpa DECIMAL(3,2),
  gpa_scale DECIMAL(3,1) DEFAULT 4.0,
  graduation_year INT,
  
  -- Test Scores
  gre_verbal INT,
  gre_quant INT,
  gre_awa DECIMAL(2,1),
  toefl_score INT,
  ielts_score DECIMAL(2,1),
  
  -- Research
  research_interests TEXT[],
  publications_count INT DEFAULT 0,
  
  -- Profile Completion
  profile_completed BOOLEAN DEFAULT false,
  
  -- For Professors
  department TEXT,
  title TEXT,
  research_areas TEXT[],
  h_index INT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Professors can view student profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'professor'));

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Public profiles visible for professors (limited fields)
CREATE POLICY "Public profiles are viewable"
  ON public.profiles FOR SELECT
  USING (profile_completed = true);

-- Grants/Scholarships Table
CREATE TABLE public.grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  grant_type grant_type NOT NULL DEFAULT 'scholarship',
  university_id UUID REFERENCES public.universities(id),
  
  -- Eligibility
  degree_levels degree_level[] NOT NULL,
  fields_of_study TEXT[],
  eligible_countries TEXT[],
  min_gpa DECIMAL(3,2),
  
  -- Funding
  funding_amount TEXT,
  stipend_monthly TEXT,
  covers_tuition BOOLEAN DEFAULT true,
  covers_living BOOLEAN DEFAULT false,
  
  -- Timeline
  deadline TIMESTAMP WITH TIME ZONE,
  start_date DATE,
  duration_months INT,
  
  -- Details
  language TEXT DEFAULT 'English',
  application_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.grants ENABLE ROW LEVEL SECURITY;

-- Grants are publicly readable
CREATE POLICY "Grants are viewable by everyone"
  ON public.grants FOR SELECT
  USING (true);

CREATE POLICY "Professors can create grants"
  ON public.grants FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'professor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Grant creators can update their grants"
  ON public.grants FOR UPDATE
  USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

-- Applications Table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  grant_id UUID REFERENCES public.grants(id) ON DELETE CASCADE NOT NULL,
  status application_status NOT NULL DEFAULT 'draft',
  
  -- Application Data
  statement_of_purpose TEXT,
  research_proposal TEXT,
  
  -- Scoring
  r_score INT,
  match_score INT,
  global_rank INT,
  
  -- Timeline
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  decision_at TIMESTAMP WITH TIME ZONE,
  
  -- Notes
  reviewer_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, grant_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Application policies
CREATE POLICY "Users can view their own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Professors can view applications to their grants"
  ON public.applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.grants g
      WHERE g.id = grant_id AND g.created_by = auth.uid()
    )
    OR public.has_role(auth.uid(), 'professor')
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can create applications"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON public.applications FOR UPDATE
  USING (auth.uid() = user_id);

-- Saved Grants (bookmarks)
CREATE TABLE public.saved_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  grant_id UUID REFERENCES public.grants(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, grant_id)
);

ALTER TABLE public.saved_grants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their saved grants"
  ON public.saved_grants FOR ALL
  USING (auth.uid() = user_id);

-- Documents Table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  document_type TEXT NOT NULL, -- 'cv', 'transcript', 'recommendation', 'sop', 'portfolio'
  file_url TEXT NOT NULL,
  file_size INT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own documents"
  ON public.documents FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Professors can view applicant documents"
  ON public.documents FOR SELECT
  USING (public.has_role(auth.uid(), 'professor') OR public.has_role(auth.uid(), 'admin'));

-- Tryout Submissions
CREATE TABLE public.tryout_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Files
  proposal_url TEXT,
  video_url TEXT,
  portfolio_url TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, submitted, reviewed
  submitted_at TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tryout_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their tryout submissions"
  ON public.tryout_submissions FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Professors can view tryout submissions"
  ON public.tryout_submissions FOR SELECT
  USING (public.has_role(auth.uid(), 'professor') OR public.has_role(auth.uid(), 'admin'));

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  
  -- Default role is student
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grants_updated_at
  BEFORE UPDATE ON public.grants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tryout_submissions_updated_at
  BEFORE UPDATE ON public.tryout_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();