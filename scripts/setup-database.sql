-- ########## 1단계: 기존 설정 모두 삭제 ##########
-- 기존 트리거 삭제
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;

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
DROP POLICY IF EXISTS "Posts are public" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Post creators or admins can update" ON public.posts;
DROP POLICY IF EXISTS "Post creators or admins can delete" ON public.posts;
DROP POLICY IF EXISTS "Comments are public" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users with comment permission can create comments" ON public.comments;
DROP POLICY IF EXISTS "Comment creators or admins can delete" ON public.comments;
DROP POLICY IF EXISTS "Comment creators or admins can update" ON public.comments;
DROP POLICY IF EXISTS "Likes are public" ON public.likes;
DROP POLICY IF EXISTS "Authenticated users can like posts" ON public.likes;
DROP POLICY IF EXISTS "Users can remove their own likes" ON public.likes;
DROP POLICY IF EXISTS "Comment likes are public" ON public.comment_likes;
DROP POLICY IF EXISTS "Authenticated users can like comments" ON public.comment_likes;
DROP POLICY IF EXISTS "Users can remove their own comment likes" ON public.comment_likes;
DROP POLICY IF EXISTS "Post reactions are public" ON public.post_reactions;
DROP POLICY IF EXISTS "Authenticated users can add reactions" ON public.post_reactions;
DROP POLICY IF EXISTS "Users can remove their own reactions" ON public.post_reactions;
DROP POLICY IF EXISTS "Anyone can view valid registration codes" ON public.registration_codes;
DROP POLICY IF EXISTS "Admin can insert and update registration codes" ON public.registration_codes;
DROP POLICY IF EXISTS "Admin can view admin settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Admin can update admin settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Events are public" ON public.events;
DROP POLICY IF EXISTS "Only admins can modify events" ON public.events;

-- 기존 테이블 삭제 (CASCADE 옵션으로 의존 객체까지 삭제)
DROP TABLE IF EXISTS public.content CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.likes CASCADE;
DROP TABLE IF EXISTS public.comment_likes CASCADE;
DROP TABLE IF EXISTS public.post_reactions CASCADE;
DROP TABLE IF EXISTS public.registration_codes CASCADE;
DROP TABLE IF EXISTS public.admin_settings CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;


-- ########## 2단계: 최신 스키마로 다시 생성 ##########
-- users 테이블 생성 (새로운 컬럼들을 처음부터 포함)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'child')), -- 'child' 역할 추가
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nickname TEXT,
  gender TEXT CHECK (gender IN ('male', 'female')),
  profile_picture_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  can_comment BOOLEAN DEFAULT FALSE -- 댓글 허용 여부 컬럼 추가
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

-- posts 테이블 생성 (게시판 게시물)
CREATE TABLE public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  media_url TEXT,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  view_count INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- comments 테이블 생성 (게시물 댓글)
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- likes 테이블 생성 (게시물 공감/좋아요)
CREATE TABLE public.likes (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id) -- 복합 기본 키
);

-- comment_likes 테이블 생성 (댓글 좋아요)
CREATE TABLE public.comment_likes (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, comment_id)
);

-- post_reactions 테이블 생성 (게시물 감정 표현)
CREATE TABLE public.post_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, post_id, reaction_type)
);

-- registration_codes 테이블 생성
CREATE TABLE public.registration_codes (
  code TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  used_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at TIMESTAMP WITH TIME ZONE
);

-- admin_settings 테이블 생성
CREATE TABLE public.admin_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Ensure only one row
  delete_password_hash TEXT,
  password_set_date TIMESTAMP WITH TIME ZONE,
  password_history_hashes JSONB DEFAULT '[]'::jsonb
);

-- events 테이블 생성
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  recurring BOOLEAN DEFAULT FALSE,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Row Level Security (RLS) 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

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

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- handle_new_user 함수를 새로운 필드를 포함하도록 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, nickname, gender, profile_picture_url, can_comment)
  VALUES (NEW.id, NEW.email, 'user', NULL, NULL, NULL, FALSE) -- 기본값으로 role='user', can_comment=FALSE 설정
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
  
-- posts 테이블에 대한 정책 생성
CREATE POLICY "Posts are public" ON public.posts
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Post creators or admins can update" ON public.posts
  FOR UPDATE USING (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'))
  WITH CHECK (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));
