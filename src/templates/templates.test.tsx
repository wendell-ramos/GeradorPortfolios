import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createPreviewProps } from '../test/portfolioFixture'
import { DesktopGeneratedSite } from './DesktopTemplate'
import { DocsGeneratedSite } from './DocsTemplate'
import { LandingGeneratedSite } from './LandingTemplate'
import { TerminalGeneratedSite } from './TerminalTemplate'

afterEach(() => {
  vi.useRealTimers()
})

describe('generated templates', () => {
  it('renders the Desktop after its loading screen', () => {
    vi.useFakeTimers()
    render(
      <DesktopGeneratedSite
        {...createPreviewProps({ template: 'desktop' })}
        onBackgroundColorChange={() => undefined}
        onDesktopAreaColorChange={() => undefined}
      />,
    )

    expect(screen.getByText(/Carregando portfolio de Wendell Ramos/)).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(1100))
    expect(screen.getByRole('heading', { name: /Eu sou Wendell Ramos/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Meus projetos' })).toBeInTheDocument()
  })

  it('executes a project command in the Terminal', async () => {
    const user = userEvent.setup()
    render(<TerminalGeneratedSite {...createPreviewProps({ template: 'terminal' })} />)

    await user.click(screen.getByRole('button', { name: 'projects' }))

    expect(screen.getByText('total 4')).toBeInTheDocument()
    expect(screen.getByText('FinControl')).toBeInTheDocument()
  })

  it('renders the Docs navigation and overview', () => {
    render(<DocsGeneratedSite {...createPreviewProps({ template: 'docs' })} />)

    expect(screen.getByRole('heading', { name: 'Wendell Ramos' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Overview' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ler documentacao do projeto' })).toBeInTheDocument()
  })

  it('announces the open and closed states of the Docs mobile navigation', async () => {
    const user = userEvent.setup()
    render(<DocsGeneratedSite {...createPreviewProps({ template: 'docs' })} />)

    const menuButton = screen.getByRole('button', { name: 'Abrir navegacao' })
    expect(menuButton).toHaveAttribute('aria-controls', 'docs-sidebar-navigation')
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(menuButton)

    expect(screen.getByRole('button', { name: 'Fechar navegacao' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('renders the Landing hero and featured project', () => {
    render(<LandingGeneratedSite {...createPreviewProps({ template: 'landing' })} />)

    expect(screen.getByRole('heading', {
      name: 'Crio sistemas web, automacoes e produtos digitais com foco em problema real.',
    })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Explorar projetos/ })).toBeInTheDocument()
    expect(screen.getByText('Destaque')).toBeInTheDocument()
  })

  it('keeps disabled sections out of every template navigation', () => {
    const props = createPreviewProps({
      projects: [],
      sections: createPreviewProps().sections.filter((section) => section.id !== 'projects'),
    })

    const { rerender } = render(
      <DesktopGeneratedSite
        {...props}
        template="desktop"
        onBackgroundColorChange={() => undefined}
        onDesktopAreaColorChange={() => undefined}
      />,
    )
    expect(screen.queryByRole('button', { name: 'Meus projetos' })).not.toBeInTheDocument()

    rerender(<TerminalGeneratedSite {...props} template="terminal" />)
    expect(screen.queryByRole('button', { name: 'projects' })).not.toBeInTheDocument()

    rerender(<DocsGeneratedSite {...props} template="docs" />)
    expect(screen.queryByRole('button', { name: 'Projetos' })).not.toBeInTheDocument()

    rerender(<LandingGeneratedSite {...props} template="landing" />)
    expect(screen.queryByRole('link', { name: 'Projetos' })).not.toBeInTheDocument()
  })

  it('renders useful empty states without crashing the templates', () => {
    const emptyProps = createPreviewProps({
      contacts: [],
      experiences: [],
      projects: [],
      resumeEnabled: false,
      resumeFile: '',
      sections: [],
      stack: [],
    })

    const { rerender } = render(<TerminalGeneratedSite {...emptyProps} template="terminal" />)
    expect(screen.getByText('Portfolio Shell v1.0.0')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'help' })).toBeInTheDocument()

    rerender(<DocsGeneratedSite {...emptyProps} template="docs" />)
    expect(screen.getByRole('heading', { name: 'Wendell Ramos' })).toBeInTheDocument()
    expect(screen.getAllByText('0', { selector: '.docs-stats strong' })).toHaveLength(3)

    rerender(<LandingGeneratedSite {...emptyProps} template="landing" />)
    expect(screen.getByRole('heading', { name: emptyProps.headline })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Explorar projetos' })).not.toBeInTheDocument()
  })
})
