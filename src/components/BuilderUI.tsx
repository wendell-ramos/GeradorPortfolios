import { useId, type ReactNode } from 'react'
import {
  ArrowRight,
  AtSign,
  FileText,
  FolderKanban,
  LayoutGrid,
  Palette,
  PenTool,
  Sparkles,
  UserRound,
} from 'lucide-react'

const stepVisuals = [UserRound, Palette, LayoutGrid, FolderKanban, AtSign, Sparkles]

export function PortfyBrand({ subtitle = 'Creative portfolio studio' }: { subtitle?: string }) {
  return (
    <div className="product-mark">
      <span className="portfy-symbol" aria-hidden="true"><b>P</b><i>/</i></span>
      <div><strong>portfy</strong><small>{subtitle}</small></div>
    </div>
  )
}

export function ProjectStartScreen({ onEmpty, onPreset }: { onEmpty: () => void; onPreset: () => void }) {
  return (
    <main className="project-start-screen">
      <section className="project-start-panel">
        <PortfyBrand subtitle="Creative portfolio studio" />
        <div className="project-start-copy">
          <p className="eyebrow">Antes de comecar</p>
          <h1>Como voce quer iniciar?</h1>
          <p>Escolha dados prontos para explorar rapidamente ou preencha cada parte manualmente.</p>
        </div>
        <div className="project-start-options">
          <button className="project-start-option is-recommended" onClick={onPreset} type="button">
            <div className="project-option-icon"><Sparkles /></div>
            <span>Recomendado para testar</span><strong>Usar dados de exemplo</strong>
            <p>Abre o gerador com identidade, experiencia, stack, projetos, secoes e contatos ja preenchidos.</p>
            <i>Comecar com exemplos <ArrowRight /></i>
          </button>
          <button className="project-start-option" onClick={onEmpty} type="button">
            <div className="project-option-icon"><PenTool /></div>
            <span>Preenchimento completo</span><strong>Comecar do zero</strong>
            <p>Inicia sem dados cadastrados para voce testar todo o fluxo manualmente.</p>
            <i>Comecar vazio <ArrowRight /></i>
          </button>
        </div>
      </section>
    </main>
  )
}

export function StepBlock({ children, description, eyebrow, title, wide = false }: { children: ReactNode; description: string; eyebrow: string; title: string; wide?: boolean }) {
  const stepNumber = Number(eyebrow.match(/\d+/)?.[0] ?? 6)
  const StepIcon = stepVisuals[Math.min(Math.max(stepNumber - 1, 0), stepVisuals.length - 1)]

  return (
    <div className={wide ? 'step-block is-wide' : 'step-block'}>
      <div className="step-copy">
        <div className="step-visual"><StepIcon aria-hidden="true" /></div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="step-side-meter" aria-hidden="true">
          <span>{String(stepNumber).padStart(2, '0')}</span>
          <div>{stepVisuals.map((_, index) => <i className={index < stepNumber ? 'is-reached' : ''} key={index} />)}</div>
        </div>
      </div>
      <div className="step-content">{children}</div>
    </div>
  )
}

export function FormSection({ children, description, icon = 'document', title }: { children: ReactNode; description?: string; icon?: 'document' | 'profile'; title: string }) {
  const Icon = icon === 'profile' ? UserRound : FileText
  return (
    <section className="editor-form-section">
      <header>
        <span><Icon aria-hidden="true" /></span>
        <div><h2>{title}</h2>{description && <p>{description}</p>}</div>
      </header>
      <div className="editor-form-section-content">{children}</div>
    </section>
  )
}

export function TextInput({ label, onChange, placeholder, value }: { label: string; onChange: (value: string) => void; placeholder?: string; value: string }) {
  const id = useId()
  return <div className="form-block"><label htmlFor={id}>{label}</label><input id={id} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value} /></div>
}

export function TextArea({ label, onChange, placeholder, rows, value }: { label: string; onChange: (value: string) => void; placeholder?: string; rows: number; value: string }) {
  const id = useId()
  return <div className="form-block"><label htmlFor={id}>{label}</label><textarea id={id} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={rows} value={value} /></div>
}
