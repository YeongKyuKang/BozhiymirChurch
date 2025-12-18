-- ########## 1. 초기화 (CASCADE로 관계성까지 삭제) ##########
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS tr_activate_user ON public.registration_codes;
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_thanks_updated_at ON public.thanks_posts;
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
DROP TRIGGER IF EXISTS update_word_updated_at ON public.word_posts;

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.activate_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

DROP TABLE IF EXISTS public.thanks_reactions CASCADE;
DROP TABLE IF EXISTS public.thanks_comments CASCADE;
DROP TABLE IF EXISTS public.thanks_posts CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.word_posts CASCADE;
DROP TABLE IF EXISTS public.registration_codes CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ########## 2. 테이블 구축 ##########

-- [1] 유저 테이블 (작성 제한 기능 컬럼 포함)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  nickname TEXT,
  role TEXT DEFAULT 'guest' CHECK (role IN ('guest', 'user', 'admin', 'child')),
  can_comment BOOLEAN DEFAULT FALSE,
  profile_picture_url TEXT,
  gender TEXT CHECK (gender IN ('male', 'female')),
  
  -- ★ 하루 작성 제한을 위한 필수 컬럼
  thanks_posts_today INT DEFAULT 0,
  last_post_date DATE,
  
  -- 기능 구현용 추가 컬럼
  last_name_change TIMESTAMP WITH TIME ZONE,
  last_pw_change TIMESTAMP WITH TIME ZONE,
  last_pic_change TIMESTAMP WITH TIME ZONE,
  code_attempts_today INT DEFAULT 0,
  last_code_attempt_date DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- [2] 등록 코드 테이블
CREATE TABLE public.registration_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  is_used BOOLEAN DEFAULT FALSE,
  used_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- [3] 감사 게시판 (Thanks) - author_id 사용
CREATE TABLE public.thanks_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL, -- 제목 (최대 20자 제한은 앱 코드에서 처리)
  content TEXT NOT NULL, -- 내용 (최대 300자 제한은 앱 코드에서 처리)
  category TEXT NOT NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  author_nickname TEXT NOT NULL,
  author_role TEXT,
  author_profile_picture_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- [3-1] 감사 댓글
CREATE TABLE public.thanks_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.thanks_posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  author_nickname TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- [3-2] 감사 반응 - user_id 컬럼명 사용
CREATE TABLE public.thanks_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.thanks_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, post_id, reaction_type)
);

-- [4] 교회 행사 (Events)
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  event_date TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  location TEXT,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- [5] 오늘의 말씀 (Word)
CREATE TABLE public.word_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  word_date DATE UNIQUE NOT NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  author_nickname TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ########## 3. 함수 및 트리거 설정 ##########

-- 새 유저 자동 생성 트리거 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, nickname, role, can_comment)
  VALUES (NEW.id, NEW.email, split_part(NEW.email, '@', 1), 'guest', FALSE)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 코드 입력 시 권한 승격 트리거 함수
CREATE OR REPLACE FUNCTION public.activate_user_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_used = TRUE AND OLD.is_used = FALSE AND NEW.used_by_user_id IS NOT NULL THEN
    UPDATE public.users
    SET role = NEW.role, can_comment = TRUE, updated_at = NOW()
    WHERE id = NEW.used_by_user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 수정 시간 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 연결
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
CREATE TRIGGER tr_activate_user AFTER UPDATE ON public.registration_codes FOR EACH ROW EXECUTE FUNCTION public.activate_user_role();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_thanks_updated_at BEFORE UPDATE ON public.thanks_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_word_updated_at BEFORE UPDATE ON public.word_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ########## 4. 보안 정책 (RLS) ##########

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thanks_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thanks_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thanks_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.word_posts ENABLE ROW LEVEL SECURITY;

-- [Users]
CREATE POLICY "Public Read Access Users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users Update Own" ON public.users FOR UPDATE USING (auth.uid() = id);

-- [Thanks Posts] (작성 제한은 앱 로직에서 처리하므로 RLS는 기본 인증 확인)
CREATE POLICY "Public Read Access Thanks" ON public.thanks_posts FOR SELECT USING (true);
CREATE POLICY "Allow insert for all authenticated users" ON public.thanks_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors Update Thanks" ON public.thanks_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors Delete Thanks" ON public.thanks_posts FOR DELETE USING (auth.uid() = author_id);

-- [Thanks Comments]
CREATE POLICY "Public Read Access Comments" ON public.thanks_comments FOR SELECT USING (true);
CREATE POLICY "Auth Insert Comments" ON public.thanks_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

-- [Thanks Reactions]
CREATE POLICY "Public Read Access Reactions" ON public.thanks_reactions FOR SELECT USING (true);
CREATE POLICY "Auth Insert Reactions" ON public.thanks_reactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth Delete Reactions" ON public.thanks_reactions FOR DELETE USING (auth.uid() = user_id);

-- [Events]
CREATE POLICY "Public Read Access Events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admin All Events" ON public.events FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- [Word Posts]
CREATE POLICY "Public Read Access Word" ON public.word_posts FOR SELECT USING (true);
CREATE POLICY "Admin All Word" ON public.word_posts FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- ########## 5. 인덱스 및 시드 데이터 ##########

CREATE INDEX idx_thanks_created ON public.thanks_posts (created_at DESC);
CREATE INDEX idx_events_date ON public.events (event_date ASC);

INSERT INTO public.registration_codes (code, role) VALUES 
('CH-2025-ABCD', 'user'), ('ADMIN-2025-SECRET', 'admin')
ON CONFLICT (code) DO NOTHING;

-- API 서버 캐시 갱신
NOTIFY pgrst, 'reload schema';
