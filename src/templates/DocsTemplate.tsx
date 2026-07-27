import { type CSSProperties, type ReactNode, useState } from 'react'
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Braces,
  BriefcaseBusiness,
  CalendarClock,
  Check,
  ChevronRight,
  FileText,
  FolderKanban,
  GraduationCap,
  Home,
  Mail,
  Menu,
  MessageSquareQuote,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react'
import type { DefaultSection, PortfolioPreviewProps } from '../models/portfolio'
import { formatExperiencePeriod, getContrastColor, sectionColorStyle } from '../utils/portfolio'
import { ContactIcon } from '../components/PortfolioIcons'

type DocsPage = {
  id: string
  label: string
  group: string
}

const pageIcons: Record<string, LucideIcon> = {
  overview: Home,
  about: UserRound,
  stack: Braces,
  education: GraduationCap,
  certifications: Award,
  services: BriefcaseBusiness,
  testimonials: MessageSquareQuote,
  availability: CalendarClock,
  projects: FolderKanban,
  contact: Mail,
}

function iconForPage(pageId: string) {
  return pageIcons[pageId] || FileText
}

function DocsPageHeader({ description, eyebrow, title }: { description: string; eyebrow: string; title: string }) {
  return (
    <header className="docs-v2-page-header">
      <span>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  )
}

function DocsEmptyState({ children, title }: { children: ReactNode; title: string }) {
  return <div className="docs-v2-empty"><FileText aria-hidden="true" /><div><strong>{title}</strong><p>{children}</p></div></div>
}