CREATE POLICY "Post creators or admins can delete" ON public.posts
  FOR DELETE USING (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- comments 테이블에 대한 정책 생성
CREATE POLICY "Comments are public" ON public.comments
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users with comment permission can create comments" ON public.comments
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL 
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.can_comment = TRUE
    )
  );
CREATE POLICY "Comment creators or admins can delete" ON public.comments
  FOR DELETE USING (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));
CREATE POLICY "Comment creators or admins can update" ON public.comments
  FOR UPDATE USING (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'))
  WITH CHECK (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- likes 테이블에 대한 정책 생성
CREATE POLICY "Likes are public" ON public.likes
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like posts" ON public.likes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can remove their own likes" ON public.likes
  FOR DELETE USING (auth.uid() = user_id);
  
-- comment_likes 테이블에 대한 정책 생성
CREATE POLICY "Comment likes are public" ON public.comment_likes
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like comments" ON public.comment_likes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can remove their own comment likes" ON public.comment_likes
  FOR DELETE USING (auth.uid() = user_id);

-- post_reactions 테이블에 대한 정책 생성
CREATE POLICY "Post reactions are public" ON public.post_reactions
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add reactions" ON public.post_reactions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can remove their own reactions" ON public.post_reactions
  FOR DELETE USING (auth.uid() = user_id);
  
-- registration_codes 테이블에 대한 정책 생성
CREATE POLICY "Anyone can view valid registration codes" ON public.registration_codes
  FOR SELECT USING (is_used = FALSE); -- Unauthenticated users can check if a code is valid
CREATE POLICY "Admin can insert and update registration codes" ON public.registration_codes
  FOR ALL USING (EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'))
  WITH CHECK (EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- admin_settings 테이블에 대한 정책 생성
CREATE POLICY "Admin can view admin settings" ON public.admin_settings
  FOR SELECT USING (EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));
CREATE POLICY "Admin can update admin settings" ON public.admin_settings
  FOR UPDATE USING (EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- events 테이블에 대한 정책 생성
CREATE POLICY "Events are public" ON public.events
  FOR SELECT USING (true);
CREATE POLICY "Only admins can modify events" ON public.events
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
-- 등록 코드 시드 데이터 삽입
INSERT INTO public.registration_codes (code, role) VALUES
('ADMIN001', 'admin'),
('ADMIN002', 'admin'),
('MEMBER001', 'user'),
('MEMBER002', 'user'),
('MEMBER003', 'user'),
('MEMBER004', 'user'),
('MEMBER005', 'user'),
('CHILD001', 'child'),
('CHILD002', 'child'),
('CHILD003', 'child')
ON CONFLICT (code) DO NOTHING;

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
('beliefs', 'grid_items', 'bible_title', 'The Bible'),
('beliefs', 'grid_items', 'bible_description', 'We believe the Bible is the inspired, infallible Word of God and our ultimate authority for faith and life.'),
('beliefs', 'grid_items', 'jesus_title', 'Jesus Christ'),
('beliefs', 'grid_items', 'jesus_description', 'We believe Jesus Christ is the Son of God, who died for our sins and rose again, offering salvation to all who believe.'),
('beliefs', 'grid_items', 'holyspirit_title', 'Holy Spirit'),
('beliefs', 'grid_items', 'holyspirit_description', 'We believe in the Holy Spirit who guides, comforts, and empowers believers in their daily walk with God.'),
('beliefs', 'grid_items', 'love_title', 'Love & Compassion'),
('beliefs', 'grid_items', 'love_description', 'We believe in showing God''s love through caring for orphans, refugees, and those in need, especially Ukrainian children.'),
('beliefs', 'grid_items', 'community_title', 'Community'),
('beliefs', 'grid_items', 'community_description', 'We believe in the importance of Christian fellowship and building a diverse, welcoming church family.'),
('beliefs', 'grid_items', 'mission_title', 'Mission'),
('beliefs', 'grid_items', 'mission_description', 'We believe in sharing the Gospel locally and globally, serving our Portland community and beyond.'),
('beliefs', 'scripture', 'scripture_title', 'Foundation Scripture'),
('beliefs', 'scripture', 'scripture_quote', 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.'),
('beliefs', 'scripture', 'scripture_reference', 'John 3:16'),
('beliefs', 'ministry_connection', 'ministry_title', 'Living Our Beliefs'),
('beliefs', 'ministry_connection', 'ministry_description', 'Our care for Ukrainian orphan children reflects our belief in God''s heart for the vulnerable and our call to love our neighbors.'),
('beliefs', 'cta', 'cta_title', 'Want to Learn More?'),
('beliefs', 'cta', 'cta_description', 'Join us for worship and discover how these beliefs come alive in our church community.'),

-- Leadership page content
('leadership', 'main', 'title', 'Our Leadership'),
('leadership', 'main', 'description', 'Meet the dedicated leaders who guide Bozhiymir Church with wisdom, compassion, and a heart for serving our community and Ukrainian children.'),
('leadership', 'bios', 'michael_bio', 'Pastor Michael has been leading Bozhiymir Church for over 10 years. He has a heart for community outreach and has been instrumental in establishing our Ukrainian children ministry.'),
('leadership', 'bios', 'sarah_bio', 'Pastor Sarah oversees our children''s programs and has a special calling to work with Ukrainian refugee children. She speaks fluent Ukrainian and Russian.'),
('leadership', 'bios', 'james_bio', 'James leads our church board and coordinates our community outreach programs. He has been with Bozhiymir Church since its founding.'),
('leadership', 'bios', 'maria_bio', 'Maria is originally from Ukraine and coordinates our Ukrainian children''s program. She helps with translation and cultural bridge-building.'),
('leadership', 'values', 'title', 'Our Leadership Values'),
('leadership', 'values', 'value1_title', 'Compassionate Service'),
('leadership', 'values', 'value1_description', 'Leading with love and putting others first, especially the vulnerable.'),
('leadership', 'values', 'value2_title', 'Biblical Foundation'),
('leadership', 'values', 'value2_description', 'Grounding all decisions and teachings in God''s Word.'),
('leadership', 'values', 'value3_title', 'Global Vision'),
('leadership', 'values', 'value3_description', 'Serving locally while thinking globally, especially for Ukrainian children.'),
('leadership', 'contact', 'title', 'Connect with Our Leaders'),
('leadership', 'contact', 'description', 'Our leadership team is here to serve you. Don''t hesitate to reach out with questions or prayer requests.'),

-- Portland Community page content
('portland-community', 'main', 'title', 'Portland Community'),
('portland-community', 'main', 'description', 'Bozhiymir Church is a beacon of hope in the Portland community.'),

-- Ukrainian Ministry page content
('ukrainian-ministry', 'main', 'title', 'Ukrainian Children Ministry'),
('ukrainian-ministry', 'main', 'description', 'In response to the Ukrainian crisis, Bozhiymir Church has opened our hearts and doors to provide love, care, and hope to Ukrainian orphan children in Portland.'),
('ukrainian-ministry', 'mission', 'title', 'Our Mission'),
('ukrainian-ministry', 'mission', 'description', 'We are committed to providing support, love, and hope to Ukrainian children and families.'),
('ukrainian-ministry', 'impact_stats', 'title', 'Our Impact'),
('ukrainian-ministry', 'impact_stats', 'stat1_number', '47'),
('ukrainian-ministry', 'impact_stats', 'stat1_label', 'Ukrainian Children'),
('ukrainian-ministry', 'impact_stats', 'stat2_number', '25'),
('ukrainian-ministry', 'impact_stats', 'stat2_label', 'Host Families'),
('ukrainian-ministry', 'impact_stats', 'stat3_number', '8'),
('ukrainian-ministry', 'impact_stats', 'stat3_label', 'Countries Represented'),
('ukrainian-ministry', 'impact_stats', 'stat4_number', '100%'),
('ukrainian-ministry', 'impact_stats', 'stat4_label', 'Children in School'),
('ukrainian-ministry', 'programs', 'title', 'Our Programs'),
('ukrainian-ministry', 'programs', 'program1_title', 'Host Family Program'),
('ukrainian-ministry', 'programs', 'program1_description', 'Connecting Ukrainian children with loving Portland families who provide temporary homes and care.'),
('ukrainian-ministry', 'programs', 'program1_stats', '25 Host Families'),
('ukrainian-ministry', 'programs', 'program2_title', 'Education Support'),
('ukrainian-ministry', 'programs', 'program2_description', 'Helping children enroll in local schools and providing tutoring in English and other subjects.'),
('ukrainian-ministry', 'programs', 'program2_stats', '47 Children in School'),
('ukrainian-ministry', 'programs', 'program3_title', 'Emotional Care'),
('ukrainian-ministry', 'programs', 'program3_description', 'Providing counseling, trauma support, and creating safe spaces for healing and growth.'),
('ukrainian-ministry', 'programs', 'program3_stats', 'Weekly Support Groups'),
('ukrainian-ministry', 'programs', 'program4_title', 'Basic Needs'),
('ukrainian-ministry', 'programs', 'program4_description', 'Ensuring children have food, clothing, medical care, and other essential necessities.'),
('ukrainian-ministry', 'programs', 'program4_stats', '100% Needs Met'),
('ukrainian-ministry', 'programs', 'program5_title', 'Cultural Connection'),
('ukrainian-ministry', 'programs', 'program5_description', 'Helping children maintain their Ukrainian heritage while adapting to American culture.'),
('ukrainian-ministry', 'programs', 'program5_stats', 'Monthly Cultural Events'),
('ukrainian-ministry', 'programs', 'program6_title', 'Clothing & Supplies'),
('ukrainian-ministry', 'programs', 'program6_description', 'Providing clothing, school supplies, and personal items for growing children.'),
('ukrainian-ministry', 'programs', 'program6_stats', 'Ongoing Support'),
('ukrainian-ministry', 'foundation', 'foundation_title', 'Our Biblical Foundation'),
('ukrainian-ministry', 'foundation', 'scripture_quote', 'Religion that God our Father accepts as pure and faultless is this: to look after orphans and widows in their distress and to keep oneself from being polluted by the world.'),
('ukrainian-ministry', 'foundation', 'scripture_reference', 'James 1:27'),
('ukrainian-ministry', 'foundation', 'description', 'This verse guides our Ukrainian children ministry. We believe caring for orphans is not just good work—it''s pure religion that pleases God''s heart.'),
('ukrainian-ministry', 'testimonials', 'title', 'Stories of Hope'),
('ukrainian-ministry', 'testimonials', 'testi1_quote', 'Taking in Anya has blessed our family more than we ever imagined. She''s brought so much joy to our home.'),
('ukrainian-ministry', 'testimonials', 'testi2_quote', 'I love my new school and friends. The church family makes me feel safe and loved.'),
('ukrainian-ministry', 'testimonials', 'testi3_quote', 'Watching these children heal and thrive reminds us daily of God''s faithfulness and love.'),
('ukrainian-ministry', 'how_to_help', 'title', 'How You Can Help'),
('ukrainian-ministry', 'how_to_help', 'card1_title', 'Become a Host Family'),
('ukrainian-ministry', 'how_to_help', 'card1_description', 'Open your home and heart to a Ukrainian child in need.'),
('ukrainian-ministry', 'how_to_help', 'card2_title', 'Volunteer'),
('ukrainian-ministry', 'how_to_help', 'card2_description', 'Help with tutoring, transportation, or special events.'),
('ukrainian-ministry', 'how_to_help', 'card3_title', 'Donate'),
('ukrainian-ministry', 'how_to_help', 'card3_description', 'Support with clothing, school supplies, or financial gifts.'),
('ukrainian-ministry', 'contact', 'title', 'Learn More'),
('ukrainian-ministry', 'contact', 'description', 'Interested in supporting our Ukrainian children ministry? We''d love to talk with you.'),

-- Community Board page content
('communityboard', 'main', 'title', 'Our Community Board'),
('communityboard', 'main', 'description', 'Share and discuss ministry stories, events, and community activities. Your thoughts and stories help our church family grow.'),

-- Events page content
('events', 'main', 'title', 'Church Events'),
('events', 'main', 'description', 'Join us for worship, fellowship, and community events. There''s always something happening at Bozhiymir Church for every age and interest.'),
('events', 'special_ministry', 'title', 'Ukrainian Ministry Events'),
('events', 'special_ministry', 'card1_title', 'Monthly Cultural Celebrations'),
('events', 'special_ministry', 'card1_description', 'Join us for Ukrainian cultural events featuring traditional food, music, and activities.'),
('events', 'special_ministry', 'card2_title', 'Host Family Gatherings'),
('events', 'special_ministry', 'card2_description', 'Special events for host families and Ukrainian children to connect and share experiences.'),
('events', 'guidelines', 'title', 'Event Information'),
('events', 'guidelines', 'card1_title', 'All Welcome'),
('events', 'guidelines', 'card1_description', 'All our events are open to everyone, regardless of background or church membership.'),
('events', 'guidelines', 'card2_title', 'Family Friendly'),
('events', 'guidelines', 'card2_description', 'Most events are designed for families and include activities for children of all ages.'),
('events', 'guidelines', 'card3_title', 'Easy to Find'),
('events', 'guidelines', 'card3_description', 'All events are held at our church campus with clear directions and parking available.'),
('events', 'cta', 'title', 'Don''t Miss Out!'),
('events', 'cta', 'description', 'Stay connected with all our events and activities. Join our church family today!'),

-- Join page content
('join', 'main', 'title', 'Join Our Family'),
('join', 'main', 'description', 'We''d love to welcome you to Bozhiymir Church! Whether you''re visiting for the first time or looking to become part of our church family, there''s a place for you here.'),
('join', 'services', 'services_title', 'Sunday Services'),
('join', 'services', 'service_style_1', 'Traditional Service'),
('join', 'services', 'service_description_1', 'Classic hymns, choir, and traditional worship format'),
('join', 'services', 'service_style_2', 'Contemporary Service'),
('join', 'services', 'service_description_2', 'Modern worship music and casual atmosphere'),
('join', 'services', 'service_style_3', 'Family Service'),
('join', 'services', 'service_description_3', 'Family-friendly with children''s activities'),
('join', 'services', 'services_footer_text', 'All services held every Sunday'),
('join', 'expect', 'expect_title', 'What to Expect'),
('join', 'expect', 'expect_title_1', 'Warm Welcome'),
('join', 'expect', 'expect_description_1', 'Our greeters will welcome you and help you find your way around.'),
('join', 'expect', 'expect_title_2', 'Inspiring Worship'),
('join', 'expect', 'expect_description_2', 'Experience meaningful worship through music and biblical teaching.'),
('join', 'expect', 'expect_title_3', 'Friendly Community'),
('join', 'expect', 'expect_description_3', 'Meet our diverse church family from many different backgrounds.'),
('join', 'expect', 'expect_title_4', 'Kids Programs'),
('join', 'expect', 'expect_description_4', 'Safe, fun programs for children during the service.'),
('join', 'contact', 'visit_title', 'Visit Us'),
('join', 'contact', 'address', '1234 Portland Avenue\nPortland, OR 97201'),
('join', 'contact', 'service_times', 'Sunday: 9:00 AM, 10:30 AM, 12:00 PM\nWednesday Bible Study: 7:00 PM'),
('join', 'contact', 'phone', '(503) 555-0123'),
('join', 'contact', 'email', 'info@bozhiymirchurch.com'),
('join', 'ministry_highlight', 'highlight_title', 'Special Ministry Opportunity'),
('join', 'ministry_highlight', 'highlight_subtitle', 'Ukrainian Children Ministry'),
('join', 'ministry_highlight', 'highlight_description', 'Join us in caring for Ukrainian orphan children in Portland. Whether through hosting, volunteering, or supporting, there are many ways to make a difference.'),
('join', 'ministry_highlight', 'stat1_number', '47'),
('join', 'ministry_highlight', 'stat1_label', 'Children Supported'),
('join', 'ministry_highlight', 'stat2_number', '25'),
('join', 'ministry_highlight', 'stat2_label', 'Host Families'),
('join', 'ministry_highlight', 'stat3_number', '100%'),
('join', 'ministry_highlight', 'stat3_label', 'In School'),
('join', 'cta', 'cta_title', 'Ready to Visit?'),
('join', 'cta', 'cta_description', 'We can''t wait to meet you and welcome you into our church family. Come as you are - you belong here!')
ON CONFLICT (page, section, key) DO UPDATE SET value = EXCLUDED.value;