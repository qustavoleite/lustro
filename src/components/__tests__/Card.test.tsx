import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardContent } from '../Card'

describe('Card', () => {
  it('deve renderizar o Card com conteúdo', () => {
    render(
      <Card>
        <p>Conteúdo do card</p>
      </Card>
    )
    expect(screen.getByText('Conteúdo do card')).toBeInTheDocument()
  })

  it('deve renderizar CardHeader com CardTitle', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Título do Card</CardTitle>
        </CardHeader>
      </Card>
    )
    expect(screen.getByText('Título do Card')).toBeInTheDocument()
  })

  it('deve renderizar CardContent com conteúdo', () => {
    render(
      <Card>
        <CardContent>
          <p>Conteúdo aqui</p>
        </CardContent>
      </Card>
    )
    expect(screen.getByText('Conteúdo aqui')).toBeInTheDocument()
  })

  it('deve aplicar className customizada', () => {
    const { container } = render(<Card className="custom-class">Teste</Card>)
    const card = container.firstChild
    expect(card).toHaveClass('custom-class')
  })
})


