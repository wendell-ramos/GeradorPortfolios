import { type ChangeEvent, useCallback, useMemo, useState } from 'react'
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
  PortfolioSection,
  SectionIcon,
  TemplateSettings,
} from './models/portfolio'
import { writePortfolioDraft } from './storage/portfolioDraft'
import { usePortfolioDraftPersistence } from './hooks/usePortfolioDraftPersistence'
import { moveById, terminalSlug } from './utils/portfolio'
import { ProjectStartScreen } from './components/BuilderUI'
import { GeneratedDevSite } from './components/GeneratedDevSite'
import { IdentityStep } from './steps/IdentityStep'
import { ProjectsStep } from './steps/ProjectsStep'
import { ContactStep } from './steps/ContactStep'
import { PreviewStep } from './steps/PreviewStep'
import { StyleStep } from './steps/StyleStep'
import { SectionsStep } from './steps/SectionsStep'
import {
  contactPresets,
  createDefaultSections,
  createPresetDevPortfolio,
  defaultDesktopAreaColors,
  defaultTemplateBackgrounds,
  defaultTemplateSettings,
  steps,
} from './data/devPortfolioDefaults'

function App() {
  const [initialPreset] = useState(createPresetDevPortfolio)
  const [builderFlowMode] = useState<'free' | 'guided'>('guided')
  const [setupComplete, setSetupComplete] = useState(false)
  const [step, setStep] = useState<BuilderStep>('identity')
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(0)
  const [showStepError, setShowStepError] = useState(false)
  const [siteMode, setSiteMode] = useState(false)
  const [template, setTemplate] = useState<DevTemplate>(initialPreset.template)
  const [accentColor, setAccentColor] = useState(initialPreset.accentColor)
  const [templateBackgrounds, setTemplateBackgrounds] = useState<Record<DevTemplate, string>>(initialPreset.templateBackgrounds)
  const [desktopAreaColors, setDesktopAreaColors] = useState<Record<DesktopColorTarget, string>>(initialPreset.desktopAreaColors)
  const [templateSettings, setTemplateSettings] = useState<TemplateSettings>(initialPreset.templateSettings)
  const [name, setName] = useState(initialPreset.name)
  const [role, setRole] = useState(initialPreset.role)
  const [location, setLocation] = useState(initialPreset.location)
  const [headline, setHeadline] = useState(initialPreset.headline)
  const [bio, setBio] = useState(initialPreset.bio)
  const [profilePhoto, setProfilePhoto] = useState(initialPreset.profilePhoto)
  const [profilePhotoError, setProfilePhotoError] = useState('')
  const [projectImageErrors, setProjectImageErrors] = useState<Record<string, string>>({})
  const [experiences, setExperiences] = useState<DevExperience[]>(initialPreset.experiences)

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
  const [stackText, setStackText] = useState(initialPreset.stackText)
  const [sections, setSections] = useState<PortfolioSection[]>(initialPreset.sections)
  const [customSectionTitle, setCustomSectionTitle] = useState('')
  const [customSectionDescription, setCustomSectionDescription] = useState('')
  const [customSectionIcon, setCustomSectionIcon] = useState<SectionIcon>('document')
  const [projects, setProjects] = useState<DevProject[]>(initialPreset.projects)
  const [contacts, setContacts] = useState<ContactLink[]>(initialPreset.contacts)

  const restoreDraft = useCallback((draft: PortfolioDraft) => {
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
  }, [])

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

  const { draftReady, draftStatus, setDraftStatus } = usePortfolioDraftPersistence({
    currentDraft,
    onRestore: restoreDraft,
    setupComplete,
  })

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
    setSections(createDefaultSections())
    setCustomSectionTitle('')
    setCustomSectionDescription('')
    setCustomSectionIcon('document')
    setProjects([])
    setContacts([])
    setSetupComplete(true)
  }

  function startPresetPortfolio() {
    const preset = createPresetDevPortfolio()
    setStep('identity')
    setMaxUnlockedStep(0)
    setShowStepError(false)
    setSiteMode(false)
    setTemplate(preset.template)
    setAccentColor(preset.accentColor)
    setTemplateBackgrounds(preset.templateBackgrounds)
    setDesktopAreaColors(preset.desktopAreaColors)
    setTemplateSettings(preset.templateSettings)
    setName(preset.name)
    setRole(preset.role)
    setLocation(preset.location)
    setHeadline(preset.headline)
    setBio(preset.bio)
    setProfilePhoto(preset.profilePhoto)
    setProfilePhotoError('')
    setProjectImageErrors({})
    setExperiences(preset.experiences)
    setStackText(preset.stackText)
    setSections(preset.sections)
    setCustomSectionTitle('')
    setCustomSectionDescription('')
    setCustomSectionIcon('document')
    setProjects(preset.projects)
    setContacts(preset.contacts)
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
          <IdentityStep
            addExperience={addExperience}
            bio={bio}
            experiences={experiences}
            handleProfilePhoto={handleProfilePhoto}
            headline={headline}
            location={location}
            moveExperience={moveExperience}
            name={name}
            profilePhoto={profilePhoto}
            profilePhotoError={profilePhotoError}
            removeExperience={removeExperience}
            role={role}
            setBio={setBio}
            setHeadline={setHeadline}
            setLocation={setLocation}
            setName={setName}
            setProfilePhoto={setProfilePhoto}
            setProfilePhotoError={setProfilePhotoError}
            setRole={setRole}
            updateExperience={updateExperience}
          />
        )}

        {step === 'style' && (
          <StyleStep
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            setTemplate={setTemplate}
            setTemplateBackgrounds={setTemplateBackgrounds}
            setTemplateSettings={setTemplateSettings}
            template={template}
            templateBackgrounds={templateBackgrounds}
            templateSettings={templateSettings}
          />
        )}

        {step === 'sections' && (
          <SectionsStep
            addCustomSection={addCustomSection}
            addPresetSection={addPresetSection}
            customSectionDescription={customSectionDescription}
            customSectionIcon={customSectionIcon}
            customSectionTitle={customSectionTitle}
            enabledSections={enabledSections}
            moveSection={moveSection}
            removeSection={removeSection}
            sections={sections}
            setCustomSectionDescription={setCustomSectionDescription}
            setCustomSectionIcon={setCustomSectionIcon}
            setCustomSectionTitle={setCustomSectionTitle}
            setStackText={setStackText}
            stack={stack}
            stackText={stackText}
            template={template}
            toggleSection={toggleSection}
            updateSectionColor={updateSectionColor}
            updateSectionDocsGroup={updateSectionDocsGroup}
            updateSectionIcon={updateSectionIcon}
            updateSectionTerminalCommand={updateSectionTerminalCommand}
          />
        )}

        {step === 'projects' && (
          <ProjectsStep
            addProject={addProject}
            handleProjectImage={handleProjectImage}
            moveProject={moveProject}
            projectImageErrors={projectImageErrors}
            projects={projects}
            removeProject={removeProject}
            removeProjectImage={removeProjectImage}
            template={template}
            updateProject={updateProject}
          />
        )}
        {step === 'contact' && (
          <ContactStep
            addPresetContact={addPresetContact}
            contacts={contacts}
            removeContact={removeContact}
            template={template}
            updateContact={updateContact}
            updateContactType={updateContactType}
          />
        )}

        {step === 'preview' && (
          <PreviewStep
            contacts={contacts.length}
            enabledSections={enabledSections.length}
            name={name}
            onOpenSite={() => setSiteMode(true)}
            projects={projects.length}
            setStep={setStep}
            stack={stack.length}
            template={template}
          />
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


export default App
