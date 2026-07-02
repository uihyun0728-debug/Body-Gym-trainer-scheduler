import { useState, useEffect } from 'react'

const LESSON_TYPES = ['PT', 'OT', 'SPT', '기타']

const EMPTY = { member_name: '', lesson_type: 'PT', etc_label: '', spt2_count: 0, note: '' }

export function ScheduleModal({ schedule, trainerId, selectedDate, hour, onSave, onDelete, onClose }) {
  const isEdit = !!schedule
  const [form, setForm]       = useState(EMPTY)
  const [delConfirm, setDel]  = useState(false)
  const [err, setErr]         = useState('')
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    if (schedule) {
      setForm({
        member_name: schedule.member_name || '',
        lesson_type: schedule.lesson_type || 'PT',
        etc_label:   schedule.etc_label   || '',
        spt2_count:  schedule.spt2_count  ?? 0,
        note:        schedule.note        || '',
      })
    } else { setForm(EMPTY) }
  }, [schedule])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    if (!form.member_name.trim()) return '회원명을 입력하세요.'
    if (!form.lesson_type)        return '수업 종류를 선택하세요.'
    const cnt = Number(form.spt2_count)
    if (form.spt2_count !== '' && (isNaN(cnt) || cnt < 0)) return 'SPT2 횟수는 0 이상의 숫자를 입력하세요.'
    if (form.note.length > 500)   return '특이사항은 500자 이내로 입력하세요.'
    return null
  }

  const handleSave = async () => {
    const e = validate(); if (e) { setErr(e); return }
    setSaving(true)
    try {
      const payload = {
        trainer_id:    trainerId,
        schedule_date: selectedDate,
        hour,
        member_name:   form.member_name.trim(),
        lesson_type:   form.lesson_type,
        etc_label:     form.lesson_type === '기타' ? (form.etc_label.trim() || null) : null,
        spt2_count:    Number(form.spt2_count) || 0,
        note:          form.note.trim() || null,
      }
      if (isEdit) payload.id = schedule.id
      await onSave(payload)
      onClose()
    } catch (e) { setErr(e.message); setSaving(false) }
  }

  const handleDel = async () => {
    try { await onDelete(schedule.id); onClose() }
    catch (e) { setErr(e.message) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-wide" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">
          {isEdit ? '일정 수정' : '일정 입력'} — {hour}시
        </h3>

        {/* 회원명 */}
        <div className="form-group">
          <label>회원명 <span className="required">*</span></label>
          <input
            type="text" className="input"
            placeholder="회원명 입력"
            value={form.member_name}
            onChange={e => set('member_name', e.target.value)}
            autoFocus
          />
        </div>

        {/* 수업 종류 */}
        <div className="form-group">
          <label>수업 종류 <span className="required">*</span></label>
          <div className="lesson-btns">
            {LESSON_TYPES.map(t => (
              <button
                key={t}
                type="button"
                className={`btn-lesson btn-lesson-${t === form.lesson_type ? 'active' : 'inactive'} lesson-${t}`}
                onClick={() => set('lesson_type', t)}
              >{t}</button>
            ))}
          </div>
        </div>

        {/* 기타 전용 필드 - 특이사항과 완전 별개 */}
        {form.lesson_type === '기타' && (
          <div className="form-group">
            <label>
              기타 내용
              <span className="label-hint"> — 셀에 표시될 내용 (특이사항과 별개)</span>
            </label>
            <input
              type="text" className="input"
              placeholder="셀에 표시할 내용 (비우면 '기타'로 표시됨)"
              value={form.etc_label}
              onChange={e => set('etc_label', e.target.value)}
            />
          </div>
        )}

        {/* SPT2 횟수 - 수업 종류와 무관 */}
        <div className="form-group">
          <label>
            SPT2 횟수
            <span className="label-hint"> — 월 누적 집계용 (미입력 시 0, 수업 종류와 무관)</span>
          </label>
          <input
            type="number" className="input input-narrow"
            min="0" placeholder="0"
            value={form.spt2_count}
            onChange={e => set('spt2_count', e.target.value)}
          />
        </div>

        {/* 특이사항 - 기타 전용 필드와 완전 별개 */}
        <div className="form-group">
          <label>
            특이사항
            <span className="label-hint"> — 최대 500자, 수업 종류와 무관한 별도 항목</span>
          </label>
          <textarea
            className="input textarea"
            placeholder="특이사항 입력 (선택 사항)"
            maxLength={500}
            value={form.note}
            onChange={e => set('note', e.target.value)}
          />
          <p className="char-count">{form.note.length} / 500</p>
        </div>

        {err && <p className="form-error">{err}</p>}

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? '저장 중...' : '저장'}
          </button>
          {isEdit && !delConfirm && (
            <button className="btn btn-danger" onClick={() => setDel(true)}>삭제</button>
          )}
          {delConfirm && (
            <>
              <span className="del-confirm-text">정말 삭제하시겠습니까?</span>
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
