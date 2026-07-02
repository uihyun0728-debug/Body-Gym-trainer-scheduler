import { useState } from 'react'
import { AdminProvider } from './context/AdminContext.jsx'
import { Header } from './components/Header.jsx'
import { ScheduleTable } from './components/ScheduleTable.jsx'
import { MemoSection } from './components/MemoSection.jsx'
import { useTrainers } from './hooks/useTrainers.js'
import { useSchedules } from './hooks/useSchedules.js'
import { useFixedMemo, useDailyMemo, useAppSettings } from './hooks/useMemos.js'
import { getTodayKST } from './utils/dateUtils.js'

function AppInner() {
  const [selectedDate, setSelectedDate] = useState(() => getTodayKST())

  const { trainers, addTrainer, updateTrainer, deleteTrainer } = useTrainers()
  const {
    loading,
    getCellSchedule, getDayCount, getMonthCount, getMonthSpt2,
    saveSchedule, deleteSchedule,
  } = useSchedules(selectedDate)

  const { content: fixedContent, save: saveFixed } = useFixedMemo()
  const { content: dailyContent, save: saveDaily } = useDailyMemo(selectedDate)
  const { subtitle, saveSubtitle } = useAppSettings()

  return (
    <div className="app">
      <Header
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        subtitle={subtitle}
        onSubtitleSave={saveSubtitle}
      />

      {/* 모바일 안내 */}
      <div className="mobile-notice">
        📱 상세 정보는 PC에서 확인해 주세요.
      </div>

      <main className="main-content">
        {loading ? (
          <div className="loading-wrap">
            <div className="spinner" />
            <p>불러오는 중...</p>
          </div>
        ) : (
          <ScheduleTable
            trainers={trainers}
            selectedDate={selectedDate}
            getCellSchedule={getCellSchedule}
            getDayCount={getDayCount}
            getMonthCount={getMonthCount}
            getMonthSpt2={getMonthSpt2}
            saveSchedule={saveSchedule}
            deleteSchedule={deleteSchedule}
            addTrainer={addTrainer}
            updateTrainer={updateTrainer}
            deleteTrainer={deleteTrainer}
          />
        )}

        <MemoSection
          fixedContent={fixedContent}
          onFixedSave={saveFixed}
          dailyContent={dailyContent}
          onDailySave={saveDaily}
          selectedDate={selectedDate}
        />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AdminProvider>
      <AppInner />
    </AdminProvider>
  )
}
