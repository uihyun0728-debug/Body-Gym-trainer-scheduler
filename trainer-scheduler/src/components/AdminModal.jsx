import { useState } from 'react'
import { useAdmin } from '../context/AdminContext.jsx'

export function AdminModal({ onClose }) {
  const { login } = useAdmin()
  const [pw, setPw]     = useState('')
  const [err, setErr]   = useState('')

  const handleLogin = () => {
    if (login(pw)) { onClose() }
    else { setErr('비밀번호가 올바르지 않습니다.'); setPw('') }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">관리자 로그인</h3>
        <div className="form-group">
          <input
            type="password"
            className="input"
            placeholder="비밀번호"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            autoFocus
          />
        </div>
        {err && <p className="form-error">{err}</p>}
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={handleLogin}>확인</button>
          <button className="btn btn-secondary" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  )
}
