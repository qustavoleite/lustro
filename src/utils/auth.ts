import { API_BASE_URL } from '../config/api'

export const logout = async (): Promise<void> => {
  const token = localStorage.getItem('authToken')
  const userData = localStorage.getItem('user')

  let isAdmin = false
  if (userData) {
    try {
      const user = JSON.parse(userData)
      isAdmin = user && user.email === 'admin@lustro.com'
    } catch {
      void 0
    }
  }

  if (token) {
    try {
      const endpoint = isAdmin
        ? `${API_BASE_URL}/auth/admin/logout`
        : `${API_BASE_URL}/auth/logout`

      await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
    } catch {
      void 0
    }
  }

  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  window.location.href = '/'
}
