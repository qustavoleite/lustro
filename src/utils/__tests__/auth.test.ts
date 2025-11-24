import { logout } from '../auth'

const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

globalThis.fetch = jest.fn() as jest.Mock

describe('logout', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    ;(globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
    })
  })

  it('deve remover authToken e user do localStorage', async () => {
    localStorage.setItem('authToken', 'test-token')
    localStorage.setItem('user', JSON.stringify({ email: 'test@test.com' }))

    await logout()

    expect(localStorage.getItem('authToken')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })

  it('deve chamar o endpoint de logout do admin quando o usuário é admin', async () => {
    localStorage.setItem('authToken', 'test-token')
    localStorage.setItem(
      'user',
      JSON.stringify({ email: 'admin@lustro.com' })
    )

    await logout()

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/admin/logout'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    )
  })

  it('deve chamar o endpoint de logout normal quando o usuário não é admin', async () => {
    localStorage.setItem('authToken', 'test-token')
    localStorage.setItem('user', JSON.stringify({ email: 'user@test.com' }))

    await logout()

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/logout'),
      expect.objectContaining({
        method: 'POST',
      })
    )
  })
})

