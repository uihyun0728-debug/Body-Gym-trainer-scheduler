import { useState, memo, useCallback } from 'react'
import { HOURS } from '../utils/dateUtils.js'
import { ScheduleModal } from './ScheduleModal.jsx'
import { TrainerModal } from './TrainerModal.jsx'
import { useAdmin } from '../context/AdminContext.jsx'

// 셀 배경색
const CELL_BG = { PT: '#FFFFFF', OT: '#FFF9C4', SPT: '#C8F7C5', 기타: '#E0E0E0' }

// 셀 표시 레이블
function cellLabel(s) {
  if (!s) return null
  if (s.lesson_type === '기타') return s.etc_label?.trim() || '기타'
  return s.lesson_type
}

// 툴팁 텍스트
function tooltipText(s) {
  if (!s) return ''
  const lines = [
    `회원명: ${s.member_name}`,
    `수업: ${s.lesson_type}${s.lesson_type === '기타' && s.etc_label ? ' (' + s.etc_label + ')' : ''}`,
    s.note ? `특이사항: ${s.note}` : null,
  ]
  return lines.filter(Boolean).join('\n')
}

// 개별 셀 - memo로 불필요한 렌더링 최소화
const Cell = memo(function Cell({ schedule, onClick }) {
  const bg = schedule ? (CELL_BG[schedule.lesson_type] || '#E0E0E0') : '#FAFAFA'
  return (
    <td
      className="sch-cell"
      style={{ backgroundColor: bg }}
      onClick={onClick}
      title={tooltipText(schedule)}
    >
      {schedule && (
        <div className="cell-inner">
          <span className="cell-member">{schedule.member_name}</span>
          <span className="cell-type">{cellLabel(schedule)}</span>
        </div>
      )}
    </td>
  )
})

export function ScheduleTable({
  trainers, selectedDate,
  getCellSchedule, getDayCount, getMonthCount, getMonthSpt2,
  saveSchedule, deleteSchedule,
  addTrainer, updateTrainer, deleteTrainer,
}) {
  const { isAdmin } = useAdmin()
  const [modal, setModal] = useState(null)

  const openCell = useCallback((trainerId, hour) => {
    const existing = getCellSchedule(trainerId, hour)
    setModal({ type: 'schedule', trainerId, hour, schedule: existing || null })
  }, [getCellSchedule])

  const openTrainer = useCallback((trainer = null) => {
    setModal({ type: 'trainer', trainer })
  }, [])

  const close = useCallback(() => setModal(null), [])

  return (
    <div className="table-outer">
      <div className="table-scroll">
        <table className="sch-table">
          <thead>
            <tr>
              <th className="th-name">트레이너</th>
              {HOURS.map(h => <th key={h} className="th-hour">{h}시</th>)}
              <th className="th-stat">PT</th>
              <th className="th-stat">OT</th>
              <th className="th-stat">SPT</th>
              <th className="th-stat th-accum">누적PT</th>
              <th className="th-stat th-accum">누적OT</th>
              <th className="th-stat th-accum">누적SPT</th>
              <th className="th-stat th-spt2">SPT2</th>
            </tr>
          </thead>
          <tbody>
            {trainers.map(tr => (
              <tr key={tr.id}>
                <td className="td-name">
                  <span className="trainer-name-text">{tr.name}</span>
                  {isAdmin && (
                    <button
                      className="btn-edit-tr"
                      title="수정/삭제"
                      onClick={() => openTrainer(tr)}
                    >✏️</button>
                  )}
                </td>
                {HOURS.map(h => (
                  <Cell
                    key={h}
                    schedule={getCellSchedule(tr.id, h)}
                    onClick={() => openCell(tr.id, h)}
                  />
                ))}
                <td className="td-stat">{getDayCount(tr.id, 'PT')}</td>
                <td className="td-stat">{getDayCount(tr.id, 'OT')}</td>
                <td className="td-stat">{getDayCount(tr.id, 'SPT')}</td>
                <td className="td-stat td-accum">{getMonthCount(tr.id, 'PT')}</td>
                <td className="td-stat td-accum">{getMonthCount(tr.id, 'OT')}</td>
                <td className="td-stat td-accum">{getMonthCount(tr.id, 'SPT')}</td>
                <td className="td-stat td-spt2">{getMonthSpt2(tr.id)}</td>
              </tr>
            ))}

            {/* 트레이너 추가 행 */}
            {isAdmin && (
              <tr>
                <td colSpan={HOURS.length + 8} className="td-add-row">
                  <button
                    className="btn btn-add-trainer"
                    disabled={trainers.length >= 8}
                    onClick={() => openTrainer(null)}
                  >
                    {trainers.length >= 8
                      ? `트레이너 최대 8명 달성 (추가 불가)`
                      : `+ 트레이너 추가 (${trainers.length}/8)`}
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal?.type === 'schedule' && (
        <ScheduleModal
          schedule={modal.schedule}
          trainerId={modal.trainerId}
          selectedDate={selectedDate}
          hour={modal.hour}
          onSave={saveSchedule}
          onDelete={deleteSchedule}
          onClose={close}
        />
      )}
      {modal?.type === 'trainer' && (
        <TrainerModal
          trainer={modal.trainer}
          onSave={modal.trainer
            ? (name) => updateTrainer(modal.trainer.id, name)
            : addTrainer}
          onDelete={deleteTrainer}
          onClose={close}
        />
      )}
    </div>
  )
}
