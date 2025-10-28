// export interface User {
//   id: string
//   nome: string
//   email: string
// }

// export const setAuthToken = (token: string): void => {
//   localStorage.setItem('authToken', token)
// }

// export const getAuthToken = (): string | null => {
//   return localStorage.getItem('authToken')
// }

// export const removeAuthToken = (): void => {
//   localStorage.removeItem('authToken')
//   localStorage.removeItem('user')
// }

// export const setUser = (user: User): void => {
//   localStorage.setItem('user', JSON.stringify(user))
// }

// export const getUser = (): User | null => {
//   const userStr = localStorage.getItem('user')
//   if (!userStr) return null

//   try {
//     return JSON.parse(userStr)
//   } catch {
//     return null
//   }
// }

// export const isAuthenticated = (): boolean => {
//   return !!getAuthToken()
// }

// export const logout = (): void => {
//   removeAuthToken()
// }

// export const fetchWithAuth = async (
//   url: string,
//   options: RequestInit = {}
// ): Promise<Response> => {
//   const token = getAuthToken()

//   const headers = {
//     'Content-Type': 'application/json',
//     ...(token && { Authorization: `Bearer ${token}` }),
//     ...options.headers,
//   }

//   return fetch(url, {
//     ...options,
//     headers,
//   })
// }
