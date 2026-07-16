import type { ReactNode } from 'react'

export function ProjectStartScreen({ onEmpty, onPreset }: { onEmpty: () => void; onPreset: () => void }) {
  return (
    <main className="project-start-screen">
      <section className="project-start-panel">
        <div className="product-mark">
          <span>PF</span>
          <div><strong>Portfy</strong><small>Gerador de portfolios</small></div>
        </div>
        <div className="project-start-copy">
          <p className="eyebrow">Antes de comecar</p>
          <h1>Como voce quer iniciar?</h1>
          <p>Escolha dados prontos para explorar rapidamente ou preencha cada parte manualmente.</p>
        </div>
        <div className="project-start-options">
          <button className="project-start-option is-recommended" onClick={onPreset} type="button">
            <span>Recomendado para testar</span><strong>Usar dados de exemplo</strong>
            <p>Abre o gerador com identidade, experiencia, stack, projetos, secoes e contatos ja preenchidos.</p>
            <i>Comecar com exemplos</i>
          </button>
          <button className="project-start-option" onClick={onEmpty} type="button">
            <span>Preenchimento completo</span><strong>Comecar do zero</strong>
            <p>Inicia sem dados cadastrados para voce testar todo o fluxo manualmente.</p>
            <i>Comecar vazio</i>
          </button>
        </div>
      </section>
    </main>
  )
}

export function StepBlock({ children, description, eyebrow, title, wide = false }: { children: ReactNode; description: string; eyebrow: string; title: string; wide?: boolean }) {
  return (
    <div className={wide ? 'step-block is-wide' : 'step-block'}>
      <div className="step-copy"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>
      <div className="step-content">{children}</div>
    </div>
  )
}

export function TextInput({ label, onChange, placeholder, value }: { label: string; onChange: (value: string) => void; placeholder?: string; value: string }) {
  return <div className="form-block"><label>{label}</label><input onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value} /></div>
}

export function TextArea({ label, onChange, placeholder, rows, value }: { label: string; onChange: (value: string) => void; placeholder?: string; rows: number; value: string }) {
  return <div className="form-block"><label>{label}</label><textarea onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={rows} value={value} /></div>
}
