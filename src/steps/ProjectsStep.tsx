import type { ChangeEvent } from 'react'
import type { DevProject, DevTemplate } from '../models/portfolio'
import { StepBlock, TextArea, TextInput } from '../components/BuilderUI'
import { ProjectsMiniPreview, TemplateEditorBanner } from '../components/PortfolioPreviews'

interface ProjectsStepProps {
  addProject: () => void
  handleProjectImage: (id: string, event: ChangeEvent<HTMLInputElement>) => void
  moveProject: (id: string, direction: -1 | 1) => void
  projectImageErrors: Record<string, string>
  projects: DevProject[]
  removeProject: (id: string) => void
  removeProjectImage: (id: string) => void
  template: DevTemplate
  updateProject: (id: string, field: keyof DevProject, value: string) => void
}

export function ProjectsStep({
  addProject,
  handleProjectImage,
  moveProject,
  projectImageErrors,
  projects,
  removeProject,
  removeProjectImage,
  template,
  updateProject,
}: ProjectsStepProps) {
  return (
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
  )
}

