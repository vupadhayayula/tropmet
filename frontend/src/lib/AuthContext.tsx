import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UserRole = 'author' | 'reviewer' | 'admin'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
  token: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (user: AuthUser) => void
  logout: () => void
  isLoggedIn: boolean
  role: UserRole | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoggedIn: false,
  role: null,
})

const STORAGE_KEY = 'tropmet_auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const login = (u: AuthUser) => {
    setUser(u)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user, role: user?.role ?? null }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
