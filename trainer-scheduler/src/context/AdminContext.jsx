import { createContext, useContext, useState, useCallback } from 'react'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)

  const login = useCallback((pw) => {
    const correct = import.meta.env.VITE_ADMIN_PASSWORD || '1124'
    if (pw === correct) { setIsAdmin(true); return true }
    return false
  }, [])

  const logout = useCallback(() => setIsAdmin(false), [])

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}
