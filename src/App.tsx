import { type ChangeEvent, type CSSProperties, type MouseEvent as ReactMouseEvent, type ReactNode, useEffect, useMemo, useState } from 'react'
import './App.css'

type BuilderStep = 'identity' | 'style' | 'sections' | 'projects' | 'contact' | 'preview'
type DevTemplate = 'desktop' | 'terminal' | 'docs'
type DesktopColorTarget = 'titlebar' | 'menu' | 'window' | 'statusbar' | 'taskbar'
type DesktopEditableTarget = 'background' | DesktopColorTarget
type DefaultSection = 'about' | 'stack' | 'projects' | 'contact'
type SectionIcon = 'home' | 'user' | 'code' | 'folder' | 'mail' | 'calendar' | 'award' | 'briefcase' | 'message' | 'document' | 'terminal' | 'link'

type PortfolioSection = {
  id: string
  title: string
  description: string
  icon: SectionIcon
  backgroundColor?: string
  enabled: boolean
  locked?: boolean
}

type DevProject = {
  id: string
  title: string
  description: string
  imageUrl: string
  imageName: string
  liveUrl: string
  repoUrl: string
  techs: string
}

type DevExperience = {
  id: string
  company: string
  city: string
  role: string
  activities: string
  startDate: string
  endDate: string
  current: boolean
}

type ContactLink = {
  id: string
  type: ContactType
  label: string
  value: string
  url: string
}

type ContactType = 'email' | 'github' | 'linkedin' | 'whatsapp' | 'instagram' | 'x' | 'portfolio'

type DevTemplateOption = {
  id: DevTemplate
  label: string
  description: string
}

type PortfolioPreviewProps = {
  accentColor: string
  backgroundColor: string
  desktopAreaColors: Record<DesktopColorTarget, string>
  bio: string
  contacts: ContactLink[]
  experiences: DevExperience[]
  headline: string
  location: string
  name: string
  profilePhoto: string
  projects: DevProject[]
  role: string
  sections: PortfolioSection[]
  stack: string[]
  template: DevTemplate
}

const steps: Array<{ id: BuilderStep; label: string }> = [
  { id: 'identity', label: 'Identidade' },
  { id: 'style', label: 'Estilo' },
  { id: 'sections', label: 'Secoes' },
  { id: 'projects', label: 'Projetos' },
  { id: 'contact', label: 'Contato' },
  { id: 'preview', label: 'Visualizar' },
]

const devTemplates: DevTemplateOption[] = [
  {
    id: 'desktop',
    label: 'Desktop retro',
    description: 'Portfolio com area de trabalho, janelas e atalhos. Bom para devs que querem algo memoravel.',
  },
  {
    id: 'terminal',
    label: 'Terminal hacker',
    description: 'Visual de linha de comando, logs e comandos. Bom para destacar stack e projetos tecnicos.',
  },
  {
    id: 'docs',
    label: 'Docs moderno',
    description: 'Visual limpo, parecido com documentacao. Bom para leitura rapida e perfil profissional.',
  },
]

const defaultSections: Record<DefaultSection, Omit<PortfolioSection, 'id' | 'enabled' | 'locked'>> = {
  about: {
    title: 'Sobre',
    description: 'Resumo, trajetoria profissional, contexto e foco de atuacao.',
    icon: 'user',
  },
  stack: {
    title: 'Stack',
    description: 'Tecnologias, ferramentas e conhecimentos principais.',
    icon: 'code',
  },
  projects: {
    title: 'Projetos',
    description: 'Cases com descricao, tecnologias e links clicaveis.',
    icon: 'folder',
  },
  contact: {
    title: 'Contato',
    description: 'Links para email, GitHub, LinkedIn, WhatsApp ou site.',
    icon: 'mail',
  },
}

const accentOptions = ['#2563eb', '#14b8a6', '#8b5cf6', '#22c55e', '#f97316']
const backgroundOptions = ['#103f8f', '#111b44', '#020617', '#f8fafc', '#ffffff', '#0f766e']
const defaultTemplateBackgrounds: Record<DevTemplate, string> = {
  desktop: '#103f8f',
  terminal: '#020617',
  docs: '#fbfbf8',
}
const defaultDesktopAreaColors: Record<DesktopColorTarget, string> = {
  titlebar: '#2563eb',
  menu: '#d6d6ce',
  window: '#fbfbf6',
  statusbar: '#d6d6ce',
  taskbar: '#d6d6d6',
}
const desktopColorTargets: Array<{ id: DesktopEditableTarget; label: string }> = [
  { id: 'background', label: 'Papel de parede' },
  { id: 'titlebar', label: 'Barra de titulo' },
  { id: 'menu', label: 'Menu da janela' },
  { id: 'window', label: 'Conteudo da janela' },
  { id: 'statusbar', label: 'Rodape da janela' },
  { id: 'taskbar', label: 'Barra de tarefas' },
]
const desktopAreaColorOptions = [...new Set([...accentOptions, ...backgroundOptions, '#d6d6d6'])]

const sectionIconOptions: Array<{ id: SectionIcon; label: string }> = [
  { id: 'user', label: 'Perfil' },
  { id: 'code', label: 'Codigo' },
  { id: 'folder', label: 'Pasta' },
  { id: 'mail', label: 'E-mail' },
  { id: 'calendar', label: 'Calendario' },
  { id: 'award', label: 'Certificado' },
  { id: 'briefcase', label: 'Servicos' },
  { id: 'message', label: 'Depoimentos' },
  { id: 'document', label: 'Documento' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'link', label: 'Link' },
]

const sectionPresets: Array<Omit<PortfolioSection, 'id' | 'enabled'>> = [
  {
    title: 'Certificados',
    description: 'Cursos, bootcamps, eventos e certificados relevantes.',
    icon: 'award',
  },
  {
    title: 'Eventos',
    description: 'Hackathons, palestras, visitas tecnicas e experiencias academicas.',
    icon: 'calendar',
  },
  {
    title: 'Servicos',
    description: 'Tipos de solucao que voce pode desenvolver para clientes.',
    icon: 'briefcase',
  },
  {
    title: 'Depoimentos',
    description: 'Comentarios de clientes, professores, colegas ou parceiros.',
    icon: 'message',
  },
]

const contactPresets: Array<Omit<ContactLink, 'id'>> = [
  {
    type: 'email',
    label: 'E-mail',
    value: 'seuemail@exemplo.com',
    url: 'mailto:seuemail@exemplo.com',
  },
  {
    type: 'github',
    label: 'GitHub',
    value: 'github.com/seu-usuario',
    url: 'https://github.com/seu-usuario',
  },
  {
    type: 'linkedin',
    label: 'LinkedIn',
    value: 'linkedin.com/in/seu-perfil',
    url: 'https://www.linkedin.com/in/seu-perfil/',
  },
  {
    type: 'whatsapp',
    label: 'WhatsApp',
    value: '(00) 00000-0000',
    url: 'https://wa.me/5500000000000',
  },
  {
    type: 'instagram',
    label: 'Instagram',
    value: '@seuusuario',
    url: 'https://www.instagram.com/seuusuario/',
  },
  {
    type: 'x',
    label: 'X / Twitter',
    value: '@seuusuario',
    url: 'https://x.com/seuusuario',
  },
  {
    type: 'portfolio',
    label: 'Portfolio',
    value: 'seuportfolio.com',
    url: 'https://seuportfolio.com',
  },
]

