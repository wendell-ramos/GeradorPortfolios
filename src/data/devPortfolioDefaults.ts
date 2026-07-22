import type { BuilderStep, ContactLink, DefaultSection, DesktopColorTarget, DesktopEditableTarget, DevCertification, DevEducation, DevExperience, DevProject, DevTemplate, DevTemplateOption, PortfolioSection, SectionIcon, TemplateSettings } from '../models/portfolio'

const exampleResumeUrl = `${import.meta.env.BASE_URL}examples/curriculo-wendell-ramos.pdf`

export const steps: Array<{ id: BuilderStep; label: string }> = [
  { id: 'identity', label: 'Identidade' }, { id: 'style', label: 'Estilo' }, { id: 'sections', label: 'Secoes' },
  { id: 'projects', label: 'Projetos' }, { id: 'contact', label: 'Contato' }, { id: 'preview', label: 'Visualizar' },
]

export const devTemplates: DevTemplateOption[] = [
  { id: 'desktop', label: 'Desktop retro', description: 'Portfolio com area de trabalho, janelas e atalhos. Bom para devs que querem algo memoravel.' },
  { id: 'terminal', label: 'Terminal hacker', description: 'Visual de linha de comando, logs e comandos. Bom para destacar stack e projetos tecnicos.' },
  { id: 'landing', label: 'Landing criativa', description: 'Pagina fluida, editorial e interativa. Boa para apresentar marca pessoal, projetos e narrativa.' },
  { id: 'docs', label: 'Docs moderno', description: 'Visual limpo, parecido com documentacao. Bom para leitura rapida e perfil profissional.' },
]

export const defaultSections: Record<DefaultSection, Omit<PortfolioSection, 'id' | 'enabled' | 'locked'>> = {
  about: { title: 'Sobre', description: 'Resumo, trajetoria profissional, contexto e foco de atuacao.', icon: 'user', terminalCommand: 'whoami', docsGroup: 'Perfil' },
  stack: { title: 'Stack', description: 'Tecnologias, ferramentas e conhecimentos principais.', icon: 'code', terminalCommand: 'stack', docsGroup: 'Perfil' },
  education: { title: 'Formacao', description: 'Formacao academica, instituicoes e periodo de estudo.', icon: 'document', terminalCommand: 'education', docsGroup: 'Perfil' },
  certifications: { title: 'Cursos e certificados', description: 'Cursos, certificacoes e credenciais profissionais.', icon: 'award', terminalCommand: 'certifications', docsGroup: 'Perfil' },
  projects: { title: 'Projetos', description: 'Cases com descricao, tecnologias e links clicaveis.', icon: 'folder', terminalCommand: 'projects', docsGroup: 'Trabalho' },
  contact: { title: 'Contato', description: 'Links para email, GitHub, LinkedIn, WhatsApp ou site.', icon: 'mail', terminalCommand: 'contact', docsGroup: 'Conecte-se' },
}

export const accentOptions = ['#2563eb', '#14b8a6', '#8b5cf6', '#22c55e', '#f97316']
export const backgroundOptions = ['#103f8f', '#111b44', '#020617', '#f8fafc', '#ffffff', '#0f766e']
export const defaultTemplateBackgrounds: Record<DevTemplate, string> = { desktop: '#103f8f', terminal: '#020617', docs: '#fbfbf8', landing: '#f4f1ea' }
export const defaultDesktopAreaColors: Record<DesktopColorTarget, string> = { titlebar: '#2563eb', menu: '#d6d6ce', window: '#fbfbf6', statusbar: '#d6d6ce', taskbar: '#d6d6d6' }
export const defaultTemplateSettings: TemplateSettings = {
  desktop: { homeTitle: 'Bem-vindo ao meu portfolio', startLabel: 'iniciar', shortcutSize: 'medium', windowWidth: 'wide' },
  terminal: { bootTitle: 'Portfolio Shell', host: 'portfolio', shell: 'bash', textScale: 'medium', scanlines: true },
  docs: { badge: 'Docs', sidebarLabel: 'DOCUMENTATION', version: 'v1.0', contentWidth: 'focused', showPageIndex: true },
  landing: {
    composition: 'editorial',
    eyebrow: 'Disponivel para novos projetos',
    primaryAction: 'Explorar projetos',
    highlight: 'problema real',
    resumeUrl: '',
    projectLayout: 'showcase',
    motion: 'expressive',
    showMarquee: true,
    showMetrics: true,
    metricOneValue: '4+',
    metricOneLabel: 'projetos publicados',
    metricTwoValue: '2',
    metricTwoLabel: 'clientes atendidos',
    metricThreeValue: 'BR',
    metricThreeLabel: 'Presidente Prudente, SP',
  },
}

