"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

// Define what data/functions the rest of the app can use
interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Safely read from localStorage ONLY on the client side
  useEffect(() => {
    const user = localStorage.getItem("userEmail")
    setIsLoggedIn(!!user)
  }, [])

  // Log in helper
  const login = (email: string) => {
    localStorage.setItem("userEmail", email)
    setIsLoggedIn(true)
  }

  // Log out helper
  const logout = () => {
    localStorage.removeItem("userEmail")
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook so you don't have to write useContext(AuthContext) every time
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}