import { type ChangeEvent, type CSSProperties, type ReactNode, useEffect, useMemo, useState } from 'react'
import './App.css'
import type {
  BuilderStep,
  ContactLink,
  ContactType,
  DesktopColorTarget,
  DevExperience,
  DevProject,
  DevTemplate,
  PortfolioDraft,
  PortfolioPreviewProps,
  PortfolioSection,
  SectionIcon,
  TemplateSettings,
} from './models/portfolio'
import { readPortfolioDraft, writePortfolioDraft } from './storage/portfolioDraft'
import { defaultSectionSurface, formatExperiencePeriod, getContrastColor, moveById, sectionColorStyle, terminalSlug } from './utils/portfolio'
import { ContactIcon, SectionIconGlyph } from './components/PortfolioIcons'
import { DesktopGeneratedSite } from './templates/DesktopTemplate'
import { TerminalGeneratedSite } from './templates/TerminalTemplate'
import { DocsGeneratedSite } from './templates/DocsTemplate'
import {
  accentOptions,
  backgroundOptions,
  contactPresets,
  defaultDesktopAreaColors,
  defaultSections,
  defaultTemplateBackgrounds,
  defaultTemplateSettings,
  devTemplates,
  sectionIconOptions,
  sectionPresets,
  steps,
} from './data/devPortfolioDefaults'

