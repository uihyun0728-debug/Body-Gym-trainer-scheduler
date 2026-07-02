-- ================================================
-- 트레이너 스케줄표 Migration SQL v1
-- Supabase > SQL Editor > New query > 전체 붙여넣기 > Run
-- ================================================

-- 트레이너 목록
CREATE TABLE IF NOT EXISTS trainer_list (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 트레이너 스케줄
CREATE TABLE IF NOT EXISTS trainer_schedule (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id    UUID NOT NULL REFERENCES trainer_list(id) ON DELETE CASCADE,
  schedule_date DATE NOT NULL,
  hour          INTEGER NOT NULL CHECK (hour >= 6 AND hour <= 23),
  member_name   TEXT NOT NULL,
  lesson_type   TEXT NOT NULL CHECK (lesson_type IN ('PT','OT','SPT','기타')),
  etc_label     TEXT DEFAULT NULL,
  spt2_count    INTEGER NOT NULL DEFAULT 0,
  note          TEXT DEFAULT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (trainer_id, schedule_date, hour)
);

-- 고정 메모 (단일 행)
CREATE TABLE IF NOT EXISTS fixed_memo (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content    TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 날짜별 메모
CREATE TABLE IF NOT EXISTS daily_memo (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memo_date  DATE NOT NULL UNIQUE,
  content    TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 앱 설정 (소제목 등 key/value)
CREATE TABLE IF NOT EXISTS app_settings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key        TEXT NOT NULL UNIQUE,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거
DROP TRIGGER IF EXISTS trg_schedule_updated_at  ON trainer_schedule;
DROP TRIGGER IF EXISTS trg_fixed_memo_updated_at ON fixed_memo;
DROP TRIGGER IF EXISTS trg_daily_memo_updated_at ON daily_memo;
DROP TRIGGER IF EXISTS trg_app_settings_updated_at ON app_settings;

CREATE TRIGGER trg_schedule_updated_at
  BEFORE UPDATE ON trainer_schedule
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_fixed_memo_updated_at
  BEFORE UPDATE ON fixed_memo
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_daily_memo_updated_at
  BEFORE UPDATE ON daily_memo
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_schedule_trainer_date
  ON trainer_schedule(trainer_id, schedule_date);
CREATE INDEX IF NOT EXISTS idx_schedule_date
  ON trainer_schedule(schedule_date);
CREATE INDEX IF NOT EXISTS idx_daily_memo_date
  ON daily_memo(memo_date);

-- RLS 활성화
ALTER TABLE trainer_list     ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixed_memo       ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_memo       ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings     ENABLE ROW LEVEL SECURITY;

-- 정책 (anon 포함 전체 허용 - 관리자 인증은 프론트엔드에서 처리)
DROP POLICY IF EXISTS "allow_all" ON trainer_list;
DROP POLICY IF EXISTS "allow_all" ON trainer_schedule;
DROP POLICY IF EXISTS "allow_all" ON fixed_memo;
DROP POLICY IF EXISTS "allow_all" ON daily_memo;
DROP POLICY IF EXISTS "allow_all" ON app_settings;

CREATE POLICY "allow_all" ON trainer_list     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON trainer_schedule FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON fixed_memo       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON daily_memo       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON app_settings     FOR ALL USING (true) WITH CHECK (true);

-- 초기 데이터
INSERT INTO fixed_memo (content)
  VALUES ('') ON CONFLICT DO NOTHING;

INSERT INTO app_settings (key, value)
  VALUES ('subtitle', '') ON CONFLICT (key) DO NOTHING;
