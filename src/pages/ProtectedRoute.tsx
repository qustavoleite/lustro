import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Loading } from "../components/Loading"
import { useAuth } from "../hooks/useAuth"

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        navigate('/login')
      } else if (!isAdmin) {
        navigate('/schedule')
      }
      setIsChecking(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [isAdmin, isAuthenticated, navigate])

  if (isChecking) {
    return <Loading />
  }

  if (isAuthenticated && isAdmin) {
    return <>{children}</>
  }

  return null
}
