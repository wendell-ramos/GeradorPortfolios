import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { writePortfolioDraft } from './storage/portfolioDraft'
import { createDraft } from './test/portfolioFixture'

function deleteDraftDatabase() {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase('portfy-dev')
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
    request.onblocked = () => reject(new Error('Draft database is blocked'))
  })
}

describe('portfolio builder flow', () => {
  beforeEach(async () => {
    await deleteDraftDatabase()
  })

  it('starts empty and blocks an incomplete identity step', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(await screen.findByRole('button', { name: /Comecar do zero/ }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(screen.getByText('Revise os campos indicados para continuar.')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Nome' })).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Informe seu nome.')).toBeInTheDocument()
    expect(screen.getByText('1 de 6')).toBeInTheDocument()
  })

  it('starts with the complete example data', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(await screen.findByRole('button', { name: /Usar dados de exemplo/ }))

    expect(screen.getByRole('textbox', { name: 'Nome' })).toHaveValue('Wendell Ramos')
    expect(screen.getByRole('textbox', { name: 'Nome' })).toBeDisabled()
    expect(screen.getByRole('textbox', { name: 'Cargo / assinatura' })).toHaveValue('Desenvolvedor de Sistemas')
    expect(screen.getByText('Curriculo - Wendell Ramos.pdf')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Exibir idiomas no Sobre mim/ })).toBeChecked()
    expect(screen.getAllByRole('textbox', { name: 'Idioma' }).map((input) => (input as HTMLInputElement).value)).toEqual(['Portugues', 'Ingles'])

    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(screen.getByText('Formacao academica, instituicoes e periodo de estudo.')).toBeInTheDocument()
    expect(screen.getByText('Cursos, certificacoes e credenciais profissionais.')).toBeInTheDocument()
    expect(screen.getByText('Solucoes e tipos de entrega oferecidos para clientes e equipes.')).toBeInTheDocument()
    expect(screen.getByText('Comentarios de clientes, colegas e parceiros profissionais.')).toBeInTheDocument()
    expect(screen.getByText('Situacao atual, modelo de trabalho e oportunidades procuradas.')).toBeInTheDocument()
  })

  it('restores the saved step and template from IndexedDB', async () => {
    await writePortfolioDraft(createDraft({
      step: 'preview',
      maxUnlockedStep: 5,
      template: 'docs',
    }))

    render(<App />)

    expect(await screen.findByRole('heading', {
      name: 'Seu site esta pronto para ser explorado.',
    })).toBeInTheDocument()
    expect(screen.getByText('Docs moderno')).toBeInTheDocument()
    expect(screen.getByText('6 de 6')).toBeInTheDocument()
  })
})
