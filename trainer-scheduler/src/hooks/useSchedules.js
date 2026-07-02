import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase.js'
import { getYearMonth } from '../utils/dateUtils.js'

export function useSchedules(selectedDate) {
  const [daySchedules, setDaySchedules]     = useState([])
  const [monthSchedules, setMonthSchedules] = useState([])
  const [loading, setLoading]               = useState(true)

  const yearMonth = getYearMonth(selectedDate)

  const fetchDay = useCallback(async () => {
    if (!selectedDate) return
    const { data } = await supabase
      .from('trainer_schedule')
      .select('*')
      .eq('schedule_date', selectedDate)
    setDaySchedules(data || [])
  }, [selectedDate])

  const fetchMonth = useCallback(async () => {
    if (!yearMonth) return
    const [y, m] = yearMonth.split('-').map(Number)
    const lastDay = new Date(y, m, 0).getDate()
    const start = `${yearMonth}-01`
    const end   = `${yearMonth}-${String(lastDay).padStart(2,'0')}`
    const { data } = await supabase
      .from('trainer_schedule')
      .select('*')
      .gte('schedule_date', start)
      .lte('schedule_date', end)
    setMonthSchedules(data || [])
  }, [yearMonth])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    await Promise.all([fetchDay(), fetchMonth()])
    setLoading(false)
  }, [fetchDay, fetchMonth])

  useEffect(() => { fetchAll() }, [fetchAll])

  // 셀 조회
  const getCellSchedule = useCallback((trainerId, hour) =>
    daySchedules.find(s => s.trainer_id === trainerId && s.hour === hour) || null,
  [daySchedules])

  // 당일 집계
  const getDayCount = useCallback((trainerId, type) =>
    daySchedules.filter(s => s.trainer_id === trainerId && s.lesson_type === type).length,
  [daySchedules])

  // 월 누적
  const getMonthCount = useCallback((trainerId, type) =>
    monthSchedules.filter(s => s.trainer_id === trainerId && s.lesson_type === type).length,
  [monthSchedules])

  // 월 SPT2 합계
  const getMonthSpt2 = useCallback((trainerId) =>
    monthSchedules
      .filter(s => s.trainer_id === trainerId)
      .reduce((sum, s) => sum + (Number(s.spt2_count) || 0), 0),
  [monthSchedules])

  // 저장 (upsert)
  const saveSchedule = async (payload) => {
    const { error } = await supabase
      .from('trainer_schedule')
      .upsert([payload], { onConflict: 'trainer_id,schedule_date,hour' })
    if (error) throw error
    await fetchAll()
  }

  // 삭제
  const deleteSchedule = async (id) => {
    const { error } = await supabase
      .from('trainer_schedule')
      .delete()
      .eq('id', id)
    if (error) throw error
    await fetchAll()
  }

  return {
    loading,
    getCellSchedule, getDayCount, getMonthCount, getMonthSpt2,
    saveSchedule, deleteSchedule,
  }
}