export function DocsGeneratedSite({
  accentColor,
  backgroundColor,
  bio,
  contacts,
  certifications,
  educations,
  experiences,
  services,
  languages,
  languagesEnabled,
  testimonials,
  availability,
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
  const visibleEducations = educations.filter((education) => education.institution.trim() || education.course.trim())
  const visibleCertifications = certifications.filter((certification) => certification.name.trim() || certification.issuer.trim())
  const visibleServices = services.filter((service) => service.title.trim() || service.description.trim())
  const visibleLanguages = languagesEnabled ? languages.filter((language) => language.name.trim()) : []
  const visibleTestimonials = testimonials.filter((testimonial) => testimonial.name.trim() || testimonial.quote.trim())
  const customSections = enabledSections.filter((section) => !['about', 'stack', 'education', 'certifications', 'services', 'testimonials', 'availability', 'projects', 'contact'].includes(section.id))
  const hasSection = (id: DefaultSection) => enabledSections.some((section) => section.id === id)
  const sectionFor = (id: DefaultSection) => enabledSections.find((section) => section.id === id)
  const docsGroupFor = (id: DefaultSection, fallback: string) => sectionFor(id)?.docsGroup || fallback
  const docsPages: DocsPage[] = [
    { id: 'overview', label: 'Overview', group: 'Comece aqui' },
    ...(hasSection('about') ? [{ id: 'about', label: sectionFor('about')?.title || 'Sobre', group: docsGroupFor('about', 'Perfil') }] : []),
    ...(hasSection('stack') ? [{ id: 'stack', label: sectionFor('stack')?.title || 'Stack', group: docsGroupFor('stack', 'Perfil') }] : []),
    ...(hasSection('education') ? [{ id: 'education', label: sectionFor('education')?.title || 'Formacao', group: docsGroupFor('education', 'Perfil') }] : []),
    ...(hasSection('certifications') ? [{ id: 'certifications', label: sectionFor('certifications')?.title || 'Certificacoes', group: docsGroupFor('certifications', 'Perfil') }] : []),
    ...(hasSection('services') ? [{ id: 'services', label: sectionFor('services')?.title || 'Servicos', group: docsGroupFor('services', 'Trabalho') }] : []),
    ...(hasSection('testimonials') ? [{ id: 'testimonials', label: sectionFor('testimonials')?.title || 'Depoimentos', group: docsGroupFor('testimonials', 'Trabalho') }] : []),
    ...(hasSection('projects') ? [{ id: 'projects', label: sectionFor('projects')?.title || 'Projetos', group: docsGroupFor('projects', 'Trabalho') }] : []),
    ...(hasSection('availability') ? [{ id: 'availability', label: sectionFor('availability')?.title || 'Disponibilidade', group: docsGroupFor('availability', 'Conecte-se') }] : []),
    ...(hasSection('contact') ? [{ id: 'contact', label: sectionFor('contact')?.title || 'Contato', group: docsGroupFor('contact', 'Conecte-se') }] : []),
    ...customSections.map((section) => ({ id: `custom:${section.id}`, label: section.title, group: section.docsGroup || 'Mais' })),
  ]
  const [activePage, setActivePage] = useState('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const activePageDefinition = docsPages.find((page) => page.id === activePage) || docsPages[0]
  const groups = [...new Set(docsPages.map((page) => page.group))]
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'PF'

  const openPage = (pageId: string) => {
    setActivePage(pageId)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderOverview = () => {
    const overviewLinks = docsPages.filter((page) => page.id !== 'overview')
    return (
      <div className="docs-v2-page docs-v2-overview">
        <section className="docs-v2-hero" id="docs-overview-hero">
          <div className="docs-v2-hero-copy">
            <span className="docs-v2-eyebrow"><i />Portfolio documentation</span>
            <h1>{name || 'Portfolio tecnico'}</h1>
            <strong>{role || 'Desenvolvedor'}</strong>
            <p>{headline || bio || 'Conheca minha trajetoria, tecnologias e projetos.'}</p>
            <div className="docs-v2-hero-meta">
              {location && <span>{location}</span>}
              <span>{visibleProjects.length} projetos publicados</span>
            </div>
            <div className="docs-v2-hero-actions">
              {hasSection('projects') && <button onClick={() => openPage('projects')} type="button">Explorar projetos <ArrowUpRight aria-hidden="true" /></button>}
              {resumeEnabled && resumeFile && <a href={resumeFile} rel="noreferrer" target="_blank"><FileText aria-hidden="true" />Curriculo <ArrowUpRight aria-hidden="true" /><small>{resumeName}</small></a>}
            </div>
          </div>
          <aside className="docs-v2-profile-card">
            <div className={profilePhoto ? 'has-photo' : ''}>{profilePhoto ? <img alt={`Foto de ${name}`} src={profilePhoto} /> : <strong>{initials}</strong>}</div>
            <span>PROFILE.md</span>
            <strong className="docs-v2-profile-name">{name || 'Portfolio'}</strong>
            <p>{bio || 'Perfil profissional e documentacao de projetos.'}</p>
            <small><i />Disponivel para conexoes</small>
          </aside>
        </section>

        <section className="docs-stats docs-v2-stats" aria-label="Resumo do portfolio">
          <div><strong>{visibleProjects.length}</strong><span>Projetos</span><small>cases documentados</small></div>
          <div><strong>{stack.filter(Boolean).length}</strong><span>Tecnologias</span><small>na stack principal</small></div>
          <div><strong>{visibleExperiences.length}</strong><span>Experiencias</span><small>registros profissionais</small></div>
        </section>

        <section className="docs-v2-section" id="docs-overview-index">
          <div className="docs-v2-section-heading"><span>01</span><div><small>Indice</small><h2>Explore o portfolio</h2><p>Cada pagina organiza uma parte da minha trajetoria e do meu trabalho.</p></div></div>
          <div className="docs-v2-link-grid">
            {overviewLinks.map((page, index) => {
              const PageIcon = iconForPage(page.id)
              return <button key={page.id} onClick={() => openPage(page.id)} type="button"><span><PageIcon aria-hidden="true" /></span><small>{String(index + 1).padStart(2, '0')} / {page.group}</small><strong>{page.label}</strong><ChevronRight aria-hidden="true" /></button>
            })}
          </div>
        </section>

        {visibleProjects[0] && (
          <section className="docs-v2-section docs-v2-featured" id="docs-overview-featured">
            <div className="docs-v2-section-heading"><span>02</span><div><small>Destaque</small><h2>Case selecionado</h2></div></div>
            <article className={visibleProjects[0].imageUrl ? 'has-image' : ''}>
              {visibleProjects[0].imageUrl && <img alt={`Capa do projeto ${visibleProjects[0].title}`} src={visibleProjects[0].imageUrl} />}
              <div><span>{visibleProjects[0].category || 'Projeto'} / {visibleProjects[0].year || 'Atual'}</span><h3>{visibleProjects[0].title}</h3><p>{visibleProjects[0].description}</p>{visibleProjects[0].techs && <code>{visibleProjects[0].techs}</code>}<button onClick={() => openPage('projects')} type="button">Ler documentacao do projeto <ChevronRight aria-hidden="true" /></button></div>
            </article>
          </section>
        )}
      </div>
    )
  }

  const renderAbout = () => (
    <div className="docs-v2-page">
      <DocsPageHeader description={bio || 'Resumo profissional ainda nao informado.'} eyebrow="Perfil / sobre" title="Trajetoria profissional" />
      <section className="docs-v2-about-card" id="docs-profile">
        <div className={profilePhoto ? 'has-photo' : ''}>{profilePhoto ? <img alt={`Foto de ${name}`} src={profilePhoto} /> : <strong>{initials}</strong>}</div>
        <span><small>Nome</small><strong>{name || 'Nao informado'}</strong></span>
        <span><small>Especialidade</small><strong>{role || 'Nao informado'}</strong></span>
        <span><small>Localizacao</small><strong>{location || 'Nao informada'}</strong></span>
      </section>
      <section className="docs-v2-section" id="docs-experience">
        <div className="docs-v2-section-heading"><span>01</span><div><small>Historico</small><h2>Experiencia profissional</h2><p>Responsabilidades, contexto e principais entregas.</p></div></div>
        <div className="docs-v2-timeline">
          {visibleExperiences.length ? visibleExperiences.map((experience, index) => <article key={experience.id}><span>{String(index + 1).padStart(2, '0')}</span><div><time>{formatExperiencePeriod(experience)}</time><h3>{experience.role || 'Cargo nao informado'}</h3><strong>{experience.company || 'Empresa nao informada'}{experience.city ? ` / ${experience.city}` : ''}</strong>{experience.activities && <p>{experience.activities}</p>}</div></article>) : <DocsEmptyState title="Nenhuma experiencia cadastrada">Este historico aparecera quando houver informacoes profissionais.</DocsEmptyState>}
        </div>
      </section>
      {visibleLanguages.length > 0 && <section className="docs-v2-section" id="docs-languages"><div className="docs-v2-section-heading"><span>02</span><div><small>Comunicacao</small><h2>Idiomas</h2></div></div><div className="docs-v2-language-grid">{visibleLanguages.map((language, index) => <article key={language.id}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{language.name}</strong><small>{language.level || 'Nivel nao informado'}</small></div></article>)}</div></section>}
    </div>
  )

  const renderStack = () => (
    <div className="docs-v2-page">
      <DocsPageHeader description="Tecnologias, ferramentas e plataformas que fazem parte do meu fluxo de desenvolvimento." eyebrow="Perfil / stack" title="Stack principal" />
      <div className="docs-v2-stack-grid" id="docs-stack-list">
        {stack.filter(Boolean).map((technology, index) => <article key={`${technology}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><Braces aria-hidden="true" /><strong>{technology}</strong><small><i />Em uso</small></article>)}
      </div>
      {!stack.filter(Boolean).length && <DocsEmptyState title="Nenhuma tecnologia cadastrada">A stack principal aparecera nesta pagina.</DocsEmptyState>}
    </div>
  )

  const renderProjects = () => (
    <div className="docs-v2-page">
      <DocsPageHeader description="Cases com contexto, tecnologias utilizadas e caminhos para explorar cada entrega." eyebrow="Trabalho / projetos" title="Projetos documentados" />
      <div className="docs-v2-project-grid" id="docs-project-list">
        {visibleProjects.length ? visibleProjects.map((project, index) => <article className={project.featured ? 'is-featured' : ''} id={`docs-project-${index + 1}`} key={project.id}><div className="docs-v2-project-cover">{project.imageUrl ? <img alt={`Capa do projeto ${project.title}`} src={project.imageUrl} /> : <span>{String(index + 1).padStart(2, '0')}</span>}<small>{project.featured ? 'Destaque' : project.status || 'Projeto'}</small></div><div className="docs-v2-project-body"><span>{project.category || 'Projeto'}{project.year ? ` / ${project.year}` : ''}</span><h2>{project.title}</h2><p>{project.description || 'Descricao do projeto ainda nao informada.'}</p>{project.techs && <code>{project.techs}</code>}<div>{project.liveUrl && <a href={project.liveUrl} rel="noreferrer" target="_blank">Abrir projeto <ArrowUpRight aria-hidden="true" /></a>}{project.repoUrl && <a href={project.repoUrl} rel="noreferrer" target="_blank">Repositorio <ArrowUpRight aria-hidden="true" /></a>}</div></div></article>) : <DocsEmptyState title="Nenhum projeto documentado">Os cases publicados aparecerao nesta pagina.</DocsEmptyState>}
      </div>
    </div>
  )

  const renderEducation = () => (
    <div className="docs-v2-page">
      <DocsPageHeader description="Instituicoes, cursos e etapas que construiram minha base profissional." eyebrow="Perfil / formacao" title="Formacao academica" />
      <div className="docs-v2-record-grid">{visibleEducations.length ? visibleEducations.map((education, index) => <article key={education.id}><span>{String(index + 1).padStart(2, '0')}</span><GraduationCap aria-hidden="true" /><div><small>{education.startYear || '?'} - {education.current ? 'Em andamento' : education.endYear || '?'}</small><h2>{education.course || 'Curso nao informado'}</h2><strong>{education.institution || 'Instituicao nao informada'}</strong><p>{[education.degree, education.location].filter(Boolean).join(' / ')}</p></div></article>) : <DocsEmptyState title="Nenhuma formacao cadastrada">As informacoes academicas aparecerao nesta pagina.</DocsEmptyState>}</div>
    </div>
  )

  const renderCertifications = () => (
    <div className="docs-v2-page">
      <DocsPageHeader description="Cursos, aprendizados complementares e credenciais que podem ser verificadas." eyebrow="Perfil / credenciais" title="Cursos e certificacoes" />
      <div className="docs-v2-record-grid">{visibleCertifications.length ? visibleCertifications.map((certification, index) => <article key={certification.id}><span>{String(index + 1).padStart(2, '0')}</span><Award aria-hidden="true" /><div><small>{certification.issueDate || 'Data nao informada'}</small><h2>{certification.name || 'Certificacao'}</h2><strong>{certification.issuer || 'Instituicao nao informada'}</strong>{certification.credentialId && <p>Credencial: <code>{certification.credentialId}</code></p>}{certification.credentialUrl && <a href={certification.credentialUrl} rel="noreferrer" target="_blank">Validar credencial <ArrowUpRight aria-hidden="true" /></a>}</div></article>) : <DocsEmptyState title="Nenhuma certificacao cadastrada">Os cursos e certificados aparecerao nesta pagina.</DocsEmptyState>}</div>
    </div>
  )

  const renderServices = () => (
    <div className="docs-v2-page">
      <DocsPageHeader description="Tipos de entrega, tecnologias e problemas que posso ajudar a resolver." eyebrow="Trabalho / servicos" title="Solucoes oferecidas" />
      <div className="docs-v2-service-grid">{visibleServices.length ? visibleServices.map((service, index) => <article key={service.id}><span>{String(index + 1).padStart(2, '0')}</span><BriefcaseBusiness aria-hidden="true" /><small>{service.deliveryType || 'Entrega personalizada'}</small><h2>{service.title || 'Servico'}</h2><p>{service.description || 'Descricao ainda nao informada.'}</p>{service.technologies && <code>{service.technologies}</code>}</article>) : <DocsEmptyState title="Nenhum servico cadastrado">As solucoes oferecidas aparecerao nesta pagina.</DocsEmptyState>}</div>
    </div>
  )

  const renderTestimonials = () => (
    <div className="docs-v2-page">
      <DocsPageHeader description="Percepcoes de pessoas que acompanharam meu trabalho e minhas entregas." eyebrow="Trabalho / depoimentos" title="Feedback profissional" />
      <div className="docs-v2-testimonials">{visibleTestimonials.length ? visibleTestimonials.map((testimonial, index) => <blockquote key={testimonial.id}><span>{String(index + 1).padStart(2, '0')}</span><MessageSquareQuote aria-hidden="true" /><p>"{testimonial.quote || 'Depoimento nao informado.'}"</p><footer><strong>{testimonial.name || 'Autor'}</strong><small>{[testimonial.role, testimonial.company].filter(Boolean).join(' / ')}</small></footer></blockquote>) : <DocsEmptyState title="Nenhum depoimento cadastrado">Os feedbacks profissionais aparecerao nesta pagina.</DocsEmptyState>}</div>
    </div>
  )

  const renderAvailability = () => (
    <div className="docs-v2-page">
      <DocsPageHeader description="Informacoes atuais para oportunidades, projetos e colaboracoes." eyebrow="Conecte-se / status" title="Disponibilidade" />
      <div className="docs-v2-availability"><span><i />Status atual</span><h2>{availability.status || 'Nao informado'}</h2><dl><div><dt>Modelo de trabalho</dt><dd>{availability.workModels || 'Nao informado'}</dd></div><div><dt>Oportunidades</dt><dd>{availability.opportunityTypes || 'Nao informado'}</dd></div></dl>{availability.note && <p>{availability.note}</p>}</div>
    </div>
  )

  const renderContact = () => (
    <div className="docs-v2-page">
      <DocsPageHeader description="Escolha o canal mais adequado para falar sobre projetos, oportunidades ou colaboracoes." eyebrow="Conecte-se / contato" title="Vamos conversar" />
      <div className="docs-v2-contact-grid">{visibleContacts.length ? visibleContacts.map((contact) => <a href={contact.url} key={contact.id} rel="noreferrer" target="_blank"><ContactIcon type={contact.type} /><span><small>{contact.label || contact.type}</small><strong>{contact.value}</strong></span><ArrowUpRight aria-hidden="true" /></a>) : <DocsEmptyState title="Nenhum contato cadastrado">Os canais oficiais aparecerao nesta pagina.</DocsEmptyState>}</div>
    </div>
  )

  const renderPage = () => {
    if (activePage === 'overview') return renderOverview()
    if (activePage === 'about') return renderAbout()
    if (activePage === 'stack') return renderStack()
    if (activePage === 'education') return renderEducation()
    if (activePage === 'certifications') return renderCertifications()
    if (activePage === 'services') return renderServices()
    if (activePage === 'testimonials') return renderTestimonials()
    if (activePage === 'availability') return renderAvailability()
    if (activePage === 'projects') return renderProjects()
    if (activePage === 'contact') return renderContact()
    const section = customSections.find((item) => `custom:${item.id}` === activePage)
    return section ? <div className="docs-v2-page docs-v2-custom" style={sectionColorStyle(section)}><DocsPageHeader description={section.description || 'Esta pagina ainda nao possui conteudo.'} eyebrow="Mais / secao personalizada" title={section.title} /></div> : renderOverview()
  }

  const outlineLinks = activePage === 'overview'
    ? [{ href: '#docs-overview-hero', label: 'Apresentacao' }, { href: '#docs-overview-index', label: 'Indice' }, ...(visibleProjects[0] ? [{ href: '#docs-overview-featured', label: 'Case em destaque' }] : [])]
    : activePage === 'about'
      ? [{ href: '#docs-profile', label: 'Perfil' }, { href: '#docs-experience', label: 'Experiencia' }, ...(visibleLanguages.length ? [{ href: '#docs-languages', label: 'Idiomas' }] : [])]
      : activePage === 'projects'
        ? visibleProjects.slice(0, 5).map((project, index) => ({ href: `#docs-project-${index + 1}`, label: project.title }))
        : []

  const style = {
    '--custom-accent': accentColor,
    '--site-background': backgroundColor,
    '--site-foreground': getContrastColor(backgroundColor),
  } as CSSProperties

  return (
    <section className={`docs-generated-site docs-v2 docs-content-${templateSettings.docs.contentWidth} ${templateSettings.docs.showPageIndex ? 'has-page-index' : 'without-page-index'}`} style={style}>
      <header className="docs-v2-topbar">
        <button aria-controls="docs-sidebar-navigation" aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Fechar navegacao' : 'Abrir navegacao'} className="docs-v2-menu" onClick={() => setMobileMenuOpen((current) => !current)} type="button">{mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
        <button className="docs-v2-brand" onClick={() => openPage('overview')} type="button"><span><BookOpen aria-hidden="true" /></span><strong>{name || 'Portfolio'}</strong><small>{templateSettings.docs.badge || 'Docs'}</small></button>
        <div className="docs-v2-context"><span>{activePageDefinition.group}</span><ChevronRight aria-hidden="true" /><strong>{activePageDefinition.label}</strong></div>
        <div className="docs-v2-version"><Check aria-hidden="true" /><span>Online</span><strong>{templateSettings.docs.version || 'v1.0'}</strong></div>
      </header>

      <div className="docs-v2-layout">
        <aside className={mobileMenuOpen ? 'docs-v2-sidebar is-open' : 'docs-v2-sidebar'} id="docs-sidebar-navigation">
          <div className="docs-v2-sidebar-profile"><div className={profilePhoto ? 'has-photo' : ''}>{profilePhoto ? <img alt="" src={profilePhoto} /> : initials}</div><span><small>{templateSettings.docs.sidebarLabel || 'DOCUMENTATION'}</small><strong>{role || 'Developer portfolio'}</strong></span></div>
          <nav aria-label="Paginas da documentacao">{groups.map((group) => <div className="docs-v2-nav-group" key={group}><p>{group}</p>{docsPages.filter((page) => page.group === group).map((page) => { const PageIcon = iconForPage(page.id); return <button className={activePage === page.id ? 'is-active' : ''} key={page.id} onClick={() => openPage(page.id)} type="button"><PageIcon aria-hidden="true" /><span>{page.label}</span>{activePage === page.id && <i />}</button> })}</div>)}</nav>
          <footer><span><i />Documentacao atualizada</span><small>{visibleProjects.length} projetos / {stack.filter(Boolean).length} tecnologias</small></footer>
        </aside>
        {mobileMenuOpen && <button aria-label="Fechar navegacao ao clicar fora" className="docs-v2-backdrop" onClick={() => setMobileMenuOpen(false)} type="button" />}

        <main className="docs-v2-main" id="docs-page-top"><div className="docs-v2-article">{renderPage()}<footer className="docs-v2-page-footer"><span><BookOpen aria-hidden="true" />{name || 'Portfolio'} / {templateSettings.docs.version || 'v1.0'}</span><button onClick={() => openPage('overview')} type="button">Voltar ao inicio <ChevronRight aria-hidden="true" /></button></footer></div></main>

        {templateSettings.docs.showPageIndex && <aside className="docs-v2-outline"><p>Nesta pagina</p><a href="#docs-page-top">{activePageDefinition.label}</a>{outlineLinks.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}<div><span><i />Status</span><strong>Conteudo atualizado</strong><small>{templateSettings.docs.version || 'v1.0'}</small></div></aside>}
      </div>
    </section>
  )
}
