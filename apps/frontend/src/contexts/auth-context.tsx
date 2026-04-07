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

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [isLoggedIn, setIsLoggedIn] = useState(false)

//   useEffect(() => {
//     setIsLoggedIn(!!localStorage.getItem("userEmail"))
//   }, [])

//   const login = (email: string) => {
//     localStorage.setItem("userEmail", email)
//     setIsLoggedIn(true)
//   }

//   const logout = () => {
//     localStorage.removeItem("userEmail")
//     setIsLoggedIn(false)
//   }

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail")
    const storedRole = localStorage.getItem("userRole")

    if (storedEmail && storedRole) {
      setUser({ email: storedEmail, role: storedRole })
      setIsLoggedIn(true)
    }
  }, [])

  const login = (email: string, role: string) => {
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