function App() {
  const [builderFlowMode] = useState<'free' | 'guided'>('free')
  const [setupComplete, setSetupComplete] = useState(false)
  const [step, setStep] = useState<BuilderStep>('identity')
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(0)
  const [showStepError, setShowStepError] = useState(false)
  const [siteMode, setSiteMode] = useState(false)
  const [template, setTemplate] = useState<DevTemplate>('desktop')
  const [accentColor, setAccentColor] = useState('#2563eb')
  const [templateBackgrounds, setTemplateBackgrounds] = useState<Record<DevTemplate, string>>(defaultTemplateBackgrounds)
  const [desktopAreaColors, setDesktopAreaColors] = useState<Record<DesktopColorTarget, string>>(defaultDesktopAreaColors)
  const [name, setName] = useState('Wendell Ramos')
  const [role, setRole] = useState('Desenvolvedor de Sistemas')
  const [location, setLocation] = useState('Presidente Prudente - SP')
  const [headline, setHeadline] = useState('Crio sistemas web, automacoes e produtos digitais com foco em problema real.')
  const [bio, setBio] = useState(
    'Estudante de Sistemas de Informacao e desenvolvedor focado em sistemas web, automacoes, dashboards e solucoes praticas para organizar processos reais.',
  )
  const [profilePhoto, setProfilePhoto] = useState('')
  const [profilePhotoError, setProfilePhotoError] = useState('')
  const [projectImageErrors, setProjectImageErrors] = useState<Record<string, string>>({})
  const [experiences, setExperiences] = useState<DevExperience[]>([
    {
      id: crypto.randomUUID(),
      company: 'Projetos independentes',
      city: 'Presidente Prudente - SP',
      role: 'Desenvolvedor de Sistemas',
      activities: 'Desenvolvimento de sistemas web, automacoes, dashboards e solucoes digitais para processos reais, da interface ao banco de dados e publicacao.',
      startDate: '2024-01',
      endDate: '',
      current: true,
    },
  ])

  function handleProfilePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setProfilePhotoError('Escolha uma imagem JPG, PNG ou WebP.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfilePhotoError('A imagem deve ter no maximo 5 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfilePhoto(reader.result)
        setProfilePhotoError('')
      }
    }
    reader.onerror = () => setProfilePhotoError('Nao foi possivel carregar essa imagem.')
    reader.readAsDataURL(file)
  }

  function addExperience() {
    setExperiences((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        company: '',
        city: '',
        role: '',
        activities: '',
        startDate: '',
        endDate: '',
        current: false,
      },
    ])
  }

  function updateExperience<K extends keyof Omit<DevExperience, 'id'>>(
    experienceId: string,
    field: K,
    value: DevExperience[K],
  ) {
    setExperiences((current) => current.map((item) => (
      item.id === experienceId
        ? { ...item, [field]: value, ...(field === 'current' && value ? { endDate: '' } : {}) }
        : item
    )))
  }

  function removeExperience(experienceId: string) {
    setExperiences((current) => current.filter((item) => item.id !== experienceId))
  }

  function moveExperience(experienceId: string, direction: -1 | 1) {
    setExperiences((current) => moveById(current, experienceId, direction))
  }
  const [stackText, setStackText] = useState('React\nTypeScript\nASP.NET MVC\nC#\nPostgreSQL\nCloudflare')
  const [sections, setSections] = useState<PortfolioSection[]>([
    { id: 'about', ...defaultSections.about, enabled: true, locked: true },
    { id: 'stack', ...defaultSections.stack, enabled: true, locked: true },
    { id: 'projects', ...defaultSections.projects, enabled: true, locked: true },
    { id: 'contact', ...defaultSections.contact, enabled: true, locked: true },
  ])
  const [customSectionTitle, setCustomSectionTitle] = useState('')
  const [customSectionDescription, setCustomSectionDescription] = useState('')
  const [customSectionIcon, setCustomSectionIcon] = useState<SectionIcon>('document')
  const [projects, setProjects] = useState<DevProject[]>([
    {
      id: crypto.randomUUID(),
      title: 'FinControl',
      description: 'Controle financeiro pessoal com dashboard, receitas, despesas, metas, categorias e arquitetura publicada na Cloudflare.',
      imageUrl: '',
      imageName: '',
      liveUrl: 'https://fincontrol-2os.pages.dev/',
      repoUrl: 'https://github.com/wendell-ramos',
      techs: 'Cloudflare, D1, SQL',
    },
    {
      id: crypto.randomUUID(),
      title: 'Pericia Contabil',
      description: 'Sistema web em ASP.NET MVC para gestao de atividades de pericia contabil, usuarios, permissoes e banco PostgreSQL.',
      imageUrl: '',
      imageName: '',
      liveUrl: '',
      repoUrl: 'https://github.com/wendell-ramos',
      techs: 'C#, ASP.NET MVC, PostgreSQL',
    },
    {
      id: crypto.randomUUID(),
      title: 'Edvaldo Films',
      description: 'Portfolio audiovisual responsivo para filmmaker, com trabalhos, processo, contato, dominio proprio e foco em video.',
      imageUrl: 'https://wendell-ramos.github.io/portfolio-wendell-ramos/assets/projeto-edvaldo-films.png',
      imageName: 'projeto-edvaldo-films.png',
      liveUrl: 'https://edvaldofilms.com.br/',
      repoUrl: '',
      techs: 'React, Vite, Cloudflare',
    },
    {
      id: crypto.randomUUID(),
      title: 'Portfolio Retro',
      description: 'Portfolio pessoal em formato de desktop retro, com janelas, atalhos, curriculo, eventos, projetos e contato.',
      imageUrl: '',
      imageName: '',
      liveUrl: 'https://wendell-ramos.github.io/portfolio-wendell-ramos/',
      repoUrl: 'https://github.com/wendell-ramos/portfolio-wendell-ramos',
      techs: 'HTML, CSS, JavaScript, GitHub Pages',
    },
  ])
  const [contacts, setContacts] = useState<ContactLink[]>([
    {
      id: crypto.randomUUID(),
      type: 'email',
      label: 'E-mail',
      value: 'wendellnascimentoramos@gmail.com',
      url: 'mailto:wendellnascimentoramos@gmail.com',
    },
    {
      id: crypto.randomUUID(),
      type: 'github',
      label: 'GitHub',
      value: 'github.com/wendell-ramos',
      url: 'https://github.com/wendell-ramos',
    },
    {
      id: crypto.randomUUID(),
      type: 'linkedin',
      label: 'LinkedIn',
      value: 'linkedin.com/in/wendellramos10',
      url: 'https://www.linkedin.com/in/wendellramos10/',
    },
    {
      id: crypto.randomUUID(),
      type: 'portfolio',
      label: 'Portfolio',
      value: 'wendell-ramos.github.io/portfolio-wendell-ramos',
      url: 'https://wendell-ramos.github.io/portfolio-wendell-ramos/',
    },
  ])

  const stack = useMemo(
    () =>
      stackText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    [stackText],
  )

  const enabledSections = sections.filter((section) => section.enabled)
  const currentIndex = steps.findIndex((item) => item.id === step)
  const projectsRequired = enabledSections.some((section) => section.id === 'projects')
  const contactsRequired = enabledSections.some((section) => section.id === 'contact')
  const identityComplete = Boolean(name.trim() && role.trim() && headline.trim() && bio.trim())
  const projectsComplete = !projectsRequired || (
    projects.length > 0
    && projects.every((project) => (
      project.title.trim()
      && project.description.trim()
      && (project.liveUrl.trim() || project.repoUrl.trim())
    ))
  )
  const contactsComplete = !contactsRequired || (
    contacts.length > 0
    && contacts.every((contact) => contact.value.trim() && contact.url.trim())
  )
  const stepCompletion: Record<BuilderStep, boolean> = {
    identity: identityComplete,
    style: true,
    sections: enabledSections.length > 0,
    projects: projectsComplete,
    contact: contactsComplete,
    preview: true,
  }
  const stepErrorMessages: Record<BuilderStep, string> = {
    identity: 'Preencha nome, cargo, chamada principal e resumo para continuar.',
    style: 'Escolha o estilo do portfolio para continuar.',
    sections: 'Mantenha ao menos uma secao ativa para continuar.',
    projects: 'Preencha titulo, descricao e pelo menos um link em cada projeto.',
    contact: 'Preencha o identificador e o link de cada contato adicionado.',
    preview: '',
  }

  function goNext() {
    if (builderFlowMode === 'guided' && !stepCompletion[step]) {
      setShowStepError(true)
      return
    }

    const nextIndex = Math.min(currentIndex + 1, steps.length - 1)
    setMaxUnlockedStep((current) => Math.max(current, nextIndex))
    setShowStepError(false)
    setStep(steps[nextIndex].id)
  }

  function goBack() {
    setShowStepError(false)
    setStep(steps[Math.max(currentIndex - 1, 0)].id)
  }

  function openUnlockedStep(nextStep: BuilderStep, index: number) {
    if (builderFlowMode === 'guided' && index > maxUnlockedStep) return
    setShowStepError(false)
    setStep(nextStep)
  }

  function toggleSection(sectionId: string) {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId ? { ...section, enabled: !section.enabled } : section,
      ),
    )
  }

  function addCustomSection() {
    if (!customSectionTitle.trim()) {
      return
    }

    setSections((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title: customSectionTitle.trim(),
        description: customSectionDescription.trim(),
        icon: customSectionIcon,
        enabled: true,
      },
    ])
    setCustomSectionTitle('')
    setCustomSectionDescription('')
    setCustomSectionIcon('document')
  }

  function removeSection(sectionId: string) {
    setSections((current) => current.filter((section) => section.id !== sectionId || section.locked))
  }

  function addPresetSection(section: Omit<PortfolioSection, 'id' | 'enabled'>) {
    setSections((current) => [
      ...current,
      {
        ...section,
        id: crypto.randomUUID(),
        enabled: true,
      },
    ])
  }

  function moveSection(sectionId: string, direction: -1 | 1) {
    setSections((current) => moveById(current, sectionId, direction))
  }

  function updateSectionIcon(sectionId: string, icon: SectionIcon) {
    setSections((current) =>
      current.map((section) => (section.id === sectionId ? { ...section, icon } : section)),
    )
  }

  function updateSectionColor(sectionId: string, backgroundColor: string) {
    setSections((current) => current.map((section) => (
      section.id === sectionId ? { ...section, backgroundColor } : section
    )))
  }

  function updateProject(projectId: string, field: keyof DevProject, value: string) {
    setProjects((current) =>
      current.map((project) => (project.id === projectId ? { ...project, [field]: value } : project)),
    )
  }

  function handleProjectImage(projectId: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setProjectImageErrors((current) => ({ ...current, [projectId]: 'Escolha uma imagem JPG, PNG ou WebP.' }))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setProjectImageErrors((current) => ({ ...current, [projectId]: 'A imagem deve ter no maximo 5 MB.' }))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return

      setProjects((current) => current.map((project) => (
        project.id === projectId
          ? { ...project, imageUrl: reader.result as string, imageName: file.name }
          : project
      )))
      setProjectImageErrors((current) => ({ ...current, [projectId]: '' }))
    }
    reader.onerror = () => setProjectImageErrors((current) => ({
      ...current,
      [projectId]: 'Nao foi possivel carregar essa imagem.',
    }))
    reader.readAsDataURL(file)
  }

  function removeProjectImage(projectId: string) {
    setProjects((current) => current.map((project) => (
      project.id === projectId ? { ...project, imageUrl: '', imageName: '' } : project
    )))
    setProjectImageErrors((current) => ({ ...current, [projectId]: '' }))
  }

  function addProject() {
    setProjects((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title: '',
        description: '',
        imageUrl: '',
        imageName: '',
        liveUrl: '',
        repoUrl: '',
        techs: '',
      },
    ])
  }

  function removeProject(projectId: string) {
    setProjects((current) => current.filter((project) => project.id !== projectId))
    setProjectImageErrors((current) => {
      const next = { ...current }
      delete next[projectId]
      return next
    })
  }

  function moveProject(projectId: string, direction: -1 | 1) {
    setProjects((current) => moveById(current, projectId, direction))
  }

  function updateContact(contactId: string, field: keyof ContactLink, value: string) {
    setContacts((current) =>
      current.map((contact) => (contact.id === contactId ? { ...contact, [field]: value } : contact)),
    )
  }

  function updateContactType(contactId: string, type: ContactType) {
    const selectedContact = contactPresets.find((contact) => contact.type === type)
    if (!selectedContact) return

    setContacts((current) =>
      current.map((contact) => (
        contact.id === contactId
          ? { ...contact, type: selectedContact.type, label: selectedContact.label, value: '', url: '' }
          : contact
      )),
    )
  }

  function addPresetContact(preset: Omit<ContactLink, 'id'>) {
    setContacts((current) => [
      ...current,
      {
        ...preset,
        id: crypto.randomUUID(),
        value: '',
        url: '',
      },
    ])
  }

  function removeContact(contactId: string) {
    setContacts((current) => current.filter((contact) => contact.id !== contactId))
  }

  function startEmptyPortfolio() {
    setStep('identity')
    setMaxUnlockedStep(0)
    setShowStepError(false)
    setSiteMode(false)
    setTemplate('desktop')
    setAccentColor('#2563eb')
    setTemplateBackgrounds(defaultTemplateBackgrounds)
    setDesktopAreaColors(defaultDesktopAreaColors)
    setName('')
    setRole('')
    setLocation('')
    setHeadline('')
    setBio('')
    setProfilePhoto('')
    setProfilePhotoError('')
    setProjectImageErrors({})
    setExperiences([])
    setStackText('')
    setSections([
      { id: 'about', ...defaultSections.about, enabled: true, locked: true },
      { id: 'stack', ...defaultSections.stack, enabled: true, locked: true },
      { id: 'projects', ...defaultSections.projects, enabled: true, locked: true },
      { id: 'contact', ...defaultSections.contact, enabled: true, locked: true },
    ])
    setCustomSectionTitle('')
    setCustomSectionDescription('')
    setCustomSectionIcon('document')
    setProjects([])
    setContacts([])
    setSetupComplete(true)
  }

  function startPresetPortfolio() {
    setStep('identity')
    setMaxUnlockedStep(0)
    setShowStepError(false)
    setSiteMode(false)
    setSetupComplete(true)
  }

  if (!setupComplete) {
    return (
      <ProjectStartScreen
        onEmpty={startEmptyPortfolio}
        onPreset={startPresetPortfolio}
      />
    )
  }

  if (siteMode) {
    return (
      <GeneratedDevSite
        accentColor={accentColor}
        backgroundColor={templateBackgrounds[template]}
        desktopAreaColors={desktopAreaColors}
        bio={bio}
        contacts={contacts}
        experiences={experiences}
        headline={headline}
        location={location}
        name={name}
        onBackgroundColorChange={(color) => setTemplateBackgrounds((current) => ({ ...current, desktop: color }))}
        onDesktopAreaColorChange={(target, color) => setDesktopAreaColors((current) => ({ ...current, [target]: color }))}
        onExit={() => setSiteMode(false)}
        profilePhoto={profilePhoto}
        projects={projects}
        role={role}
        sections={enabledSections}
        stack={stack}
        template={template}
      />
    )
  }

  return (
    <main className="flow-shell">
      <header className="flow-header">
        <div className="product-mark">
          <span>PF</span>
          <div>
            <strong>Portfy Dev</strong>
            <small>Gerador guiado de portfolio para desenvolvedores</small>
          </div>
        </div>
        {(builderFlowMode === 'free' || maxUnlockedStep >= steps.length - 1) && (
          <button className="ghost-button" onClick={() => openUnlockedStep('preview', steps.length - 1)} type="button">
            Visualizar portfolio
          </button>
        )}
      </header>

      {builderFlowMode === 'free' && (
        <nav className="stepper" aria-label="Etapas do gerador">
          {steps.map((item, index) => (
            <button
              className={item.id === step ? 'step-item is-active' : 'step-item'}
              key={item.id}
              onClick={() => openUnlockedStep(item.id, index)}
              type="button"
            >
              <span>{index + 1}</span>
              {item.label}
            </button>
          ))}
        </nav>
      )}

      <section className="flow-card">
        {step === 'identity' && (
          <StepBlock
            eyebrow="Etapa 1"
            title="Defina a identidade principal do portfolio."
            description="Essas informacoes formam o hero e a apresentacao inicial do portfolio dev."
          >
            <TextInput label="Nome" onChange={setName} placeholder="Ex.: Wendell Ramos" value={name} />
            <TextInput label="Cargo / assinatura" onChange={setRole} placeholder="Ex.: Desenvolvedor de Sistemas" value={role} />
            <TextInput label="Localizacao" onChange={setLocation} placeholder="Ex.: Presidente Prudente - SP" value={location} />
            <TextArea label="Chamada principal" onChange={setHeadline} placeholder="Resuma em uma frase o que voce cria e para quem." rows={3} value={headline} />
            <TextArea label="Resumo sobre voce" onChange={setBio} placeholder="Conte sua trajetoria, seus interesses e seu foco profissional." rows={5} value={bio} />
            <div className="profile-photo-field">
              <div className="profile-photo-copy">
                <strong>Foto para o Sobre mim</strong>
                <span>JPG, PNG ou WebP de ate 5 MB.</span>
              </div>
              <div className="profile-photo-control">
                <div className={profilePhoto ? 'profile-photo-preview has-photo' : 'profile-photo-preview'}>
                  {profilePhoto
                    ? <img alt={`Foto de ${name}`} src={profilePhoto} />
                    : <span aria-hidden="true">{name.trim().charAt(0).toUpperCase() || 'P'}</span>}
                </div>
                <div className="profile-photo-actions">
                  <label className="profile-photo-button">
                    {profilePhoto ? 'Trocar foto' : 'Adicionar foto'}
                    <input accept="image/jpeg,image/png,image/webp" onChange={handleProfilePhoto} type="file" />
                  </label>
                  {profilePhoto && (
                    <button onClick={() => { setProfilePhoto(''); setProfilePhotoError('') }} type="button">
                      Remover
                    </button>
                  )}
                </div>
              </div>
              {profilePhotoError && <p className="profile-photo-error" role="alert">{profilePhotoError}</p>}
            </div>
            <div className="experience-builder">
              <div className="experience-builder-header">
                <div>
                  <strong>Experiencias profissionais</strong>
                  <span>Cadastre cada experiencia separadamente para gerar uma trajetoria organizada.</span>
                </div>
                <button onClick={addExperience} type="button">Adicionar experiencia</button>
              </div>
              <div className="experience-list">
                {experiences.length === 0 && (
                  <div className="experience-empty">
                    <strong>Nenhuma experiencia cadastrada.</strong>
                    <span>Voce pode deixar esta parte vazia ou adicionar sua primeira experiencia.</span>
                  </div>
                )}
                {experiences.map((item, index) => (
                  <article className="experience-editor" key={item.id}>
                    <div className="experience-editor-title">
                      <div>
                        <span>Experiencia {index + 1}</span>
                        <strong>{item.role || item.company || 'Nova experiencia'}</strong>
                      </div>
                      <div className="experience-editor-actions">
                        <button disabled={index === 0} onClick={() => moveExperience(item.id, -1)} type="button" aria-label="Mover experiencia para cima">↑</button>
                        <button disabled={index === experiences.length - 1} onClick={() => moveExperience(item.id, 1)} type="button" aria-label="Mover experiencia para baixo">↓</button>
                        <button onClick={() => removeExperience(item.id)} type="button">Remover</button>
                      </div>
                    </div>
                    <div className="experience-fields">
                      <TextInput label="Empresa" onChange={(value) => updateExperience(item.id, 'company', value)} placeholder="Ex.: Empresa ou projeto independente" value={item.company} />
                      <TextInput label="Cidade" onChange={(value) => updateExperience(item.id, 'city', value)} placeholder="Ex.: Sao Paulo - SP ou Remoto" value={item.city} />
                      <TextInput label="Cargo" onChange={(value) => updateExperience(item.id, 'role', value)} placeholder="Ex.: Desenvolvedor Front-end" value={item.role} />
                      <TextArea label="Atividades realizadas" onChange={(value) => updateExperience(item.id, 'activities', value)} placeholder="Descreva responsabilidades, entregas e resultados." rows={4} value={item.activities} />
                      <label className="experience-date-field">
                        <span>Data de admissao</span>
                        <input onChange={(event) => updateExperience(item.id, 'startDate', event.target.value)} type="month" value={item.startDate} />
                      </label>
                      <label className="experience-current-field">
                        <input checked={item.current} onChange={(event) => updateExperience(item.id, 'current', event.target.checked)} type="checkbox" />
                        <span>Trabalho atual</span>
                      </label>
                      <label className="experience-date-field">
                        <span>Data de saida</span>
                        <input disabled={item.current} onChange={(event) => updateExperience(item.id, 'endDate', event.target.value)} type="month" value={item.endDate} />
                      </label>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <IdentityMiniPreview headline={headline} name={name} profilePhoto={profilePhoto} role={role} />
          </StepBlock>
        )}

        {step === 'style' && (
          <StepBlock
            eyebrow="Etapa 2"
            title="Escolha um estilo que combine com dev."
            description="Nesta fase nao misturamos areas. Filmmaker e designer vao ter estilos proprios depois."
          >
            <div className="template-grid">
              {devTemplates.map((item) => (
                <button
                  className={item.id === template ? 'template-card is-active' : 'template-card'}
                  key={item.id}
                  onClick={() => setTemplate(item.id)}
                  type="button"
                >
                  <TemplateMiniPreview accentColor={accentColor} template={item.id} />
                  <strong>{item.label}</strong>
                  <span>{item.description}</span>
                </button>
              ))}
            </div>

            <div className="color-row" aria-label="Cores de destaque">
              {accentOptions.map((color) => (
                <button
                  aria-label={`Usar cor ${color}`}
                  className={accentColor === color ? 'color-dot is-active' : 'color-dot'}
                  key={color}
                  onClick={() => setAccentColor(color)}
                  style={{ background: color }}
                  type="button"
                />
              ))}
            </div>
            <ColorMiniPreview accentColor={accentColor} template={template} />
            <div className="area-color-editor">
              <div className="area-color-copy">
                <strong>Fundo geral do site</strong>
                <span>Altera a area principal do estilo escolhido, como o papel de parede do Desktop.</span>
              </div>
              <div className="area-color-controls">
                <label className="native-color-picker">
                  <span style={{ backgroundColor: templateBackgrounds[template] }} />
                  Escolher cor
                  <input
                    aria-label="Escolher cor do fundo geral"
                    onChange={(event) => setTemplateBackgrounds((current) => ({
                      ...current,
                      [template]: event.target.value,
                    }))}
                    type="color"
                    value={templateBackgrounds[template]}
                  />
                </label>
                <div className="background-color-presets" aria-label="Cores sugeridas para o fundo">
                  {backgroundOptions.map((color) => (
                    <button
                      aria-label={`Usar fundo ${color}`}
                      className={templateBackgrounds[template] === color ? 'is-active' : ''}
                      key={color}
                      onClick={() => setTemplateBackgrounds((current) => ({ ...current, [template]: color }))}
                      style={{ backgroundColor: color }}
                      type="button"
                    />
                  ))}
                </div>
                <button
                  className="reset-color-button"
                  disabled={templateBackgrounds[template] === defaultTemplateBackgrounds[template]}
                  onClick={() => setTemplateBackgrounds((current) => ({
                    ...current,
                    [template]: defaultTemplateBackgrounds[template],
                  }))}
                  type="button"
                >
                  Restaurar padrao
                </button>
              </div>
              <div
                className={`area-color-preview mini-${template}`}
                style={{ backgroundColor: templateBackgrounds[template], color: getContrastColor(templateBackgrounds[template]) }}
              >
                <span>Fundo</span>
                <strong>{template === 'desktop' ? 'Area de trabalho' : template === 'terminal' ? 'Terminal' : 'Pagina'}</strong>
                <i style={{ backgroundColor: accentColor }} />
              </div>
            </div>
            {/*
              <div className="desktop-area-customizer">
                <div className="desktop-area-customizer-copy">
                  <strong>Personalizar partes do Desktop</strong>
                  <span>Clique em uma area da miniatura para escolher exatamente qual cor deseja alterar.</span>
                </div>
                <div className="desktop-area-map" aria-label="Partes personalizaveis do Desktop">
                  <div className="desktop-area-map-window">
                    <button
                      aria-pressed={selectedDesktopArea === 'titlebar'}
                      className={selectedDesktopArea === 'titlebar' ? 'desktop-area-map-titlebar is-selected' : 'desktop-area-map-titlebar'}
                      onClick={() => setSelectedDesktopArea('titlebar')}
                      style={{ backgroundColor: desktopAreaColors.titlebar, color: getContrastColor(desktopAreaColors.titlebar) }}
                      type="button"
                    >
                      <span>WR</span><strong>Bem-vindo ao meu portfolio</strong><i>_ [] X</i>
                    </button>
                    <button
                      aria-pressed={selectedDesktopArea === 'window'}
                      className={selectedDesktopArea === 'window' ? 'desktop-area-map-content is-selected' : 'desktop-area-map-content'}
                      onClick={() => setSelectedDesktopArea('window')}
                      style={{ backgroundColor: desktopAreaColors.window, color: getContrastColor(desktopAreaColors.window) }}
                      type="button"
                    >
                      <span>Conteudo da janela</span>
                      <i style={{ backgroundColor: accentColor }} />
                    </button>
                  </div>
                  <button
                    aria-pressed={selectedDesktopArea === 'taskbar'}
                    className={selectedDesktopArea === 'taskbar' ? 'desktop-area-map-taskbar is-selected' : 'desktop-area-map-taskbar'}
                    onClick={() => setSelectedDesktopArea('taskbar')}
                    style={{ backgroundColor: desktopAreaColors.taskbar, color: getContrastColor(desktopAreaColors.taskbar) }}
                    type="button"
                  >
                    <strong>WR iniciar</strong><span>Portfolio</span><i>12:30</i>
                  </button>
                </div>
                <div className="desktop-area-selection">
                  <span>Area selecionada</span>
                  <strong>{desktopColorTargets.find((item) => item.id === selectedDesktopArea)?.label}</strong>
                  <label className="native-color-picker">
                    <span style={{ backgroundColor: desktopAreaColors[selectedDesktopArea] }} />
                    Escolher cor
                    <input
                      aria-label={`Escolher cor da ${desktopColorTargets.find((item) => item.id === selectedDesktopArea)?.label}`}
                      onChange={(event) => setDesktopAreaColors((current) => ({ ...current, [selectedDesktopArea]: event.target.value }))}
                      type="color"
                      value={desktopAreaColors[selectedDesktopArea]}
                    />
                  </label>
                  <div className="background-color-presets" aria-label="Cores sugeridas para a area selecionada">
                    {desktopAreaColorOptions.map((color) => (
                      <button
                        aria-label={`Usar ${color} na ${desktopColorTargets.find((item) => item.id === selectedDesktopArea)?.label}`}
                        className={desktopAreaColors[selectedDesktopArea] === color ? 'is-active' : ''}
                        key={color}
                        onClick={() => setDesktopAreaColors((current) => ({ ...current, [selectedDesktopArea]: color }))}
                        style={{ backgroundColor: color }}
                        type="button"
                      />
                    ))}
                  </div>
                  <button
                    className="reset-color-button"
                    disabled={desktopAreaColors[selectedDesktopArea] === defaultDesktopAreaColors[selectedDesktopArea]}
                    onClick={() => setDesktopAreaColors((current) => ({
                      ...current,
                      [selectedDesktopArea]: defaultDesktopAreaColors[selectedDesktopArea],
                    }))}
                    type="button"
                  >
                    Restaurar esta area
                  </button>
                </div>
              </div>
            */}
          </StepBlock>
        )}

        {step === 'sections' && (
          <StepBlock
            eyebrow="Etapa 3"
            title="Monte as secoes do portfolio."
            description="A pessoa pode remover o que nao quiser e adicionar secoes proprias."
          >
            <div className="preset-section-grid">
              {sectionPresets.map((section) => (
                <button key={section.title} onClick={() => addPresetSection(section)} type="button">
                  <SectionIconGlyph icon={section.icon} />
                  <strong>{section.title}</strong>
                  <span>{section.description}</span>
                </button>
              ))}
            </div>

            <div className="section-manager">
              {sections.map((section, index) => (
                <article className={section.enabled ? 'managed-section is-active' : 'managed-section'} key={section.id}>
                  <div className="managed-section-summary">
                    <SectionIconGlyph icon={section.icon} />
                    <div>
                      <strong>{section.title}</strong>
                      <p>{section.description}</p>
                    </div>
                  </div>
                  <div className="section-actions">
                    <label className="section-icon-select">
                      <span>Icone</span>
                      <select
                        onChange={(event) => updateSectionIcon(section.id, event.target.value as SectionIcon)}
                        value={section.icon}
                      >
                        {sectionIconOptions.map((icon) => <option key={icon.id} value={icon.id}>{icon.label}</option>)}
                      </select>
                    </label>
                    <label className="section-color-control">
                      <span
                        className="section-color-swatch"
                        style={{ backgroundColor: section.backgroundColor || defaultSectionSurface(template) }}
                      />
                      <span>Cor</span>
                      <input
                        aria-label={`Escolher cor da secao ${section.title}`}
                        onChange={(event) => updateSectionColor(section.id, event.target.value)}
                        type="color"
                        value={section.backgroundColor || defaultSectionSurface(template)}
                      />
                    </label>
                    {section.backgroundColor && (
                      <button onClick={() => updateSectionColor(section.id, '')} type="button">Cor padrao</button>
                    )}
                    <button disabled={index === 0} onClick={() => moveSection(section.id, -1)} type="button">
                      Subir
                    </button>
                    <button disabled={index === sections.length - 1} onClick={() => moveSection(section.id, 1)} type="button">
                      Descer
                    </button>
                    <button onClick={() => toggleSection(section.id)} type="button">
                      {section.enabled ? 'Ativa' : 'Oculta'}
                    </button>
                    {!section.locked && (
                      <button onClick={() => removeSection(section.id)} type="button">
                        Remover
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="add-box">
              <TextInput label="Nome da nova secao" onChange={setCustomSectionTitle} placeholder="Ex.: Certificados" value={customSectionTitle} />
              <TextArea
                label="Descricao da nova secao"
                onChange={setCustomSectionDescription}
                placeholder="Explique que tipo de conteudo aparecera nesta secao."
                rows={3}
                value={customSectionDescription}
              />
              <div className="form-block">
                <label>Icone da secao</label>
                <div className="section-icon-picker" role="group" aria-label="Escolha o icone da nova secao">
                  {sectionIconOptions.map((icon) => (
                    <button
                      aria-label={icon.label}
                      aria-pressed={customSectionIcon === icon.id}
                      className={customSectionIcon === icon.id ? 'is-active' : ''}
                      key={icon.id}
                      onClick={() => setCustomSectionIcon(icon.id)}
                      type="button"
                    >
                      <SectionIconGlyph icon={icon.id} />
                      <span>{icon.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button className="primary-button" onClick={addCustomSection} type="button">
                Adicionar secao
              </button>
            </div>

            <TextArea label="Stack, uma tecnologia por linha" onChange={setStackText} placeholder={'React\nTypeScript\nPostgreSQL'} rows={6} value={stackText} />
            <SectionsMiniPreview sections={enabledSections} stack={stack} />
          </StepBlock>
        )}

        {step === 'projects' && (
          <StepBlock
            eyebrow="Etapa 4"
            title="Adicione projetos com links clicaveis."
            description="Cada projeto pode ter link publico, repositorio e tecnologias usadas."
          >
            <div className="item-list">
              {projects.map((project, index) => (
                <article className="editable-item" key={project.id}>
                  <div className="item-heading">
                    <strong>Projeto {index + 1}</strong>
                    <div className="inline-actions">
                      <button disabled={index === 0} onClick={() => moveProject(project.id, -1)} type="button">
                        Subir
                      </button>
                      <button disabled={index === projects.length - 1} onClick={() => moveProject(project.id, 1)} type="button">
                        Descer
                      </button>
                      <button onClick={() => removeProject(project.id)} type="button">
                        Remover
                      </button>
                    </div>
                  </div>
                  <TextInput
                    label="Nome do projeto"
                    onChange={(value) => updateProject(project.id, 'title', value)}
                    placeholder="Ex.: Sistema de reservas"
                    value={project.title}
                  />
                  <TextArea
                    label="Descricao"
                    onChange={(value) => updateProject(project.id, 'description', value)}
                    placeholder="Descreva o problema, a solucao e o resultado."
                    rows={3}
                    value={project.description}
                  />
                  <div className="project-image-field">
                    <div className="project-image-copy">
                      <strong>Imagem de capa</strong>
                      <span>Envie um arquivo JPG, PNG ou WebP de ate 5 MB.</span>
                    </div>
                    <div className="project-image-control">
                      <div className={project.imageUrl ? 'project-image-preview has-image' : 'project-image-preview'}>
                        {project.imageUrl
                          ? <img alt={`Capa do projeto ${project.title}`} src={project.imageUrl} />
                          : <span aria-hidden="true">Sem capa</span>}
                      </div>
                      <div className="project-image-actions">
                        <label className="project-image-button">
                          {project.imageUrl ? 'Trocar imagem' : 'Escolher imagem'}
                          <input
                            accept="image/jpeg,image/png,image/webp"
                            aria-label={`Selecionar capa do projeto ${project.title}`}
                            onChange={(event) => handleProjectImage(project.id, event)}
                            type="file"
                          />
                        </label>
                        {project.imageUrl && (
                          <button onClick={() => removeProjectImage(project.id)} type="button">Remover capa</button>
                        )}
                        {project.imageName && <small title={project.imageName}>{project.imageName}</small>}
                      </div>
                    </div>
                    {projectImageErrors[project.id] && (
                      <p className="project-image-error" role="alert">{projectImageErrors[project.id]}</p>
                    )}
                  </div>
                  <TextInput
                    label="Link publicado"
                    onChange={(value) => updateProject(project.id, 'liveUrl', value)}
                    placeholder="https://meu-projeto.com"
                    value={project.liveUrl}
                  />
                  <TextInput
                    label="Repositorio"
                    onChange={(value) => updateProject(project.id, 'repoUrl', value)}
                    placeholder="https://github.com/usuario/projeto"
                    value={project.repoUrl}
                  />
                  <TextInput
                    label="Tecnologias"
                    onChange={(value) => updateProject(project.id, 'techs', value)}
                    placeholder="React, TypeScript, PostgreSQL"
                    value={project.techs}
                  />
                </article>
              ))}
            </div>
            <button className="primary-button" onClick={addProject} type="button">
              Adicionar projeto
            </button>
            <ProjectsMiniPreview projects={projects} />
          </StepBlock>
        )}

        {step === 'contact' && (
          <StepBlock
            eyebrow="Etapa 5"
            title="Adicione links de contato."
            description="Escolha redes predefinidas com icones e edite texto/URL conforme precisar."
          >
            <div className="preset-contact-grid">
              {contactPresets.map((preset) => (
                <button
                  className={`preset-contact contact-${preset.type}`}
                  key={preset.type}
                  onClick={() => addPresetContact(preset)}
                  type="button"
                >
                  <ContactIcon type={preset.type} />
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="item-list">
              {contacts.map((contact) => (
                <article className="editable-item" key={contact.id}>
                  <div className="item-heading">
                    <strong className="contact-item-title">
                      <ContactIcon type={contact.type} />
                      {contact.label}
                    </strong>
                    <button onClick={() => removeContact(contact.id)} type="button">
                      Remover
                    </button>
                  </div>
                  <div className="form-block">
                    <label htmlFor={`contact-type-${contact.id}`}>Rede / tipo de contato</label>
                    <select
                      id={`contact-type-${contact.id}`}
                      onChange={(event) => updateContactType(contact.id, event.target.value as ContactType)}
                      value={contact.type}
                    >
                      {contactPresets.map((preset) => (
                        <option key={preset.type} value={preset.type}>{preset.label}</option>
                      ))}
                    </select>
                  </div>
                  <TextInput
                    label="Texto exibido"
                    onChange={(value) => updateContact(contact.id, 'value', value)}
                    placeholder={contactPresets.find((preset) => preset.type === contact.type)?.value}
                    value={contact.value}
                  />
                  <TextInput
                    label="URL"
                    onChange={(value) => updateContact(contact.id, 'url', value)}
                    placeholder={contactPresets.find((preset) => preset.type === contact.type)?.url}
                    value={contact.url}
                  />
                </article>
              ))}
            </div>
            <ContactsMiniPreview contacts={contacts} />
          </StepBlock>
        )}

        {step === 'preview' && (
          <StepBlock
            eyebrow="Etapa final"
            title="Seu site esta pronto para ser explorado."
            description="Abra a experiencia completa e explore o portfolio como um visitante veria depois da publicacao."
            wide
          >
            <PreviewSummary
              contacts={contacts.length}
              projects={projects.length}
              sections={enabledSections.length}
              stack={stack.length}
              template={devTemplates.find((item) => item.id === template)?.label ?? 'Dev'}
            />
            <div className="preview-edit-actions">
              <button onClick={() => setStep('identity')} type="button">Editar identidade</button>
              <button onClick={() => setStep('style')} type="button">Editar estilo</button>
              <button onClick={() => setStep('sections')} type="button">Editar secoes</button>
              <button onClick={() => setStep('projects')} type="button">Editar projetos</button>
              <button onClick={() => setStep('contact')} type="button">Editar contatos</button>
            </div>
            <div className="site-preview-toolbar">
              <div>
                <span>Site interativo</span>
                <strong>{name.toLowerCase().replaceAll(' ', '-')}.dev</strong>
                <p>Navegacao, atalhos e links funcionam na experiencia completa.</p>
              </div>
              <button className="primary-button" onClick={() => setSiteMode(true)} type="button">
                Abrir site gerado
              </button>
            </div>
          </StepBlock>
        )}

        {builderFlowMode === 'guided' && showStepError && !stepCompletion[step] && (
          <p className="step-validation-message" role="alert">{stepErrorMessages[step]}</p>
        )}

        <footer className="flow-actions">
          <button disabled={currentIndex === 0} onClick={goBack} type="button">
            Voltar
          </button>
          <button className="primary-button" disabled={currentIndex === steps.length - 1} onClick={goNext} type="button">
            Continuar
          </button>
        </footer>
      </section>
    </main>
  )
}

function ProjectStartScreen({ onEmpty, onPreset }: { onEmpty: () => void; onPreset: () => void }) {
  return (
    <main className="project-start-screen">
      <section className="project-start-panel">
        <div className="product-mark">
          <span>PF</span>
          <div>
            <strong>Portfy Dev</strong>
            <small>Novo portfolio</small>
          </div>
        </div>
        <div className="project-start-copy">
          <p className="eyebrow">Antes de comecar</p>
          <h1>Como voce quer iniciar?</h1>
          <p>Escolha dados prontos para explorar rapidamente ou preencha cada parte manualmente.</p>
        </div>
        <div className="project-start-options">
          <button className="project-start-option is-recommended" onClick={onPreset} type="button">
            <span>Recomendado para testar</span>
            <strong>Usar dados de exemplo</strong>
            <p>Abre o gerador com identidade, experiencia, stack, projetos, secoes e contatos ja preenchidos.</p>
            <i>Comecar com exemplos</i>
          </button>
          <button className="project-start-option" onClick={onEmpty} type="button">
            <span>Preenchimento completo</span>
            <strong>Comecar do zero</strong>
            <p>Inicia sem dados cadastrados para voce testar todo o fluxo manualmente.</p>
            <i>Comecar vazio</i>
          </button>
        </div>
      </section>
    </main>
  )
}

function moveById<T extends { id: string }>(items: T[], id: string, direction: -1 | 1) {
  const index = items.findIndex((item) => item.id === id)
  const nextIndex = index + direction

  if (index < 0 || nextIndex < 0 || nextIndex >= items.length) {
    return items
  }

  const next = [...items]
  const [item] = next.splice(index, 1)
  next.splice(nextIndex, 0, item)
  return next
}

function defaultSectionSurface(template: DevTemplate) {
  return template === 'docs' ? '#ffffff' : template === 'terminal' ? '#071426' : '#f8fafc'
}

function getContrastColor(color: string) {
  const normalized = color.replace('#', '')
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return '#111827'

  const red = Number.parseInt(normalized.slice(0, 2), 16)
  const green = Number.parseInt(normalized.slice(2, 4), 16)
  const blue = Number.parseInt(normalized.slice(4, 6), 16)
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000

  return luminance > 150 ? '#111827' : '#f8fafc'
}

function sectionColorStyle(section: PortfolioSection): CSSProperties | undefined {
  if (!section.backgroundColor) return undefined

  return {
    backgroundColor: section.backgroundColor,
    color: getContrastColor(section.backgroundColor),
    '--section-foreground': getContrastColor(section.backgroundColor),
  } as CSSProperties
}

function formatExperiencePeriod(experience: DevExperience) {
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  const formatMonth = (value: string) => {
    const [year, month] = value.split('-')
    return year && month ? `${months[Number(month) - 1]} ${year}` : ''
  }
  const start = formatMonth(experience.startDate) || 'Inicio nao informado'
  const end = experience.current ? 'Atual' : formatMonth(experience.endDate) || 'Saida nao informada'
  return `${start} - ${end}`
}

function IdentityMiniPreview({
  headline,
  name,
  profilePhoto,
  role,
}: {
  headline: string
  name: string
  profilePhoto: string
  role: string
}) {
  return (
    <aside className="mini-preview identity-preview">
      <span>Previa do hero</span>
      <div className="identity-preview-profile">
        {profilePhoto && <img alt={`Foto de ${name}`} src={profilePhoto} />}
        <div>
          <strong>{name}</strong>
          <p>{role}</p>
        </div>
      </div>
      <h2>{headline}</h2>
    </aside>
  )
}

function TemplateMiniPreview({
  accentColor,
  template,
}: {
  accentColor: string
  template: DevTemplate
}) {
  return (
    <div className={`template-mini mini-${template}`} style={{ '--custom-accent': accentColor } as CSSProperties}>
      {template === 'desktop' && (
        <>
          <i />
          <b />
        </>
      )}
      {template === 'terminal' && (
        <>
          <span>$ whoami</span>
          <span>$ ls projetos</span>
        </>
      )}
      {template === 'docs' && (
        <>
          <em />
          <em />
          <em />
        </>
      )}
    </div>
  )
}

function ColorMiniPreview({
  accentColor,
  template,
}: {
  accentColor: string
  template: DevTemplate
}) {
  return (
    <aside className="mini-preview color-preview" style={{ '--custom-accent': accentColor } as CSSProperties}>
      <span>Cor aplicada no estilo</span>
      <div className={`color-preview-surface mini-${template}`}>
        <strong>Portfolio Dev</strong>
        <p>Links, botoes, detalhes e destaques usam a cor escolhida.</p>
        <button type="button">Ver projeto</button>
      </div>
    </aside>
  )
}

function SectionsMiniPreview({
  sections,
  stack,
}: {
  sections: PortfolioSection[]
  stack: string[]
}) {
  return (
    <aside className="mini-preview">
      <span>Como as secoes vao aparecer</span>
      <div className="section-preview-list">
        {sections.map((section) => (
          <div
            key={section.id}
            style={section.backgroundColor ? {
              backgroundColor: section.backgroundColor,
              color: getContrastColor(section.backgroundColor),
            } : undefined}
          >
            <SectionIconGlyph icon={section.icon} />
            <span>
              <strong>{section.title}</strong>
              <small>{section.description}</small>
            </span>
          </div>
        ))}
      </div>
      <div className="mini-stack">
        {stack.slice(0, 5).map((item) => (
          <b key={item}>{item}</b>
        ))}
      </div>
    </aside>
  )
}

function ProjectsMiniPreview({ projects }: { projects: DevProject[] }) {
  return (
    <aside className="mini-preview">
      <span>Previa dos cards de projeto</span>
      <div className="project-mini-grid">
        {projects.slice(0, 3).map((project) => (
          <div key={project.id}>
            {project.imageUrl && <img alt="" className="project-mini-cover" src={project.imageUrl} />}
            <strong>{project.title}</strong>
            <p>{project.description}</p>
            <small>{project.liveUrl ? 'Online' : 'Sem link publico'} / {project.repoUrl ? 'Repo' : 'Sem repo'}</small>
          </div>
        ))}
      </div>
    </aside>
  )
}

function ContactsMiniPreview({ contacts }: { contacts: ContactLink[] }) {
  return (
    <aside className="mini-preview">
      <span>Previa dos links de contato</span>
      <div className="contact-mini-list">
        {contacts.map((contact) => (
          <a className={`contact-link contact-${contact.type}`} href={contact.url} key={contact.id}>
            <ContactIcon type={contact.type} />
            <span>
              <small>{contact.label}</small>
              {contact.value}
            </span>
          </a>
        ))}
      </div>
    </aside>
  )
}

function ContactIcon({ type }: { type: ContactType }) {
  return (
    <b className={`contact-icon contact-${type}`} aria-hidden="true">
      {type === 'email' && (
        <svg viewBox="0 0 24 24">
          <path d="M4 6h16v12H4z" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      )}
      {type === 'github' && (
        <svg viewBox="0 0 24 24">
          <path d="M12 2.8a9.2 9.2 0 0 0-2.9 17.9c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 2.9.8.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.6s.9-.3 2.8 1a9.7 9.7 0 0 1 5.2 0c1.9-1.3 2.8-1 2.8-1 .5 1.3.2 2.3.1 2.6a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7 1 .7 2v2.5c0 .3.2.6.7.5A9.2 9.2 0 0 0 12 2.8Z" />
        </svg>
      )}
      {type === 'linkedin' && (
        <svg viewBox="0 0 24 24">
          <path d="M5.2 9.1h3.1v9.7H5.2zM6.8 5.2a1.8 1.8 0 1 1 0 3.5 1.8 1.8 0 0 1 0-3.5ZM10.4 9.1h3v1.3c.4-.8 1.5-1.6 3-1.6 3.2 0 3.8 2.1 3.8 4.8v5.2h-3.1v-4.6c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4v4.7h-3.1V9.1Z" />
        </svg>
      )}
      {type === 'whatsapp' && (
        <svg viewBox="0 0 24 24">
          <path d="M12 3.4a8.4 8.4 0 0 0-7.1 12.9L4 20.6l4.4-1A8.4 8.4 0 1 0 12 3.4Z" />
          <path d="M9.3 8.2c-.2-.4-.4-.4-.7-.4h-.5c-.2 0-.5.1-.8.4-.3.4-1 1-1 2.3s1 2.7 1.1 2.9c.1.2 2 3.2 4.9 4.3 2.4.9 2.9.7 3.4.7.5 0 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4s-.2-.2-.5-.4l-1.8-.9c-.3-.1-.5-.2-.7.2l-.7.9c-.1.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5Z" />
        </svg>
      )}
      {type === 'instagram' && (
        <svg viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" rx="5" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="16.8" cy="7.2" r=".8" />
        </svg>
      )}
      {type === 'x' && (
        <svg viewBox="0 0 24 24">
          <path d="M4.5 4.5h4.2l4.1 5.6 4.9-5.6h1.9l-5.9 6.8 6.1 8.2h-4.2l-4.5-6.1-5.4 6.1H3.8l6.4-7.3Z" />
        </svg>
      )}
      {type === 'portfolio' && (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.8 12h16.4M12 3.5c2 2.2 3.1 5 3.1 8.5S14 18.3 12 20.5c-2-2.2-3.1-5-3.1-8.5S10 5.7 12 3.5Z" />
        </svg>
      )}
    </b>
  )
}

function StepBlock({
  children,
  description,
  eyebrow,
  title,
  wide = false,
}: {
  children: ReactNode
  description: string
  eyebrow: string
  title: string
  wide?: boolean
}) {
  return (
    <div className={wide ? 'step-block is-wide' : 'step-block'}>
      <div className="step-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="step-content">{children}</div>
    </div>
  )
}

function PreviewSummary({
  contacts,
  projects,
  sections,
  stack,
  template,
}: {
  contacts: number
  projects: number
  sections: number
  stack: number
  template: string
}) {
  return (
    <aside className="preview-summary">
      <div>
        <span>Template</span>
        <strong>{template}</strong>
      </div>
      <div>
        <span>Secoes</span>
        <strong>{sections}</strong>
      </div>
      <div>
        <span>Projetos</span>
        <strong>{projects}</strong>
      </div>
      <div>
        <span>Stack</span>
        <strong>{stack}</strong>
      </div>
      <div>
        <span>Contatos</span>
        <strong>{contacts}</strong>
      </div>
    </aside>
  )
}

function TextInput({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string
  onChange: (value: string) => void
  placeholder?: string
  value: string
}) {
  return (
    <div className="form-block">
      <label>{label}</label>
      <input onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value} />
    </div>
  )
}

function TextArea({
  label,
  onChange,
  placeholder,
  rows,
  value,
}: {
  label: string
  onChange: (value: string) => void
  placeholder?: string
  rows: number
  value: string
}) {
  return (
    <div className="form-block">
      <label>{label}</label>
      <textarea onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={rows} value={value} />
    </div>
  )
}

function GeneratedDevSite({
  onBackgroundColorChange,
  onDesktopAreaColorChange,
  onExit,
  ...props
}: PortfolioPreviewProps & {
  onBackgroundColorChange: (color: string) => void
  onDesktopAreaColorChange: (target: DesktopColorTarget, color: string) => void
  onExit: () => void
}) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className={`generated-site-mode generated-site-${props.template}`}>
      <button aria-label="Voltar ao editor" className="return-editor-button" onClick={onExit} type="button">
        <span aria-hidden="true">←</span>
        <span className="return-editor-label">Voltar ao editor</span>
      </button>
      {props.template === 'desktop' ? (
        <DesktopGeneratedSite
          {...props}
          onBackgroundColorChange={onBackgroundColorChange}
          onDesktopAreaColorChange={onDesktopAreaColorChange}
        />
      ) : props.template === 'terminal' ? (
        <TerminalGeneratedSite {...props} />
      ) : props.template === 'docs' ? (
        <DocsGeneratedSite {...props} />
      ) : <DevPortfolioPreview {...props} standalone />}
    </main>
  )
}

function DesktopGeneratedSite({
  accentColor,
  backgroundColor,
  desktopAreaColors,
  bio,
  contacts,
  experiences,
  headline,
  location,
  name,
  profilePhoto,
  projects,
  role,
  sections,
  stack,
  onBackgroundColorChange,
  onDesktopAreaColorChange,
}: PortfolioPreviewProps & {
  onBackgroundColorChange: (color: string) => void
  onDesktopAreaColorChange: (target: DesktopColorTarget, color: string) => void
}) {
  const [activeSection, setActiveSection] = useState('home')
  const [windowOpen, setWindowOpen] = useState(true)
  const [maximized, setMaximized] = useState(false)
  const [booting, setBooting] = useState(true)
  const [editingColors, setEditingColors] = useState(false)
  const [selectedColorTarget, setSelectedColorTarget] = useState<DesktopEditableTarget>('titlebar')
  const style = {
    '--custom-accent': accentColor,
    '--site-background': backgroundColor,
    '--site-foreground': getContrastColor(backgroundColor),
    '--desktop-titlebar': desktopAreaColors.titlebar,
    '--desktop-titlebar-foreground': getContrastColor(desktopAreaColors.titlebar),
    '--desktop-menu': desktopAreaColors.menu,
    '--desktop-menu-foreground': getContrastColor(desktopAreaColors.menu),
    '--desktop-window-surface': desktopAreaColors.window,
    '--desktop-window-foreground': getContrastColor(desktopAreaColors.window),
    '--section-foreground': getContrastColor(desktopAreaColors.window),
    '--desktop-statusbar': desktopAreaColors.statusbar,
    '--desktop-statusbar-foreground': getContrastColor(desktopAreaColors.statusbar),
    '--desktop-taskbar': desktopAreaColors.taskbar,
    '--desktop-taskbar-foreground': getContrastColor(desktopAreaColors.taskbar),
  } as CSSProperties
  const selectedColor = selectedColorTarget === 'background' ? backgroundColor : desktopAreaColors[selectedColorTarget]
  const selectedColorLabel = desktopColorTargets.find((item) => item.id === selectedColorTarget)?.label ?? 'Area'
  const selectedDefaultColor = selectedColorTarget === 'background'
    ? defaultTemplateBackgrounds.desktop
    : defaultDesktopAreaColors[selectedColorTarget]
  const activeDefinition = sections.find((section) => section.id === activeSection)
  const visibleProjects = projects.filter((project) => project.title.trim())
  const visibleContacts = contacts.filter((contact) => contact.value.trim() && contact.url.trim())
  const terminalUser = name.trim().toLowerCase().replaceAll(' ', '-') || 'dev'
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
  const displayInitials = initials || 'PF'

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), 1100)
    return () => window.clearTimeout(timer)
  }, [])

  function openSection(sectionId: string) {
    setActiveSection(sectionId)
    setWindowOpen(true)
    setMaximized(false)
  }

  function selectColorArea(event: ReactMouseEvent, target: DesktopEditableTarget) {
    if (!editingColors) return
    event.preventDefault()
    event.stopPropagation()
    setSelectedColorTarget(target)
  }

  function changeSelectedColor(color: string) {
    if (selectedColorTarget === 'background') {
      onBackgroundColorChange(color)
      return
    }
    onDesktopAreaColorChange(selectedColorTarget, color)
  }

  function colorAreaClass(target: DesktopEditableTarget) {
    if (!editingColors) return ''
    return selectedColorTarget === target ? 'is-color-selectable is-color-selected' : 'is-color-selectable'
  }

  function renderWindowContent(): ReactNode {
    if (activeSection === 'home') {
      return (
        <div className={bio || stack.length ? 'desktop-home-layout' : 'desktop-home-layout is-single'}>
          <div className="desktop-home-content">
            <p className="desktop-window-kicker">Ola, mundo.</p>
            <h1>
              {name ? <>Eu sou <strong>{name}</strong>{role ? `, ${role.toLowerCase()}.` : '.'}</> : role || 'Portfolio em construcao.'}
            </h1>
            {headline && <p>{headline}</p>}
            {location && <span className="desktop-location">{location}</span>}
            <div className="desktop-window-actions">
              {sections.some((section) => section.id === 'projects') && (
                <button onClick={() => openSection('projects')} type="button">Explorar projetos</button>
              )}
              {sections.some((section) => section.id === 'about') && (
                <button onClick={() => openSection('about')} type="button">Sobre mim</button>
              )}
              {sections.some((section) => section.id === 'contact') && (
                <button onClick={() => openSection('contact')} type="button">Falar comigo</button>
              )}
            </div>
          </div>
          {(bio || stack.length > 0) && (
            <aside className="desktop-terminal-card" aria-label="Terminal com apresentacao">
              <div><span /><span /><span /></div>
              {bio && <><p><strong>{terminalUser}@portfolio:~$</strong> whoami</p><p>{bio}</p></>}
              {stack.length > 0 && <><p><strong>{terminalUser}@portfolio:~$</strong> stack --top</p><p>{stack.slice(0, 4).join(' / ')}</p></>}
              <p><strong>{terminalUser}@portfolio:~$</strong> <i /></p>
            </aside>
          )}
        </div>
      )
    }

    if (activeSection === 'about') {
      return (
        <div className="desktop-copy-content desktop-about-content">
          <div className={profilePhoto ? 'desktop-profile-badge has-photo' : 'desktop-profile-badge'}>
            {profilePhoto ? <img alt={`Foto de ${name || 'perfil'}`} src={profilePhoto} /> : displayInitials}
          </div>
          <div className="desktop-about-copy">
            <p className="desktop-window-kicker">Perfil profissional</p>
            <h2>{name ? `Sobre ${name}` : 'Sobre mim'}</h2>
            {bio && <p>{bio}</p>}
            {(role || location) && <span className="desktop-location">{[role, location].filter(Boolean).join(' / ')}</span>}
            <div className="desktop-about-experience">
              <small>Experiencia profissional</small>
              <div className="desktop-experience-list">
                {experiences.length === 0 && <p>Nenhuma experiencia profissional informada.</p>}
                {experiences.map((item) => (
                  <article key={item.id}>
                    <div><strong>{item.role || 'Cargo nao informado'}</strong><span>{formatExperiencePeriod(item)}</span></div>
                    <small>{item.company || 'Empresa nao informada'}{item.city ? ` / ${item.city}` : ''}</small>
                    {item.activities && <p>{item.activities}</p>}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (activeSection === 'stack') {
      return (
        <div className="desktop-copy-content">
          <p className="desktop-window-kicker">Ferramentas e tecnologias</p>
          <h2>Habilidades</h2>
          {stack.length === 0 && <DesktopEmptyState message="Nenhuma tecnologia adicionada." />}
          <div className="desktop-stack-list">
            {stack.map((item, index) => (
              <span key={item}><small>{String(index + 1).padStart(2, '0')}</small>{item}</span>
            ))}
          </div>
        </div>
      )
    }

    if (activeSection === 'projects') {
      return (
        <div className="desktop-project-explorer">
          <div className="desktop-project-list">
            {visibleProjects.length === 0 && <DesktopEmptyState message="Nenhum projeto publicado." />}
            {visibleProjects.map((project, index) => (
              <article key={project.id}>
                <div className={project.imageUrl ? 'desktop-project-cover has-image' : 'desktop-project-cover'}>
                  {project.imageUrl ? (
                    <>
                      <img
                        alt={`Capa do projeto ${project.title}`}
                        onError={(event) => { event.currentTarget.hidden = true }}
                        src={project.imageUrl}
                      />
                      <div className="desktop-project-cover-caption"><span>PROJETO</span><strong>{project.title}</strong></div>
                    </>
                  ) : (
                    <div><span>PROJETO</span><strong>{project.title}</strong></div>
                  )}
                  <small>{String(index + 1).padStart(2, '0')}</small>
                </div>
                <div className="desktop-project-card-content">
                  <p className="desktop-window-kicker">Projeto selecionado</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="desktop-project-techs">
                    {project.techs.split(',').map((tech) => tech.trim()).filter(Boolean).map((tech) => <span key={tech}>{tech}</span>)}
                  </div>
                  <div className="desktop-project-links">
                    {project.liveUrl && <a href={project.liveUrl} rel="noreferrer" target="_blank">Visitar projeto</a>}
                    {project.repoUrl && <a href={project.repoUrl} rel="noreferrer" target="_blank">Repositorio</a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )
    }

    if (activeSection === 'contact') {
      return (
        <div className="desktop-copy-content">
          <p className="desktop-window-kicker">Canais disponiveis</p>
          <h2>Vamos construir algo funcional?</h2>
          {visibleContacts.length === 0 && <DesktopEmptyState message="Nenhum canal de contato publicado." />}
          <div className="desktop-contact-list">
            {visibleContacts.map((contact) => (
              <a className={`contact-${contact.type}`} href={contact.url} key={contact.id} rel="noreferrer" target="_blank">
                <ContactIcon type={contact.type} />
                <span><small>{contact.label}</small>{contact.value}</span>
              </a>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="desktop-copy-content">
        <p className="desktop-window-kicker">Secao personalizada</p>
        <h2>{activeDefinition?.title}</h2>
        <p>{activeDefinition?.description}</p>
      </div>
    )
  }

  const desktopItems = [
    { id: 'home', title: 'Bem-vindo', icon: 'home' as SectionIcon },
    ...sections.map(({ icon, id, title }) => ({
      id,
      icon,
      title: id === 'about' ? 'Sobre mim' : id === 'projects' ? 'Meus projetos' : id === 'stack' ? 'Habilidades' : title,
    })),
  ]
  const windowTitle = activeSection === 'home' ? 'Bem-vindo ao meu portfolio' : activeDefinition?.title ?? 'Portfolio'
  const statusText = activeSection === 'projects'
    ? `${visibleProjects.length} projetos encontrados`
    : `${desktopItems.length - 1} atalhos disponiveis`

  if (booting) {
    return (
      <section className="desktop-boot-screen" style={style}>
        <div><strong>{displayInitials}</strong><span>PORTFOLIO</span></div>
        <p>Carregando portfolio de {name}...</p>
        <i aria-hidden="true"><span /></i>
      </section>
    )
  }

  return (
    <section
      className={`desktop-generated-site ${editingColors ? 'is-color-editing' : ''} ${colorAreaClass('background')}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) selectColorArea(event, 'background')
      }}
      style={style}
    >
      <button
        aria-pressed={editingColors}
        className="site-color-editor-toggle"
        onClick={(event) => {
          event.stopPropagation()
          setEditingColors((current) => !current)
        }}
        type="button"
      >
        <span aria-hidden="true">#</span>{editingColors ? 'Finalizar cores' : 'Editar cores'}
      </button>

      {editingColors && (
        <aside className="site-color-editor-panel" onClick={(event) => event.stopPropagation()}>
          <span>Area selecionada</span>
          <strong>{selectedColorLabel}</strong>
          <p>Clique em outra parte destacada do site para seleciona-la.</p>
          <label className="site-live-color-picker">
            <span style={{ backgroundColor: selectedColor }} />
            Escolher cor
            <input
              aria-label={`Escolher cor da ${selectedColorLabel}`}
              onChange={(event) => changeSelectedColor(event.target.value)}
              type="color"
              value={selectedColor}
            />
          </label>
          <div className="site-live-color-presets" aria-label="Cores sugeridas">
            {desktopAreaColorOptions.map((color) => (
              <button
                aria-label={`Usar cor ${color}`}
                className={selectedColor === color ? 'is-active' : ''}
                key={color}
                onClick={() => changeSelectedColor(color)}
                style={{ backgroundColor: color }}
                type="button"
              />
            ))}
          </div>
          <button
            className="site-color-reset"
            disabled={selectedColor === selectedDefaultColor}
            onClick={() => changeSelectedColor(selectedDefaultColor)}
            type="button"
          >
            Restaurar esta area
          </button>
        </aside>
      )}
      <div className="desktop-wallpaper-brand">
        <strong>{displayInitials}</strong>
        <span>{name}<br />PORTFOLIO</span>
      </div>

      <nav className="desktop-site-icons" aria-label="Aplicativos do portfolio">
        {desktopItems.map((item) => (
          <button className={activeSection === item.id && windowOpen ? 'is-active' : ''} key={item.id} onClick={() => openSection(item.id)} type="button">
            <DesktopShortcutIcon icon={item.icon} />
            <strong>{item.title}</strong>
          </button>
        ))}
      </nav>

      {windowOpen && (
        <section className={maximized ? 'desktop-site-window is-maximized' : 'desktop-site-window'} aria-label={windowTitle}>
          <header className={colorAreaClass('titlebar')} onClickCapture={(event) => selectColorArea(event, 'titlebar')}>
            <div><span className="desktop-title-badge" aria-hidden="true">{displayInitials}</span><strong>{windowTitle}</strong></div>
            <div className="desktop-window-controls">
              <button aria-label="Minimizar janela" onClick={() => setWindowOpen(false)} type="button">_</button>
              <button aria-label={maximized ? 'Restaurar janela' : 'Maximizar janela'} onClick={() => setMaximized((current) => !current)} type="button">[]</button>
              <button aria-label="Fechar janela" onClick={() => setWindowOpen(false)} type="button">X</button>
            </div>
          </header>
          <div className={`desktop-window-menu ${colorAreaClass('menu')}`} onClickCapture={(event) => selectColorArea(event, 'menu')}><span>Arquivo</span><span>Editar</span><span>Exibir</span><span>Ajuda</span></div>
          {activeSection !== 'home' && (
            <div className={`desktop-window-address ${colorAreaClass('menu')}`} onClickCapture={(event) => selectColorArea(event, 'menu')}><span>Endereco</span><strong>{name} / Portfolio / {windowTitle}</strong></div>
          )}
          <div className={`desktop-site-window-body ${colorAreaClass('window')}`} onClickCapture={(event) => selectColorArea(event, 'window')} style={activeDefinition ? sectionColorStyle(activeDefinition) : undefined}>
            {renderWindowContent()}
          </div>
          <footer className={`desktop-window-status ${colorAreaClass('statusbar')}`} onClickCapture={(event) => selectColorArea(event, 'statusbar')}>{statusText} | Clique nos atalhos para explorar</footer>
        </section>
      )}

      <footer className={`desktop-taskbar ${colorAreaClass('taskbar')}`} onClickCapture={(event) => selectColorArea(event, 'taskbar')}>
        <button className="desktop-start-button" onClick={() => openSection('home')} type="button"><span>{displayInitials}</span> iniciar</button>
        <button className="desktop-active-app" onClick={() => setWindowOpen(true)} type="button">{windowTitle}</button>
        <time><span aria-hidden="true" />{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</time>
      </footer>
    </section>
  )
}

function DesktopShortcutIcon({ icon }: { icon: SectionIcon }) {
  return <SectionIconGlyph desktop icon={icon} />
}

function DesktopEmptyState({ message }: { message: string }) {
  return (
    <div className="desktop-empty-state">
      <span aria-hidden="true">i</span>
      <p>{message}</p>
    </div>
  )
}

function SectionIconGlyph({ desktop = false, icon }: { desktop?: boolean; icon: SectionIcon }) {
  const iconClass = icon === 'home' ? 'icon-computer' : icon === 'code' ? 'icon-stack' : `icon-${icon}`
  const className = `${desktop ? 'section-icon-glyph desktop-site-icon-art' : 'section-icon-glyph'} ${iconClass}`

  if (icon === 'folder' || icon === 'mail' || icon === 'home' || icon === 'user' || icon === 'briefcase' || icon === 'message' || icon === 'link') {
    return <span className={className} aria-hidden="true"><i /><b /></span>
  }

  if (icon === 'code') {
    return <span className={className} aria-hidden="true"><i /><i /><i /></span>
  }

  if (icon === 'calendar') {
    return <span className={className} aria-hidden="true"><b>26</b></span>
  }

  if (icon === 'award') {
    return <span className={className} aria-hidden="true"><i /><b>1</b></span>
  }

  if (icon === 'terminal') {
    return <span className={className} aria-hidden="true"><b>&gt;_</b></span>
  }

  return <span className={className} aria-hidden="true"><i /><i /><i /></span>
}

function terminalSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function TerminalGeneratedSite({
  accentColor,
  backgroundColor,
  bio,
  contacts,
  experiences,
  headline,
  location,
  name,
  projects,
  role,
  sections,
  stack,
}: PortfolioPreviewProps) {
  const enabledSections = sections.filter((section) => section.enabled)
  const hasSection = (id: DefaultSection) => enabledSections.some((section) => section.id === id)
  const customSections = enabledSections.filter((section) => !['about', 'stack', 'projects', 'contact'].includes(section.id))
  const visibleProjects = projects.filter((project) => project.title.trim())
  const visibleContacts = contacts.filter((contact) => contact.value.trim() && contact.url.trim())
  const visibleExperiences = experiences.filter((experience) => experience.company.trim() || experience.role.trim())
  const userName = terminalSlug(name).replace(/-/g, '_') || 'dev'
  const prompt = `${userName}@portfolio:~/portfolio$`

  const commands = [
    { id: 'help', label: 'help', aliases: ['help', 'ajuda'] },
    ...(hasSection('about') ? [{ id: 'whoami', label: 'whoami', aliases: ['whoami', 'about', 'sobre', 'bio'] }] : []),
    ...(hasSection('stack') ? [{ id: 'stack', label: 'stack', aliases: ['stack', 'skills', 'habilidades', 'tecnologias'] }] : []),
    ...(hasSection('projects') ? [{ id: 'projects', label: 'projects', aliases: ['projects', 'projetos', 'ls-projects'] }] : []),
    ...(visibleExperiences.length ? [{ id: 'experience', label: 'experience', aliases: ['experience', 'experiences', 'experiencia', 'experiencias', 'work'] }] : []),
    ...(hasSection('contact') ? [{ id: 'contact', label: 'contact', aliases: ['contact', 'contato', 'contacts'] }] : []),
    ...customSections.map((section) => {
      const slug = terminalSlug(section.title) || `section-${section.id}`
      return { id: `custom:${section.id}`, label: slug, aliases: [slug, `cat-${slug}`] }
    }),
  ]

  const [activeCommand, setActiveCommand] = useState('help')
  const [commandInput, setCommandInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>(['help'])
  const [unknownCommand, setUnknownCommand] = useState('')

  const runCommand = (rawCommand: string) => {
    const normalizedCommand = rawCommand.trim().toLowerCase()
    if (!normalizedCommand) return

    setCommandHistory((current) => [...current.slice(-7), normalizedCommand])
    setCommandInput('')

    if (normalizedCommand === 'clear' || normalizedCommand === 'cls') {
      setCommandHistory([])
      setActiveCommand('')
      setUnknownCommand('')
      return
    }

    const command = commands.find((item) => item.aliases.includes(normalizedCommand))
    if (command) {
      setActiveCommand(command.id)
      setUnknownCommand('')
      return
    }

    setActiveCommand('unknown')
    setUnknownCommand(normalizedCommand)
  }

  const formatDate = (value: string) => {
    if (!value) return ''
    const [year, month] = value.split('-')
    return month && year ? `${month}/${year}` : value
  }

  const renderOutput = () => {
    if (!activeCommand) return null

    if (activeCommand === 'unknown') {
      return (
        <div className="terminal-message is-error">
          <p>bash: {unknownCommand}: comando nao encontrado</p>
          <p>Digite <button onClick={() => runCommand('help')} type="button">help</button> para ver os comandos disponiveis.</p>
        </div>
      )
    }

    if (activeCommand === 'help') {
      return (
        <div className="terminal-help-output">
          <p>Comandos disponiveis:</p>
          <dl>
            {commands.filter((command) => command.id !== 'help').map((command) => (
              <div key={command.id}>
                <dt>{command.label}</dt>
                <dd>{command.id === 'whoami' ? 'identidade e resumo profissional' : command.id === 'stack' ? 'tecnologias e ferramentas' : command.id === 'projects' ? 'projetos publicados e repositorios' : command.id === 'experience' ? 'historico profissional' : command.id === 'contact' ? 'canais para contato' : 'arquivo de secao personalizada'}</dd>
              </div>
            ))}
            <div><dt>clear</dt><dd>limpa a tela do terminal</dd></div>
          </dl>
          <p className="terminal-muted">Clique em um comando acima ou digite no prompt.</p>
        </div>
      )
    }

    if (activeCommand === 'whoami') {
      return (
        <div className="terminal-about-output">
          <p><span>name</span> = "{name || 'Nao informado'}"</p>
          <p><span>role</span> = "{role || 'Desenvolvedor'}"</p>
          {location && <p><span>location</span> = "{location}"</p>}
          {headline && <p><span>headline</span> = "{headline}"</p>}
          <div className="terminal-text-file">
            <p className="terminal-file-label">--- about.txt ---</p>
            <p>{bio || 'Resumo profissional ainda nao informado.'}</p>
            <p className="terminal-file-label">--- EOF ---</p>
          </div>
        </div>
      )
    }

    if (activeCommand === 'stack') {
      return (
        <div className="terminal-list-output">
          <p>Instalados em ~/skills:</p>
          {stack.filter(Boolean).length ? (
            <ol>{stack.filter(Boolean).map((item, index) => <li key={`${item}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span>{item}</li>)}</ol>
          ) : <p className="terminal-muted">0 tecnologias cadastradas.</p>}
        </div>
      )
    }

    if (activeCommand === 'projects') {
      return (
        <div className="terminal-project-output">
          <p>total {visibleProjects.length}</p>
          {visibleProjects.length ? visibleProjects.map((project, index) => (
            <article key={project.id}>
              <h2><span>[{String(index + 1).padStart(2, '0')}]</span> {project.title}</h2>
              {project.description && <p>{project.description}</p>}
              {project.techs && <p className="terminal-project-stack"><span>stack:</span> {project.techs}</p>}
              {(project.liveUrl || project.repoUrl) && (
                <p className="terminal-project-links">
                  {project.liveUrl && <a href={project.liveUrl} rel="noreferrer" target="_blank">[abrir projeto]</a>}
                  {project.repoUrl && <a href={project.repoUrl} rel="noreferrer" target="_blank">[ver codigo]</a>}
                </p>
              )}
            </article>
          )) : <p className="terminal-muted">Nenhum projeto encontrado em ~/projects.</p>}
        </div>
      )
    }

    if (activeCommand === 'experience') {
      return (
        <div className="terminal-experience-output">
          <p>Historico profissional:</p>
          {visibleExperiences.map((experience, index) => (
            <article key={experience.id}>
              <p className="terminal-experience-heading"><span>{String(index + 1).padStart(2, '0')}</span> {experience.role || 'Cargo nao informado'} @ {experience.company || 'Empresa nao informada'}</p>
              <p>{formatDate(experience.startDate) || 'inicio nao informado'} - {experience.current ? 'presente' : formatDate(experience.endDate) || 'fim nao informado'}{experience.city ? ` | ${experience.city}` : ''}</p>
              {experience.activities && <p>{experience.activities}</p>}
            </article>
          ))}
        </div>
      )
    }

    if (activeCommand === 'contact') {
      return (
        <div className="terminal-contact-output">
          <p>Canais disponiveis:</p>
          {visibleContacts.length ? visibleContacts.map((contact) => (
            <p key={contact.id}>
              <span>[{contact.type}]</span>
              <a href={contact.url} rel="noreferrer" target="_blank">{contact.value}</a>
            </p>
          )) : <p className="terminal-muted">Nenhum canal de contato cadastrado.</p>}
        </div>
      )
    }

    if (activeCommand.startsWith('custom:')) {
      const section = customSections.find((item) => `custom:${item.id}` === activeCommand)
      if (!section) return null
      return (
        <div className="terminal-text-file">
          <p className="terminal-file-label">$ cat {terminalSlug(section.title) || 'section'}.md</p>
          <h2># {section.title}</h2>
          <p>{section.description || 'Esta secao ainda nao possui conteudo.'}</p>
          <p className="terminal-file-label">--- EOF ---</p>
        </div>
      )
    }

    return null
  }

  const style = {
    '--custom-accent': accentColor,
    '--site-background': backgroundColor,
    '--site-foreground': getContrastColor(backgroundColor),
  } as CSSProperties

  return (
    <section className="terminal-generated-site" style={style}>
      <header className="terminal-site-header">
        <span className="terminal-window-controls" aria-hidden="true"><i /><i /><i /></span>
        <strong>{userName}@portfolio: ~/portfolio</strong>
        <span>bash</span>
      </header>

      <nav className="terminal-command-nav" aria-label="Comandos do portfolio">
        <span>commands:</span>
        {commands.map((command) => (
          <button className={activeCommand === command.id ? 'is-active' : ''} key={command.id} onClick={() => runCommand(command.label)} type="button">{command.label}</button>
        ))}
        <button onClick={() => runCommand('clear')} type="button">clear</button>
      </nav>

      <main className="terminal-screen" role="log">
        <div className="terminal-startup">
          <p>Portfolio Shell v1.0.0</p>
          <p>Session initialized for {name || userName}.</p>
          <p className="terminal-muted">Type 'help' to list available commands.</p>
        </div>

        <div className="terminal-history" aria-label="Historico de comandos">
          {commandHistory.slice(0, -1).map((command, index) => <p key={`${command}-${index}`}><span>{prompt}</span> {command}</p>)}
          {commandHistory.length > 0 && <p><span>{prompt}</span> {commandHistory.at(-1)}</p>}
        </div>

        <section className="terminal-command-output" aria-live="polite">{renderOutput()}</section>
      </main>

      <form className="terminal-prompt-form" onSubmit={(event) => { event.preventDefault(); runCommand(commandInput) }}>
        <label htmlFor="terminal-command-input"><span>{userName}@portfolio</span>:<b>~/portfolio</b>$</label>
        <input autoComplete="off" id="terminal-command-input" onChange={(event) => setCommandInput(event.target.value)} placeholder="digite um comando" spellCheck="false" value={commandInput} />
        <button type="submit">executar</button>
      </form>

      <footer className="terminal-status-bar">
        <span>session: active</span>
        <span>{visibleProjects.length} projects</span>
        <span>{stack.filter(Boolean).length} skills</span>
      </footer>
    </section>
  )
}

function DocsGeneratedSite({
  accentColor,
  backgroundColor,
  bio,
  contacts,
  experiences,
  headline,
  location,
  name,
  profilePhoto,
  projects,
  role,
  sections,
  stack,
}: PortfolioPreviewProps) {
  const enabledSections = sections.filter((section) => section.enabled)
  const visibleProjects = projects.filter((project) => project.title.trim())
  const visibleContacts = contacts.filter((contact) => contact.value.trim() && contact.url.trim())
  const visibleExperiences = experiences.filter((experience) => experience.company.trim() || experience.role.trim())
  const customSections = enabledSections.filter((section) => !['about', 'stack', 'projects', 'contact'].includes(section.id))
  const hasSection = (id: DefaultSection) => enabledSections.some((section) => section.id === id)
  const docsPages = [
    { id: 'overview', label: 'Overview', group: 'Comece aqui' },
    ...(hasSection('about') ? [{ id: 'about', label: enabledSections.find((section) => section.id === 'about')?.title || 'Sobre', group: 'Perfil' }] : []),
    ...(hasSection('stack') ? [{ id: 'stack', label: enabledSections.find((section) => section.id === 'stack')?.title || 'Stack', group: 'Perfil' }] : []),
    ...(hasSection('projects') ? [{ id: 'projects', label: enabledSections.find((section) => section.id === 'projects')?.title || 'Projetos', group: 'Trabalho' }] : []),
    ...(hasSection('contact') ? [{ id: 'contact', label: enabledSections.find((section) => section.id === 'contact')?.title || 'Contato', group: 'Conecte-se' }] : []),
    ...customSections.map((section) => ({ id: `custom:${section.id}`, label: section.title, group: 'Mais' })),
  ]
  const [activePage, setActivePage] = useState('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const activePageDefinition = docsPages.find((page) => page.id === activePage) || docsPages[0]
  const groups = [...new Set(docsPages.map((page) => page.group))]

  const openPage = (pageId: string) => {
    setActivePage(pageId)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderOverview = () => (
    <div className="docs-page docs-overview-page">
      <div className="docs-breadcrumb"><span>Portfolio</span><b>/</b><strong>Overview</strong></div>
      <section className={profilePhoto ? 'docs-overview-hero has-photo' : 'docs-overview-hero'}>
        <div>
          <p className="docs-page-kicker">{role || 'Desenvolvedor'}</p>
          <h1>{name || 'Portfolio tecnico'}</h1>
          <p className="docs-page-lead">{headline || bio || 'Conheca minha trajetoria, tecnologias e projetos.'}</p>
          <div className="docs-overview-meta">
            {location && <span>Baseado em {location}</span>}
            <span className="is-available">Disponivel para conexoes</span>
          </div>
        </div>
        {profilePhoto && <img alt={`Foto de ${name}`} src={profilePhoto} />}
      </section>

      <div className="docs-note"><strong>Sobre este portfolio</strong><p>{bio || 'Esta documentacao apresenta meu perfil profissional e os projetos que desenvolvi.'}</p></div>

      <section className="docs-content-section">
        <div className="docs-section-title"><span>01</span><div><h2>Explore a documentacao</h2><p>Escolha uma pagina para conhecer cada parte do meu trabalho.</p></div></div>
        <div className="docs-quick-links">
          {docsPages.filter((page) => page.id !== 'overview').map((page) => (
            <button key={page.id} onClick={() => openPage(page.id)} type="button"><span>{page.group}</span><strong>{page.label}</strong><b aria-hidden="true">-&gt;</b></button>
          ))}
        </div>
      </section>

      <section className="docs-stats" aria-label="Resumo do portfolio">
        <div><strong>{visibleProjects.length}</strong><span>Projetos documentados</span></div>
        <div><strong>{stack.filter(Boolean).length}</strong><span>Tecnologias principais</span></div>
        <div><strong>{visibleExperiences.length}</strong><span>Experiencias</span></div>
      </section>

      {visibleProjects[0] && (
        <section className="docs-content-section docs-featured-project">
          <p className="docs-page-kicker">Case em destaque</p>
          <div className={visibleProjects[0].imageUrl ? 'has-image' : ''}>
            {visibleProjects[0].imageUrl && <img alt={`Capa do projeto ${visibleProjects[0].title}`} src={visibleProjects[0].imageUrl} />}
            <div><h2>{visibleProjects[0].title}</h2><p>{visibleProjects[0].description}</p><button onClick={() => openPage('projects')} type="button">Ler documentacao do projeto</button></div>
          </div>
        </section>
      )}
    </div>
  )

  const renderAbout = () => (
    <div className="docs-page">
      <div className="docs-breadcrumb"><span>Perfil</span><b>/</b><strong>Sobre</strong></div>
      <header className="docs-page-header"><p className="docs-page-kicker">Perfil profissional</p><h1>Sobre mim</h1><p>{bio || 'Resumo profissional ainda nao informado.'}</p></header>
      {profilePhoto && <figure className="docs-profile-banner"><img alt={`Foto de ${name}`} src={profilePhoto} /><figcaption><strong>{name}</strong><span>{role}{location ? ` / ${location}` : ''}</span></figcaption></figure>}
      <section className="docs-content-section" id="docs-experience">
        <div className="docs-section-title"><span>01</span><div><h2>Experiencia profissional</h2><p>Trajetoria, responsabilidades e principais entregas.</p></div></div>
        <div className="docs-experience-list">
          {visibleExperiences.length ? visibleExperiences.map((experience) => (
            <article key={experience.id}><div className="docs-experience-marker" /><div><div className="docs-experience-title"><h3>{experience.role || 'Cargo nao informado'}</h3><time>{formatExperiencePeriod(experience)}</time></div><strong>{experience.company || 'Empresa nao informada'}{experience.city ? ` / ${experience.city}` : ''}</strong>{experience.activities && <p>{experience.activities}</p>}</div></article>
          )) : <div className="docs-empty-state"><strong>Nenhuma experiencia cadastrada</strong><p>Este historico sera exibido quando houver informacoes profissionais.</p></div>}
        </div>
      </section>
    </div>
  )

  const renderStack = () => (
    <div className="docs-page">
      <div className="docs-breadcrumb"><span>Perfil</span><b>/</b><strong>Stack</strong></div>
      <header className="docs-page-header"><p className="docs-page-kicker">Referencia tecnica</p><h1>Tecnologias e ferramentas</h1><p>Principais tecnologias utilizadas no desenvolvimento dos meus projetos.</p></header>
      <section className="docs-content-section">
        <div className="docs-stack-table" role="table" aria-label="Stack principal">
          <div className="docs-stack-row is-header" role="row"><span role="columnheader">#</span><span role="columnheader">Tecnologia</span><span role="columnheader">Status</span></div>
          {stack.filter(Boolean).map((technology, index) => <div className="docs-stack-row" key={`${technology}-${index}`} role="row"><span role="cell">{String(index + 1).padStart(2, '0')}</span><strong role="cell">{technology}</strong><span role="cell"><i /> Em uso</span></div>)}
        </div>
        {!stack.filter(Boolean).length && <div className="docs-empty-state"><strong>Nenhuma tecnologia cadastrada</strong><p>A stack principal aparecera aqui.</p></div>}
      </section>
    </div>
  )

  const renderProjects = () => (
    <div className="docs-page">
      <div className="docs-breadcrumb"><span>Trabalho</span><b>/</b><strong>Projetos</strong></div>
      <header className="docs-page-header"><p className="docs-page-kicker">Cases documentados</p><h1>Projetos</h1><p>Solucoes desenvolvidas, contexto tecnico e links para explorar cada entrega.</p></header>
      <div className="docs-project-list">
        {visibleProjects.length ? visibleProjects.map((project, index) => (
          <article id={`docs-project-${index + 1}`} key={project.id}>
            <div className="docs-project-heading"><span>Case {String(index + 1).padStart(2, '0')}</span><h2>{project.title}</h2></div>
            {project.imageUrl && <div className="docs-project-image"><img alt={`Capa do projeto ${project.title}`} src={project.imageUrl} /></div>}
            <p>{project.description || 'Descricao do projeto ainda nao informada.'}</p>
            {project.techs && <div className="docs-code-line"><span>stack</span><code>{project.techs}</code></div>}
            {(project.liveUrl || project.repoUrl) && <div className="docs-project-actions">{project.liveUrl && <a href={project.liveUrl} rel="noreferrer" target="_blank">Abrir projeto <span>-&gt;</span></a>}{project.repoUrl && <a href={project.repoUrl} rel="noreferrer" target="_blank">Ver repositorio <span>-&gt;</span></a>}</div>}
          </article>
        )) : <div className="docs-empty-state"><strong>Nenhum projeto documentado</strong><p>Os cases publicados aparecerao nesta pagina.</p></div>}
      </div>
    </div>
  )

  const renderContact = () => (
    <div className="docs-page">
      <div className="docs-breadcrumb"><span>Conecte-se</span><b>/</b><strong>Contato</strong></div>
      <header className="docs-page-header"><p className="docs-page-kicker">Canais oficiais</p><h1>Vamos conversar</h1><p>Escolha o canal mais adequado para falar sobre projetos, oportunidades ou colaboracoes.</p></header>
      <div className="docs-contact-list">
        {visibleContacts.length ? visibleContacts.map((contact) => <a href={contact.url} key={contact.id} rel="noreferrer" target="_blank"><ContactIcon type={contact.type} /><span><small>{contact.label || contact.type}</small><strong>{contact.value}</strong></span><b aria-hidden="true">-&gt;</b></a>) : <div className="docs-empty-state"><strong>Nenhum contato cadastrado</strong><p>Os canais oficiais aparecerao aqui.</p></div>}
      </div>
    </div>
  )

  const renderPage = () => {
    if (activePage === 'overview') return renderOverview()
    if (activePage === 'about') return renderAbout()
    if (activePage === 'stack') return renderStack()
    if (activePage === 'projects') return renderProjects()
    if (activePage === 'contact') return renderContact()
    const section = customSections.find((item) => `custom:${item.id}` === activePage)
    return section ? <div className="docs-page docs-custom-page" style={sectionColorStyle(section)}><div className="docs-breadcrumb"><span>Mais</span><b>/</b><strong>{section.title}</strong></div><header className="docs-page-header"><p className="docs-page-kicker">Secao personalizada</p><h1>{section.title}</h1><p>{section.description || 'Esta pagina ainda nao possui conteudo.'}</p></header></div> : renderOverview()
  }

  const style = {
    '--custom-accent': accentColor,
    '--site-background': backgroundColor,
    '--site-foreground': getContrastColor(backgroundColor),
  } as CSSProperties

  return (
    <section className="docs-generated-site" style={style}>
      <header className="docs-site-header">
        <button aria-expanded={mobileMenuOpen} aria-label="Abrir navegacao" className="docs-mobile-menu" onClick={() => setMobileMenuOpen((current) => !current)} type="button"><span /><span /><span /></button>
        <button className="docs-brand" onClick={() => openPage('overview')} type="button"><strong>{name || 'Portfolio'}</strong><span>Docs</span></button>
        <div className="docs-header-context"><span>{activePageDefinition.group}</span><b>/</b><strong>{activePageDefinition.label}</strong></div>
        <span className="docs-version">v1.0</span>
      </header>

      <div className="docs-site-layout">
        <aside className={mobileMenuOpen ? 'docs-sidebar is-open' : 'docs-sidebar'}>
          <div className="docs-sidebar-intro"><span>DOCUMENTATION</span><strong>{role || 'Developer portfolio'}</strong></div>
          <nav aria-label="Paginas da documentacao">
            {groups.map((group) => <div className="docs-nav-group" key={group}><p>{group}</p>{docsPages.filter((page) => page.group === group).map((page) => <button className={activePage === page.id ? 'is-active' : ''} key={page.id} onClick={() => openPage(page.id)} type="button"><span>{page.label}</span><b aria-hidden="true">{activePage === page.id ? '-' : ''}</b></button>)}</div>)}
          </nav>
          <footer><span className="is-online" />Portfolio atualizado</footer>
        </aside>
        {mobileMenuOpen && <button aria-label="Fechar navegacao" className="docs-sidebar-backdrop" onClick={() => setMobileMenuOpen(false)} type="button" />}

        <main className="docs-main-content" id="docs-page-top">{renderPage()}<footer className="docs-page-footer"><span>{name || 'Portfolio'}</span><button onClick={() => openPage('overview')} type="button">Voltar ao inicio</button></footer></main>

        <aside className="docs-page-index"><p>Nesta pagina</p><a href="#docs-page-top">{activePageDefinition.label}</a>{activePage === 'about' && <a href="#docs-experience">Experiencia</a>}{activePage === 'projects' && visibleProjects.slice(0, 5).map((project, index) => <a href={`#docs-project-${index + 1}`} key={project.id}>{project.title}</a>)}<div><span>Ultima atualizacao</span><strong>Agora</strong></div></aside>
      </div>
    </section>
  )
}

function DevPortfolioPreview({
  accentColor,
  backgroundColor,
  bio,
  contacts,
  experiences,
  headline,
  location,
  name,
  profilePhoto,
  projects,
  role,
  sections,
  stack,
  template,
  standalone = false,
}: PortfolioPreviewProps & { standalone?: boolean }) {
  const style = {
    '--custom-accent': accentColor,
    '--site-background': backgroundColor,
    '--site-foreground': getContrastColor(backgroundColor),
  } as CSSProperties

  return (
    <article className={`portfolio-preview dev-preview dev-${template} ${standalone ? 'is-standalone' : ''}`} id="portfolio-top" style={style}>
      <PreviewNav name={name} sections={sections} template={template} />

      <section className="dev-hero">
        <div className="dev-hero-copy">
          <p>{role}</p>
          <h2>{headline}</h2>
          <span>{location}</span>
        </div>
        <DevHeroVisual name={name} projects={projects} stack={stack} template={template} />
      </section>

      {sections.map((section) => (
        <GeneratedSection
          bio={bio}
          contacts={contacts}
          experiences={experiences}
          key={section.id}
          name={name}
          profilePhoto={profilePhoto}
          projects={projects}
          section={section}
          stack={stack}
        />
      ))}
    </article>
  )
}

function GeneratedSection({
  bio,
  contacts,
  experiences,
  name,
  profilePhoto,
  projects,
  section,
  stack,
}: {
  bio: string
  contacts: ContactLink[]
  experiences: DevExperience[]
  name: string
  profilePhoto: string
  projects: DevProject[]
  section: PortfolioSection
  stack: string[]
}) {
  if (section.id === 'about') {
    return (
      <section className="dev-section dev-about" id={section.id} style={sectionColorStyle(section)}>
        <p className="preview-label">Sobre</p>
        <div className={profilePhoto ? 'dev-about-layout has-photo' : 'dev-about-layout'}>
          {profilePhoto && (
            <img className="dev-about-photo" alt={`Foto de ${name}`} src={profilePhoto} />
          )}
          <div className="dev-about-copy">
            <h3>{bio}</h3>
            <div className="dev-about-experience">
              <strong>Experiencia profissional</strong>
              <div className="dev-experience-list">
                {experiences.length === 0 && <p>Nenhuma experiencia profissional informada.</p>}
                {experiences.map((item) => (
                  <article key={item.id}>
                    <div><h4>{item.role || 'Cargo nao informado'}</h4><span>{formatExperiencePeriod(item)}</span></div>
                    <small>{item.company || 'Empresa nao informada'}{item.city ? ` / ${item.city}` : ''}</small>
                    {item.activities && <p>{item.activities}</p>}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (section.id === 'stack') {
    return (
      <section className="dev-section" id={section.id} style={sectionColorStyle(section)}>
        <p className="preview-label">Stack principal</p>
        <div className="dev-stack-grid">{stack.map((item) => <span key={item}>{item}</span>)}</div>
      </section>
    )
  }

  if (section.id === 'projects') {
    return (
      <section className="dev-section" id={section.id} style={sectionColorStyle(section)}>
        <div className="section-heading"><p className="preview-label">Projetos</p><strong>{projects.length} cases selecionados</strong></div>
        <div className="dev-project-grid">
          {projects.map((project, index) => (
            <article className="dev-project-card" key={project.id}>
              {project.imageUrl && (
                <div className="dev-project-cover">
                  <img alt={`Capa do projeto ${project.title}`} src={project.imageUrl} />
                </div>
              )}
              <div className="dev-project-card-content">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <small>{project.techs}</small>
              <div className="project-links">
                {project.liveUrl && <a href={project.liveUrl} rel="noreferrer" target="_blank">Ver online</a>}
                {project.repoUrl && <a href={project.repoUrl} rel="noreferrer" target="_blank">Repositorio</a>}
              </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    )
  }

  if (section.id === 'contact') {
    return (
      <section className="dev-contact" id={section.id} style={sectionColorStyle(section)}>
        <div><p className="preview-label">Contato</p><strong>Vamos construir algo funcional?</strong></div>
        <div className="contact-links">
          {contacts.map((contact) => (
            <a className={`contact-link contact-${contact.type}`} href={contact.url} key={contact.id} rel="noreferrer" target="_blank">
              <ContactIcon type={contact.type} />
              <span><small>{contact.label}</small>{contact.value}</span>
            </a>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="dev-section" id={section.id} style={sectionColorStyle(section)}>
      <p className="preview-label">Secao personalizada</p>
      <h3>{section.title}</h3>
      <p>{section.description}</p>
    </section>
  )
}

function PreviewNav({
  name,
  sections,
  template,
}: {
  name: string
  sections: PortfolioSection[]
  template: DevTemplate
}) {
  return (
    <nav className="site-nav">
      <a className="site-nav-brand" href="#portfolio-top">
        {template === 'terminal' ? `${name.toLowerCase().replaceAll(' ', '-')}@portfolio` : name}
      </a>
      <div>
        {sections.map((section) => (
          <a href={`#${section.id}`} key={section.id}>
            {section.title}
          </a>
        ))}
      </div>
    </nav>
  )
}

function DevHeroVisual({
  name,
  projects,
  stack,
  template,
}: {
  name: string
  projects: DevProject[]
  stack: string[]
  template: DevTemplate
}) {
  if (template === 'terminal') {
    return (
      <div className="dev-visual terminal-visual" aria-hidden="true">
        <div className="terminal-top">
          <span />
          <span />
          <span />
        </div>
        <p>$ whoami</p>
        <strong>{name}</strong>
        <p>$ ls projetos</p>
        <small>{projects.map((project) => project.title).join(' / ')}</small>
      </div>
    )
  }

  if (template === 'docs') {
    return (
      <div className="dev-visual docs-visual" aria-hidden="true">
        <span>README.md</span>
        <strong>Portfolio tecnico</strong>
        <p>Stack: {stack.slice(0, 4).join(', ')}</p>
        <div>
          <i />
          <i />
          <i />
        </div>
      </div>
    )
  }

  return (
    <div className="dev-visual desktop-visual" aria-hidden="true">
      <div className="desktop-icon">DEV</div>
      <div className="desktop-window">
        <span>Projetos.exe</span>
        <strong>{projects[0]?.title ?? 'Projeto principal'}</strong>
        <p>{stack.slice(0, 3).join(' + ')}</p>
      </div>
    </div>
  )
}

export default App
