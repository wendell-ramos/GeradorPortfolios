import { useState, type CSSProperties, type PointerEvent } from 'react'
import { ArrowDown, ArrowUpRight, Download, MapPin } from 'lucide-react'
import type { DefaultSection, PortfolioPreviewProps } from '../models/portfolio'
import { formatExperiencePeriod, getContrastColor } from '../utils/portfolio'
import { ContactIcon } from '../components/PortfolioIcons'

export function LandingGeneratedSite({
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
  resumeEnabled,
  resumeFile,
  resumeName,
  role,
  sections,
  stack,
  templateSettings,
}: PortfolioPreviewProps) {
  const enabledSections = sections.filter((section) => section.enabled)
  const settings = templateSettings.landing
  const renderedSections = settings.composition === 'projects'
    ? [...enabledSections].sort((left, right) => Number(right.id === 'projects') - Number(left.id === 'projects'))
    : enabledSections
  const hasSection = (id: DefaultSection) => enabledSections.some((section) => section.id === id)
  const visibleProjects = projects.filter((project) => project.title.trim())
  const orderedProjects = [...visibleProjects].sort((left, right) => Number(right.featured) - Number(left.featured))
  const projectCategories = [...new Set(orderedProjects.map((project) => project.category.trim()).filter(Boolean))]
  const [activeCategory, setActiveCategory] = useState('Todos')
  const selectedCategory = activeCategory === 'Todos' || projectCategories.includes(activeCategory) ? activeCategory : 'Todos'
  const displayedProjects = selectedCategory === 'Todos'
    ? orderedProjects
    : orderedProjects.filter((project) => project.category.trim() === selectedCategory)
  const visibleContacts = contacts.filter((contact) => contact.value.trim() && contact.url.trim())
  const visibleExperiences = experiences.filter((experience) => experience.company.trim() || experience.role.trim())
  const firstSectionId = renderedSections[0]?.id
  const metrics = [
    { value: settings.metricOneValue, label: settings.metricOneLabel },
    { value: settings.metricTwoValue, label: settings.metricTwoLabel },
    { value: settings.metricThreeValue, label: settings.metricThreeLabel },
  ].filter((metric) => metric.value.trim() || metric.label.trim())
  const primaryTarget = hasSection('projects')
    ? '#landing-projects'
    : firstSectionId
      ? `#landing-${firstSectionId}`
      : visibleContacts[0]?.url
  const contactTarget = hasSection('contact') ? '#landing-contact' : visibleContacts[0]?.url

  const style = {
    '--custom-accent': accentColor,
    '--site-background': backgroundColor,
    '--site-foreground': getContrastColor(backgroundColor),
  } as CSSProperties

  const updateSpotlight = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`)
  }

  return (
    <section
      className={`landing-generated-site landing-composition-${settings.composition} landing-projects-${settings.projectLayout} landing-motion-${settings.motion}`}
      onPointerMove={updateSpotlight}
      style={style}
    >
      <header className="landing-nav">
        <a className="landing-brand" href="#landing-home"><span>{initials(name)}</span><strong>{name || 'Portfolio'}</strong></a>
        <nav aria-label="Navegacao da landing page">
          {renderedSections.map((section) => <a href={`#landing-${section.id}`} key={section.id}>{section.title}</a>)}
        </nav>
        {contactTarget && <a className="landing-nav-cta" href={contactTarget}>Vamos conversar <ArrowUpRight aria-hidden="true" /></a>}
      </header>

      <main>
        <section className="landing-hero" id="landing-home">
          <div className="landing-hero-orbit" aria-hidden="true"><span /><span /><span /></div>
          <div className="landing-hero-copy">
            <p className="landing-eyebrow"><i />{settings.eyebrow || 'Disponivel para novos projetos'}</p>
            <h1>{renderHighlightedText(headline || `Eu sou ${name || 'desenvolvedor'} e crio experiencias digitais.`, settings.highlight)}</h1>
            <div className="landing-hero-meta">
              <p>{role || 'Desenvolvedor'} que transforma problemas em produtos digitais claros, funcionais e memoraveis.</p>
              <span><MapPin aria-hidden="true" />{location || 'Trabalho remoto'}</span>
            </div>
            <div className="landing-hero-actions">
              {primaryTarget && <a href={primaryTarget}>{settings.primaryAction || 'Explorar projetos'} <ArrowDown aria-hidden="true" /></a>}
              {visibleContacts[0] && <a href={visibleContacts[0].url} rel="noreferrer" target="_blank">Entrar em contato <ArrowUpRight aria-hidden="true" /></a>}
              {resumeEnabled && (resumeFile || settings.resumeUrl) && <a href={resumeFile || settings.resumeUrl} rel="noreferrer" target="_blank" title={resumeName || 'Curriculo em PDF'}>Curriculo <Download aria-hidden="true" /></a>}
            </div>
            {settings.showMetrics && metrics.length > 0 && (
              <div className="landing-hero-metrics">
                {metrics.map((metric, index) => (
                  <div key={`${metric.value}-${index}`}>
                    <strong>{metric.value || '--'}</strong>
                    <span>{metric.label || 'Metrica personalizada'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={profilePhoto ? 'landing-portrait has-photo' : 'landing-portrait'}>
            <span className="landing-portrait-index">01 / HERO</span>
            {profilePhoto ? <img alt={`Foto de ${name}`} src={profilePhoto} /> : <strong>{initials(name)}</strong>}
            <div><span>{name || 'Seu nome'}</span><small>{role || 'Desenvolvedor'}</small></div>
          </div>
          {firstSectionId && <a className="landing-scroll-cue" href={`#landing-${firstSectionId}`}><span>Scroll</span><i /></a>}
        </section>

        {renderedSections.map((section, index) => {
          const sectionIndex = String(index + 1).padStart(2, '0')

          if (section.id === 'about') {
            return (
              <section className="landing-section landing-about" id="landing-about" key={section.id}>
                <LandingSectionHeading index={sectionIndex} label="Sobre mim" title="Codigo com contexto. Design com intencao." />
                <div className="landing-about-grid">
                  <p className="landing-about-lead">{bio || 'Conte aqui sua trajetoria, seus interesses e o tipo de impacto que busca criar.'}</p>
                  <div className="landing-experience-list">
                    <span>Trajetoria recente</span>
                    {visibleExperiences.length ? visibleExperiences.map((experience) => (
                      <article key={experience.id}>
                        <time>{formatExperiencePeriod(experience)}</time>
                        <div><h3>{experience.role || 'Cargo'}</h3><strong>{experience.company || 'Empresa'}{experience.city ? ` / ${experience.city}` : ''}</strong>{experience.activities && <p>{experience.activities}</p>}</div>
                      </article>
                    )) : <p>Nenhuma experiencia profissional cadastrada.</p>}
                  </div>
                </div>
              </section>
            )
          }

          if (section.id === 'stack') {
            return settings.showMarquee && stack.length > 0 ? (
              <section className="landing-marquee-section" id="landing-stack" key={section.id}>
                <span className="landing-marquee-label">{sectionIndex} / Stack principal</span>
                <div className="landing-marquee" aria-label="Tecnologias principais">
                  <div>{[...stack, ...stack].map((item, itemIndex) => <span key={`${item}-${itemIndex}`}>{item}<i /></span>)}</div>
                </div>
              </section>
            ) : (
              <section className="landing-section landing-stack" id="landing-stack" key={section.id}>
                <LandingSectionHeading index={sectionIndex} label="Stack" title="Ferramentas que uso para tirar ideias do papel." />
                <div>{stack.map((item, itemIndex) => <span key={`${item}-${itemIndex}`}><b>{String(itemIndex + 1).padStart(2, '0')}</b>{item}</span>)}</div>
              </section>
            )
          }

          if (section.id === 'projects') {
            return (
              <section className="landing-section landing-projects" id="landing-projects" key={section.id}>
                <LandingSectionHeading index={sectionIndex} label="Projetos selecionados" title="Trabalho real, pensado de ponta a ponta." />
                {projectCategories.length > 1 && (
                  <div className="landing-project-filters" aria-label="Filtrar projetos por categoria">
                    {['Todos', ...projectCategories].map((category) => (
                      <button
                        aria-pressed={selectedCategory === category}
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        type="button"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
                <div className="landing-project-list">
                  {displayedProjects.map((project, projectIndex) => (
                    <article className={`${project.imageUrl ? 'has-image ' : ''}${project.featured ? 'is-featured' : ''}`.trim()} key={project.id}>
                      <div className="landing-project-media">
                        {project.imageUrl ? <img alt={`Capa do projeto ${project.title}`} src={project.imageUrl} /> : <span>{String(projectIndex + 1).padStart(2, '0')}</span>}
                        {project.featured && <b className="landing-project-featured-badge">Destaque</b>}
                        <i aria-hidden="true" />
                      </div>
                      <div className="landing-project-copy">
                        <span>{project.category || `Case ${String(projectIndex + 1).padStart(2, '0')}`}</span>
                        <h3>{project.title}</h3>
                        {(project.status || project.year) && (
                          <div className="landing-project-meta">
                            {project.status && <span>{project.status}</span>}
                            {project.year && <time>{project.year}</time>}
                          </div>
                        )}
                        <p>{project.description || 'Descricao do projeto ainda nao informada.'}</p>
                        {project.techs && <div className="landing-project-techs">{project.techs.split(',').map((tech) => <b key={tech.trim()}>{tech.trim()}</b>)}</div>}
                        <div className="landing-project-links">
                          {project.liveUrl && <a href={project.liveUrl} rel="noreferrer" target="_blank">Ver projeto <ArrowUpRight aria-hidden="true" /></a>}
                          {project.repoUrl && <a href={project.repoUrl} rel="noreferrer" target="_blank">Codigo <ArrowUpRight aria-hidden="true" /></a>}
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
              <section className="landing-contact" id="landing-contact" key={section.id}>
                <p className="landing-eyebrow"><i />Tem uma ideia em mente?</p>
                <h2>Vamos criar algo que mereca ser lembrado.</h2>
                <div className="landing-contact-grid">
                  <p>Estou aberto a projetos, oportunidades e boas conversas sobre tecnologia e produtos digitais.</p>
                  <div>{visibleContacts.map((contact) => (
                    <a href={contact.url} key={contact.id} rel="noreferrer" target="_blank"><ContactIcon type={contact.type} /><span><small>{contact.label}</small><strong>{contact.value}</strong></span><ArrowUpRight aria-hidden="true" /></a>
                  ))}</div>
                </div>
              </section>
            )
          }

          return (
            <section className="landing-section landing-custom" id={`landing-${section.id}`} key={section.id} style={section.backgroundColor ? { backgroundColor: section.backgroundColor, color: getContrastColor(section.backgroundColor) } : undefined}>
              <LandingSectionHeading index={sectionIndex} label="Mais sobre meu trabalho" title={section.title} />
              <p>{section.description || 'Esta secao ainda nao possui uma descricao.'}</p>
            </section>
          )
        })}
      </main>

      <footer className="landing-footer"><strong>{name || 'Portfolio'}</strong><span>{new Date().getFullYear()} / Feito para a web</span><a href="#landing-home">Voltar ao topo <ArrowUpRight aria-hidden="true" /></a></footer>
    </section>
  )
}

function LandingSectionHeading({ index, label, title }: { index: string; label: string; title: string }) {
  return <header className="landing-section-heading"><span>{index} / {label}</span><h2>{title}</h2></header>
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase() || 'PF'
}

function renderHighlightedText(text: string, highlight: string) {
  const cleanHighlight = highlight.trim()
  if (!cleanHighlight) return text

  const highlightIndex = text.toLocaleLowerCase().indexOf(cleanHighlight.toLocaleLowerCase())
  if (highlightIndex < 0) return text

  return (
    <>
      {text.slice(0, highlightIndex)}
      <em>{text.slice(highlightIndex, highlightIndex + cleanHighlight.length)}</em>
      {text.slice(highlightIndex + cleanHighlight.length)}
    </>
  )
}
