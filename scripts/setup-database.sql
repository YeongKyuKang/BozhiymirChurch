-- ########## 1단계: 기존 설정 모두 삭제 ##########
-- 기존 트리거 삭제
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
-- 신규 추가될 테이블의 트리거도 삭제
DROP TRIGGER IF EXISTS update_thanks_posts_updated_at ON public.thanks_posts;
DROP TRIGGER IF EXISTS update_word_posts_updated_at ON public.word_posts;
-- 슬러그 생성 트리거도 삭제
DROP TRIGGER IF EXISTS set_event_slug ON public.events;


-- 기존 함수 삭제 (CASCADE 옵션으로 의존 객체까지 삭제)
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
-- 슬러그 생성 함수도 삭제
DROP FUNCTION IF EXISTS generate_event_slug() CASCADE;


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
-- ✅ 추가: event-banners 스토리지 정책 삭제
DROP POLICY IF EXISTS "Anyone can view event banners" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload event banners" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update event banners" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete event banners" ON storage.objects;
-- 기존 정책 삭제 (계속)
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
--DROP POLICY IF EXISTS "Anyone can view valid registration codes" ON public.registration_codes;
--DROP POLICY IF EXISTS "Admin can insert and update registration codes" ON public.registration_codes;
DROP POLICY IF EXISTS "Admin can view admin settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Admin can update admin settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Events are public" ON public.events;
DROP POLICY IF EXISTS "Only admins can modify events" ON public.events;
DROP POLICY IF EXISTS "Prayer requests are public" ON public.prayer_requests;
DROP POLICY IF EXISTS "Authenticated users can create prayer requests" ON public.prayer_requests;
DROP POLICY IF EXISTS "Admins or request authors can update prayer request answers" ON public.prayer_requests;
DROP POLICY IF EXISTS "Request authors or admins can delete prayer requests" ON public.prayer_requests;
-- 신규 추가될 테이블의 정책도 삭제
DROP POLICY IF EXISTS "Thanks posts are public" ON public.thanks_posts;
DROP POLICY IF EXISTS "Authenticated users can create thanks posts" ON public.thanks_posts;
DROP POLICY IF EXISTS "Thanks post creators or admins can update" ON public.thanks_posts;
DROP POLICY IF EXISTS "Thanks post creators or admins can delete" ON public.thanks_posts;
DROP POLICY IF EXISTS "Thanks comments are public" ON public.thanks_comments;
DROP POLICY IF EXISTS "Authenticated users with comment permission can create thanks comments" ON public.thanks_comments;
DROP POLICY IF EXISTS "Thanks comment creators or admins can delete" ON public.thanks_comments;
DROP POLICY IF EXISTS "Thanks comment creators or admins can update" ON public.thanks_comments;
DROP POLICY IF EXISTS "Thanks reactions are public" ON public.thanks_reactions;
DROP POLICY IF EXISTS "Authenticated users can add thanks reactions" ON public.thanks_reactions;
DROP POLICY IF EXISTS "Users can remove their own thanks reactions" ON public.thanks_reactions;
DROP POLICY IF EXISTS "Word posts are public" ON public.word_posts;
DROP POLICY IF EXISTS "Admins can create word posts" ON public.word_posts;
DROP POLICY IF EXISTS "Admins can update word posts" ON public.word_posts;
DROP POLICY IF EXISTS "Admins can delete word posts" ON public.word_posts;
DROP POLICY IF EXISTS "Word comments are public" ON public.word_comments;
DROP POLICY IF EXISTS "Authenticated users with comment permission can create word comments" ON public.word_comments;
DROP POLICY IF EXISTS "Word comment creators or admins can delete" ON public.word_comments;
DROP POLICY IF EXISTS "Word comment creators or admins can update" ON public.word_comments;
DROP POLICY IF EXISTS "Word reactions are public" ON public.word_reactions;
DROP POLICY IF EXISTS "Authenticated users can add word reactions" ON public.word_reactions;
DROP POLICY IF EXISTS "Users can remove their own word reactions" ON public.word_reactions;

-- 기존 스토리지 정책 삭제 (중복 방지)
DROP POLICY IF EXISTS "Anyone can view profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view word backgrounds" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload word backgrounds" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update word backgrounds" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete word backgrounds" ON storage.objects;

-- 기존 테이블 삭제 (CASCADE 옵션으로 의존 객체까지 삭제)
DROP TABLE IF EXISTS public.content CASCADE;
DROP TABLE IF EXISTS public.users CASCADE; -- users 테이블 삭제 부분 제거
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.likes CASCADE;
DROP TABLE IF EXISTS public.comment_likes CASCADE;
DROP TABLE IF EXISTS public.post_reactions CASCADE;
DROP TABLE IF EXISTS public.registration_codes CASCADE;
DROP TABLE IF EXISTS public.admin_settings CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.prayer_requests CASCADE;
-- contact_forms 테이블 삭제 추가
DROP TABLE IF EXISTS public.contact_forms CASCADE;
-- 신규 추가될 테이블도 삭제
DROP TABLE IF EXISTS public.thanks_posts CASCADE;
DROP TABLE IF EXISTS public.thanks_comments CASCADE;
DROP TABLE IF EXISTS public.thanks_reactions CASCADE;
DROP TABLE IF EXISTS public.word_posts CASCADE;
DROP TABLE IF EXISTS public.word_comments CASCADE;
DROP TABLE IF EXISTS public.word_reactions CASCADE;


-- ########## 2단계: 최신 스키마로 다시 생성 ##########
-- users 테이블 생성 (새로운 컬럼들을 처음부터 포함) - 이 부분도 제거합니다.
--CREATE TABLE public.users (
-- id UUID REFERENCES auth.users(id) PRIMARY KEY,
--  email TEXT NOT NULL,
--  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'child')), -- 'child' 역할 추가
--  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--  nickname TEXT,
--  gender TEXT CHECK (gender IN ('male', 'female')),
--  profile_picture_url TEXT,
--  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--  can_comment BOOLEAN DEFAULT FALSE -- 댓글 허용 여부 컬럼 추가
--);

-- -- content 테이블 생성
-- CREATE TABLE public.content (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   page TEXT NOT NULL,
--   section TEXT NOT NULL,
--   key TEXT NOT NULL,
--   value TEXT NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   UNIQUE(page, section, key)
-- );

