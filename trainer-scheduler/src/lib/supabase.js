import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('❌ Supabase 환경변수 누락. .env 파일을 확인하세요.')
}

export const supabase = createClient(url, key)
