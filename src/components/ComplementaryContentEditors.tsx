import { BriefcaseBusiness, CalendarCheck, MessageSquareQuote, Plus } from 'lucide-react'
import type { DevAvailability, DevService, DevTestimonial } from '../models/portfolio'
import { TextArea, TextInput } from './BuilderUI'

interface ComplementaryContentEditorsProps {
  availability: DevAvailability
  services: DevService[]
  testimonials: DevTestimonial[]
  hasAvailabilitySection: boolean
  hasServicesSection: boolean
  hasTestimonialsSection: boolean
  addService: () => void
  addTestimonial: () => void
  moveService: (id: string, direction: -1 | 1) => void
  moveTestimonial: (id: string, direction: -1 | 1) => void
  removeService: (id: string) => void
  removeTestimonial: (id: string) => void
  updateAvailability: <K extends keyof DevAvailability>(field: K, value: DevAvailability[K]) => void
  updateService: <K extends keyof Omit<DevService, 'id'>>(id: string, field: K, value: DevService[K]) => void
  updateTestimonial: <K extends keyof Omit<DevTestimonial, 'id'>>(id: string, field: K, value: DevTestimonial[K]) => void
}

function EntryActions({
  canMoveDown,
  canMoveUp,
  moveDown,
  moveUp,
  remove,
}: {
  canMoveDown: boolean
  canMoveUp: boolean
  moveDown: () => void
  moveUp: () => void
  remove: () => void
}) {
  return <div><button disabled={!canMoveUp} onClick={moveUp} type="button">Subir</button><button disabled={!canMoveDown} onClick={moveDown} type="button">Descer</button><button onClick={remove} type="button">Remover</button></div>
}

export function ComplementaryContentEditors(props: ComplementaryContentEditorsProps) {
  const {
    addService, addTestimonial, availability, hasAvailabilitySection,
    hasServicesSection, hasTestimonialsSection, moveService, moveTestimonial,
    removeService, removeTestimonial, services, testimonials, updateAvailability,
    updateService, updateTestimonial,
  } = props

  return (
    <div className="professional-content-editors complementary-content-editors">
      {hasServicesSection && (
        <section className="structured-content-editor">
          <header><span><BriefcaseBusiness aria-hidden="true" /></span><div><strong>Servicos oferecidos</strong><small>Apresente as solucoes que voce pode entregar.</small></div><button className="primary-button" onClick={addService} type="button"><Plus aria-hidden="true" />Adicionar servico</button></header>
          <div className="structured-entry-list">
            {services.length === 0 && <div className="structured-empty"><strong>Nenhum servico adicionado</strong><p>Cadastre apenas as entregas que voce realmente oferece.</p></div>}
            {services.map((service, index) => <article className="structured-entry" key={service.id}>
              <div className="structured-entry-heading"><div><span>Servico {index + 1}</span><strong>{service.title || 'Novo servico'}</strong></div><EntryActions canMoveDown={index < services.length - 1} canMoveUp={index > 0} moveDown={() => moveService(service.id, 1)} moveUp={() => moveService(service.id, -1)} remove={() => removeService(service.id)} /></div>
              <div className="structured-entry-grid"><TextInput label="Nome do servico" onChange={(value) => updateService(service.id, 'title', value)} placeholder="Ex.: Desenvolvimento de sistemas web" value={service.title} /><TextInput label="Tipo de entrega" onChange={(value) => updateService(service.id, 'deliveryType', value)} placeholder="Ex.: Projeto completo" value={service.deliveryType} /><div className="structured-wide-field"><TextArea label="Descricao" onChange={(value) => updateService(service.id, 'description', value)} placeholder="Explique o problema que esse servico resolve." rows={3} value={service.description} /></div><div className="structured-wide-field"><TextInput label="Tecnologias utilizadas" onChange={(value) => updateService(service.id, 'technologies', value)} placeholder="React, TypeScript, PostgreSQL" value={service.technologies} /></div></div>
            </article>)}
          </div>
        </section>
      )}

      {hasTestimonialsSection && (
        <section className="structured-content-editor">
          <header><span><MessageSquareQuote aria-hidden="true" /></span><div><strong>Depoimentos</strong><small>Inclua comentarios autorizados de pessoas com quem trabalhou.</small></div><button className="primary-button" onClick={addTestimonial} type="button"><Plus aria-hidden="true" />Adicionar depoimento</button></header>
          <div className="structured-entry-list">
            {testimonials.length === 0 && <div className="structured-empty"><strong>Nenhum depoimento adicionado</strong><p>Esta secao pode permanecer vazia ate voce receber um feedback.</p></div>}
            {testimonials.map((testimonial, index) => <article className="structured-entry" key={testimonial.id}>
              <div className="structured-entry-heading"><div><span>Depoimento {index + 1}</span><strong>{testimonial.name || 'Novo depoimento'}</strong></div><EntryActions canMoveDown={index < testimonials.length - 1} canMoveUp={index > 0} moveDown={() => moveTestimonial(testimonial.id, 1)} moveUp={() => moveTestimonial(testimonial.id, -1)} remove={() => removeTestimonial(testimonial.id)} /></div>
              <div className="structured-entry-grid"><TextInput label="Nome" onChange={(value) => updateTestimonial(testimonial.id, 'name', value)} placeholder="Nome da pessoa" value={testimonial.name} /><TextInput label="Cargo" onChange={(value) => updateTestimonial(testimonial.id, 'role', value)} placeholder="Ex.: Fundador" value={testimonial.role} /><TextInput label="Empresa ou projeto" onChange={(value) => updateTestimonial(testimonial.id, 'company', value)} placeholder="Ex.: Empresa Exemplo" value={testimonial.company} /><div className="structured-wide-field"><TextArea label="Depoimento" onChange={(value) => updateTestimonial(testimonial.id, 'quote', value)} placeholder="Escreva o feedback recebido." rows={4} value={testimonial.quote} /></div></div>
            </article>)}
          </div>
        </section>
      )}

      {hasAvailabilitySection && (
        <section className="structured-content-editor availability-editor">
          <header><span><CalendarCheck aria-hidden="true" /></span><div><strong>Disponibilidade profissional</strong><small>Deixe claro para quais oportunidades voce esta aberto.</small></div></header>
          <div className="structured-entry-grid">
            <label className="form-block"><span>Situacao atual</span><select onChange={(event) => updateAvailability('status', event.target.value)} value={availability.status}><option value="">Selecione</option><option value="Disponivel para oportunidades">Disponivel para oportunidades</option><option value="Disponivel para projetos">Disponivel para projetos</option><option value="Aberto a conversas">Aberto a conversas</option><option value="Indisponivel no momento">Indisponivel no momento</option></select></label>
            <label className="form-block"><span>Modelo de trabalho</span><select onChange={(event) => updateAvailability('workModels', event.target.value)} value={availability.workModels}><option value="">Selecione</option><option value="Remoto">Remoto</option><option value="Hibrido">Hibrido</option><option value="Presencial">Presencial</option><option value="Flexivel">Flexivel</option></select></label>
            <div className="structured-wide-field"><TextInput label="Tipos de oportunidade" onChange={(value) => updateAvailability('opportunityTypes', value)} placeholder="Ex.: Estagio, freelancer, projetos web" value={availability.opportunityTypes} /></div>
            <div className="structured-wide-field"><TextArea label="Observacao" onChange={(value) => updateAvailability('note', value)} placeholder="Adicione contexto sobre prazos, localizacao ou disponibilidade." rows={3} value={availability.note} /></div>
          </div>
        </section>
      )}
    </div>
  )
}
