import { act, fireEvent, render, screen } from '@testing-library/react'
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
    const shortcuts = screen.getByRole('navigation', { name: 'Aplicativos do portfolio' })
    expect(shortcuts).toHaveAttribute('data-columns', '1')
    expect(shortcuts).toHaveAttribute('data-rows', '6')
  })

  it('groups the Desktop stack by technical area', () => {
    vi.useFakeTimers()
    const stackGroups = [
      { id: 'front', category: 'Front-end', technologies: 'React' },
      { id: 'back', category: 'Back-end & APIs', technologies: 'ASP.NET MVC' },
      { id: 'data', category: 'Dados & cloud', technologies: 'PostgreSQL' },
      { id: 'tools', category: 'Ferramentas', technologies: 'Git e GitHub' },
    ]
    render(
      <DesktopGeneratedSite
        {...createPreviewProps({ stack: ['React', 'ASP.NET MVC', 'PostgreSQL', 'Git e GitHub'], stackGroups, template: 'desktop' })}
        onBackgroundColorChange={() => undefined}
        onDesktopAreaColorChange={() => undefined}
      />,
    )

    act(() => vi.advanceTimersByTime(1100))
    fireEvent.click(screen.getByRole('button', { name: 'Habilidades' }))

    expect(screen.getByRole('heading', { name: 'Front-end' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Back-end & APIs' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dados & cloud' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ferramentas' })).toBeInTheDocument()
  })

  it('preserves stack categories in Terminal, Docs and Landing templates', () => {
    const stackGroups = [{ id: 'front', category: 'Front-end', technologies: 'React\nTypeScript' }]
    const props = createPreviewProps({ stack: ['React', 'TypeScript'], stackGroups })

    const { rerender } = render(<TerminalGeneratedSite {...props} template="terminal" />)
    fireEvent.click(screen.getByRole('button', { name: 'stack' }))
    expect(screen.getByText('./front-end')).toBeInTheDocument()

    rerender(<DocsGeneratedSite {...props} template="docs" />)
    fireEvent.click(screen.getByRole('button', { name: 'Stack' }))
    expect(screen.getByRole('heading', { name: 'Front-end' })).toBeInTheDocument()

    rerender(<LandingGeneratedSite {...props} template="landing" />)
    expect(screen.getAllByText('Front-end').length).toBeGreaterThan(0)
  })

  it('organizes all Desktop shortcuts into multiple columns', () => {
    vi.useFakeTimers()
    const base = createPreviewProps()
    const sections = [
      ...base.sections,
      { id: 'education', title: 'Formacao', description: 'Formacao', icon: 'document' as const, enabled: true },
      { id: 'certifications', title: 'Certificados', description: 'Certificados', icon: 'award' as const, enabled: true },
      { id: 'services', title: 'Servicos', description: 'Servicos', icon: 'briefcase' as const, enabled: true },
      { id: 'testimonials', title: 'Depoimentos', description: 'Depoimentos', icon: 'message' as const, enabled: true },
      { id: 'availability', title: 'Disponibilidade', description: 'Disponibilidade', icon: 'calendar' as const, enabled: true },
      { id: 'events', title: 'Eventos', description: 'Eventos', icon: 'calendar' as const, enabled: true },
    ]

    render(
      <DesktopGeneratedSite
        {...createPreviewProps({ sections, template: 'desktop' })}
        onBackgroundColorChange={() => undefined}
        onDesktopAreaColorChange={() => undefined}
      />,
    )

    act(() => vi.advanceTimersByTime(1100))
    const shortcuts = screen.getByRole('navigation', { name: 'Aplicativos do portfolio' })

    expect(shortcuts).toHaveAttribute('data-columns', '2')
    expect(shortcuts).toHaveAttribute('data-rows', '6')
    expect(shortcuts.querySelectorAll('button')).toHaveLength(12)
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
      stackGroups: [],
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

  it('renders structured education and certifications in every template', () => {
    vi.useFakeTimers()
    const base = createPreviewProps()
    const props = createPreviewProps({
      educations: [{ id: 'education-1', institution: 'Universidade Exemplo', course: 'Sistemas de Informacao', degree: 'Bacharelado', location: 'Sao Paulo', startYear: '2024', endYear: '', current: true }],
      certifications: [{ id: 'certification-1', name: 'React com TypeScript', issuer: 'Escola Exemplo', issueDate: '07/2026', credentialId: 'ABC-123', credentialUrl: 'https://example.com/credential' }],
      sections: [
        ...base.sections.filter((section) => !['education', 'certifications'].includes(section.id)),
        { id: 'education', title: 'Formacao', description: 'Formacao academica', icon: 'document', terminalCommand: 'education', docsGroup: 'Perfil', enabled: true },
        { id: 'certifications', title: 'Cursos e certificados', description: 'Credenciais', icon: 'award', terminalCommand: 'certifications', docsGroup: 'Perfil', enabled: true },
      ],
    })

    const { rerender } = render(<DesktopGeneratedSite {...props} template="desktop" onBackgroundColorChange={() => undefined} onDesktopAreaColorChange={() => undefined} />)
    act(() => vi.advanceTimersByTime(1100))
    fireEvent.click(screen.getByRole('button', { name: 'Formacao' }))
    expect(screen.getByText('Universidade Exemplo')).toBeInTheDocument()

    vi.useRealTimers()
    rerender(<TerminalGeneratedSite {...props} template="terminal" />)
    fireEvent.click(screen.getByRole('button', { name: 'certifications' }))
    expect(screen.getByText('React com TypeScript')).toBeInTheDocument()

    rerender(<DocsGeneratedSite {...props} template="docs" />)
    fireEvent.click(screen.getByRole('button', { name: 'Formacao' }))
    expect(screen.getByRole('heading', { name: 'Sistemas de Informacao' })).toBeInTheDocument()

    rerender(<LandingGeneratedSite {...props} template="landing" />)
    expect(screen.getByRole('heading', { name: 'React com TypeScript' })).toBeInTheDocument()
  })

  it('renders complementary professional content in every template', () => {
    vi.useFakeTimers()
    const base = createPreviewProps()
    const props = createPreviewProps({
      services: [{ id: 'service-1', title: 'Sistemas web', description: 'Aplicacoes completas para processos reais.', technologies: 'React, TypeScript', deliveryType: 'Projeto completo' }],
      languages: [{ id: 'language-1', name: 'Ingles', level: 'Intermediario' }],
      languagesEnabled: true,
      testimonials: [{ id: 'testimonial-1', name: 'Cliente Exemplo', role: 'Fundador', company: 'Empresa Exemplo', quote: 'Transformou uma necessidade em uma solucao clara.' }],
      availability: { status: 'Disponivel para projetos', workModels: 'Remoto', opportunityTypes: 'Freelancer e projetos web', note: 'Disponibilidade para novos projetos.' },
      sections: [
        ...base.sections.filter((section) => !['services', 'testimonials', 'availability'].includes(section.id)),
        { id: 'services', title: 'Servicos', description: 'Servicos oferecidos', icon: 'briefcase', terminalCommand: 'services', docsGroup: 'Trabalho', enabled: true },
        { id: 'testimonials', title: 'Depoimentos', description: 'Depoimentos', icon: 'message', terminalCommand: 'testimonials', docsGroup: 'Trabalho', enabled: true },
        { id: 'availability', title: 'Disponibilidade', description: 'Disponibilidade', icon: 'calendar', terminalCommand: 'availability', docsGroup: 'Conecte-se', enabled: true },
      ],
    })

    const { rerender } = render(<DesktopGeneratedSite {...props} template="desktop" onBackgroundColorChange={() => undefined} onDesktopAreaColorChange={() => undefined} />)
    act(() => vi.advanceTimersByTime(1100))
    fireEvent.click(screen.getByRole('button', { name: 'Servicos' }))
    expect(screen.getByRole('heading', { name: 'Sistemas web' })).toBeInTheDocument()

    vi.useRealTimers()
    rerender(<TerminalGeneratedSite {...props} template="terminal" />)
    fireEvent.click(screen.getByRole('button', { name: 'whoami' }))
    expect(screen.getByText('LANGUAGE_01')).toBeInTheDocument()
    expect(screen.getByText('# Intermediario')).toBeInTheDocument()

    rerender(<DocsGeneratedSite {...props} template="docs" />)
    fireEvent.click(screen.getByRole('button', { name: 'Disponibilidade' }))
    expect(screen.getByRole('heading', { name: 'Disponivel para projetos' })).toBeInTheDocument()

    rerender(<LandingGeneratedSite {...props} template="landing" />)
    expect(screen.getByText(/Transformou uma necessidade em uma solucao clara/)).toBeInTheDocument()
  })
})
