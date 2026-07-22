import { type CSSProperties, useState } from 'react'
import type { DefaultSection, PortfolioPreviewProps } from '../models/portfolio'
import { getContrastColor, terminalSlug } from '../utils/portfolio'

export function TerminalGeneratedSite({
  accentColor,
  backgroundColor,
  bio,
  contacts,
  certifications,
  educations,
  experiences,
  headline,
  location,
  name,
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
  const hasSection = (id: DefaultSection) => enabledSections.some((section) => section.id === id)
  const customSections = enabledSections.filter((section) => !['about', 'stack', 'education', 'certifications', 'projects', 'contact'].includes(section.id))
  const visibleProjects = projects.filter((project) => project.title.trim())
  const visibleContacts = contacts.filter((contact) => contact.value.trim() && contact.url.trim())
  const visibleExperiences = experiences.filter((experience) => experience.company.trim() || experience.role.trim())
  const visibleEducations = educations.filter((education) => education.institution.trim() || education.course.trim())
  const visibleCertifications = certifications.filter((certification) => certification.name.trim() || certification.issuer.trim())
  const userName = terminalSlug(name).replace(/-/g, '_') || 'dev'
  const terminalHost = templateSettings.terminal.host || 'portfolio'
  const prompt = `${userName}@${terminalHost}:~/portfolio$`
  const sectionCommand = (id: DefaultSection, fallback: string) => enabledSections.find((section) => section.id === id)?.terminalCommand || fallback

  const commands = [
    { id: 'help', label: 'help', aliases: ['help', 'ajuda'] },
    ...(hasSection('about') ? [{ id: 'whoami', label: sectionCommand('about', 'whoami'), aliases: [sectionCommand('about', 'whoami'), 'whoami', 'about', 'sobre', 'bio'] }] : []),
    ...(hasSection('stack') ? [{ id: 'stack', label: sectionCommand('stack', 'stack'), aliases: [sectionCommand('stack', 'stack'), 'stack', 'skills', 'habilidades', 'tecnologias'] }] : []),
    ...(hasSection('education') ? [{ id: 'education', label: sectionCommand('education', 'education'), aliases: [sectionCommand('education', 'education'), 'education', 'formacao', 'academic'] }] : []),
    ...(hasSection('certifications') ? [{ id: 'certifications', label: sectionCommand('certifications', 'certifications'), aliases: [sectionCommand('certifications', 'certifications'), 'certifications', 'certificados', 'courses', 'cursos'] }] : []),
    ...(hasSection('projects') ? [{ id: 'projects', label: sectionCommand('projects', 'projects'), aliases: [sectionCommand('projects', 'projects'), 'projects', 'projetos', 'ls-projects'] }] : []),
    ...(visibleExperiences.length ? [{ id: 'experience', label: 'experience', aliases: ['experience', 'experiences', 'experiencia', 'experiencias', 'work'] }] : []),
    ...(resumeEnabled && resumeFile ? [{ id: 'resume', label: 'resume', aliases: ['resume', 'cv', 'curriculo'] }] : []),
    ...(hasSection('contact') ? [{ id: 'contact', label: sectionCommand('contact', 'contact'), aliases: [sectionCommand('contact', 'contact'), 'contact', 'contato', 'contacts'] }] : []),
    ...customSections.map((section) => {
      const slug = section.terminalCommand || terminalSlug(section.title) || `section-${section.id}`
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
                <dd>{command.id === 'whoami' ? 'identidade e resumo profissional' : command.id === 'stack' ? 'tecnologias e ferramentas' : command.id === 'education' ? 'formacao academica' : command.id === 'certifications' ? 'cursos e credenciais' : command.id === 'projects' ? 'projetos publicados e repositorios' : command.id === 'experience' ? 'historico profissional' : command.id === 'resume' ? 'abre o curriculo em PDF' : command.id === 'contact' ? 'canais para contato' : 'arquivo de secao personalizada'}</dd>
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

    if (activeCommand === 'education') {
      return <div className="terminal-record-output"><p>Formacao academica ({visibleEducations.length}):</p>{visibleEducations.length ? visibleEducations.map((education, index) => <article key={education.id}><p><span>[{String(index + 1).padStart(2, '0')}]</span> {education.course || 'Curso nao informado'}</p><p>{education.institution || 'Instituicao nao informada'}{education.degree ? ` | ${education.degree}` : ''}</p><p>{education.startYear || '?'} - {education.current ? 'em andamento' : education.endYear || '?'}{education.location ? ` | ${education.location}` : ''}</p></article>) : <p className="terminal-muted">Nenhuma formacao cadastrada.</p>}</div>
    }

    if (activeCommand === 'certifications') {
      return <div className="terminal-record-output"><p>Credenciais encontradas ({visibleCertifications.length}):</p>{visibleCertifications.length ? visibleCertifications.map((certification, index) => <article key={certification.id}><p><span>[{String(index + 1).padStart(2, '0')}]</span> {certification.name || 'Certificacao'}</p><p>{certification.issuer || 'Instituicao nao informada'}{certification.issueDate ? ` | ${certification.issueDate}` : ''}</p>{certification.credentialId && <p>id: {certification.credentialId}</p>}{certification.credentialUrl && <a href={certification.credentialUrl} rel="noreferrer" target="_blank">[validar credencial]</a>}</article>) : <p className="terminal-muted">Nenhuma certificacao cadastrada.</p>}</div>
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

    if (activeCommand === 'resume') {
      return (
        <div className="terminal-resume-output">
          <p>Arquivo encontrado em ~/documents/{resumeName || 'curriculo.pdf'}</p>
          <a href={resumeFile} rel="noreferrer" target="_blank">[abrir curriculo.pdf]</a>
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
          <p className="terminal-file-label">$ cat {section.terminalCommand || terminalSlug(section.title) || 'section'}.md</p>
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
    <section className={`terminal-generated-site terminal-text-${templateSettings.terminal.textScale} ${templateSettings.terminal.scanlines ? 'has-scanlines' : 'no-scanlines'}`} style={style}>
      <header className="terminal-site-header">
        <span className="terminal-window-controls" aria-hidden="true"><i /><i /><i /></span>
        <strong>{userName}@{terminalHost}: ~/portfolio</strong>
        <span>{templateSettings.terminal.shell || 'bash'}</span>
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
          <p>{templateSettings.terminal.bootTitle || 'Portfolio Shell'} v1.0.0</p>
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
        <label htmlFor="terminal-command-input"><span>{userName}@{terminalHost}</span>:<b>~/portfolio</b>$</label>
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
