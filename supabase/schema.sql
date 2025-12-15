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

-- Messaging System: Conversations Table
-- Represents a conversation between two users (student and professor)
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  participant2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Optional: Link to application if conversation started from an application
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  grant_id UUID REFERENCES public.grants(id) ON DELETE SET NULL,
  
  -- Metadata
  last_message_at TIMESTAMP WITH TIME ZONE,
  last_message_preview TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure unique conversation between two users
  UNIQUE(participant1_id, participant2_id)
);

-- Create indexes for faster lookups
CREATE INDEX idx_conversations_participant1 ON public.conversations(participant1_id);
CREATE INDEX idx_conversations_participant2 ON public.conversations(participant2_id);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);

-- Messages Table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Message content
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- 'text', 'file', 'system'
  
  -- File attachments (optional)
  file_url TEXT,
  file_name TEXT,
  file_type TEXT,
  file_size INT,
  
  -- Read status
  read_at TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_message_type CHECK (message_type IN ('text', 'file', 'system'))
);

-- Create indexes for faster queries
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX idx_messages_unread ON public.messages(receiver_id, is_read) WHERE is_read = false;

-- Enable RLS for messaging tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Conversations
CREATE POLICY "Users can view their own conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);

CREATE POLICY "Users can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (
    auth.uid() = participant1_id OR auth.uid() = participant2_id
  );

CREATE POLICY "Users can update their conversations"
  ON public.conversations FOR UPDATE
  USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);

-- RLS Policies for Messages
CREATE POLICY "Users can view messages in their conversations"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their own messages"
  ON public.messages FOR UPDATE
  USING (auth.uid() = sender_id);

CREATE POLICY "Users can mark messages as read"
  ON public.messages FOR UPDATE
  USING (
    auth.uid() = receiver_id
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    )
  );

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

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update conversation's last_message_at when a message is inserted
CREATE OR REPLACE FUNCTION public.update_conversation_on_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations
  SET 
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.content, 100),
    updated_at = now()
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to update conversation when message is sent
CREATE TRIGGER update_conversation_on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_on_message();

-- Function to get or create a conversation between two users
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(
  _participant1_id UUID,
  _participant2_id UUID,
  _application_id UUID DEFAULT NULL,
  _grant_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _conversation_id UUID;
  _smaller_id UUID;
  _larger_id UUID;
BEGIN
  -- Ensure consistent ordering (smaller UUID first)
  IF _participant1_id < _participant2_id THEN
    _smaller_id := _participant1_id;
    _larger_id := _participant2_id;
  ELSE
    _smaller_id := _participant2_id;
    _larger_id := _participant1_id;
  END IF;
  
  -- Try to find existing conversation
  SELECT id INTO _conversation_id
  FROM public.conversations
  WHERE participant1_id = _smaller_id
    AND participant2_id = _larger_id
  LIMIT 1;
  
  -- If not found, create new conversation
  IF _conversation_id IS NULL THEN
    INSERT INTO public.conversations (participant1_id, participant2_id, application_id, grant_id)
    VALUES (_smaller_id, _larger_id, _application_id, _grant_id)
    RETURNING id INTO _conversation_id;
  END IF;
  
  RETURN _conversation_id;
END;
$$;

-- Function to get unread message count for a user
CREATE OR REPLACE FUNCTION public.get_unread_count(_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)
  FROM public.messages m
  INNER JOIN public.conversations c ON c.id = m.conversation_id
  WHERE m.receiver_id = _user_id
    AND m.is_read = false
    AND (c.participant1_id = _user_id OR c.participant2_id = _user_id);
$$;

-- Note: To enable Realtime for messaging, go to Supabase Dashboard > Database > Replication
-- and enable replication for 'messages' and 'conversations' tables