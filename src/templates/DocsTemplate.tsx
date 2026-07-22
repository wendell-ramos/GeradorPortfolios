import { type CSSProperties, useState } from 'react'
import type { DefaultSection, PortfolioPreviewProps } from '../models/portfolio'
import { formatExperiencePeriod, getContrastColor, sectionColorStyle } from '../utils/portfolio'
import { ContactIcon } from '../components/PortfolioIcons'

export function DocsGeneratedSite({
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
  const visibleProjects = projects.filter((project) => project.title.trim())
  const visibleContacts = contacts.filter((contact) => contact.value.trim() && contact.url.trim())
  const visibleExperiences = experiences.filter((experience) => experience.company.trim() || experience.role.trim())
  const customSections = enabledSections.filter((section) => !['about', 'stack', 'projects', 'contact'].includes(section.id))
  const hasSection = (id: DefaultSection) => enabledSections.some((section) => section.id === id)
  const docsGroupFor = (id: DefaultSection, fallback: string) => enabledSections.find((section) => section.id === id)?.docsGroup || fallback
  const docsPages = [
    { id: 'overview', label: 'Overview', group: 'Comece aqui' },
    ...(hasSection('about') ? [{ id: 'about', label: enabledSections.find((section) => section.id === 'about')?.title || 'Sobre', group: docsGroupFor('about', 'Perfil') }] : []),
    ...(hasSection('stack') ? [{ id: 'stack', label: enabledSections.find((section) => section.id === 'stack')?.title || 'Stack', group: docsGroupFor('stack', 'Perfil') }] : []),
    ...(hasSection('projects') ? [{ id: 'projects', label: enabledSections.find((section) => section.id === 'projects')?.title || 'Projetos', group: docsGroupFor('projects', 'Trabalho') }] : []),
    ...(hasSection('contact') ? [{ id: 'contact', label: enabledSections.find((section) => section.id === 'contact')?.title || 'Contato', group: docsGroupFor('contact', 'Conecte-se') }] : []),
    ...customSections.map((section) => ({ id: `custom:${section.id}`, label: section.title, group: section.docsGroup || 'Mais' })),
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
          {resumeEnabled && resumeFile && <a className="docs-resume-link" href={resumeFile} rel="noreferrer" target="_blank"><span>PDF</span> Abrir curriculo <small>{resumeName}</small><b aria-hidden="true">-&gt;</b></a>}
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
    <section className={`docs-generated-site docs-content-${templateSettings.docs.contentWidth} ${templateSettings.docs.showPageIndex ? 'has-page-index' : 'without-page-index'}`} style={style}>
      <header className="docs-site-header">
        <button aria-controls="docs-sidebar-navigation" aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Fechar navegacao' : 'Abrir navegacao'} className="docs-mobile-menu" onClick={() => setMobileMenuOpen((current) => !current)} type="button"><span /><span /><span /></button>
        <button className="docs-brand" onClick={() => openPage('overview')} type="button"><strong>{name || 'Portfolio'}</strong><span>{templateSettings.docs.badge || 'Docs'}</span></button>
        <div className="docs-header-context"><span>{activePageDefinition.group}</span><b>/</b><strong>{activePageDefinition.label}</strong></div>
        <span className="docs-version">{templateSettings.docs.version || 'v1.0'}</span>
      </header>

      <div className="docs-site-layout">
        <aside className={mobileMenuOpen ? 'docs-sidebar is-open' : 'docs-sidebar'} id="docs-sidebar-navigation">
          <div className="docs-sidebar-intro"><span>{templateSettings.docs.sidebarLabel || 'DOCUMENTATION'}</span><strong>{role || 'Developer portfolio'}</strong></div>
          <nav aria-label="Paginas da documentacao">
            {groups.map((group) => <div className="docs-nav-group" key={group}><p>{group}</p>{docsPages.filter((page) => page.group === group).map((page) => <button className={activePage === page.id ? 'is-active' : ''} key={page.id} onClick={() => openPage(page.id)} type="button"><span>{page.label}</span><b aria-hidden="true">{activePage === page.id ? '-' : ''}</b></button>)}</div>)}
          </nav>
          <footer><span className="is-online" />Portfolio atualizado</footer>
        </aside>
        {mobileMenuOpen && <button aria-label="Fechar navegacao ao clicar fora" className="docs-sidebar-backdrop" onClick={() => setMobileMenuOpen(false)} type="button" />}

        <main className="docs-main-content" id="docs-page-top">{renderPage()}<footer className="docs-page-footer"><span>{name || 'Portfolio'}</span><button onClick={() => openPage('overview')} type="button">Voltar ao inicio</button></footer></main>

        {templateSettings.docs.showPageIndex && <aside className="docs-page-index"><p>Nesta pagina</p><a href="#docs-page-top">{activePageDefinition.label}</a>{activePage === 'about' && <a href="#docs-experience">Experiencia</a>}{activePage === 'projects' && visibleProjects.slice(0, 5).map((project, index) => <a href={`#docs-project-${index + 1}`} key={project.id}>{project.title}</a>)}<div><span>Ultima atualizacao</span><strong>Agora</strong></div></aside>}
      </div>
    </section>
  )
}
