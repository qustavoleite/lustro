export function useAuth() {
  const userData = localStorage.getItem('user')
  const token = localStorage.getItem('authToken')
  let user = null

  if (userData) {
    try {
      user = JSON.parse(userData)
    } catch (error) {
      console.error('Erro ao analisar dados do usuário:', error)
    }
  }

  const isAdmin = user?.email === 'admin@gmail.com'
  const isAuthenticated = !!token

  return {
    user,
    isAdmin,
    isAuthenticated,
  }
}