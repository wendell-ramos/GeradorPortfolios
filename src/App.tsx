import { type ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { Check, Eye, LogOut } from 'lucide-react'
import './App.css'
import './Builder.css'
import type {
  BuilderStep,
  ContactLink,
  ContactType,
  DesktopColorTarget,
  DevCertification,
  DevEducation,
  DevExperience,
  DevProject,
  DevTemplate,
  PortfolioDraft,
  PortfolioSection,
  SectionIcon,
  TemplateSettings,
} from './models/portfolio'
import { usePortfolioDraftPersistence } from './hooks/usePortfolioDraftPersistence'
import { moveById, terminalSlug } from './utils/portfolio'
import { validateContacts, validateIdentity, validateProjects } from './utils/validation'
import { PortfyBrand, ProjectStartScreen } from './components/BuilderUI'
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
  const [resumeEnabled, setResumeEnabled] = useState(initialPreset.resumeEnabled)
  const [resumeFile, setResumeFile] = useState(initialPreset.resumeFile)
  const [resumeName, setResumeName] = useState(initialPreset.resumeName)
  const [resumeFileError, setResumeFileError] = useState('')
  const [projectImageErrors, setProjectImageErrors] = useState<Record<string, string>>({})
  const [experiences, setExperiences] = useState<DevExperience[]>(initialPreset.experiences)
  const [educations, setEducations] = useState<DevEducation[]>(initialPreset.educations)
  const [certifications, setCertifications] = useState<DevCertification[]>(initialPreset.certifications)

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

  function handleResumeFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setResumeFileError('Escolha um arquivo PDF.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setResumeFileError('O curriculo deve ter no maximo 10 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return
      setResumeFile(reader.result)
      setResumeName(file.name)
      setResumeFileError('')
    }
    reader.onerror = () => setResumeFileError('Nao foi possivel carregar esse PDF.')
    reader.readAsDataURL(file)
  }

  function removeResumeFile() {
    setResumeFile('')
    setResumeName('')
    setResumeFileError('')
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

  function addEducation() {
    setEducations((current) => [...current, { id: crypto.randomUUID(), institution: '', course: '', degree: '', location: '', startYear: '', endYear: '', current: false }])
  }

  function updateEducation<K extends keyof Omit<DevEducation, 'id'>>(educationId: string, field: K, value: DevEducation[K]) {
    setEducations((current) => current.map((item) => item.id === educationId
      ? { ...item, [field]: value, ...(field === 'current' && value ? { endYear: '' } : {}) }
      : item))
  }

  function removeEducation(educationId: string) {
    setEducations((current) => current.filter((item) => item.id !== educationId))
  }

  function moveEducation(educationId: string, direction: -1 | 1) {
    setEducations((current) => moveById(current, educationId, direction))
  }

  function addCertification() {
    setCertifications((current) => [...current, { id: crypto.randomUUID(), name: '', issuer: '', issueDate: '', credentialId: '', credentialUrl: '' }])
  }

  function updateCertification<K extends keyof Omit<DevCertification, 'id'>>(certificationId: string, field: K, value: DevCertification[K]) {
    setCertifications((current) => current.map((item) => item.id === certificationId ? { ...item, [field]: value } : item))
  }

  function removeCertification(certificationId: string) {
    setCertifications((current) => current.filter((item) => item.id !== certificationId))
  }

  function moveCertification(certificationId: string, direction: -1 | 1) {
    setCertifications((current) => moveById(current, certificationId, direction))
  }
  const [stackText, setStackText] = useState(initialPreset.stackText)
  const [sections, setSections] = useState<PortfolioSection[]>(initialPreset.sections)
  const [customSectionTitle, setCustomSectionTitle] = useState('')
  const [customSectionDescription, setCustomSectionDescription] = useState('')
  const [customSectionIcon, setCustomSectionIcon] = useState<SectionIcon>('document')
  const [projects, setProjects] = useState<DevProject[]>(initialPreset.projects)
  const [contacts, setContacts] = useState<ContactLink[]>(initialPreset.contacts)

  const restoreDraft = useCallback((draft: PortfolioDraft) => {
    const savedTemplateSettings = draft.templateSettings ?? defaultTemplateSettings

    setStep(draft.step)
    setMaxUnlockedStep(draft.maxUnlockedStep)
    setTemplate(draft.template)
    setAccentColor(draft.accentColor)
    setTemplateBackgrounds({ ...defaultTemplateBackgrounds, ...draft.templateBackgrounds })
    setDesktopAreaColors({ ...defaultDesktopAreaColors, ...draft.desktopAreaColors })
    setTemplateSettings({
      desktop: { ...defaultTemplateSettings.desktop, ...savedTemplateSettings.desktop },
      terminal: { ...defaultTemplateSettings.terminal, ...savedTemplateSettings.terminal },
      docs: { ...defaultTemplateSettings.docs, ...savedTemplateSettings.docs },
      landing: { ...defaultTemplateSettings.landing, ...savedTemplateSettings.landing },
    })
    setName(draft.name)
    setRole(draft.role)
    setLocation(draft.location)
    setHeadline(draft.headline)
    setBio(draft.bio)
    setProfilePhoto(draft.profilePhoto)
    setResumeEnabled(draft.resumeEnabled ?? Boolean(draft.resumeFile))
    setResumeFile(draft.resumeFile ?? '')
    setResumeName(draft.resumeName ?? '')
    setResumeFileError('')
    setExperiences(draft.experiences)
    setEducations(draft.educations)
    setCertifications(draft.certifications)
    setStackText(draft.stackText)
    setSections(draft.sections)
    setProjects((draft.projects ?? []).map((project, index) => ({
      ...project,
      category: project.category ?? 'Projeto',
      status: project.status ?? 'Concluido',
      year: project.year ?? '',
      featured: project.featured ?? index === 0,
    })))
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
      resumeEnabled,
      resumeFile,
      resumeName,
      experiences,
      educations,
      certifications,
      stackText,
      sections,
      projects,
      contacts,
    }
  ), [accentColor, bio, certifications, contacts, desktopAreaColors, educations, experiences, headline, location, maxUnlockedStep, name, profilePhoto, projects, resumeEnabled, resumeFile, resumeName, role, sections, stackText, step, template, templateBackgrounds, templateSettings])

  const { draftErrorReason, draftReady, draftStatus, saveNow } = usePortfolioDraftPersistence({
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
  const identityValidation = validateIdentity({ bio, experiences, headline, name, resumeEnabled, resumeFile, role })
  const projectValidation = validateProjects(projects, projectsRequired)
  const contactValidation = validateContacts(contacts, contactsRequired)
  const stepCompletion: Record<BuilderStep, boolean> = {
    identity: identityValidation.valid,
    style: true,
    sections: enabledSections.length > 0,
    projects: projectValidation.valid,
    contact: contactValidation.valid,
    preview: true,
  }
  const stepErrorMessages: Record<BuilderStep, string> = {
    identity: 'Revise os campos indicados para continuar.',
    style: 'Escolha o estilo do portfolio para continuar.',
    sections: 'Mantenha ao menos uma secao ativa para continuar.',
    projects: 'Revise os projetos e seus links para continuar.',
    contact: 'Revise os contatos e seus links para continuar.',
    preview: '',
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    const frame = window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('.step-content')?.scrollTo({ top: 0, behavior: 'auto' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [step])

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

  function addPresetSection(section: Omit<PortfolioSection, 'id' | 'enabled'> & { id?: string }) {
    setSections((current) => {
      if (section.id && current.some((item) => item.id === section.id)) return current
      return [
        ...current,
        {
        ...section,
        id: section.id || crypto.randomUUID(),
        terminalCommand: section.terminalCommand || terminalSlug(section.title),
        docsGroup: section.docsGroup || 'Mais',
        enabled: true,
        },
      ]
    })
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

  function updateProject(projectId: string, field: keyof DevProject, value: DevProject[keyof DevProject]) {
    if (field === 'featured' && value === true) {
      setProjects((current) => current.map((project) => ({
        ...project,
        featured: project.id === projectId,
      })))
      return
    }

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
        category: '',
        status: '',
        year: '',
        featured: false,
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
    const saved = await saveNow()
    if (saved) {
      setSiteMode(false)
      setSetupComplete(false)
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
    setResumeEnabled(false)
    setResumeFile('')
    setResumeName('')
    setResumeFileError('')
    setProjectImageErrors({})
    setExperiences([])
    setEducations([])
    setCertifications([])
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
    setResumeEnabled(preset.resumeEnabled)
    setResumeFile(preset.resumeFile)
    setResumeName(preset.resumeName)
    setResumeFileError('')
    setProjectImageErrors({})
    setExperiences(preset.experiences)
    setEducations(preset.educations)
    setCertifications(preset.certifications)
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
        <PortfyBrand subtitle="Preparando seu estudio..." />
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
        certifications={certifications}
        educations={educations}
        experiences={experiences}
        headline={headline}
        location={location}
        name={name}
        onBackgroundColorChange={(color) => setTemplateBackgrounds((current) => ({ ...current, desktop: color }))}
        onDesktopAreaColorChange={(target, color) => setDesktopAreaColors((current) => ({ ...current, [target]: color }))}
        onExit={() => setSiteMode(false)}
        profilePhoto={profilePhoto}
        resumeEnabled={resumeEnabled}
        resumeFile={resumeFile}
        resumeName={resumeName}
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
    <main className={`flow-shell flow-template-${template}`}>
      <header className="flow-header">
        <PortfyBrand subtitle="Gerador de portfólios" />
        <div className="flow-progress" aria-label={`Etapa ${currentIndex + 1} de ${steps.length}`}>
          <div>
            <span>Seu portfolio</span>
            <strong>{currentIndex + 1} de {steps.length}</strong>
          </div>
          <i><span style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }} /></i>
        </div>
        <div className="flow-header-actions">
          <span className={`draft-status is-${draftStatus}`} aria-live="polite">
            {draftStatus === 'saved' ? <Check aria-hidden="true" /> : <i />}
            {draftStatus === 'saving'
              ? 'Salvando...'
              : draftStatus === 'error'
                ? draftErrorReason === 'quota'
                  ? 'Armazenamento cheio'
                  : draftErrorReason === 'blocked'
                    ? 'Armazenamento ocupado'
                    : draftErrorReason === 'unavailable'
                      ? 'Salvamento indisponivel'
                      : 'Falha ao salvar'
                : 'Rascunho salvo'}
          </span>
          <button className="ghost-button" onClick={exitToStart} type="button"><LogOut aria-hidden="true" />Sair</button>
          {(builderFlowMode === 'free' || maxUnlockedStep >= steps.length - 1) && (
            <button className="ghost-button" onClick={() => openUnlockedStep('preview', steps.length - 1)} type="button">
              <Eye aria-hidden="true" />Visualizar portfolio
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
            validationErrors={showStepError ? identityValidation : { valid: true, fields: {}, experiences: {} }}
            handleProfilePhoto={handleProfilePhoto}
            handleResumeFile={handleResumeFile}
            headline={headline}
            location={location}
            moveExperience={moveExperience}
            name={name}
            profilePhoto={profilePhoto}
            profilePhotoError={profilePhotoError}
            removeResumeFile={removeResumeFile}
            resumeEnabled={resumeEnabled}
            resumeFile={resumeFile}
            resumeFileError={resumeFileError}
            resumeName={resumeName}
            removeExperience={removeExperience}
            role={role}
            setBio={setBio}
            setHeadline={setHeadline}
            setLocation={setLocation}
            setName={setName}
            setProfilePhoto={setProfilePhoto}
            setProfilePhotoError={setProfilePhotoError}
            setResumeEnabled={setResumeEnabled}
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
            addCertification={addCertification}
            addEducation={addEducation}
            certifications={certifications}
            customSectionDescription={customSectionDescription}
            customSectionIcon={customSectionIcon}
            customSectionTitle={customSectionTitle}
            enabledSections={enabledSections}
            educations={educations}
            moveCertification={moveCertification}
            moveEducation={moveEducation}
            moveSection={moveSection}
            removeSection={removeSection}
            removeCertification={removeCertification}
            removeEducation={removeEducation}
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
            updateCertification={updateCertification}
            updateEducation={updateEducation}
          />
        )}

        {step === 'projects' && (
          <ProjectsStep
            addProject={addProject}
            handleProjectImage={handleProjectImage}
            moveProject={moveProject}
            projectImageErrors={projectImageErrors}
            projects={projects}
            validationErrors={showStepError ? projectValidation : { valid: true, items: {} }}
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
            validationErrors={showStepError ? contactValidation : { valid: true, items: {} }}
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
