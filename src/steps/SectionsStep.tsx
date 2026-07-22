import type { DevCertification, DevEducation, DevTemplate, PortfolioSection, SectionIcon } from '../models/portfolio'
import { sectionIconOptions, sectionPresets } from '../data/devPortfolioDefaults'
import { defaultSectionSurface, terminalSlug } from '../utils/portfolio'
import { StepBlock, TextArea, TextInput } from '../components/BuilderUI'
import { SectionIconGlyph } from '../components/PortfolioIcons'
import { SectionsMiniPreview, TemplateEditorBanner } from '../components/PortfolioPreviews'
import { ProfessionalContentEditors } from '../components/ProfessionalContentEditors'

interface SectionsStepProps {
  addCustomSection: () => void
  addPresetSection: (section: Omit<PortfolioSection, 'id' | 'enabled'> & { id?: string }) => void
  addCertification: () => void
  addEducation: () => void
  certifications: DevCertification[]
  customSectionDescription: string
  customSectionIcon: SectionIcon
  customSectionTitle: string
  enabledSections: PortfolioSection[]
  educations: DevEducation[]
  moveCertification: (id: string, direction: -1 | 1) => void
  moveEducation: (id: string, direction: -1 | 1) => void
  moveSection: (id: string, direction: -1 | 1) => void
  removeSection: (id: string) => void
  removeCertification: (id: string) => void
  removeEducation: (id: string) => void
  sections: PortfolioSection[]
  setCustomSectionDescription: (value: string) => void
  setCustomSectionIcon: (icon: SectionIcon) => void
  setCustomSectionTitle: (value: string) => void
  setStackText: (value: string) => void
  stack: string[]
  stackText: string
  template: DevTemplate
  toggleSection: (id: string) => void
  updateSectionColor: (id: string, color: string) => void
  updateSectionDocsGroup: (id: string, group: string) => void
  updateSectionIcon: (id: string, icon: SectionIcon) => void
  updateSectionTerminalCommand: (id: string, command: string) => void
  updateCertification: <K extends keyof Omit<DevCertification, 'id'>>(id: string, field: K, value: DevCertification[K]) => void
  updateEducation: <K extends keyof Omit<DevEducation, 'id'>>(id: string, field: K, value: DevEducation[K]) => void
}

