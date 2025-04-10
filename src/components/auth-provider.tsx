"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => void
  isLoading: boolean
}

// Export the AuthContext so it can be imported elsewhere
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // In a real app, you would make an API call to authenticate
    // For demo purposes, we'll simulate a successful login
    const mockUser = {
      id: "user_" + Math.random().toString(36).substr(2, 9),
      name: email.split("@")[0],
      email,
    }

    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
  }

  const signUp = async (name: string, email: string, password: string) => {
    // In a real app, you would make an API call to register
    // For demo purposes, we'll simulate a successful registration
    const mockUser = {
      id: "user_" + Math.random().toString(36).substr(2, 9),
      name,
      email,
    }

    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, signIn, signUp, signOut, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
