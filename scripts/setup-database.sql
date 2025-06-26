-- ########## 1단계: 기존 설정 모두 삭제 ##########
-- 기존 트리거 삭제
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 기존 함수 삭제 (CASCADE 옵션으로 의존 객체까지 삭제)
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile with new fields" ON public.users;
DROP POLICY IF EXISTS "Allow service role to insert user records" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated users to insert their own user record" ON public.users;
DROP POLICY IF EXISTS "Only admins can modify content" ON public.content;
DROP POLICY IF EXISTS "Anyone can view content" ON public.content;
DROP POLICY IF EXISTS "Users can delete their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile pictures" ON storage.objects;

-- 기존 테이블 삭제 (CASCADE 옵션으로 의존 객체까지 삭제)
DROP TABLE IF EXISTS public.content CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 기존 스토리지 버킷과 객체 삭제
DELETE FROM storage.objects WHERE bucket_id = 'profile-pictures';
DELETE FROM storage.buckets WHERE id = 'profile-pictures';


-- ########## 2단계: 최신 스키마로 다시 생성 ##########
-- users 테이블 생성 (새로운 컬럼들을 처음부터 포함)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nickname TEXT,
  gender TEXT CHECK (gender IN ('male', 'female')),
  profile_picture_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- content 테이블 생성
CREATE TABLE public.content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page, section, key)
);

-- Row Level Security (RLS) 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- updated_at 타임스탬프를 자동으로 업데이트하는 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at을 자동으로 업데이트하는 트리거 생성
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- handle_new_user 함수를 새로운 필드를 포함하도록 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, nickname, gender, profile_picture_url)
  VALUES (NEW.id, NEW.email, 'user', NULL, NULL, NULL)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ########## 3단계: 정책 및 트리거 다시 생성 ##########
-- users 테이블에 대한 정책 생성
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- 모든 필드에 대한 업데이트를 허용하는 정책으로 통합
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- service_role을 위한 INSERT 정책 생성
CREATE POLICY "Allow service role to insert user records" ON public.users
  FOR INSERT TO service_role
  WITH CHECK (true);

-- content 테이블에 대한 정책 생성
CREATE POLICY "Anyone can view content" ON public.content
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Only admins can modify content" ON public.content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 'on_auth_user_created' 트리거 다시 생성
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ########## 4단계: 스토리지 버킷 및 정책 생성 ##########
-- 프로필 사진용 스토리지 버킷 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- 프로필 사진에 대한 스토리지 정책 설정
CREATE POLICY "Anyone can view profile pictures" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-pictures');
CREATE POLICY "Users can upload their own profile pictures" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-pictures'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Users can update their own profile pictures" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile-pictures'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Users can delete their own profile pictures" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile-pictures'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );


-- ########## 5단계: 시드 데이터 삽입 ##########
-- 모든 페이지의 기본 콘텐츠 삽입
INSERT INTO public.content (page, section, key, value) VALUES
-- Home page content
('home', 'hero', 'title', 'Welcome to Bozhiymir Church'),
('home', 'hero', 'subtitle', 'A Community of Faith, Hope, and Love'),
('home', 'hero', 'description', 'Join us as we grow together in faith and fellowship, supporting Ukrainian children with love and hope.'),
('home', 'about', 'title', 'About Our Church'),
('home', 'about', 'description', 'Bozhiymir Church is a welcoming community in Portland where families come together to worship, learn, and serve.'),
('home', 'services', 'title', 'Service Times'),
('home', 'services', 'sunday_service', 'Sunday Worship: 10:00 AM'),
('home', 'services', 'bible_study', 'Bible Study: Wednesday 7:00 PM'),

-- Beliefs page content
('beliefs', 'main', 'title', 'Our Beliefs'),
('beliefs', 'main', 'description', 'We believe in the fundamental truths of Christianity as revealed in the Holy Bible.'),
('beliefs', 'trinity', 'title', 'The Trinity'),
('beliefs', 'trinity', 'description', 'We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit.'),
('beliefs', 'salvation', 'title', 'Salvation'),
('beliefs', 'salvation', 'description', 'We believe that salvation is by grace through faith in Jesus Christ alone.'),

-- Leadership page content
('leadership', 'main', 'title', 'Our Leadership'),
('leadership', 'main', 'description', 'Meet our dedicated team of pastors and leaders.'),

-- Portland Community page content
('portland-community', 'main', 'title', 'Portland Community'),
('portland-community', 'main', 'description', 'Bozhiymir Church is a beacon of hope in the Portland community.'),

-- Ukrainian Ministry page content
('ukrainian-ministry', 'main', 'title', 'Ukrainian Ministry'),
('ukrainian-ministry', 'main', 'description', 'Supporting Ukrainian families and children in their time of need.'),
('ukrainian-ministry', 'mission', 'title', 'Our Mission'),
('ukrainian-ministry', 'mission', 'description', 'We are committed to providing support, love, and hope to Ukrainian children and families.'),

-- Events page content
('events', 'main', 'title', 'Upcoming Events'),
('events', 'main', 'description', 'Join us for these upcoming events and activities.'),

-- Ministries page content
('ministries', 'main', 'title', 'Our Ministries'),
('ministries', 'main', 'description', 'Discover the various ways you can get involved in our church community.'),
('ministries', 'youth', 'title', 'Youth Ministry'),
('ministries', 'youth', 'description', 'Engaging programs for teenagers and young adults.'),
('ministries', 'children', 'title', 'Children''s Ministry'),
('ministries', 'children', 'description', 'Fun and educational programs for children of all ages.'),

-- Join page content
('join', 'main', 'title', 'Join Our Community'),
('join', 'main', 'description', 'We welcome you to become part of our church family.'),
('join', 'welcome', 'title', 'New Here?'),
('join', 'welcome', 'description', 'We would love to meet you and help you feel at home in our community.')
ON CONFLICT (page, section, key) DO NOTHING;