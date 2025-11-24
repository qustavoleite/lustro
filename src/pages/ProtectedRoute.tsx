import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loading } from '../components/Loading'
import { useAuth } from '../hooks/useAuth'

export function ProtectedAdminRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAdmin, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login')
      } else if (!isAdmin) {
        navigate('/schedule')
      }
    }
  }, [isAdmin, isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated || !isAdmin) {
    return <Loading />
  }

  return <>{children}</>
}
