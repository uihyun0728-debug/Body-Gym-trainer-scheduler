import { useState } from 'react'
import { useAdmin } from '../context/AdminContext.jsx'
import { AdminModal } from './AdminModal.jsx'
import { getTodayKST, addDaysKST, formatDateKorean } from '../utils/dateUtils.js'

export function Header({ selectedDate, onDateChange, subtitle, onSubtitleSave }) {
  const { isAdmin, logout } = useAdmin()
  const [showAdmin, setShowAdmin]   = useState(false)
  const [editSub, setEditSub]       = useState(false)
  const [subInput, setSubInput]     = useState(subtitle)

  const commitSubtitle = async () => {
    await onSubtitleSave(subInput)
    setEditSub(false)
  }

  return (
    <header className="app-header">
      {/* 좌측: 제목 영역 */}
      <div className="header-left">
        <h1 className="app-title">트레이너 스케줄표</h1>

        {isAdmin && editSub ? (
          <div className="subtitle-edit">
            <input
              className="input subtitle-input"
              value={subInput}
              onChange={e => setSubInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && commitSubtitle()}
              placeholder="소제목 입력"
              autoFocus
            />
            <button className="btn btn-sm btn-primary" onClick={commitSubtitle}>저장</button>
            <button className="btn btn-sm btn-secondary" onClick={() => { setSubInput(subtitle); setEditSub(false) }}>취소</button>
          </div>
        ) : (
          <div className="subtitle-row">
            <p className="app-subtitle">
              {subtitle || <span className="subtitle-empty">(소제목 없음)</span>}
            </p>
            {isAdmin && (
              <button className="btn-icon-tiny" title="소제목 수정" onClick={() => { setSubInput(subtitle); setEditSub(true) }}>✏️</button>
            )}
          </div>
        )}
      </div>

      {/* 우측: 날짜 + 관리자 */}
      <div className="header-right">
        <div className="date-nav">
          <button className="btn btn-nav" onClick={() => onDateChange(addDaysKST(selectedDate, -1))}>◀ 이전날</button>
          <div className="date-center">
            <input
              type="date"
              className="input date-pick"
              value={selectedDate}
              onChange={e => e.target.value && onDateChange(e.target.value)}
            />
            <span className="date-label">{formatDateKorean(selectedDate)}</span>
          </div>
          <button className="btn btn-nav" onClick={() => onDateChange(getTodayKST())}>오늘</button>
          <button className="btn btn-nav" onClick={() => onDateChange(addDaysKST(selectedDate, 1))}>다음날 ▶</button>
        </div>

        <div className="admin-wrap">
          {isAdmin ? (
            <button className="btn btn-admin-on" onClick={logout}>🔓 관리자 ON — 로그아웃</button>
          ) : (
            <button className="btn btn-admin-off" onClick={() => setShowAdmin(true)}>🔐 관리자 모드</button>
          )}
        </div>
      </div>

      {showAdmin && <AdminModal onClose={() => setShowAdmin(false)} />}
    </header>
  )
}
