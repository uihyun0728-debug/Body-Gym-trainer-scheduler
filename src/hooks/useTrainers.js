import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

export function useTrainers() {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data, error } = await supabase
      .from('trainer_list')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true })
    if (!error) setTrainers(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const addTrainer = async (name) => {
    const maxOrder = trainers.length > 0
      ? Math.max(...trainers.map(t => t.display_order)) + 1
      : 0
    const { error } = await supabase
      .from('trainer_list')
      .insert([{ name: name.trim(), display_order: maxOrder }])
    if (error) throw error
    await fetch()
  }

  const updateTrainer = async (id, name) => {
    const { error } = await supabase
      .from('trainer_list')
      .update({ name: name.trim() })
      .eq('id', id)
    if (error) throw error
    await fetch()
  }

  const deleteTrainer = async (id) => {
    const { error } = await supabase
      .from('trainer_list')
      .delete()
      .eq('id', id)
    if (error) throw error
    await fetch()
  }

  return { trainers, loading, addTrainer, updateTrainer, deleteTrainer }
}
