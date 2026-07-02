import { useState } from 'react'

export function TrainerModal({ trainer, onSave, onDelete, onClose }) {
  const isEdit = !!trainer
  const [name, setName]         = useState(trainer?.name || '')
  const [err, setErr]           = useState('')
  const [delConfirm, setDel]    = useState(false)

  const handleSave = async () => {
    if (!name.trim()) { setErr('이름을 입력하세요.'); return }
    try { await onSave(name); onClose() }
    catch (e) { setErr(e.message) }
  }

  const handleDel = async () => {
    try { await onDelete(trainer.id); onClose() }
    catch (e) { setErr(e.message) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">{isEdit ? '트레이너 수정' : '트레이너 추가'}</h3>
        <div className="form-group">
          <label>이름</label>
          <input
            type="text"
            className="input"
            placeholder="트레이너 이름"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            autoFocus
          />
        </div>
        {err && <p className="form-error">{err}</p>}
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={handleSave}>저장</button>
          {isEdit && !delConfirm && (
            <button className="btn btn-danger" onClick={() => setDel(true)}>삭제</button>
          )}
          {delConfirm && (
            <>
              <span className="del-confirm-text">정말 삭제?</span>
              <button className="btn btn-danger" onClick={handleDel}>확인</button>
              <button className="btn btn-secondary" onClick={() => setDel(false)}>취소</button>
            </>
          )}
          <button className="btn btn-secondary" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  )
}
