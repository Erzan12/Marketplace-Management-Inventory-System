"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type User = {
  email: string
  role: string
}

interface AuthContextType {
  isLoggedIn: boolean
  user: User | null
  login: (email: string, role: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail")
    const storedRole = localStorage.getItem("userRole")

    console.log("Auth init:")
    console.log("storedEmail:", storedEmail)
    console.log("storedRole:", storedRole)

    if (!storedEmail) {
      console.warn("No email found in localStorage")
    }

    if (!storedRole) {
      console.warn("No role found in localStorage")
    }

    if (storedEmail && storedRole) {
      setUser({ email: storedEmail, role: storedRole })
      setIsLoggedIn(true)
    }

    if (storedEmail && storedRole) {
      setUser({ email: storedEmail, role: storedRole })
      setIsLoggedIn(true)
    }
  }, [])

  // const login = (email: string, role: string) => {
  //   localStorage.setItem("userEmail", email)
  //   localStorage.setItem("userRole", role)

  //   setUser({ email, role })
  //   setIsLoggedIn(true)
  // }

  const login = (email: string, role: string) => {
    console.log("ROLE BEFORE LOGIN:", role)
    if (!role || role === "undefined") {
      console.error("❌ Invalid role passed to login:", role)
      return
    }

    localStorage.setItem("userEmail", email)
    localStorage.setItem("userRole", role)

    setUser({ email, role })
    setIsLoggedIn(true)
  }

  const logout = () => {
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userRole")

    setUser(null)
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}