export const desktopColorTargets: Array<{ id: DesktopEditableTarget; label: string }> = [
  { id: 'background', label: 'Papel de parede' }, { id: 'titlebar', label: 'Barra de titulo' }, { id: 'menu', label: 'Menu da janela' },
  { id: 'window', label: 'Conteudo da janela' }, { id: 'statusbar', label: 'Rodape da janela' }, { id: 'taskbar', label: 'Barra de tarefas' },
]
export const desktopAreaColorOptions = [...new Set([...accentOptions, ...backgroundOptions, '#d6d6d6'])]

export const sectionIconOptions: Array<{ id: SectionIcon; label: string }> = [
  { id: 'user', label: 'Perfil' }, { id: 'code', label: 'Codigo' }, { id: 'folder', label: 'Pasta' }, { id: 'mail', label: 'E-mail' },
  { id: 'calendar', label: 'Calendario' }, { id: 'award', label: 'Certificado' }, { id: 'briefcase', label: 'Servicos' },
  { id: 'message', label: 'Depoimentos' }, { id: 'document', label: 'Documento' }, { id: 'terminal', label: 'Terminal' }, { id: 'link', label: 'Link' },
]

export const sectionPresets: Array<Omit<PortfolioSection, 'id' | 'enabled'> & { id?: string }> = [
  { id: 'education', ...defaultSections.education },
  { id: 'certifications', ...defaultSections.certifications },
  { title: 'Eventos', description: 'Hackathons, palestras, visitas tecnicas e experiencias academicas.', icon: 'calendar' },
  { title: 'Servicos', description: 'Tipos de solucao que voce pode desenvolver para clientes.', icon: 'briefcase' },
  { title: 'Depoimentos', description: 'Comentarios de clientes, professores, colegas ou parceiros.', icon: 'message' },
]

export const contactPresets: Array<Omit<ContactLink, 'id'>> = [
  { type: 'email', label: 'E-mail', value: 'seuemail@exemplo.com', url: 'mailto:seuemail@exemplo.com' },
  { type: 'github', label: 'GitHub', value: 'github.com/seu-usuario', url: 'https://github.com/seu-usuario' },
  { type: 'linkedin', label: 'LinkedIn', value: 'linkedin.com/in/seu-perfil', url: 'https://www.linkedin.com/in/seu-perfil/' },
  { type: 'whatsapp', label: 'WhatsApp', value: '(00) 00000-0000', url: 'https://wa.me/5500000000000' },
  { type: 'instagram', label: 'Instagram', value: '@seuusuario', url: 'https://www.instagram.com/seuusuario/' },
  { type: 'x', label: 'X / Twitter', value: '@seuusuario', url: 'https://x.com/seuusuario' },
  { type: 'portfolio', label: 'Portfolio', value: 'seuportfolio.com', url: 'https://seuportfolio.com' },
]

export function createDefaultSections(): PortfolioSection[] {
  return [
    { id: 'about', ...defaultSections.about, enabled: true, locked: true },
    { id: 'stack', ...defaultSections.stack, enabled: true, locked: true },
    { id: 'projects', ...defaultSections.projects, enabled: true, locked: true },
    { id: 'contact', ...defaultSections.contact, enabled: true, locked: true },
  ]
}

