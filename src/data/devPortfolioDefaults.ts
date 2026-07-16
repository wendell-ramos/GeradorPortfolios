import type { BuilderStep, ContactLink, DefaultSection, DesktopColorTarget, DesktopEditableTarget, DevTemplate, DevTemplateOption, PortfolioSection, SectionIcon, TemplateSettings } from '../models/portfolio'

export const steps: Array<{ id: BuilderStep; label: string }> = [
  { id: 'identity', label: 'Identidade' }, { id: 'style', label: 'Estilo' }, { id: 'sections', label: 'Secoes' },
  { id: 'projects', label: 'Projetos' }, { id: 'contact', label: 'Contato' }, { id: 'preview', label: 'Visualizar' },
]

export const devTemplates: DevTemplateOption[] = [
  { id: 'desktop', label: 'Desktop retro', description: 'Portfolio com area de trabalho, janelas e atalhos. Bom para devs que querem algo memoravel.' },
  { id: 'terminal', label: 'Terminal hacker', description: 'Visual de linha de comando, logs e comandos. Bom para destacar stack e projetos tecnicos.' },
  { id: 'docs', label: 'Docs moderno', description: 'Visual limpo, parecido com documentacao. Bom para leitura rapida e perfil profissional.' },
]

export const defaultSections: Record<DefaultSection, Omit<PortfolioSection, 'id' | 'enabled' | 'locked'>> = {
  about: { title: 'Sobre', description: 'Resumo, trajetoria profissional, contexto e foco de atuacao.', icon: 'user', terminalCommand: 'whoami', docsGroup: 'Perfil' },
  stack: { title: 'Stack', description: 'Tecnologias, ferramentas e conhecimentos principais.', icon: 'code', terminalCommand: 'stack', docsGroup: 'Perfil' },
  projects: { title: 'Projetos', description: 'Cases com descricao, tecnologias e links clicaveis.', icon: 'folder', terminalCommand: 'projects', docsGroup: 'Trabalho' },
  contact: { title: 'Contato', description: 'Links para email, GitHub, LinkedIn, WhatsApp ou site.', icon: 'mail', terminalCommand: 'contact', docsGroup: 'Conecte-se' },
}

export const accentOptions = ['#2563eb', '#14b8a6', '#8b5cf6', '#22c55e', '#f97316']
export const backgroundOptions = ['#103f8f', '#111b44', '#020617', '#f8fafc', '#ffffff', '#0f766e']
export const defaultTemplateBackgrounds: Record<DevTemplate, string> = { desktop: '#103f8f', terminal: '#020617', docs: '#fbfbf8' }
export const defaultDesktopAreaColors: Record<DesktopColorTarget, string> = { titlebar: '#2563eb', menu: '#d6d6ce', window: '#fbfbf6', statusbar: '#d6d6ce', taskbar: '#d6d6d6' }
export const defaultTemplateSettings: TemplateSettings = {
  desktop: { homeTitle: 'Bem-vindo ao meu portfolio', startLabel: 'iniciar', shortcutSize: 'medium', windowWidth: 'wide' },
  terminal: { bootTitle: 'Portfolio Shell', host: 'portfolio', shell: 'bash', textScale: 'medium', scanlines: true },
  docs: { badge: 'Docs', sidebarLabel: 'DOCUMENTATION', version: 'v1.0', contentWidth: 'focused', showPageIndex: true },
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

export const sectionPresets: Array<Omit<PortfolioSection, 'id' | 'enabled'>> = [
  { title: 'Certificados', description: 'Cursos, bootcamps, eventos e certificados relevantes.', icon: 'award' },
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