function App() {
  const [builderFlowMode] = useState<'free' | 'guided'>('guided')
  const [setupComplete, setSetupComplete] = useState(false)
  const [step, setStep] = useState<BuilderStep>('identity')
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(0)
  const [showStepError, setShowStepError] = useState(false)
  const [siteMode, setSiteMode] = useState(false)
  const [template, setTemplate] = useState<DevTemplate>('desktop')
  const [accentColor, setAccentColor] = useState('#2563eb')
  const [templateBackgrounds, setTemplateBackgrounds] = useState<Record<DevTemplate, string>>(defaultTemplateBackgrounds)
  const [desktopAreaColors, setDesktopAreaColors] = useState<Record<DesktopColorTarget, string>>(defaultDesktopAreaColors)
  const [templateSettings, setTemplateSettings] = useState<TemplateSettings>(defaultTemplateSettings)
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
  const [draftReady, setDraftReady] = useState(false)
  const [draftStatus, setDraftStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const currentDraft = useMemo<PortfolioDraft>(() => (
    {
      version: 1,
      updatedAt: new Date().toISOString(),
      step,
      maxUnlockedStep,
      template,
      accentColor,
      templateBackgrounds,
      desktopAreaColors,
      templateSettings,
      name,
      role,
      location,
      headline,
      bio,
      profilePhoto,
      experiences,
      stackText,
      sections,
      projects,
      contacts,
    }
  ), [accentColor, bio, contacts, desktopAreaColors, experiences, headline, location, maxUnlockedStep, name, profilePhoto, projects, role, sections, stackText, step, template, templateBackgrounds, templateSettings])

  useEffect(() => {
    let active = true

    readPortfolioDraft()
      .then((draft) => {
        if (!active || !draft) return
        setStep(draft.step)
        setMaxUnlockedStep(draft.maxUnlockedStep)
        setTemplate(draft.template)
        setAccentColor(draft.accentColor)
        setTemplateBackgrounds({ ...defaultTemplateBackgrounds, ...draft.templateBackgrounds })
        setDesktopAreaColors({ ...defaultDesktopAreaColors, ...draft.desktopAreaColors })
        setTemplateSettings({
          desktop: { ...defaultTemplateSettings.desktop, ...draft.templateSettings.desktop },
          terminal: { ...defaultTemplateSettings.terminal, ...draft.templateSettings.terminal },
          docs: { ...defaultTemplateSettings.docs, ...draft.templateSettings.docs },
        })
        setName(draft.name)
        setRole(draft.role)
        setLocation(draft.location)
        setHeadline(draft.headline)
        setBio(draft.bio)
        setProfilePhoto(draft.profilePhoto)
        setExperiences(draft.experiences)
        setStackText(draft.stackText)
        setSections(draft.sections)
        setProjects(draft.projects)
        setContacts(draft.contacts)
        setSetupComplete(true)
        setDraftStatus('saved')
      })
      .catch(() => {
        if (active) setDraftStatus('error')
      })
      .finally(() => {
        if (active) setDraftReady(true)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!draftReady || !setupComplete) return

    setDraftStatus('saving')
    const timeout = window.setTimeout(() => {
      writePortfolioDraft(currentDraft)
        .then(() => setDraftStatus('saved'))
        .catch(() => setDraftStatus('error'))
    }, 500)

    return () => window.clearTimeout(timeout)
  }, [currentDraft, draftReady, setupComplete])

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
        terminalCommand: terminalSlug(customSectionTitle),
        docsGroup: 'Mais',
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
        terminalCommand: terminalSlug(section.title),
        docsGroup: 'Mais',
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

  function updateSectionTerminalCommand(sectionId: string, terminalCommand: string) {
    setSections((current) => current.map((section) => (
      section.id === sectionId ? { ...section, terminalCommand: terminalSlug(terminalCommand) } : section
    )))
  }

  function updateSectionDocsGroup(sectionId: string, docsGroup: string) {
    setSections((current) => current.map((section) => (
      section.id === sectionId ? { ...section, docsGroup } : section
    )))
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

  async function exitToStart() {
    setDraftStatus('saving')
    try {
      await writePortfolioDraft(currentDraft)
      setDraftStatus('saved')
      setSiteMode(false)
      setSetupComplete(false)
    } catch {
      setDraftStatus('error')
    }
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
    setTemplateSettings(defaultTemplateSettings)
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

  if (!draftReady) {
    return (
      <main className="draft-loading-screen">
        <div className="product-mark">
          <span>PF</span>
          <div><strong>Portfy</strong><small>Carregando seu rascunho...</small></div>
        </div>
      </main>
    )
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
        templateSettings={templateSettings}
      />
    )
  }

  return (
    <main className="flow-shell">
      <header className="flow-header">
        <div className="product-mark">
          <span>PF</span>
          <div>
            <strong>Portfy</strong>
            <small>Portfolio para desenvolvedores</small>
          </div>
        </div>
        <div className="flow-header-actions">
          <span className={`draft-status is-${draftStatus}`} aria-live="polite">
            <i />
            {draftStatus === 'saving' ? 'Salvando...' : draftStatus === 'error' ? 'Falha ao salvar' : 'Rascunho salvo'}
          </span>
          <button className="ghost-button" onClick={exitToStart} type="button">Sair</button>
          {(builderFlowMode === 'free' || maxUnlockedStep >= steps.length - 1) && (
            <button className="ghost-button" onClick={() => openUnlockedStep('preview', steps.length - 1)} type="button">
              Visualizar portfolio
            </button>
          )}
        </div>
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
            <div className={`template-settings-panel template-settings-${template}`}>
              <div className="template-settings-heading">
                <div>
                  <strong>{template === 'desktop' ? 'Interface do sistema' : template === 'terminal' ? 'Ambiente do terminal' : 'Leitura da documentacao'}</strong>
                  <span>{template === 'desktop' ? 'Personalize rotulos, atalhos e a janela da interface retro.' : template === 'terminal' ? 'Defina a identidade, a escala e o acabamento visual da sessao.' : 'Ajuste a identidade e a composicao de leitura do portfolio.'}</span>
                </div>
                <button
                  disabled={JSON.stringify(templateSettings[template]) === JSON.stringify(defaultTemplateSettings[template])}
                  onClick={() => setTemplateSettings((current) => ({ ...current, [template]: defaultTemplateSettings[template] }))}
                  type="button"
                >
                  Restaurar estilo
                </button>
              </div>

              {template === 'desktop' && (
                <div className="template-settings-fields">
                  <TextInput label="Titulo da janela inicial" onChange={(value) => setTemplateSettings((current) => ({ ...current, desktop: { ...current.desktop, homeTitle: value } }))} placeholder="Bem-vindo ao meu portfolio" value={templateSettings.desktop.homeTitle} />
                  <TextInput label="Texto do botao iniciar" onChange={(value) => setTemplateSettings((current) => ({ ...current, desktop: { ...current.desktop, startLabel: value } }))} placeholder="iniciar" value={templateSettings.desktop.startLabel} />
                  <label className="template-option-field"><span>Tamanho dos atalhos</span><select onChange={(event) => setTemplateSettings((current) => ({ ...current, desktop: { ...current.desktop, shortcutSize: event.target.value as TemplateSettings['desktop']['shortcutSize'] } }))} value={templateSettings.desktop.shortcutSize}><option value="small">Compacto</option><option value="medium">Padrao</option><option value="large">Grande</option></select></label>
                  <label className="template-option-field"><span>Largura da janela</span><select onChange={(event) => setTemplateSettings((current) => ({ ...current, desktop: { ...current.desktop, windowWidth: event.target.value as TemplateSettings['desktop']['windowWidth'] } }))} value={templateSettings.desktop.windowWidth}><option value="compact">Compacta</option><option value="wide">Ampla</option></select></label>
                  <div className="template-setting-preview desktop-setting-preview"><span>{templateSettings.desktop.startLabel || 'iniciar'}</span><strong>{templateSettings.desktop.homeTitle || 'Portfolio'}</strong></div>
                </div>
              )}

              {template === 'terminal' && (
                <div className="template-settings-fields">
                  <TextInput label="Nome do ambiente" onChange={(value) => setTemplateSettings((current) => ({ ...current, terminal: { ...current.terminal, bootTitle: value } }))} placeholder="Portfolio Shell" value={templateSettings.terminal.bootTitle} />
                  <TextInput label="Hostname" onChange={(value) => setTemplateSettings((current) => ({ ...current, terminal: { ...current.terminal, host: terminalSlug(value) } }))} placeholder="portfolio" value={templateSettings.terminal.host} />
                  <TextInput label="Shell exibido" onChange={(value) => setTemplateSettings((current) => ({ ...current, terminal: { ...current.terminal, shell: value } }))} placeholder="bash" value={templateSettings.terminal.shell} />
                  <label className="template-option-field"><span>Escala do texto</span><select onChange={(event) => setTemplateSettings((current) => ({ ...current, terminal: { ...current.terminal, textScale: event.target.value as TemplateSettings['terminal']['textScale'] } }))} value={templateSettings.terminal.textScale}><option value="small">Compacta</option><option value="medium">Padrao</option><option value="large">Ampliada</option></select></label>
                  <label className="template-toggle-field"><input checked={templateSettings.terminal.scanlines} onChange={(event) => setTemplateSettings((current) => ({ ...current, terminal: { ...current.terminal, scanlines: event.target.checked } }))} type="checkbox" /><span><strong>Linhas de monitor</strong><small>Efeito sutil de tela CRT.</small></span></label>
                  <div className={`template-setting-preview terminal-setting-preview terminal-preview-${templateSettings.terminal.textScale} ${templateSettings.terminal.scanlines ? 'has-scanlines' : ''}`}><span>{templateSettings.terminal.bootTitle || 'Portfolio Shell'} v1.0.0</span><code>dev@{templateSettings.terminal.host || 'portfolio'}:~/portfolio$</code><small>{templateSettings.terminal.shell || 'bash'}</small></div>
                </div>
              )}

              {template === 'docs' && (
                <div className="template-settings-fields">
                  <TextInput label="Selo do cabecalho" onChange={(value) => setTemplateSettings((current) => ({ ...current, docs: { ...current.docs, badge: value } }))} placeholder="Docs" value={templateSettings.docs.badge} />
                  <TextInput label="Titulo da sidebar" onChange={(value) => setTemplateSettings((current) => ({ ...current, docs: { ...current.docs, sidebarLabel: value } }))} placeholder="DOCUMENTATION" value={templateSettings.docs.sidebarLabel} />
                  <TextInput label="Versao exibida" onChange={(value) => setTemplateSettings((current) => ({ ...current, docs: { ...current.docs, version: value } }))} placeholder="v1.0" value={templateSettings.docs.version} />
                  <label className="template-option-field"><span>Largura de leitura</span><select onChange={(event) => setTemplateSettings((current) => ({ ...current, docs: { ...current.docs, contentWidth: event.target.value as TemplateSettings['docs']['contentWidth'] } }))} value={templateSettings.docs.contentWidth}><option value="focused">Focada</option><option value="wide">Ampla</option></select></label>
                  <label className="template-toggle-field"><input checked={templateSettings.docs.showPageIndex} onChange={(event) => setTemplateSettings((current) => ({ ...current, docs: { ...current.docs, showPageIndex: event.target.checked } }))} type="checkbox" /><span><strong>Indice lateral</strong><small>Atalhos da pagina atual.</small></span></label>
                  <div className={`template-setting-preview docs-setting-preview docs-preview-${templateSettings.docs.contentWidth}`}><span>{templateSettings.docs.sidebarLabel || 'DOCUMENTATION'}</span><strong>Portfolio <b>{templateSettings.docs.badge || 'Docs'}</b></strong><small>{templateSettings.docs.version || 'v1.0'}{templateSettings.docs.showPageIndex ? ' / indice ativo' : ''}</small></div>
                </div>
              )}
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
            title={template === 'desktop' ? 'Monte os atalhos e janelas do Desktop.' : template === 'terminal' ? 'Defina os comandos do Terminal.' : 'Organize as paginas da documentacao.'}
            description={template === 'desktop' ? 'Cada secao vira um atalho com icone e uma janela propria.' : template === 'terminal' ? 'Cada secao vira um comando textual. Icones e controles visuais nao fazem parte deste estilo.' : 'Cada secao vira uma pagina agrupada na navegacao lateral do Docs.'}
          >
            <TemplateEditorBanner template={template} />
            <div className={`preset-section-grid preset-section-${template}`}>
              {sectionPresets.map((section) => (
                <button key={section.title} onClick={() => addPresetSection(section)} type="button">
                  {template === 'desktop' && <SectionIconGlyph icon={section.icon} />}
                  {template === 'terminal' && <code>./{terminalSlug(section.title)}</code>}
                  {template === 'docs' && <small>Nova pagina</small>}
                  <strong>{section.title}</strong>
                  <span>{section.description}</span>
                </button>
              ))}
            </div>

            <div className="section-manager">
              {sections.map((section, index) => (
                <article className={`${section.enabled ? 'managed-section is-active' : 'managed-section'} managed-section-${template}`} key={section.id}>
                  <div className="managed-section-summary">
                    {template === 'desktop' && <SectionIconGlyph icon={section.icon} />}
                    {template === 'terminal' && <code className="section-terminal-command">$ {section.terminalCommand || terminalSlug(section.title)}</code>}
                    {template === 'docs' && <span className="section-docs-page">PAGE</span>}
                    <div>
                      <strong>{section.title}</strong>
                      <p>{section.description}</p>
                    </div>
                  </div>
                  <div className="section-actions">
                    {template === 'desktop' && (
                      <>
                        <label className="section-icon-select">
                          <span>Icone</span>
                          <select onChange={(event) => updateSectionIcon(section.id, event.target.value as SectionIcon)} value={section.icon}>
                            {sectionIconOptions.map((icon) => <option key={icon.id} value={icon.id}>{icon.label}</option>)}
                          </select>
                        </label>
                        <label className="section-color-control">
                          <span className="section-color-swatch" style={{ backgroundColor: section.backgroundColor || defaultSectionSurface(template) }} />
                          <span>Cor</span>
                          <input aria-label={`Escolher cor da secao ${section.title}`} onChange={(event) => updateSectionColor(section.id, event.target.value)} type="color" value={section.backgroundColor || defaultSectionSurface(template)} />
                        </label>
                        {section.backgroundColor && <button onClick={() => updateSectionColor(section.id, '')} type="button">Cor padrao</button>}
                      </>
                    )}
                    {template === 'terminal' && (
                      <label className="section-template-field section-terminal-field">
                        <span>Comando</span>
                        <b>./</b>
                        <input aria-label={`Comando da secao ${section.title}`} onChange={(event) => updateSectionTerminalCommand(section.id, event.target.value)} value={section.terminalCommand || terminalSlug(section.title)} />
                      </label>
                    )}
                    {template === 'docs' && (
                      <label className="section-template-field">
                        <span>Grupo da sidebar</span>
                        <select onChange={(event) => updateSectionDocsGroup(section.id, event.target.value)} value={section.docsGroup || 'Mais'}>
                          <option value="Comece aqui">Comece aqui</option>
                          <option value="Perfil">Perfil</option>
                          <option value="Trabalho">Trabalho</option>
                          <option value="Conecte-se">Conecte-se</option>
                          <option value="Mais">Mais</option>
                        </select>
                      </label>
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
              {template === 'desktop' && (
                <div className="form-block">
                  <label>Icone do atalho</label>
                  <div className="section-icon-picker" role="group" aria-label="Escolha o icone da nova secao">
                    {sectionIconOptions.map((icon) => (
                      <button aria-label={icon.label} aria-pressed={customSectionIcon === icon.id} className={customSectionIcon === icon.id ? 'is-active' : ''} key={icon.id} onClick={() => setCustomSectionIcon(icon.id)} type="button">
                        <SectionIconGlyph icon={icon.id} /><span>{icon.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {template === 'terminal' && <p className="template-form-hint"><code>./{terminalSlug(customSectionTitle) || 'novo-comando'}</code> sera criado a partir do nome da secao.</p>}
              {template === 'docs' && <p className="template-form-hint">A nova pagina sera adicionada inicialmente ao grupo <strong>Mais</strong>.</p>}
              <button className="primary-button" onClick={addCustomSection} type="button">
                Adicionar secao
              </button>
            </div>

            <TextArea label="Stack, uma tecnologia por linha" onChange={setStackText} placeholder={'React\nTypeScript\nPostgreSQL'} rows={6} value={stackText} />
            <SectionsMiniPreview sections={enabledSections} stack={stack} template={template} />
          </StepBlock>
        )}

        {step === 'projects' && (
          <StepBlock
            eyebrow="Etapa 4"
            title={template === 'desktop' ? 'Preencha os projetos exibidos nas janelas.' : template === 'terminal' ? 'Cadastre as entradas de ~/projects.' : 'Documente seus projetos como cases.'}
            description={template === 'terminal' ? 'O Terminal apresenta titulo, descricao, stack e links como texto. Imagens de capa nao sao usadas neste estilo.' : template === 'desktop' ? 'Cada projeto pode ter capa, link publicado, repositorio e tecnologias.' : 'Cada projeto vira um artigo tecnico com capa, contexto, stack e links.'}
          >
            <TemplateEditorBanner template={template} />
            <div className="item-list">
              {projects.map((project, index) => (
                <article className={`editable-item editable-item-${template}`} key={project.id}>
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
                  {template !== 'terminal' && <div className="project-image-field">
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
                  </div>}
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
            <ProjectsMiniPreview projects={projects} template={template} />
          </StepBlock>
        )}

        {step === 'contact' && (
          <StepBlock
            eyebrow="Etapa 5"
            title={template === 'desktop' ? 'Adicione contatos com atalhos visuais.' : template === 'terminal' ? 'Configure a saida do comando contact.' : 'Organize os canais da pagina Contato.'}
            description={template === 'terminal' ? 'As redes aparecem como linhas de texto clicaveis, sem icones.' : template === 'desktop' ? 'Escolha redes predefinidas com seus icones e edite texto e URL.' : 'Cada canal aparece como uma referencia organizada com icone e link.'}
          >
            <TemplateEditorBanner template={template} />
            <div className={`preset-contact-grid preset-contact-${template}`}>
              {contactPresets.map((preset) => (
                <button
                  className={`preset-contact contact-${preset.type}`}
                  key={preset.type}
                  onClick={() => addPresetContact(preset)}
                  type="button"
                >
                  {template !== 'terminal' && <ContactIcon type={preset.type} />}
                  {template === 'terminal' && <code>[{preset.type}]</code>}
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="item-list">
              {contacts.map((contact) => (
                <article className={`editable-item editable-item-${template}`} key={contact.id}>
                  <div className="item-heading">
                    <strong className="contact-item-title">
                      {template !== 'terminal' && <ContactIcon type={contact.type} />}
                      {template === 'terminal' && <code>[{contact.type}]</code>}
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
            <ContactsMiniPreview contacts={contacts} template={template} />
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
            <strong>Portfy</strong>
            <small>Gerador de portfolios</small>
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

function TemplateEditorBanner({ template }: { template: DevTemplate }) {
  return (
    <aside className={`template-editor-banner template-editor-${template}`}>
      <span>{template === 'desktop' ? 'Desktop retro' : template === 'terminal' ? 'Terminal hacker' : 'Docs moderno'}</span>
      <div>
        <strong>{template === 'desktop' ? 'Editando atalhos e janelas' : template === 'terminal' ? 'Editando comandos e saidas' : 'Editando paginas e navegacao'}</strong>
        <p>{template === 'desktop' ? 'Os controles desta etapa afetam a experiencia visual do Desktop.' : template === 'terminal' ? 'Somente opcoes que fazem sentido em uma interface de linha de comando sao exibidas.' : 'Os controles desta etapa seguem a estrutura editorial de uma documentacao.'}</p>
      </div>
    </aside>
  )
}

function SectionsMiniPreview({
  sections,
  stack,
  template,
}: {
  sections: PortfolioSection[]
  stack: string[]
  template: DevTemplate
}) {
  if (template === 'terminal') {
    return (
      <aside className="mini-preview template-data-preview terminal-data-preview">
        <span>Comandos disponiveis</span>
        <div className="terminal-section-preview">
          {sections.map((section) => <p key={section.id}><code>$ {section.terminalCommand || terminalSlug(section.title)}</code><span>{section.description}</span></p>)}
        </div>
        <p className="terminal-preview-stack"><code>$ stack</code> {stack.slice(0, 5).join(' | ')}</p>
      </aside>
    )
  }

  if (template === 'docs') {
    return (
      <aside className="mini-preview template-data-preview docs-data-preview">
        <span>Paginas na documentacao</span>
        <div className="docs-section-preview">
          {[...new Set(sections.map((section) => section.docsGroup || 'Mais'))].map((group) => (
            <div key={group}><strong>{group}</strong>{sections.filter((section) => (section.docsGroup || 'Mais') === group).map((section) => <span key={section.id}>{section.title}</span>)}</div>
          ))}
        </div>
        <small>{stack.length} tecnologias na pagina Stack</small>
      </aside>
    )
  }

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

function ProjectsMiniPreview({ projects, template }: { projects: DevProject[]; template: DevTemplate }) {
  if (template === 'terminal') {
    return (
      <aside className="mini-preview template-data-preview terminal-data-preview">
        <span>Saida de $ projects</span>
        <div className="terminal-project-mini-list">
          {projects.slice(0, 3).map((project, index) => <div key={project.id}><code>[{String(index + 1).padStart(2, '0')}] {project.title || 'projeto-sem-nome'}</code><p>{project.description || 'descricao pendente'}</p><small>stack: {project.techs || 'nao informada'}</small></div>)}
        </div>
      </aside>
    )
  }

  return (
    <aside className="mini-preview">
      <span>{template === 'desktop' ? 'Previa dos cards na janela' : 'Previa dos cases documentados'}</span>
      <div className={`project-mini-grid project-mini-${template}`}>
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

function ContactsMiniPreview({ contacts, template }: { contacts: ContactLink[]; template: DevTemplate }) {
  if (template === 'terminal') {
    return (
      <aside className="mini-preview template-data-preview terminal-data-preview">
        <span>Saida de $ contact</span>
        <div className="terminal-contact-mini-list">
          {contacts.map((contact) => <p key={contact.id}><code>[{contact.type}]</code><span>{contact.value || 'nao informado'}</span></p>)}
        </div>
      </aside>
    )
  }

  return (
    <aside className="mini-preview">
      <span>{template === 'desktop' ? 'Previa dos atalhos de contato' : 'Previa das referencias de contato'}</span>
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
