const KST = 'Asia/Seoul'

// 오늘 날짜 YYYY-MM-DD (KST)
export function getTodayKST() {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: KST }).format(new Date())
}

// YYYY-MM-DD → "YYYY년 MM월 DD일 (요일)"
export function formatDateKorean(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  const days = ['일','월','화','수','목','금','토']
  return `${y}년 ${m}월 ${d}일 (${days[dt.getUTCDay()]})`
}

// YYYY-MM-DD ± N일 (KST 정오 기준으로 DST 오차 제거)
export function addDaysKST(dateStr, delta) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(
    `${String(y).padStart(4,'0')}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}T12:00:00+09:00`
  )
  dt.setDate(dt.getDate() + delta)
  return new Intl.DateTimeFormat('sv-SE', { timeZone: KST }).format(dt)
}

// YYYY-MM-DD → YYYY-MM
export function getYearMonth(dateStr) {
  return dateStr ? dateStr.slice(0, 7) : ''
}

// 06~23 시간 배열
export const HOURS = Array.from({ length: 18 }, (_, i) => i + 6)
