import type { CSSProperties } from 'react'
import type { ContactLink, DevProject, DevTemplate, PortfolioSection } from '../models/portfolio'
import { getContrastColor, terminalSlug } from '../utils/portfolio'
import { ContactIcon, SectionIconGlyph } from './PortfolioIcons'

export function IdentityMiniPreview({
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

export function TemplateMiniPreview({
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

export function ColorMiniPreview({
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

export function TemplateEditorBanner({ template }: { template: DevTemplate }) {
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

export function SectionsMiniPreview({
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

export function ProjectsMiniPreview({ projects, template }: { projects: DevProject[]; template: DevTemplate }) {
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

export function ContactsMiniPreview({ contacts, template }: { contacts: ContactLink[]; template: DevTemplate }) {
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


export function PreviewSummary({
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

