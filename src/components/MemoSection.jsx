import { useState, useEffect } from 'react'
import { useAdmin } from '../context/AdminContext.jsx'

export function MemoSection({ fixedContent, onFixedSave, dailyContent, onDailySave, selectedDate }) {
  const { isAdmin } = useAdmin()
  const [fixedText, setFixedText]   = useState(fixedContent)
  const [dailyText, setDailyText]   = useState(dailyContent)
  const [fixedOk, setFixedOk]       = useState(false)
  const [dailyOk, setDailyOk]       = useState(false)

  useEffect(() => { setFixedText(fixedContent) }, [fixedContent])
  useEffect(() => { setDailyText(dailyContent) }, [dailyContent, selectedDate])

  const saveFixed = async () => {
    await onFixedSave(fixedText)
    setFixedOk(true); setTimeout(() => setFixedOk(false), 1500)
  }

  const saveDaily = async () => {
    await onDailySave(dailyText)
    setDailyOk(true); setTimeout(() => setDailyOk(false), 1500)
  }

  return (
    <div className="memo-wrap">
      {/* 고정 메모 */}
      <div className="memo-box">
        <div className="memo-hd">
          <span className="memo-title">📌 고정 메모 <span className="memo-sub">(모든 날짜 공통)</span></span>
          {isAdmin && (
            <button className="btn btn-sm btn-primary" onClick={saveFixed}>
              {fixedOk ? '저장됨 ✓' : '저장'}
            </button>
          )}
        </div>
        <textarea
          className="memo-ta"
          maxLength={10000}
          value={fixedText}
          onChange={e => setFixedText(e.target.value)}
          disabled={!isAdmin}
          placeholder={isAdmin ? '고정 메모를 입력하세요.' : '관리자만 수정할 수 있습니다.'}
        />
        <p className="char-count">{fixedText.length} / 10000</p>
      </div>

      {/* 날짜별 메모 */}
      <div className="memo-box">
        <div className="memo-hd">
          <span className="memo-title">📅 날짜별 메모 <span className="memo-sub">(선택 날짜 전용)</span></span>
          <button className="btn btn-sm btn-primary" onClick={saveDaily}>
            {dailyOk ? '저장됨 ✓' : '저장'}
          </button>
        </div>
        <textarea
          className="memo-ta"
          maxLength={10000}
          value={dailyText}
          onChange={e => setDailyText(e.target.value)}
          placeholder="날짜별 메모를 입력하세요."
        />
        <p className="char-count">{dailyText.length} / 10000</p>
      </div>
    </div>
  )
}
