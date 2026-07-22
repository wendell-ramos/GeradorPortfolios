import type { ContactLink, ContactType, DevTemplate } from '../models/portfolio'
import { contactPresets } from '../data/devPortfolioDefaults'
import { StepBlock, TextInput } from '../components/BuilderUI'
import { ContactIcon } from '../components/PortfolioIcons'
import { ContactsMiniPreview, TemplateEditorBanner } from '../components/PortfolioPreviews'
import type { ContactValidation } from '../utils/validation'

interface ContactStepProps {
  addPresetContact: (preset: Omit<ContactLink, 'id'>) => void
  contacts: ContactLink[]
  removeContact: (id: string) => void
  template: DevTemplate
  validationErrors: ContactValidation
  updateContact: (id: string, field: keyof ContactLink, value: string) => void
  updateContactType: (id: string, type: ContactType) => void
}

export function ContactStep({
  addPresetContact,
  contacts,
  removeContact,
  template,
  validationErrors,
  updateContact,
  updateContactType,
}: ContactStepProps) {
  return (
  <StepBlock
    eyebrow="Etapa 5"
    title={template === 'desktop' ? 'Adicione contatos com atalhos visuais.' : template === 'terminal' ? 'Configure a saida do comando contact.' : template === 'landing' ? 'Feche a pagina com um convite claro.' : 'Organize os canais da pagina Contato.'}
    description={template === 'terminal' ? 'As redes aparecem como linhas de texto clicaveis, sem icones.' : template === 'desktop' ? 'Escolha redes predefinidas com seus icones e edite texto e URL.' : template === 'landing' ? 'Os canais aparecem como links grandes e interativos no encerramento da landing page.' : 'Cada canal aparece como uma referencia organizada com icone e link.'}
  >
    <TemplateEditorBanner template={template} />
    <div className={`preset-contact-grid preset-contact-${template}`}>
      {contactPresets.map((preset) => (
        <button
          className={`preset-contact contact-${preset.type}`}
          key={preset.type}
          onClick={() => addPresetContact(preset)}
          type="button"
        >
          {template !== 'terminal' && <ContactIcon type={preset.type} />}
          {template === 'terminal' && <code>[{preset.type}]</code>}
          {preset.label}
        </button>
      ))}
    </div>

    <div className="item-list">
      {contacts.map((contact) => (
        <article className={`editable-item contact-editor editable-item-${template}`} key={contact.id}>
          <div className="item-heading">
            <strong className="contact-item-title">
              {template !== 'terminal' && <ContactIcon type={contact.type} />}
              {template === 'terminal' && <code>[{contact.type}]</code>}
              {contact.label}
            </strong>
            <button onClick={() => removeContact(contact.id)} type="button">
              Remover
            </button>
          </div>
          <div className="form-block">
            <label htmlFor={`contact-type-${contact.id}`}>Rede / tipo de contato</label>
            <select
              id={`contact-type-${contact.id}`}
              onChange={(event) => updateContactType(contact.id, event.target.value as ContactType)}
              value={contact.type}
            >
              {contactPresets.map((preset) => (
                <option key={preset.type} value={preset.type}>{preset.label}</option>
              ))}
            </select>
          </div>
          <TextInput
            error={validationErrors.items[contact.id]?.value}
            label="Texto exibido"
            onChange={(value) => updateContact(contact.id, 'value', value)}
            placeholder={contactPresets.find((preset) => preset.type === contact.type)?.value}
            value={contact.value}
          />
          <TextInput
            error={validationErrors.items[contact.id]?.url}
            label="URL"
            onChange={(value) => updateContact(contact.id, 'url', value)}
            placeholder={contactPresets.find((preset) => preset.type === contact.type)?.url}
            value={contact.url}
          />
        </article>
      ))}
    </div>
    <ContactsMiniPreview contacts={contacts} template={template} />
  </StepBlock>
  )
}
