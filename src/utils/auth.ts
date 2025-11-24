import { API_BASE_URL } from '../config/api'

export const logout = async (): Promise<void> => {
  const token = localStorage.getItem('authToken')
  const userData = localStorage.getItem('user')

  // Verifica se é admin
  let isAdmin = false
  if (userData) {
    try {
      const user = JSON.parse(userData)
      isAdmin = user && user.email === 'admin@lustro.com'
    } catch {
      // Ignorar erro de parse
    }
  }

  // Chama o endpoint de logout correto
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
    } catch (error) {
      // Continua com o logout mesmo se a requisição falhar
      console.error('Erro ao fazer logout no servidor:', error)
    }
  }

  // Remove os dados do localStorage
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')

  // Redireciona para a página inicial
  window.location.href = '/'
}
