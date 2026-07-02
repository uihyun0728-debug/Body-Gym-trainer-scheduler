import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

export function useFixedMemo() {
  const [content, setContent] = useState('')
  const [rowId, setRowId]     = useState(null)

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('fixed_memo').select('*').limit(1)
    if (data && data.length > 0) { setContent(data[0].content || ''); setRowId(data[0].id) }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const save = async (text) => {
    if (rowId) {
      await supabase.from('fixed_memo').update({ content: text }).eq('id', rowId)
    } else {
      const { data } = await supabase.from('fixed_memo').insert([{ content: text }]).select()
      if (data?.[0]) setRowId(data[0].id)
    }
    setContent(text)
  }

  return { content, setContent, save }
}

export function useDailyMemo(selectedDate) {
  const [content, setContent] = useState('')
  const [rowId, setRowId]     = useState(null)

  const fetch = useCallback(async () => {
    if (!selectedDate) return
    const { data } = await supabase
      .from('daily_memo').select('*').eq('memo_date', selectedDate).limit(1)
    if (data && data.length > 0) { setContent(data[0].content || ''); setRowId(data[0].id) }
    else { setContent(''); setRowId(null) }
  }, [selectedDate])

  useEffect(() => { fetch() }, [fetch])

  const save = async (text) => {
    const { data } = await supabase
      .from('daily_memo')
      .upsert([{ memo_date: selectedDate, content: text }], { onConflict: 'memo_date' })
      .select()
    if (data?.[0]) setRowId(data[0].id)
    setContent(text)
  }

  return { content, setContent, save }
}

export function useAppSettings() {
  const [subtitle, setSubtitle] = useState('')

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('app_settings').select('*').eq('key', 'subtitle').limit(1)
    if (data?.[0]) setSubtitle(data[0].value || '')
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const saveSubtitle = async (text) => {
    await supabase
      .from('app_settings')
      .upsert([{ key: 'subtitle', value: text }], { onConflict: 'key' })
    setSubtitle(text)
  }

  return { subtitle, saveSubtitle }
}
