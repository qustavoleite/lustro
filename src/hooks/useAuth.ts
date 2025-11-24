import { useEffect, useState } from 'react'

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user')
      const token = localStorage.getItem('authToken')

      if (userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)

          const userIsAdmin = parsedUser.email === 'admin@lustro.com'
          setIsAdmin(userIsAdmin)
        } catch {
          void 0
        }
      }

      setIsAuthenticated(!!token)
      setIsLoading(false)
    }

    checkAuth()

    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return {
    user,
    isAdmin,
    isAuthenticated,
    isLoading,
  }
}