export function SectionsStep({
  addCustomSection,
  addPresetSection,
  addCertification,
  addEducation,
  certifications,
  customSectionDescription,
  customSectionIcon,
  customSectionTitle,
  enabledSections,
  educations,
  moveCertification,
  moveEducation,
  moveSection,
  removeSection,
  removeCertification,
  removeEducation,
  sections,
  setCustomSectionDescription,
  setCustomSectionIcon,
  setCustomSectionTitle,
  setStackText,
  stack,
  stackText,
  template,
  toggleSection,
  updateSectionColor,
  updateSectionDocsGroup,
  updateSectionIcon,
  updateSectionTerminalCommand,
  updateCertification,
  updateEducation,
}: SectionsStepProps) {
  return (
  <StepBlock
    eyebrow="Etapa 3"
    title={template === 'desktop' ? 'Monte os atalhos e janelas do Desktop.' : template === 'terminal' ? 'Defina os comandos do Terminal.' : template === 'landing' ? 'Construa o ritmo da Landing.' : 'Organize as paginas da documentacao.'}
    description={template === 'desktop' ? 'Cada secao vira um atalho com icone e uma janela propria.' : template === 'terminal' ? 'Cada secao vira um comando textual. Icones e controles visuais nao fazem parte deste estilo.' : template === 'landing' ? 'A ordem das secoes define a narrativa vertical que o visitante percorre.' : 'Cada secao vira uma pagina agrupada na navegacao lateral do Docs.'}
  >
    <TemplateEditorBanner template={template} />
    <div className={`preset-section-grid preset-section-${template}`}>
      {sectionPresets.map((section) => (
        <button disabled={Boolean(section.id && sections.some((item) => item.id === section.id))} key={section.title} onClick={() => addPresetSection(section)} type="button">
          {template === 'desktop' && <SectionIconGlyph icon={section.icon} />}
          {template === 'terminal' && <code>./{terminalSlug(section.title)}</code>}
          {template === 'docs' && <small>Nova pagina</small>}
          {template === 'landing' && <small>Nova secao</small>}
          <strong>{section.title}</strong>
          <span>{section.description}</span>
        </button>
      ))}
    </div>

    <div className="section-manager">
      {sections.map((section, index) => (
        <article className={`${section.enabled ? 'managed-section is-active' : 'managed-section'} managed-section-${template}`} key={section.id}>
          <div className="managed-section-summary">
            {template === 'desktop' && <SectionIconGlyph icon={section.icon} />}
            {template === 'terminal' && <code className="section-terminal-command">$ {section.terminalCommand || terminalSlug(section.title)}</code>}
            {template === 'docs' && <span className="section-docs-page">PAGE</span>}
            {template === 'landing' && <span className="section-landing-index">{String(index + 1).padStart(2, '0')}</span>}
            <div>
              <strong>{section.title}</strong>
              <p>{section.description}</p>
            </div>
          </div>
          <div className="section-actions">
            {template === 'desktop' && (
              <>
                <label className="section-icon-select">
                  <span>Icone</span>
                  <select onChange={(event) => updateSectionIcon(section.id, event.target.value as SectionIcon)} value={section.icon}>
                    {sectionIconOptions.map((icon) => <option key={icon.id} value={icon.id}>{icon.label}</option>)}
                  </select>
                </label>
                <label className="section-color-control">
                  <span className="section-color-swatch" style={{ backgroundColor: section.backgroundColor || defaultSectionSurface(template) }} />
                  <span>Cor</span>
                  <input aria-label={`Escolher cor da secao ${section.title}`} onChange={(event) => updateSectionColor(section.id, event.target.value)} type="color" value={section.backgroundColor || defaultSectionSurface(template)} />
                </label>
                {section.backgroundColor && <button onClick={() => updateSectionColor(section.id, '')} type="button">Cor padrao</button>}
              </>
            )}
            {template === 'terminal' && (
              <label className="section-template-field section-terminal-field">
                <span>Comando</span>
                <b>./</b>
                <input aria-label={`Comando da secao ${section.title}`} onChange={(event) => updateSectionTerminalCommand(section.id, event.target.value)} value={section.terminalCommand || terminalSlug(section.title)} />
              </label>
            )}
            {template === 'docs' && (
              <label className="section-template-field">
                <span>Grupo da sidebar</span>
                <select onChange={(event) => updateSectionDocsGroup(section.id, event.target.value)} value={section.docsGroup || 'Mais'}>
                  <option value="Comece aqui">Comece aqui</option>
                  <option value="Perfil">Perfil</option>
                  <option value="Trabalho">Trabalho</option>
                  <option value="Conecte-se">Conecte-se</option>
                  <option value="Mais">Mais</option>
                </select>
              </label>
            )}
            <button disabled={index === 0} onClick={() => moveSection(section.id, -1)} type="button">
              Subir
            </button>
            <button disabled={index === sections.length - 1} onClick={() => moveSection(section.id, 1)} type="button">
              Descer
            </button>
            <button onClick={() => toggleSection(section.id)} type="button">
              {section.enabled ? 'Ativa' : 'Oculta'}
            </button>
            {!section.locked && (
              <button onClick={() => removeSection(section.id)} type="button">
                Remover
              </button>
            )}
          </div>
        </article>
      ))}
    </div>

    <ProfessionalContentEditors
      addCertification={addCertification}
      addEducation={addEducation}
      certifications={certifications}
      educations={educations}
      hasCertificationsSection={sections.some((section) => section.id === 'certifications')}
      hasEducationSection={sections.some((section) => section.id === 'education')}
      moveCertification={moveCertification}
      moveEducation={moveEducation}
      removeCertification={removeCertification}
      removeEducation={removeEducation}
      updateCertification={updateCertification}
      updateEducation={updateEducation}
    />

    <div className="add-box">
      <TextInput label="Nome da nova secao" onChange={setCustomSectionTitle} placeholder="Ex.: Certificados" value={customSectionTitle} />
      <TextArea
        label="Descricao da nova secao"
        onChange={setCustomSectionDescription}
        placeholder="Explique que tipo de conteudo aparecera nesta secao."
        rows={3}
        value={customSectionDescription}
      />
      {template === 'desktop' && (
        <div className="form-block">
          <label>Icone do atalho</label>
          <div className="section-icon-picker" role="group" aria-label="Escolha o icone da nova secao">
            {sectionIconOptions.map((icon) => (
              <button aria-label={icon.label} aria-pressed={customSectionIcon === icon.id} className={customSectionIcon === icon.id ? 'is-active' : ''} key={icon.id} onClick={() => setCustomSectionIcon(icon.id)} type="button">
                <SectionIconGlyph icon={icon.id} /><span>{icon.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {template === 'terminal' && <p className="template-form-hint"><code>./{terminalSlug(customSectionTitle) || 'novo-comando'}</code> sera criado a partir do nome da secao.</p>}
      {template === 'docs' && <p className="template-form-hint">A nova pagina sera adicionada inicialmente ao grupo <strong>Mais</strong>.</p>}
      {template === 'landing' && <p className="template-form-hint">A nova secao entra no final da narrativa e pode ser reordenada acima.</p>}
      <button className="primary-button" onClick={addCustomSection} type="button">
        Adicionar secao
      </button>
    </div>

    <TextArea label="Stack, uma tecnologia por linha" onChange={setStackText} placeholder={'React\nTypeScript\nPostgreSQL'} rows={6} value={stackText} />
    <SectionsMiniPreview sections={enabledSections} stack={stack} template={template} />
  </StepBlock>
  )
}