export function createPresetDevPortfolio() {
  const educations: DevEducation[] = []
  const certifications: DevCertification[] = []
  const experiences: DevExperience[] = [{
    id: crypto.randomUUID(),
    company: 'Projetos independentes',
    city: 'Presidente Prudente - SP',
    role: 'Desenvolvedor de Sistemas',
    activities: 'Desenvolvimento de sistemas web, automacoes, dashboards e solucoes digitais para processos reais, da interface ao banco de dados e publicacao.',
    startDate: '2024-01',
    endDate: '',
    current: true,
  }]

  const projects: DevProject[] = [
    { id: crypto.randomUUID(), title: 'FinControl', description: 'Controle financeiro pessoal com dashboard, receitas, despesas, metas, categorias e arquitetura publicada na Cloudflare.', imageUrl: '', imageName: '', liveUrl: 'https://fincontrol-2os.pages.dev/', repoUrl: 'https://github.com/wendell-ramos', techs: 'Cloudflare, D1, SQL', category: 'Sistemas web', status: 'Publicado', year: '2026', featured: true },
    { id: crypto.randomUUID(), title: 'Pericia Contabil', description: 'Sistema web em ASP.NET MVC para gestao de atividades de pericia contabil, usuarios, permissoes e banco PostgreSQL.', imageUrl: '', imageName: '', liveUrl: '', repoUrl: 'https://github.com/wendell-ramos', techs: 'C#, ASP.NET MVC, PostgreSQL', category: 'Sistemas web', status: 'Em desenvolvimento', year: '2026', featured: false },
    { id: crypto.randomUUID(), title: 'Edvaldo Films', description: 'Portfolio audiovisual responsivo para filmmaker, com trabalhos, processo, contato, dominio proprio e foco em video.', imageUrl: 'https://wendell-ramos.github.io/portfolio-wendell-ramos/assets/projeto-edvaldo-films.png', imageName: 'projeto-edvaldo-films.png', liveUrl: 'https://edvaldofilms.com.br/', repoUrl: '', techs: 'React, Vite, Cloudflare', category: 'Portfolios', status: 'Publicado', year: '2025', featured: false },
    { id: crypto.randomUUID(), title: 'Portfolio Retro', description: 'Portfolio pessoal em formato de desktop retro, com janelas, atalhos, curriculo, eventos, projetos e contato.', imageUrl: '', imageName: '', liveUrl: 'https://wendell-ramos.github.io/portfolio-wendell-ramos/', repoUrl: 'https://github.com/wendell-ramos/portfolio-wendell-ramos', techs: 'HTML, CSS, JavaScript, GitHub Pages', category: 'Portfolios', status: 'Publicado', year: '2025', featured: false },
  ]

  const contacts: ContactLink[] = [
    { id: crypto.randomUUID(), type: 'email', label: 'E-mail', value: 'wendellnascimentoramos@gmail.com', url: 'mailto:wendellnascimentoramos@gmail.com' },
    { id: crypto.randomUUID(), type: 'github', label: 'GitHub', value: 'github.com/wendell-ramos', url: 'https://github.com/wendell-ramos' },
    { id: crypto.randomUUID(), type: 'linkedin', label: 'LinkedIn', value: 'linkedin.com/in/wendellramos10', url: 'https://www.linkedin.com/in/wendellramos10/' },
    { id: crypto.randomUUID(), type: 'portfolio', label: 'Portfolio', value: 'wendell-ramos.github.io/portfolio-wendell-ramos', url: 'https://wendell-ramos.github.io/portfolio-wendell-ramos/' },
  ]

  return {
    template: 'desktop' as DevTemplate,
    accentColor: '#2563eb',
    templateBackgrounds: { ...defaultTemplateBackgrounds },
    desktopAreaColors: { ...defaultDesktopAreaColors },
    templateSettings: structuredClone(defaultTemplateSettings),
    name: 'Wendell Ramos',
    role: 'Desenvolvedor de Sistemas',
    location: 'Presidente Prudente - SP',
    headline: 'Crio sistemas web, automacoes e produtos digitais com foco em problema real.',
    bio: 'Estudante de Sistemas de Informacao e desenvolvedor focado em sistemas web, automacoes, dashboards e solucoes praticas para organizar processos reais.',
    profilePhoto: '',
    resumeEnabled: true,
    resumeFile: exampleResumeUrl,
    resumeName: 'Curriculo - Wendell Ramos.pdf',
    experiences,
    educations,
    certifications,
    stackText: 'React\nTypeScript\nASP.NET MVC\nC#\nPostgreSQL\nCloudflare',
    sections: createDefaultSections(),
    projects,
    contacts,
  }
}
