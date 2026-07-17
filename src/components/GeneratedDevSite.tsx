import { type CSSProperties, useEffect } from 'react'
import type {
  ContactLink,
  DesktopColorTarget,
  DevExperience,
  DevProject,
  DevTemplate,
  PortfolioPreviewProps,
  PortfolioSection,
} from '../models/portfolio'
import { formatExperiencePeriod, getContrastColor, sectionColorStyle } from '../utils/portfolio'
import { ContactIcon } from './PortfolioIcons'
import { DesktopGeneratedSite } from '../templates/DesktopTemplate'
import { TerminalGeneratedSite } from '../templates/TerminalTemplate'
import { DocsGeneratedSite } from '../templates/DocsTemplate'
import { LandingGeneratedSite } from '../templates/LandingTemplate'

export function GeneratedDevSite({
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
      ) : props.template === 'landing' ? (
        <LandingGeneratedSite {...props} />
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