-- -- posts 테이블 생성 (게시판 게시물)
-- CREATE TABLE public.posts (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   title TEXT NOT NULL,
--   content TEXT NOT NULL,
--   media_url TEXT,
--   author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
--   view_count INT DEFAULT 0,
--   likes_count INT DEFAULT 0,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- -- comments 테이블 생성 (게시물 댓글)
-- CREATE TABLE public.comments (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY, -- 오류 수정: 'IS NULL' 제거
--   post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
--   author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
--   comment TEXT NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- -- likes 테이블 생성 (게시물 공감/좋아요)
-- CREATE TABLE public.likes (
--   user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
--   post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   PRIMARY KEY (user_id, post_id) -- 복합 기본 키
-- );

-- -- comment_likes 테이블 생성 (댓글 좋아요)
-- CREATE TABLE public.comment_likes (
--   user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
--   comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   PRIMARY KEY (user_id, comment_id)
-- );

-- -- post_reactions 테이블 생성 (게시물 감정 표현)
-- CREATE TABLE public.post_reactions (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
--   post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
--   reaction_type TEXT NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   UNIQUE (user_id, post_id, reaction_type)
-- );

-- -- registration_codes 테이블 생성
-- CREATE TABLE public.registration_codes (
--   code TEXT PRIMARY KEY,
--   role TEXT NOT NULL,
--   is_used BOOLEAN DEFAULT FALSE,
--   used_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
--   used_at TIMESTAMP WITH TIME ZONE
-- );

-- -- admin_settings 테이블 생성
-- CREATE TABLE public.admin_settings (
--   id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Ensure only one row
--   delete_password_hash TEXT,
--   password_set_date TIMESTAMP WITH TIME ZONE,
--   password_history_hashes JSONB DEFAULT '[]'::jsonb
-- );

-- -- events 테이블 생성 (스키마 수정: slug 컬럼 추가)
-- CREATE TABLE public.events (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   title TEXT NOT NULL,
--   slug TEXT UNIQUE, -- 슬러그 컬럼 추가 및 UNIQUE 제약 조건
--   description TEXT, -- Nullable
--   event_date TEXT NOT NULL, --YYYY-MM-DD
--   start_time TEXT, -- HH:MM, Nullable
--   end_time TEXT, -- HH:MM, Nullable
--   location TEXT, -- Nullable
--   category TEXT, -- Nullable
--   image_url TEXT, -- Nullable
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- -- prayer_requests 테이블 생성 (이전 대화에서 추가)
-- CREATE TABLE public.prayer_requests (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   category TEXT NOT NULL, -- 'ukraine' | 'bozhiymirchurch' | 'members' | 'children'
--   title TEXT NOT NULL,
--   content TEXT NOT NULL,
--   author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
--   author_nickname TEXT NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   answer_content TEXT,
--   answer_author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
--   answer_author_nickname TEXT,
--   answered_at TIMESTAMP WITH TIME ZONE
-- );

-- -- thanks_posts 테이블 생성 (새로 추가: 감사 제목 게시판)
-- CREATE TABLE public.thanks_posts (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   title TEXT NOT NULL,
--   content TEXT NOT NULL,
--   author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
--   author_nickname TEXT NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   author_profile_picture_url TEXT,
--   author_role TEXT,
--   category TEXT NOT NULL
-- );

-- -- thanks_comments 테이블 생성 (새로 추가: 감사 제목 댓글)
-- CREATE TABLE public.thanks_comments (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   post_id UUID REFERENCES public.thanks_posts(id) ON DELETE CASCADE NOT NULL,
--   author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
--   comment TEXT NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- -- thanks_reactions 테이블 생성 (새로 추가: 감사 제목 공감/반응)
-- CREATE TABLE public.thanks_reactions (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
--   post_id UUID REFERENCES public.thanks_posts(id) ON DELETE CASCADE,
--   reaction_type TEXT NOT NULL, -- 'like', 'heart', 'pray' 등 다양한 이모티콘
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   UNIQUE (user_id, post_id, reaction_type)
-- );

-- -- word_posts 테이블 생성 (새로 추가: 매일 말씀 게시판)
-- CREATE TABLE public.word_posts (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   title TEXT NOT NULL, -- 예: "요한복음 3:16"
--   content TEXT NOT NULL, -- 예: "하나님이 세상을 이처럼 사랑하사..."
--   word_date DATE UNIQUE NOT NULL, -- 매일 말씀을 위한 고유 날짜 (달력 UI용)
--   author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL, -- 주로 관리자가 작성
--   author_nickname TEXT NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   image_url TEXT -- 배경 이미지 URL
-- );

-- -- word_comments 테이블 생성 (새로 추가: 매일 말씀 댓글)
-- CREATE TABLE public.word_comments (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   post_id UUID REFERENCES public.word_posts(id) ON DELETE CASCADE NOT NULL,
--   author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
--   comment TEXT NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- -- word_reactions 테이블 생성 (새로 추가: 매일 말씀 공감/반응)
-- CREATE TABLE public.word_reactions (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
--   post_id UUID REFERENCES public.word_posts(id) ON DELETE CASCADE,
--   reaction_type TEXT NOT NULL, -- 'like', 'heart', 'pray' 등 다양한 이모티콘
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   UNIQUE (user_id, post_id, reaction_type)
-- );

-- CREATE TABLE public.contact_forms (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   first_name TEXT NOT NULL,
--   last_name TEXT NOT NULL,
--   email TEXT NOT NULL,
--   phone TEXT,
--   interests JSONB,
--   message TEXT,
--   is_read BOOLEAN DEFAULT FALSE,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   age_group TEXT,
--   receive_updates BOOLEAN DEFAULT FALSE,
--   type TEXT,
--   subject TEXT
-- );


-- -- Row Level Security (RLS) 활성화
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.registration_codes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
-- -- 신규 추가된 테이블 RLS 활성화
-- ALTER TABLE public.thanks_posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.thanks_comments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.thanks_reactions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.word_posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.word_comments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.word_reactions ENABLE ROW LEVEL SECURITY;


-- -- updated_at 타임스탬프를 자동으로 업데이트하는 함수 생성
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = NOW();
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- updated_at을 자동으로 업데이트하는 트리거 생성
-- CREATE TRIGGER update_users_updated_at
--     BEFORE UPDATE ON public.users
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_posts_updated_at
--     BEFORE UPDATE ON public.posts
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_events_updated_at
--     BEFORE UPDATE ON public.events
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- -- 신규 추가된 테이블의 updated_at 트리거
-- CREATE TRIGGER update_thanks_posts_updated_at
--     BEFORE UPDATE ON public.thanks_posts
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_word_posts_updated_at
--     BEFORE UPDATE ON public.word_posts
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- -- 슬러그를 자동으로 생성하는 함수
-- CREATE OR REPLACE FUNCTION generate_event_slug()
-- RETURNS TRIGGER AS $$
-- DECLARE
--     base_slug TEXT;
--     new_slug TEXT;
--     counter INT := 0;
-- BEGIN
--     -- 특수 문자 제거 및 공백을 하이픈으로 대체, 소문자로 변환
--     base_slug := LOWER(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9가-힣]+', '-', 'g'));
--     -- 선행/후행 하이픈 제거 및 여러 하이픈을 하나로
--     base_slug := TRIM(BOTH '-' FROM REGEXP_REPLACE(base_slug, '-+', '-', 'g'));

--     -- 제목이 너무 짧거나 특수 문자로만 이루어져 슬러그가 비어있는 경우 기본값 설정
--     IF base_slug = '' THEN
--         base_slug := 'event';
--     END IF;

--     new_slug := base_slug;

--     -- 슬러그의 고유성 확인 및 필요한 경우 카운터 추가
--     LOOP
--         -- 카운터가 0보다 크면 슬러그에 카운터 추가
--         IF counter > 0 THEN
--             new_slug := base_slug || '-' || counter;
--         END IF;

--         -- 이미 존재하는 슬러그인지 확인
--         PERFORM 1 FROM public.events WHERE slug = new_slug;
--         -- 슬러그가 존재하지 않거나, 업데이트 중이고 기존 슬러그와 동일한 경우 루프 종료
--         IF NOT FOUND OR (TG_OP = 'UPDATE' AND OLD.slug = new_slug) THEN
--             NEW.slug := new_slug;
--             EXIT;
--         END IF;

--         counter := counter + 1;
--     END LOOP;

--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- -- 슬러그를 자동으로 설정하는 트리거
-- CREATE TRIGGER set_event_slug
-- BEFORE INSERT OR UPDATE ON public.events
-- FOR EACH ROW
-- EXECUTE FUNCTION generate_event_slug();


-- -- handle_new_user 함수를 새로운 필드를 포함하도록 생성
-- -- 이 함수는 auth.users 테이블에 새 사용자가 추가될 때 public.users 테이블에 자동으로 레코드를 삽입합니다.
-- -- public.users 테이블이 삭제되지 않으므로, 이 함수는 기존 로직과 함께 잘 작동합니다.
-- CREATE OR REPLACE FUNCTION handle_new_user()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO public.users (id, email, role, nickname, gender, profile_picture_url, can_comment)
--   VALUES (NEW.id, NEW.email, 'user', NULL, NULL, NULL, FALSE) -- 기본값으로 role='user', can_comment=FALSE 설정
--   ON CONFLICT (id) DO NOTHING; -- 이미 존재하는 ID에 대한 충돌 방지
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;


-- -- ########## 3단계: 정책 및 트리거 다시 생성 ##########
-- -- users 테이블에 대한 정책 생성
-- CREATE POLICY "Users can view their own profile" ON public.users
--   FOR SELECT USING (auth.uid() = id);

-- -- 모든 필드에 대한 업데이트를 허용하는 정책으로 통합
-- CREATE POLICY "Users can update their own profile" ON public.users
--   FOR UPDATE USING (auth.uid() = id)
--   WITH CHECK (auth.uid() = id);

-- -- service_role을 위한 INSERT 정책 생성
-- CREATE POLICY "Allow service role to insert user records" ON public.users
--   FOR INSERT TO service_role
--   WITH CHECK (true);

-- -- content 테이블에 대한 정책 생성
-- CREATE POLICY "Anyone can view content" ON public.content
--   FOR SELECT TO authenticated, anon USING (true);

-- CREATE POLICY "Only admins can modify content" ON public.content
--   FOR ALL USING (
--     EXISTS (
--       SELECT 1 FROM public.users
--       WHERE users.id = auth.uid()
--       AND users.role = 'admin'
--     )
--   );
  
-- -- posts 테이블에 대한 정책 생성
-- CREATE POLICY "Posts are public" ON public.posts
--   FOR SELECT USING (true);
-- CREATE POLICY "Authenticated users can create posts" ON public.posts
--   FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- CREATE POLICY "Post creators or admins can update" ON public.posts
--   FOR UPDATE USING (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'))
--   WITH CHECK (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));
-- CREATE POLICY "Post creators or admins can delete" ON public.posts
--   FOR DELETE USING (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- -- comments 테이블에 대한 정책 생성
-- CREATE POLICY "Comments are public" ON public.comments
--   FOR SELECT USING (true);
-- CREATE POLICY "Authenticated users with comment permission can create comments" ON public.comments
--   FOR INSERT WITH CHECK (
--     auth.uid() IS NOT NULL 
--     AND EXISTS (
--       SELECT 1 FROM public.users
--       WHERE users.id = auth.uid() AND users.can_comment = TRUE
--     )
--   );
-- CREATE POLICY "Comment creators or admins can delete" ON public.comments
--   FOR DELETE USING (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));
-- CREATE POLICY "Comment creators or admins can update" ON public.comments
--   FOR UPDATE USING (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'))
--   WITH CHECK (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- -- likes 테이블에 대한 정책 생성
-- CREATE POLICY "Likes are public" ON public.likes
--   FOR SELECT USING (true);
-- CREATE POLICY "Authenticated users can like posts" ON public.likes
--   FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- CREATE POLICY "Users can remove their own likes" ON public.likes
--   FOR DELETE USING (auth.uid() = user_id);
  
-- -- comment_likes 테이블에 대한 정책 생성
-- CREATE POLICY "Comment likes are public" ON public.comment_likes
--   FOR SELECT USING (true);
-- CREATE POLICY "Authenticated users can like comments" ON public.comment_likes
--   FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- CREATE POLICY "Users can remove their own comment likes" ON public.comment_likes
--   FOR DELETE USING (auth.uid() = user_id);

-- -- post_reactions 테이블에 대한 정책 생성
-- CREATE POLICY "Post reactions are public" ON public.post_reactions
--   FOR SELECT USING (true);
-- CREATE POLICY "Authenticated users can add reactions" ON public.post_reactions
--   FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- CREATE POLICY "Users can remove their own reactions" ON public.post_reactions
--   FOR DELETE USING (auth.uid() = user_id);
  
-- -- registration_codes 테이블에 대한 정책 생성
-- CREATE POLICY "Anyone can view valid registration codes" ON public.registration_codes
--   FOR SELECT USING (is_used = FALSE); -- Unauthenticated users can check if a code is valid
-- CREATE POLICY "Admin can insert and update registration codes" ON public.registration_codes
--   FOR ALL USING (EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'))
--   WITH CHECK (EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- -- admin_settings 테이블에 대한 정책 생성
-- CREATE POLICY "Admin can view admin settings" ON public.admin_settings
--   FOR SELECT USING (EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));
-- CREATE POLICY "Admin can update admin settings" ON public.admin_settings
--   FOR UPDATE USING (EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- -- events 테이블에 대한 정책 생성
-- CREATE POLICY "Events are public" ON public.events
--   FOR SELECT USING (true);
-- CREATE POLICY "Only admins can modify events" ON public.events
--   FOR ALL USING (
--     EXISTS (
--       SELECT 1 FROM public.users
--       WHERE users.id = auth.uid()
--       AND users.role = 'admin'
--     )
--   );

-- -- prayer_requests 테이블에 대한 정책 생성
-- CREATE POLICY "Prayer requests are public" ON public.prayer_requests
--   FOR SELECT USING (true);
-- CREATE POLICY "Authenticated users can create prayer requests" ON public.prayer_requests
--   FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- -- 관리자 또는 요청 작성자가 응답 필드를 업데이트할 수 있도록 허용
-- CREATE POLICY "Admins or request authors can update prayer request answers" ON public.prayer_requests
--   FOR UPDATE USING (
--     auth.uid() = author_id 
--     OR EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
--   )
--   WITH CHECK (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));
-- CREATE POLICY "Request authors or admins can delete prayer requests" ON public.prayer_requests
--   FOR DELETE USING (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- -- thanks_posts 테이블에 대한 정책 생성 (새로 추가)
-- CREATE POLICY "Thanks posts are public" ON public.thanks_posts
--   FOR SELECT USING (true);
-- CREATE POLICY "Authenticated users can create thanks posts" ON public.thanks_posts
--   FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- CREATE POLICY "Thanks post creators or admins can update" ON public.thanks_posts
--   FOR UPDATE USING (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'))
--   WITH CHECK (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));
-- CREATE POLICY "Thanks post creators or admins can delete" ON public.thanks_posts
--   FOR DELETE USING (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- -- thanks_comments 테이블에 대한 정책 생성 (새로 추가)
-- CREATE POLICY "Thanks comments are public" ON public.thanks_comments
--   FOR SELECT USING (true);
-- CREATE POLICY "Authenticated users with comment permission can create thanks comments" ON public.thanks_comments
--   FOR INSERT WITH CHECK (
--     auth.uid() IS NOT NULL 
--     AND EXISTS (
--       SELECT 1 FROM public.users
--       WHERE users.id = auth.uid() AND users.can_comment = TRUE
--     )
--   );
-- CREATE POLICY "Thanks comment creators or admins can delete" ON public.thanks_comments
--   FOR DELETE USING (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));
-- CREATE POLICY "Thanks comment creators or admins can update" ON public.thanks_comments
--   FOR UPDATE USING (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'))
--   WITH CHECK (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- -- thanks_reactions 테이블에 대한 정책 생성 (새로 추가)
-- CREATE POLICY "Thanks reactions are public" ON public.thanks_reactions
--   FOR SELECT USING (true);
-- CREATE POLICY "Authenticated users can add thanks reactions" ON public.thanks_reactions
--   FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- CREATE POLICY "Users can remove their own thanks reactions" ON public.thanks_reactions
--   FOR DELETE USING (auth.uid() = user_id);

-- -- word_posts 테이블에 대한 정책 생성 (새로 추가)
-- CREATE POLICY "Word posts are public" ON public.word_posts
--   FOR SELECT USING (true);
-- -- 매일 말씀은 관리자만 작성 가능하도록 설정
-- CREATE POLICY "Admins can create word posts" ON public.word_posts
--   FOR INSERT WITH CHECK (EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));
-- CREATE POLICY "Admins can update word posts" ON public.word_posts
--   FOR UPDATE USING (EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'))
--   WITH CHECK (EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));
-- CREATE POLICY "Admins can delete word posts" ON public.word_posts
--   FOR DELETE USING (EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- -- word_comments 테이블에 대한 정책 생성 (새로 추가)
-- CREATE POLICY "Word comments are public" ON public.word_comments
--   FOR SELECT USING (true);
-- CREATE POLICY "Authenticated users with comment permission can create word comments" ON public.word_comments
--   FOR INSERT WITH CHECK (
--     auth.uid() IS NOT NULL 
--     AND EXISTS (
--       SELECT 1 FROM public.users
--       WHERE users.id = auth.uid() AND users.can_comment = TRUE
--     )
--   );
-- CREATE POLICY "Word comment creators or admins can delete" ON public.word_comments
--   FOR DELETE USING (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));
-- CREATE POLICY "Word comment creators or admins can update" ON public.word_comments
--   FOR UPDATE USING (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'))
--   WITH CHECK (auth.uid() = author_id OR EXISTS(SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- -- word_reactions 테이블에 대한 정책 생성 (새로 추가)
-- CREATE POLICY "Word reactions are public" ON public.word_reactions
--   FOR SELECT USING (true);
-- CREATE POLICY "Authenticated users can add word reactions" ON public.word_reactions
--   FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- CREATE POLICY "Users can remove their own word reactions" ON public.word_reactions
--   FOR DELETE USING (auth.uid() = user_id);


-- -- 'on_auth_user_created' 트리거 다시 생성
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- -- ########## 4단계: 스토리지 버킷 및 정책 생성 ##########
-- -- 프로필 사진용 스토리지 버킷 생성
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('profile-pictures', 'profile-pictures', true)
-- ON CONFLICT (id) DO NOTHING;

-- -- ✅ 추가: word-backgrounds 스토리지 버킷 생성
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('word-backgrounds', 'word-backgrounds', true)
-- ON CONFLICT (id) DO NOTHING;

-- -- 프로필 사진에 대한 스토리지 정책 설정
-- CREATE POLICY "Anyone can view profile pictures" ON storage.objects
--   FOR SELECT USING (bucket_id = 'profile-pictures');
-- CREATE POLICY "Users can upload their own profile pictures" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'profile-pictures'
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );
-- CREATE POLICY "Users can update their own profile pictures" ON storage.objects
--   FOR UPDATE USING (
--     bucket_id = 'profile-pictures'
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );
-- CREATE POLICY "Users can delete their own profile pictures" ON storage.objects
--   FOR DELETE USING (
--     bucket_id = 'profile-pictures'
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );

-- -- ✅ 추가: word-backgrounds에 대한 스토리지 정책 설정
-- CREATE POLICY "Anyone can view word backgrounds" ON storage.objects
--   FOR SELECT USING (bucket_id = 'word-backgrounds');
-- CREATE POLICY "Admins can upload word backgrounds" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'word-backgrounds' AND EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
--   );
-- CREATE POLICY "Admins can update word backgrounds" ON storage.objects
--   FOR UPDATE USING (
--     bucket_id = 'word-backgrounds' AND EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
--   );
-- CREATE POLICY "Admins can delete word backgrounds" ON storage.objects
--   FOR DELETE USING (
--     bucket_id = 'word-backgrounds' AND EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
--   );

--   -- ✅ 추가: event-banners 스토리지 버킷 생성
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('event-banners', 'event-banners', true)
-- ON CONFLICT (id) DO NOTHING;

-- -- ✅ 추가: event-banners에 대한 스토리지 정책 설정
-- CREATE POLICY "Anyone can view event banners" ON storage.objects
--   FOR SELECT USING (bucket_id = 'event-banners');
-- CREATE POLICY "Admins can upload event banners" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'event-banners' AND EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
--   );
-- CREATE POLICY "Admins can update event banners" ON storage.objects
--   FOR UPDATE USING (
--     bucket_id = 'event-banners' AND EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
--   );
-- CREATE POLICY "Admins can delete event banners" ON storage.objects
--   FOR DELETE USING (
--     bucket_id = 'event-banners' AND EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
--   );


-- -- ########## 5단계: 시드 데이터 삽입 ##########
-- -- 등록 코드 시드 데이터 삽입
-- INSERT INTO public.registration_codes (code, role) VALUES
-- ('ADMIN001', 'admin'),
-- ('ADMIN002', 'admin'),
-- ('MEMBER001', 'user'),
-- ('MEMBER002', 'user'),
-- ('MEMBER003', 'user'),
-- ('MEMBER004', 'user'),
-- ('MEMBER005', 'user'),
-- ('CHILD001', 'child'),
-- ('CHILD002', 'child'),
-- ('CHILD003', 'child')
-- ON CONFLICT (code) DO NOTHING;

-- -- 모든 ��이지의 기본 콘텐츠 삽입
-- INSERT INTO public.content (page, section, key, value) VALUES
-- -- Home page content
-- ('home', 'hero', 'title', 'Welcome to Bozhiymir Church'),
-- ('home', 'hero', 'subtitle', 'SUNDAY MORNINGS AT'),
-- ('home', 'hero', 'sunday_service_times', '9:00AM (TRADITIONAL), 10:30AM, OR 12:00PM'),
-- ('home', 'hero', 'description', '🇺🇦 A loving community in Poland where Ukrainian children find hope and healing'),
-- ('home', 'hero', 'ukrainian_translation', 'Любляча спільнота в Портленді, де українські діти знаходять надію'),
-- ('home', 'hero', 'cta_text', 'Join our church family this Sunday'),
-- ('home', 'about', 'title', 'About Our Church'),
-- ('home', 'about', 'description', 'Bozhiymir Church is a welcoming community in Poland where families come together to worship, learn, and serve.'),
-- ('home', 'services', 'title', 'Service Times'),
-- ('home', 'services', 'sunday_service', 'Sunday Worship: 10:00 AM'),
-- ('home', 'services', 'bible_study', 'Bible Study: Wednesday 7:00 PM'),
-- ('home', 'community_about', 'main_title', 'About Our Community'),
-- ('home', 'community_about', 'subtitle', 'A Family United by Faith and Love'),
-- ('home', 'community_about', 'paragraph_1', 'Bozhiymir Church is more than a place of worship—we''re a diverse, loving family that spans cultures, languages, and backgrounds. Our community has grown stronger through welcoming Ukrainian families and children who have found refuge in Poland.'),
-- ('home', 'community_about', 'paragraph_2', 'From our traditional Sunday services to our vibrant children''s programs, every person who walks through our doors becomes part of something beautiful. We believe that God''s love knows no borders, and our community reflects that truth every day.'),
-- ('home', 'community_about', 'scripture_quote', '"There is neither Jew nor Gentile, neither slave nor free, nor is there male and female, for you are all one in Christ Jesus." - Galatians 3:28'),
-- ('home', 'community_about', 'ministry_title', 'Our Ukrainian Ministry'),
-- ('home', 'community_about', 'ministry_description', 'We''ve opened our hearts and homes to Ukrainian orphan children, providing them with not just shelter, but a loving church family. Through host families, educational support, and community care, we''re helping these brave children heal and build new lives filled with hope.'),
-- ('home', 'community_highlights', 'highlight1_title', 'Welcoming Spirit'),
-- ('home', 'community_highlights', 'highlight1_description', 'Every person is welcomed with open arms, regardless of background, language, or life circumstances.'),
-- ('home', 'community_highlights', 'highlight2_title', 'Global Family'),
-- ('home', 'community_highlights', 'highlight2_description', 'Our community represents multiple countries and cultures, creating a rich tapestry of faith and fellowship.'),
-- ('home', 'community_highlights', 'highlight3_title', 'Caring Support'),
-- ('home', 'community_highlights', 'highlight3_description', 'From practical needs to emotional support, our community rallies around each member with Christ''s love.'),

-- -- Jesus page content (새로 추가)
-- ('jesus', 'main', 'title', 'Jesus Christ'),
-- ('jesus', 'main', 'subtitle', 'Our Lord and Savior'),
-- ('jesus', 'main', 'description', 'At the heart of our faith is Jesus Christ - the Son of God, our Savior, and the foundation of everything we believe and do as a church community.'),
-- ('jesus', 'main', 'scripture_quote', 'Jesus said to him, "I am the way, and the truth, and the life. No one comes to the Father except through me."'),
-- ('jesus', 'main', 'scripture_reference', 'John 14:6'),
-- ('jesus', 'who_is_jesus', 'title', 'Who is Jesus?'),
-- ('jesus', 'who_is_jesus', 'description', 'Jesus Christ is the eternal Son of God who became human to save us from our sins. He lived a perfect life, died on the cross for our redemption, and rose again, conquering death and offering eternal life to all who believe.'),
-- ('jesus', 'teachings', 'title', 'The Teachings of Jesus'),
-- ('jesus', 'teachings', 'teaching1_title', 'Love God and Others'),
-- ('jesus', 'teachings', 'teaching1_description', 'Jesus taught us to love God with all our heart, soul, mind, and strength, and to love our neighbors as ourselves.'),
-- ('jesus', 'teachings', 'teaching1_scripture', 'Matthew 22:37-39'),
-- ('jesus', 'teachings', 'teaching2_title', 'Forgiveness'),
-- ('jesus', 'teachings', 'teaching2_description', 'Through Jesus, we learn the power of forgiveness - both receiving God''s forgiveness and extending it to others.'),
-- ('jesus', 'teachings', 'teaching2_scripture', 'Matthew 6:14-15'),
-- ('jesus', 'teachings', 'teaching3_title', 'Compassion for the Vulnerable'),
-- ('jesus', 'teachings', 'teaching3_description', 'Jesus showed special care for children, the poor, and the marginalized - a calling we embrace in our Ukrainian ministry.'),
-- ('jesus', 'teachings', 'teaching3_scripture', 'Matthew 19:14'),
-- ('jesus', 'teachings', 'teaching4_title', 'Eternal Life'),
-- ('jesus', 'teachings', 'teaching4_description', 'Jesus offers the gift of eternal life to all who believe in Him as their Lord and Savior.'),
-- ('jesus', 'teachings', 'teaching4_scripture', 'John 3:16'),
-- ('jesus', 'teachings', 'teaching5_title', 'Peace and Hope'),
-- ('jesus', 'teachings', 'teaching5_description', 'In a troubled world, Jesus offers peace that surpasses understanding and hope that never fails.'),
-- ('jesus', 'teachings', 'teaching5_scripture', 'John 14:27'),
-- ('jesus', 'teachings', 'teaching6_title', 'Service to Others'),
-- ('jesus', 'teachings', 'teaching6_description', 'Jesus taught by example that true greatness comes through serving others with humility and love.'),
-- ('jesus', 'teachings', 'teaching6_scripture', 'Mark 10:43-44'),
-- ('jesus', 'salvation', 'title', 'Salvation Through Jesus'),
-- ('jesus', 'salvation', 'description', 'Salvation is a free gift from God, received through faith in Jesus Christ. It cannot be earned by good works, but is given by God''s grace to all who believe.'),
-- ('jesus', 'salvation', 'steps_title', 'How to Receive Salvation'),
-- ('jesus', 'salvation', 'step1', 'Acknowledge that you are a sinner in need of God''s forgiveness'),
-- ('jesus', 'salvation', 'step2', 'Believe that Jesus Christ died for your sins and rose again'),
-- ('jesus', 'salvation', 'step3', 'Confess Jesus as your Lord and Savior'),
-- ('jesus', 'salvation', 'step4', 'Commit to following Jesus in your daily life'),
-- ('jesus', 'ministry_connection', 'title', 'Jesus and Our Ukrainian Ministry'),
-- ('jesus', 'ministry_connection', 'description', 'Our care for Ukrainian orphan children reflects Jesus'' heart for the vulnerable. Just as He welcomed children and cared for those in need, we open our arms to these precious children, showing them the love of Christ.'),
-- ('jesus', 'cta', 'title', 'Want to Know Jesus?'),
-- ('jesus', 'cta', 'description', 'If you would like to learn more about Jesus or make a decision to follow Him, we would love to talk with you.'),

-- -- Beliefs page content
-- ('beliefs', 'main', 'title', 'Our Beliefs'),
-- ('beliefs', 'main', 'description', 'At Bozhiymir Church, our faith is built on the solid foundation of God''s Word. These core beliefs guide everything we do as a church family.'),
-- ('beliefs', 'trinity', 'title', 'The Trinity'),
-- ('beliefs', 'trinity', 'description', 'We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit.'),
-- ('beliefs', 'salvation', 'title', 'Salvation'),
-- ('beliefs', 'salvation', 'description', 'We believe that salvation is by grace through faith in Jesus Christ alone.'),
-- ('beliefs', 'grid_items', 'bible_title', 'The Bible'),
-- ('beliefs', 'grid_items', 'bible_description', 'We believe the Bible is the inspired, infallible Word of God and our ultimate authority for faith and life.'),
-- ('beliefs', 'grid_items', 'jesus_title', 'Jesus Christ'),
-- ('beliefs', 'grid_items', 'jesus_description', 'We believe Jesus Christ is the Son of God, who died for our sins and rose again, offering salvation to all who believe.'),
-- ('beliefs', 'grid_items', 'holyspirit_title', 'Holy Spirit'),
-- ('beliefs', 'grid_items', 'holyspirit_description', 'We believe in the Holy Spirit who guides, comforts, and empowers believers in their daily walk with God.'),
-- ('beliefs', 'grid_items', 'love_title', 'Love & Compassion'),
-- ('beliefs', 'grid_items', 'love_description', 'We believe in showing God''s love through caring for orphans, refugees, and those in need, especially Ukrainian children.'),
-- ('beliefs', 'grid_items', 'community_title', 'Community'),
-- ('beliefs', 'grid_items', 'community_description', 'Building authentic relationships and welcoming all backgrounds.'),
-- ('beliefs', 'grid_items', 'mission_title', 'Mission'),
-- ('beliefs', 'grid_items', 'mission_description', 'We believe in sharing the Gospel locally and globally, serving our Poland community and beyond.'),
-- ('beliefs', 'scripture', 'scripture_title', 'Foundation Scripture'),
-- ('beliefs', 'scripture', 'scripture_quote', 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.'),
-- ('beliefs', 'scripture', 'scripture_reference', 'John 3:16'),
-- ('beliefs', 'ministry_connection', 'ministry_title', 'Living Our Beliefs'),
-- ('beliefs', 'ministry_connection', 'ministry_description', 'Our care for Ukrainian orphan children reflects our belief in God''s heart for the vulnerable and our call to love our neighbors.'),
-- ('beliefs', 'cta', 'cta_title', 'Want to Learn More?'),
-- ('beliefs', 'cta', 'cta_description', 'Join us for worship and discover how these beliefs come alive in our church community.'),

-- -- Prayer page content (새로 추가)
-- ('prayer', 'main', 'title', 'Prayer Requests'),
-- ('prayer', 'main', 'description', 'Share your prayer requests with our church family. We believe in the power of prayer and want to lift up your needs before God together.'),
-- ('prayer', 'categories', 'title', 'Prayer Categories'),
-- ('prayer', 'categories', 'ukraine_title', 'Ukraine'),
-- ('prayer', 'categories', 'ukraine_description', 'Prayers for Ukrainian families, children, and the ongoing crisis.'),
-- ('prayer', 'categories', 'church_title', 'Bozhiymir Church'),
-- ('prayer', 'categories', 'church_description', 'Prayers for our church, ministries, and leadership.'),
-- ('prayer', 'categories', 'members_title', 'Church Members'),
-- ('prayer', 'categories', 'members_description', 'Personal prayer requests from our church family.'),
-- ('prayer', 'categories', 'children_title', 'Children'),
-- ('prayer', 'categories', 'children_description', 'Special prayers for our young ones and their needs.'),
-- ('prayer', 'guidelines', 'title', 'Prayer Guidelines'),
-- ('prayer', 'guidelines', 'guideline1', 'Please be respectful and appropriate in your prayer requests'),
-- ('prayer', 'guidelines', 'guideline2', 'Avoid sharing personal details that should remain private'),
-- ('prayer', 'guidelines', 'guideline3', 'Our prayer team will pray for all requests regularly'),
-- ('prayer', 'guidelines', 'guideline4', 'Feel free to share updates or answered prayers'),
-- ('prayer', 'scripture', 'title', 'God Hears Our Prayers'),
-- ('prayer', 'scripture', 'quote', 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.'),
-- ('prayer', 'scripture', 'reference', 'Philippians 4:6'),
-- ('prayer', 'cta', 'title', 'Submit a Prayer Request'),
-- ('prayer', 'cta', 'description', 'Share your prayer needs with our loving church community.'),

-- -- Thanks page content (새로 추가)
-- ('thanks', 'main', 'title', 'Gratitude & Testimonies'),
-- ('thanks', 'main', 'description', 'Share your testimonies, gratitude, and praise reports with our church family. Let us celebrate God''s goodness together!'),
-- ('thanks', 'purpose', 'title', 'Why Share Gratitude?'),
-- ('thanks', 'purpose', 'description', 'Sharing our testimonies encourages others, builds faith, and gives glory to God for His faithfulness in our lives.'),
-- ('thanks', 'categories', 'title', 'What to Share'),
-- ('thanks', 'categories', 'category1', 'Answered prayers and God''s provision'),
-- ('thanks', 'categories', 'category2', 'Personal testimonies of God''s work in your life'),
-- ('thanks', 'categories', 'category3', 'Gratitude for church community and support'),
-- ('thanks', 'categories', 'category4', 'Praise for healing, breakthrough, or blessing'),
-- ('thanks', 'categories', 'category5', 'Thanksgiving for Ukrainian ministry impact'),
-- ('thanks', 'scripture', 'title', 'Give Thanks'),
-- ('thanks', 'scripture', 'quote', 'Give thanks to the Lord, for he is good; his love endures forever.'),
-- ('thanks', 'scripture', 'reference', 'Psalm 107:1'),
-- ('thanks', 'filters', 'title', 'Filter Posts'),
-- ('thanks', 'filters', 'all_posts', 'All Posts'),
-- ('thanks', 'filters', 'admin_posts', 'Leadership'),
-- ('thanks', 'filters', 'user_posts', 'Members'),
-- ('thanks', 'filters', 'child_posts', 'Children'),
-- ('thanks', 'cta', 'title', 'Share Your Testimony'),
-- ('thanks', 'cta', 'description', 'Tell us how God has been working in your life!'),

-- -- Word page content (새로 추가)
-- ('word', 'main', 'title', 'Daily Word'),
-- ('word', 'main', 'description', 'Discover God''s Word for today. Each day brings a new scripture, reflection, and opportunity to grow in faith.'),
-- ('word', 'purpose', 'title', 'Why Daily Scripture?'),
-- ('word', 'purpose', 'description', 'Regular time in God''s Word strengthens our faith, provides guidance, and helps us grow closer to Jesus each day.'),
-- ('word', 'navigation', 'title', 'Scripture Calendar'),
-- ('word', 'navigation', 'description', 'Browse through recent daily scriptures or catch up on what you might have missed.'),
-- ('word', 'features', 'title', 'Features'),
-- ('word', 'features', 'feature1', 'Daily scripture verses with reflection'),
-- ('word', 'features', 'feature2', 'Beautiful background images'),
-- ('word', 'features', 'feature3', 'Community reactions and comments'),
-- ('word', 'features', 'feature4', 'Easy sharing with friends and family'),
-- ('word', 'scripture', 'title', 'The Power of God''s Word'),
-- ('word', 'scripture', 'quote', 'All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness.'),
-- ('word', 'scripture', 'reference', '2 Timothy 3:16'),
-- ('word', 'cta', 'title', 'Start Your Day with God'),
-- ('word', 'cta', 'description', 'Make daily scripture reading a part of your spiritual journey.'),

-- -- Story page content (***수정되어 추가된 부분***)
-- ('story', 'main', 'title', 'Our Story'),
-- ('story', 'main', 'description', 'From humble beginnings to a thriving community church, discover how God has been faithful in building Bozhiymir Church into a beacon of hope in Poland.'),
-- ('story', 'mission', 'mission_title', 'Our Mission'),
-- ('story', 'mission', 'mission_quote', '"To be a loving church family that welcomes all people, shares the Gospel of Jesus Christ, and serves our community with special care for the vulnerable, including Ukrainian orphan children."'),
-- ('story', 'timeline', 'timeline_title', 'Our Journey'),
-- ('story', 'timeline', 'timeline_2010_title', 'Church Founded'),
-- ('story', 'timeline', 'timeline_2010_description', 'Bozhiymir Church was established in Poland with a vision to serve the diverse community.'),
-- ('story', 'timeline', 'timeline_2015_title', 'Community Growth'),
-- ('story', 'timeline', 'timeline_2015_description', 'Our congregation grew to over 100 members, representing 12 different countries.'),
-- ('story', 'timeline', 'timeline_2018_title', 'Youth Ministry Launch'),
-- ('story', 'timeline', 'timeline_2018_description', 'Started dedicated programs for children and teenagers in our community.'),
-- ('story', 'timeline', 'timeline_2022_title', 'Ukrainian Ministry Begins'),
-- ('story', 'timeline', 'timeline_2022_description', 'In response to the Ukrainian crisis, we began our ministry to support Ukrainian orphan children.'),
-- ('story', 'timeline', 'timeline_2024_title', 'Expanding Impact'),
-- ('story', 'timeline', 'timeline_2024_description', 'Now supporting 47 Ukrainian children and 25 host families in the Poland area.'),
-- ('story', 'values', 'values_title', 'Our Core Values'),
-- ('story', 'values', 'value1_title', 'Love'),
-- ('story', 'values', 'value1_description', 'Showing Christ''s love to all people, especially the vulnerable.'),
-- ('story', 'values', 'value2_title', 'Community'),
-- ('story', 'values', 'value2_description', 'Building authentic relationships and welcoming all backgrounds.'),
-- ('story', 'values', 'value3_title', 'Service'),
-- ('story', 'values', 'value3_description', 'Serving locally and globally with hands-on compassion.'),
-- ('story', 'values', 'value4_title', 'Hope'),
-- ('story', 'values', 'value4_description', 'Bringing hope through the Gospel and practical care.'),
-- ('story', 'ministry_highlight', 'highlight_title', 'A Special Calling'),
-- ('story', 'ministry_highlight', 'highlight_description', 'When the Ukrainian crisis began, God placed a special burden on our hearts for Ukrainian orphan children. Today, this ministry is central to who we are as Bozhiymir Church.'),
-- ('story', 'ministry_highlight', 'stat1_number', '47'),
-- ('story', 'ministry_highlight', 'stat1_label', 'Children Supported'),
-- ('story', 'ministry_highlight', 'stat2_number', '25'),
-- ('story', 'ministry_highlight', 'stat2_label', 'Host Families'),
-- ('story', 'ministry_highlight', 'highlight_quote', '"Religion that God our Father accepts as pure and faultless is this: to look after orphans and widows in their distress." - James 1:27'),
-- ('story', 'cta', 'cta_title', 'Want to Learn More?'),
-- ('story', 'cta', 'cta_description', 'Join us for worship and discover how these beliefs come alive in our church community.'),

-- -- Leadership page content
-- -- 기존 leaders 배열의 내용을 content 테이블에 삽입
-- ('leadership', 'hero', 'title_part1', 'Our'),
-- ('leadership', 'hero', 'title_part2', 'Leadership'),
-- ('leadership', 'hero', 'description', 'Meet the dedicated leaders who guide Bozhiymir Church with wisdom, compassion, and a heart for serving our community and Ukrainian children.'),

-- ('leadership', 'leader_michael', 'name', 'Pastor Michael Johnson'),
-- ('leadership', 'leader_michael', 'role', 'Senior Pastor'),
-- ('leadership', 'leader_michael', 'image', '/placeholder.svg?height=300&width=300'),
-- ('leadership', 'leader_michael', 'bio', 'Pastor Michael has been leading Bozhiymir Church for over 10 years. He has a heart for community outreach and has been instrumental in establishing our Ukrainian children ministry.'),
-- ('leadership', 'leader_michael', 'specialties', 'Biblical Teaching, Community Outreach, Ukrainian Ministry'),
-- ('leadership', 'leader_michael', 'email', 'pastor.michael@bozhiymirchurch.com'),
-- ('leadership', 'leader_michael', 'phone', '(503) 555-0123'),

-- ('leadership', 'leader_sarah', 'name', 'Pastor Sarah Williams'),
-- ('leadership', 'leader_sarah', 'role', 'Associate Pastor & Children''s Ministry'),
-- ('leadership', 'leader_sarah', 'image', '/placeholder.svg?height=300&width=300'),
-- ('leadership', 'leader_sarah', 'bio', 'Pastor Sarah oversees our children''s programs and has a special calling to work with Ukrainian refugee children. She speaks fluent Ukrainian and Russian.'),
-- ('leadership', 'leader_sarah', 'specialties', 'Children''s Ministry, Ukrainian Language, Family Counseling'),
-- ('leadership', 'leader_sarah', 'email', 'pastor.sarah@bozhiymirchurch.com'),
-- ('leadership', 'leader_sarah', 'phone', '(503) 555-0124'),

-- ('leadership', 'leader_james', 'name', 'Deacon James Thompson'),
-- ('leadership', 'leader_james', 'role', 'Board Chairman'),
-- ('leadership', 'leader_james', 'image', '/placeholder.svg?height=300&width=300'),
-- ('leadership', 'leader_james', 'bio', 'James leads our church board and coordinates our community outreach programs. He has been with Bozhiymir Church since its founding.'),
-- ('leadership', 'leader_james', 'specialties', 'Church Administration, Community Relations, Volunteer Coordination'),
-- ('leadership', 'leader_james', 'email', 'james.thompson@bozhiymirchurch.com'),
-- ('leadership', 'leader_james', 'phone', '(503) 555-0125'),

-- ('leadership', 'leader_maria', 'name', 'Maria Kovalenko'),
-- ('leadership', 'leader_maria', 'role', 'Ukrainian Ministry Coordinator'),
-- ('leadership', 'leader_maria', 'image', '/placeholder.svg?height=300&width=300'),
-- ('leadership', 'leader_maria', 'bio', 'Maria is originally from Ukraine and coordinates our Ukrainian children''s program. She helps with translation and cultural bridge-building.'),
-- ('leadership', 'leader_maria', 'specialties', 'Ukrainian Culture, Translation Services, Child Care'),
-- ('leadership', 'leader_maria', 'email', 'maria.kovalenko@bozhiymirchurch.com'),
-- ('leadership', 'leader_maria', 'phone', '(503) 555-0126'),

-- ('leadership', 'leadership_values', 'title', 'Our Leadership Values'),
-- ('leadership', 'leadership_values', 'value1_title', 'Compassionate Service'),
-- ('leadership', 'leadership_values', 'value1_description', 'Leading with love and putting others first, especially the vulnerable.'),
-- ('leadership', 'leadership_values', 'value2_title', 'Biblical Foundation'),
-- ('leadership', 'leadership_values', 'value2_description', 'Grounding all decisions and teachings in God''s Word.'),
-- ('leadership', 'leadership_values', 'value3_title', 'Global Vision'),
-- ('leadership', 'leadership_values', 'value3_description', 'Serving locally while thinking globally, especially for Ukrainian children.'),

-- ('leadership', 'contact_leadership', 'title', 'Connect with Our Leaders'),
-- ('leadership', 'contact_leadership', 'description', 'Our leadership team is here to serve you. Don''t hesitate to reach out with questions or prayer requests.'),
-- ('leadership', 'contact_leadership', 'button1_text', 'Visit Our Church'),
-- ('leadership', 'contact_leadership', 'button2_text', 'Back to Home'),

-- -- Ukrainian Ministry page content
-- ('ukrainian-ministry', 'main', 'title', 'Ukrainian Children Ministry'),
-- ('ukrainian-ministry', 'main', 'description', 'In response to the Ukrainian crisis, Bozhiymir Church has opened our hearts and doors to provide love, care, and hope to Ukrainian orphan children in Poland.'),
-- ('ukrainian-ministry', 'mission', 'title', 'Our Mission'),
-- ('ukrainian-ministry', 'mission', 'description', 'We are committed to providing support, love, and hope to Ukrainian children and families.'),
-- ('ukrainian-ministry', 'impact_stats', 'title', 'Our Impact'),
-- ('ukrainian-ministry', 'impact_stats', 'stat1_number', '47'),
-- ('ukrainian-ministry', 'impact_stats', 'stat1_label', 'Ukrainian Children'),
-- ('ukrainian-ministry', 'impact_stats', 'stat2_number', '25'),
-- ('ukrainian-ministry', 'impact_stats', 'stat2_label', 'Host Families'),
-- ('ukrainian-ministry', 'impact_stats', 'stat3_number', '8'),
-- ('ukrainian-ministry', 'impact_stats', 'stat3_label', 'Countries Represented'),
-- ('ukrainian-ministry', 'impact_stats', 'stat4_number', '100%'),
-- ('ukrainian-ministry', 'impact_stats', 'stat4_label', 'Children in School'),
-- ('ukrainian-ministry', 'programs', 'title', 'Our Programs'),
-- ('ukrainian-ministry', 'programs', 'program1_title', 'Host Family Program'),
-- ('ukrainian-ministry', 'programs', 'program1_description', 'Connecting Ukrainian children with loving Poland families who provide temporary homes and care.'),
-- ('ukrainian-ministry', 'programs', 'program1_stats', '25 Host Families'),
-- ('ukrainian-ministry', 'programs', 'program2_title', 'Education Support'),
-- ('ukrainian-ministry', 'programs', 'program2_description', 'Helping children enroll in local schools and providing tutoring in English and other subjects.'),
-- ('ukrainian-ministry', 'programs', 'program2_stats', '47 Children in School'),
-- ('ukrainian-ministry', 'programs', 'program3_title', 'Emotional Care'),
-- ('ukrainian-ministry', 'programs', 'program3_description', 'Providing counseling, trauma support, and creating safe spaces for healing and growth.'),
-- ('ukrainian-ministry', 'programs', 'program3_stats', 'Weekly Support Groups'),
-- ('ukrainian-ministry', 'programs', 'program4_title', 'Basic Needs'),
-- ('ukrainian-ministry', 'programs', 'program4_description', 'Ensuring children have food, clothing, medical care, and other essential necessities.'),
-- ('ukrainian-ministry', 'programs', 'program4_stats', '100% Needs Met'),
-- ('ukrainian-ministry', 'programs', 'program5_title', 'Cultural Connection'),
-- ('ukrainian-ministry', 'programs', 'program5_description', 'Helping children maintain their Ukrainian heritage while adapting to American culture.'),
-- ('ukrainian-ministry', 'programs', 'program5_stats', 'Monthly Cultural Events'),
-- ('ukrainian-ministry', 'programs', 'program6_title', 'Clothing & Supplies'),
-- ('ukrainian-ministry', 'programs', 'program6_description', 'Providing clothing, school supplies, and personal items for growing children.'),
-- ('ukrainian-ministry', 'programs', 'program6_stats', 'Ongoing Support'),
-- ('ukrainian-ministry', 'foundation', 'foundation_title', 'Our Biblical Foundation'),
-- ('ukrainian-ministry', 'foundation', 'scripture_quote', 'Religion that God our Father accepts as pure and faultless is this: to look after orphans and widows in their distress and to keep oneself from being polluted by the world.'),
-- ('ukrainian-ministry', 'foundation', 'scripture_reference', 'James 1:27'),
-- ('ukrainian-ministry', 'foundation', 'description', 'This verse guides our Ukrainian children ministry. We believe caring for orphans is not just good work—it''s pure religion that pleases God''s heart.'),
-- ('ukrainian-ministry', 'testimonials', 'title', 'Stories of Hope'),
-- ('ukrainian-ministry', 'testimonials', 'testi1_quote', 'Taking in Anya has blessed our family more than we ever imagined. She''s brought so much joy to our home.'),
-- ('ukrainian-ministry', 'testimonials', 'testi2_quote', 'I love my new school and friends. The church family makes me feel safe and loved.'),
-- ('ukrainian-ministry', 'testimonials', 'testi3_quote', 'Watching these children heal and thrive reminds us daily of God''s faithfulness and love.'),
-- ('ukrainian-ministry', 'how_to_help', 'title', 'How You Can Help'),
-- ('ukrainian-ministry', 'how_to_help', 'card1_title', 'Become a Host Family'),
-- ('ukrainian-ministry', 'how_to_help', 'card1_description', 'Open your home and heart to a Ukrainian child in need.'),
-- ('ukrainian-ministry', 'how_to_help', 'card2_title', 'Volunteer'),
-- ('ukrainian-ministry', 'how_to_help', 'card2_description', 'Help with tutoring, transportation, or special events.'),
-- ('ukrainian-ministry', 'how_to_help', 'card3_title', 'Donate'),
-- ('ukrainian-ministry', 'how_to_help', 'card3_description', 'Support with clothing, school supplies, or financial gifts.'),
-- ('ukrainian-ministry', 'contact', 'title', 'Learn More'),
-- ('ukrainian-ministry', 'contact', 'description', 'Interested in supporting our Ukrainian children ministry? We''d love to talk with you.'),

-- -- Community Board page content
-- ('communityboard', 'main', 'title', 'Our Community Board'),
-- ('communityboard', 'main', 'description', 'Share and discuss ministry stories, events, and community activities. Your thoughts and stories help our church family grow.'),

-- -- Events page content
-- ('events', 'main', 'title', 'Church Events'),
-- ('events', 'main', 'description', 'Join us for worship, fellowship, and community events. There''s always something happening at Bozhiymir Church for every age and interest.'),
-- ('events', 'special_ministry', 'title', 'Ukrainian Ministry Events'),
-- ('events', 'special_ministry', 'card1_title', 'Monthly Cultural Celebrations'),
-- ('events', 'special_ministry', 'card1_description', 'Join us for Ukrainian cultural events featuring traditional food, music, and activities.'),
-- ('events', 'special_ministry', 'card2_title', 'Host Family Gatherings'),
-- ('events', 'special_ministry', 'card2_description', 'Special events for host families and Ukrainian children to connect and share experiences.'),
-- ('events', 'guidelines', 'title', 'Event Information'),
-- ('events', 'guidelines', 'card1_title', 'All Welcome'),
-- ('events', 'guidelines', 'card1_description', 'All our events are open to everyone, regardless of background or church membership.'),
-- ('events', 'guidelines', 'card2_title', 'Family Friendly'),
-- ('events', 'guidelines', 'card2_description', 'Most events are designed for families and include activities for children of all ages.'),
-- ('events', 'guidelines', 'card3_title', 'Easy to Find'),
-- ('events', 'guidelines', 'card3_description', 'All events are held at our church campus with clear directions and parking available.'),
-- ('events', 'cta', 'title', 'Don''t Miss Out!'),
-- ('events', 'cta', 'description', 'Stay connected with all our events and activities. Join our church family today!'),

-- --join
-- ('join', 'main', 'title', 'Join Our Church Family'),
-- ('join', 'main', 'description', 'Discover how to connect with Bozhiymir Church, attend our services, and become part of our loving community.'),
-- ('join', 'services', 'services_title', 'Our Sunday Services'),
-- ('join', 'services', 'service_style_1', 'Traditional Service'),
-- ('join', 'services', 'service_description_1', 'A classic worship experience with hymns and choir.'),
-- ('join', 'services', 'service_style_2', 'Contemporary Service'),
-- ('join', 'services', 'service_description_2', 'Modern worship with a band and engaging teaching.'),
-- ('join', 'services', 'service_style_3', 'Family Service'),
-- ('join', 'services', 'service_description_3', 'A relaxed service designed for families with young children.'),
-- ('join', 'services', 'services_footer_text', 'No matter where you are on your spiritual journey, you are welcome here.'),
-- ('join', 'expect', 'expect_title', 'What to Expect on Your First Visit'),
-- ('join', 'expect', 'expect_title_1', 'Warm Welcome'),
-- ('join', 'expect', 'expect_description_1', 'Be greeted by friendly faces and helpful volunteers ready to assist you.'),
-- ('join', 'expect', 'expect_title_2', 'Uplifting Worship'),
-- ('join', 'expect', 'expect_description_2', 'Experience inspiring music and a relevant message.'),
-- ('join', 'expect', 'expect_title_3', 'Community & Fellowship'),
-- ('join', 'expect', 'expect_description_3', 'Opportunities to connect with others before and after service.'),
-- ('join', 'expect', 'expect_title_4', 'Kids Programs'),
-- ('join', 'expect', 'expect_description_4', 'Safe and engaging environments for children of all ages.'),
-- ('join', 'contact', 'visit_title', 'Plan Your Visit'),
-- ('join', 'contact', 'address', 'Poloneza 87, 02-826 Warszawa'),
-- ('join', 'contact', 'service_times', 'Sunday: 10:00 AM ~ 6:30 PM
-- Wednesday: 6:00 PM ~ 10:00PM'),
-- ('join', 'contact', 'phone', '(503) 555-0123'),
-- ('join', 'contact', 'email', 'info@bozhiymirchurch.com'),
-- ('join', 'ministry_highlight', 'highlight_title', 'Our Special Calling'),
-- ('join', 'ministry_highlight', 'highlight_subtitle', 'Ukrainian Children Ministry'),
-- ('join', 'ministry_highlight', 'highlight_description', 'Learn about our vital ministry supporting Ukrainian children and how you can get involved.'),
-- ('join', 'ministry_highlight', 'stat1_number', '47+'),
-- ('join', 'ministry_highlight', 'stat1_label', 'Children Supported'),
-- ('join', 'ministry_highlight', 'stat2_number', '25+'),
-- ('join', 'ministry_highlight', 'stat2_label', 'Host Families'),
-- ('join', 'ministry_highlight', 'stat3_number', '100%'),
-- ('join', 'ministry_highlight', 'stat3_label', 'Needs Met'),
-- ('join', 'cta', 'cta_title', 'Ready to Connect?'),
-- ('join', 'cta', 'cta_description', 'We are excited to welcome you to our church family!')

-- ON CONFLICT (page, section, key) DO UPDATE SET value = EXCLUDED.value;

-- -- ########## 6단계: 이벤트 시드 데이터 삽입 ##########
-- -- 슬러그는 트리거에 의해 자동으로 생성되므로 여기에 삽입하지 않습니다.
-- INSERT INTO public.events (title, description, event_date, start_time, end_time, location, category, image_url) VALUES
-- ('주일 예배', '매주 주일 드리는 온 가족 예배입니다. 찬양과 말씀으로 함께 은혜를 나눕니다.', '2025-07-13', '11:00', '12:30', '본당', '예배', 'https://placehold.co/600x400/FFDDC1/000000?text=Worship+Service'),
-- ('어린이 성경학교', '아이들이 즐겁게 성경을 배우고 신앙을 키울 수 있는 프로그램입니다.', '2025-07-20', '10:00', '12:00', '유아실', '어린이', 'https://placehold.co/600x400/D1E7FF/000000?text=Kids+Bible+School'),
-- ('청년부 모임', '젊은이들을 위한 교제와 신앙 성장을 위한 시간입니다.', '2025-07-15', '19:00', '21:00', '소그룹실', '청소년/청년', 'https://placehold.co/600x400/E6CCFF/000000?text=Youth+Group'),
-- ('수요 성경공부', '성경을 깊이 있게 공부하며 삶에 적용하는 시간입니다.', '2025-07-16', '20:00', '21:30', '온라인 (Zoom)', '성경공부', 'https://placehold.co/600x400/C1FFD1/000000?text=Bible+Study'),
-- ('새벽 기도회', '매일 새벽 하나님께 나아가 기도하는 시간입니다.', '2025-07-14', '06:00', '07:00', '본당', '예배', 'https://placehold.co/600x400/FFC1C1/000000?text=Morning+Prayer'),
-- ('여성 모임', '여성들을 위한 교제와 나눔의 시간입니다.', '2025-07-25', '14:00', '16:00', '친교실', '공동체', 'https://placehold.co/600x400/C1FFFF/000000?text=Women''s+Fellowship'),
-- ('남성 모임', '남성들을 위한 교제와 나눔의 시간입니다.', '2025-07-26', '14:00', '16:00', '친교실', '공동체', 'https://placehold.co/600x400/E0C1FF/000000?text=Men''s+Fellowship'),
-- ('새 신자 환영회', '교회에 새로 오신 분들을 환영하고 소개하는 자리입니다.', '2025-08-03', '13:00', '14:00', '카페테리아', '공동체', 'https://placehold.co/600x400/FFD700/000000?text=New+Comers');
