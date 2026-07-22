import { type CSSProperties, type MouseEvent as ReactMouseEvent, type ReactNode, useEffect, useState } from 'react'
import type { DesktopColorTarget, DesktopEditableTarget, PortfolioPreviewProps, SectionIcon } from '../models/portfolio'
import { defaultDesktopAreaColors, defaultTemplateBackgrounds, desktopAreaColorOptions, desktopColorTargets } from '../data/devPortfolioDefaults'
import { formatExperiencePeriod, getContrastColor, sectionColorStyle } from '../utils/portfolio'
import { ContactIcon, DesktopEmptyState, DesktopShortcutIcon } from '../components/PortfolioIcons'

export function DesktopGeneratedSite({
  accentColor,
  backgroundColor,
  desktopAreaColors,
  bio,
  contacts,
  certifications,
  educations,
  experiences,
  headline,
  location,
  name,
  profilePhoto,
  resumeEnabled,
  resumeFile,
  resumeName,
  projects,
  role,
  sections,
  stack,
  templateSettings,
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
  const visibleEducations = educations.filter((education) => education.institution.trim() || education.course.trim())
  const visibleCertifications = certifications.filter((certification) => certification.name.trim() || certification.issuer.trim())
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

    if (activeSection === 'resume') {
      return (
        <div className="desktop-copy-content desktop-resume-content">
          <p className="desktop-window-kicker">Documento profissional</p>
          <h2>Curriculo</h2>
          <p>Consulte minha formacao, experiencia e principais qualificacoes no documento completo.</p>
          <div className="desktop-resume-file">
            <span aria-hidden="true">PDF</span>
            <div><strong>{resumeName || 'Curriculo.pdf'}</strong><small>Documento pronto para visualizacao</small></div>
            <a href={resumeFile} rel="noreferrer" target="_blank">Abrir PDF</a>
          </div>
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

    if (activeSection === 'education') {
      return (
        <div className="desktop-copy-content desktop-structured-content">
          <p className="desktop-window-kicker">Trajetoria academica</p>
          <h2>Formacao</h2>
          {visibleEducations.length === 0 && <DesktopEmptyState message="Nenhuma formacao adicionada." />}
          <div className="desktop-structured-list">
            {visibleEducations.map((education) => <article key={education.id}><span>{education.current ? 'EM ANDAMENTO' : education.endYear || 'FORMACAO'}</span><div><h3>{education.course || 'Curso nao informado'}</h3><strong>{education.institution || 'Instituicao nao informada'}</strong><p>{[education.degree, education.location, [education.startYear, education.current ? 'Atual' : education.endYear].filter(Boolean).join(' - ')].filter(Boolean).join(' / ')}</p></div></article>)}
          </div>
        </div>
      )
    }

    if (activeSection === 'certifications') {
      return (
        <div className="desktop-copy-content desktop-structured-content">
          <p className="desktop-window-kicker">Credenciais profissionais</p>
          <h2>Cursos e certificados</h2>
          {visibleCertifications.length === 0 && <DesktopEmptyState message="Nenhum certificado adicionado." />}
          <div className="desktop-structured-list">
            {visibleCertifications.map((certification) => <article key={certification.id}><span>{certification.issueDate || 'CERTIFICADO'}</span><div><h3>{certification.name || 'Certificacao'}</h3><strong>{certification.issuer || 'Instituicao nao informada'}</strong>{certification.credentialId && <p>Credencial: {certification.credentialId}</p>}{certification.credentialUrl && <a href={certification.credentialUrl} rel="noreferrer" target="_blank">Ver credencial</a>}</div></article>)}
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

  const desktopSectionItems = sections.map(({ icon, id, title }) => ({
      id,
      icon,
      title: id === 'about' ? 'Sobre mim' : id === 'projects' ? 'Meus projetos' : id === 'stack' ? 'Habilidades' : title,
    }))
  if (resumeEnabled && resumeFile) {
    const aboutIndex = desktopSectionItems.findIndex((item) => item.id === 'about')
    desktopSectionItems.splice(aboutIndex >= 0 ? aboutIndex + 1 : 0, 0, { id: 'resume', title: 'Curriculo', icon: 'document' })
  }
  const desktopItems = [
    { id: 'home', title: 'Bem-vindo', icon: 'home' as SectionIcon },
    ...desktopSectionItems,
  ]
  const windowTitle = activeSection === 'home'
    ? templateSettings.desktop.homeTitle || 'Portfolio'
    : activeSection === 'resume'
      ? 'Curriculo'
      : activeDefinition?.title ?? 'Portfolio'
  const statusText = activeSection === 'projects'
    ? `${visibleProjects.length} projetos encontrados`
    : activeSection === 'resume'
      ? 'Documento PDF disponivel'
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
      className={`desktop-generated-site desktop-shortcuts-${templateSettings.desktop.shortcutSize} desktop-window-${templateSettings.desktop.windowWidth} ${editingColors ? 'is-color-editing' : ''} ${colorAreaClass('background')}`}
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
        <button className="desktop-start-button" onClick={() => openSection('home')} type="button"><span>{displayInitials}</span> {templateSettings.desktop.startLabel || 'iniciar'}</button>
        <button className="desktop-active-app" onClick={() => setWindowOpen(true)} type="button">{windowTitle}</button>
        <time><span aria-hidden="true" />{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</time>
      </footer>
    </section>
  )
}
