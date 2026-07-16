import type { BuilderStep, DevTemplate } from '../models/portfolio'
import { devTemplates } from '../data/devPortfolioDefaults'
import { StepBlock } from '../components/BuilderUI'
import { PreviewSummary } from '../components/PortfolioPreviews'

interface PreviewStepProps {
  contacts: number
  enabledSections: number
  name: string
  onOpenSite: () => void
  projects: number
  setStep: (step: BuilderStep) => void
  stack: number
  template: DevTemplate
}

export function PreviewStep({
  contacts,
  enabledSections,
  name,
  onOpenSite,
  projects,
  setStep,
  stack,
  template,
}: PreviewStepProps) {
  return (
  <StepBlock
    eyebrow="Etapa final"
    title="Seu site esta pronto para ser explorado."
    description="Abra a experiencia completa e explore o portfolio como um visitante veria depois da publicacao."
    wide
  >
    <PreviewSummary
      contacts={contacts}
      projects={projects}
      sections={enabledSections}
      stack={stack}
      template={devTemplates.find((item) => item.id === template)?.label ?? 'Dev'}
    />
    <div className="preview-edit-actions">
      <button onClick={() => setStep('identity')} type="button">Editar identidade</button>
      <button onClick={() => setStep('style')} type="button">Editar estilo</button>
      <button onClick={() => setStep('sections')} type="button">Editar secoes</button>
      <button onClick={() => setStep('projects')} type="button">Editar projetos</button>
      <button onClick={() => setStep('contact')} type="button">Editar contatos</button>
    </div>
    <div className="site-preview-toolbar">
      <div>
        <span>Site interativo</span>
        <strong>{name.toLowerCase().replaceAll(' ', '-')}.dev</strong>
        <p>Navegacao, atalhos e links funcionam na experiencia completa.</p>
      </div>
      <button className="primary-button" onClick={onOpenSite} type="button">
        Abrir site gerado
      </button>
    </div>
  </StepBlock>
  )
}
