# 트레이너 스케줄표

React + Vite + Supabase + Vercel 기반 관리자용 트레이너 스케줄 관리 웹앱

## 기능
- 트레이너별 06~23시 시간대 스케줄 관리
- 수업 종류: PT / OT / SPT / 기타
- 당일 PT·OT·SPT 집계 / 월 누적 PT·OT·SPT·SPT2 집계
- 관리자 비밀번호 인증 (환경변수 관리)
- 고정 메모 + 날짜별 메모
- KST 기준 날짜 이동

## 시작하기

```bash
git clone https://github.com/your-username/trainer-scheduler.git
cd trainer-scheduler
npm install
cp .env.example .env
# .env에 Supabase 정보 입력
npm run dev
```

## 환경변수

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_PASSWORD=1124
```
