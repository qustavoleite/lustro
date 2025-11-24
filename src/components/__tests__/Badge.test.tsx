import { render, screen } from '@testing-library/react'
import { Badge } from '../Badge'

describe('Badge', () => {
  it('deve renderizar o badge com texto', () => {
    render(<Badge>Agendado</Badge>)
    expect(screen.getByText('Agendado')).toBeInTheDocument()
  })

  it('deve aplicar variante default', () => {
    render(<Badge variant="default">Badge</Badge>)
    const badge = screen.getByText('Badge')
    expect(badge).toHaveClass('bg-blue-700')
  })

  it('deve aplicar variante secondary', () => {
    render(<Badge variant="secondary">Badge</Badge>)
    const badge = screen.getByText('Badge')
    expect(badge).toHaveClass('bg-gray-200')
  })

  it('deve aplicar variante destructive', () => {
    render(<Badge variant="destructive">Badge</Badge>)
    const badge = screen.getByText('Badge')
    expect(badge).toHaveClass('bg-red-600')
  })

  it('deve aplicar variante outline', () => {
    render(<Badge variant="outline">Badge</Badge>)
    const badge = screen.getByText('Badge')
    expect(badge).toHaveClass('border')
  })

  it('deve aplicar className customizada', () => {
    render(<Badge className="custom-class">Badge</Badge>)
    const badge = screen.getByText('Badge')
    expect(badge).toHaveClass('custom-class')
  })
})


