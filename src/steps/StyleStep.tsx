import type { Dispatch, SetStateAction } from 'react'
import type { DevTemplate, TemplateSettings } from '../models/portfolio'
import {
  accentOptions,
  backgroundOptions,
  defaultTemplateBackgrounds,
  defaultTemplateSettings,
  devTemplates,
} from '../data/devPortfolioDefaults'
import { getContrastColor, terminalSlug } from '../utils/portfolio'
import { StepBlock, TextInput } from '../components/BuilderUI'
import { ColorMiniPreview, TemplateMiniPreview } from '../components/PortfolioPreviews'

interface StyleStepProps {
  accentColor: string
  setAccentColor: (color: string) => void
  setTemplate: (template: DevTemplate) => void
  setTemplateBackgrounds: Dispatch<SetStateAction<Record<DevTemplate, string>>>
  setTemplateSettings: Dispatch<SetStateAction<TemplateSettings>>
  template: DevTemplate
  templateBackgrounds: Record<DevTemplate, string>
  templateSettings: TemplateSettings
}

export function StyleStep({
  accentColor,
  setAccentColor,
  setTemplate,
  setTemplateBackgrounds,
  setTemplateSettings,
  template,
  templateBackgrounds,
  templateSettings,
}: StyleStepProps) {
  return (
  <StepBlock
    eyebrow="Etapa 2"
    title="Escolha um estilo que combine com dev."
    description="Nesta fase nao misturamos areas. Filmmaker e designer vao ter estilos proprios depois."
  >
    <div className="template-grid">
      {devTemplates.map((item) => (
        <button
          className={item.id === template ? 'template-card is-active' : 'template-card'}
          key={item.id}
          onClick={() => setTemplate(item.id)}
          type="button"
        >
          <TemplateMiniPreview accentColor={accentColor} template={item.id} />
          <strong>{item.label}</strong>
          <span>{item.description}</span>
        </button>
      ))}
    </div>

    <div className="color-row" aria-label="Cores de destaque">
      {accentOptions.map((color) => (
        <button
          aria-label={`Usar cor ${color}`}
          className={accentColor === color ? 'color-dot is-active' : 'color-dot'}
          key={color}
          onClick={() => setAccentColor(color)}
          style={{ background: color }}
          type="button"
        />
      ))}
    </div>
    <ColorMiniPreview accentColor={accentColor} template={template} />
    <div className="area-color-editor">
      <div className="area-color-copy">
        <strong>Fundo geral do site</strong>
        <span>Altera a area principal do estilo escolhido, como o papel de parede do Desktop.</span>
      </div>
      <div className="area-color-controls">
        <label className="native-color-picker">
          <span style={{ backgroundColor: templateBackgrounds[template] }} />
          Escolher cor
          <input
            aria-label="Escolher cor do fundo geral"
            onChange={(event) => setTemplateBackgrounds((current) => ({
              ...current,
              [template]: event.target.value,
            }))}
            type="color"
            value={templateBackgrounds[template]}
          />
        </label>
        <div className="background-color-presets" aria-label="Cores sugeridas para o fundo">
          {backgroundOptions.map((color) => (
            <button
              aria-label={`Usar fundo ${color}`}
              className={templateBackgrounds[template] === color ? 'is-active' : ''}
              key={color}
              onClick={() => setTemplateBackgrounds((current) => ({ ...current, [template]: color }))}
              style={{ backgroundColor: color }}
              type="button"
            />
          ))}
        </div>
        <button
          className="reset-color-button"
          disabled={templateBackgrounds[template] === defaultTemplateBackgrounds[template]}
          onClick={() => setTemplateBackgrounds((current) => ({
            ...current,
            [template]: defaultTemplateBackgrounds[template],
          }))}
          type="button"
        >
          Restaurar padrao
        </button>
      </div>
      <div
        className={`area-color-preview mini-${template}`}
        style={{ backgroundColor: templateBackgrounds[template], color: getContrastColor(templateBackgrounds[template]) }}
      >
        <span>Fundo</span>
        <strong>{template === 'desktop' ? 'Area de trabalho' : template === 'terminal' ? 'Terminal' : 'Pagina'}</strong>
        <i style={{ backgroundColor: accentColor }} />
      </div>
    </div>
    <div className={`template-settings-panel template-settings-${template}`}>
      <div className="template-settings-heading">
        <div>
          <strong>{template === 'desktop' ? 'Interface do sistema' : template === 'terminal' ? 'Ambiente do terminal' : 'Leitura da documentacao'}</strong>
          <span>{template === 'desktop' ? 'Personalize rotulos, atalhos e a janela da interface retro.' : template === 'terminal' ? 'Defina a identidade, a escala e o acabamento visual da sessao.' : 'Ajuste a identidade e a composicao de leitura do portfolio.'}</span>
        </div>
        <button
          disabled={JSON.stringify(templateSettings[template]) === JSON.stringify(defaultTemplateSettings[template])}
          onClick={() => setTemplateSettings((current) => ({ ...current, [template]: defaultTemplateSettings[template] }))}
          type="button"
        >
          Restaurar estilo
        </button>
      </div>

      {template === 'desktop' && (
        <div className="template-settings-fields">
          <TextInput label="Titulo da janela inicial" onChange={(value) => setTemplateSettings((current) => ({ ...current, desktop: { ...current.desktop, homeTitle: value } }))} placeholder="Bem-vindo ao meu portfolio" value={templateSettings.desktop.homeTitle} />
          <TextInput label="Texto do botao iniciar" onChange={(value) => setTemplateSettings((current) => ({ ...current, desktop: { ...current.desktop, startLabel: value } }))} placeholder="iniciar" value={templateSettings.desktop.startLabel} />
          <label className="template-option-field"><span>Tamanho dos atalhos</span><select onChange={(event) => setTemplateSettings((current) => ({ ...current, desktop: { ...current.desktop, shortcutSize: event.target.value as TemplateSettings['desktop']['shortcutSize'] } }))} value={templateSettings.desktop.shortcutSize}><option value="small">Compacto</option><option value="medium">Padrao</option><option value="large">Grande</option></select></label>
          <label className="template-option-field"><span>Largura da janela</span><select onChange={(event) => setTemplateSettings((current) => ({ ...current, desktop: { ...current.desktop, windowWidth: event.target.value as TemplateSettings['desktop']['windowWidth'] } }))} value={templateSettings.desktop.windowWidth}><option value="compact">Compacta</option><option value="wide">Ampla</option></select></label>
          <div className="template-setting-preview desktop-setting-preview"><span>{templateSettings.desktop.startLabel || 'iniciar'}</span><strong>{templateSettings.desktop.homeTitle || 'Portfolio'}</strong></div>
        </div>
      )}

      {template === 'terminal' && (
        <div className="template-settings-fields">
          <TextInput label="Nome do ambiente" onChange={(value) => setTemplateSettings((current) => ({ ...current, terminal: { ...current.terminal, bootTitle: value } }))} placeholder="Portfolio Shell" value={templateSettings.terminal.bootTitle} />
          <TextInput label="Hostname" onChange={(value) => setTemplateSettings((current) => ({ ...current, terminal: { ...current.terminal, host: terminalSlug(value) } }))} placeholder="portfolio" value={templateSettings.terminal.host} />
          <TextInput label="Shell exibido" onChange={(value) => setTemplateSettings((current) => ({ ...current, terminal: { ...current.terminal, shell: value } }))} placeholder="bash" value={templateSettings.terminal.shell} />
          <label className="template-option-field"><span>Escala do texto</span><select onChange={(event) => setTemplateSettings((current) => ({ ...current, terminal: { ...current.terminal, textScale: event.target.value as TemplateSettings['terminal']['textScale'] } }))} value={templateSettings.terminal.textScale}><option value="small">Compacta</option><option value="medium">Padrao</option><option value="large">Ampliada</option></select></label>
          <label className="template-toggle-field"><input checked={templateSettings.terminal.scanlines} onChange={(event) => setTemplateSettings((current) => ({ ...current, terminal: { ...current.terminal, scanlines: event.target.checked } }))} type="checkbox" /><span><strong>Linhas de monitor</strong><small>Efeito sutil de tela CRT.</small></span></label>
          <div className={`template-setting-preview terminal-setting-preview terminal-preview-${templateSettings.terminal.textScale} ${templateSettings.terminal.scanlines ? 'has-scanlines' : ''}`}><span>{templateSettings.terminal.bootTitle || 'Portfolio Shell'} v1.0.0</span><code>dev@{templateSettings.terminal.host || 'portfolio'}:~/portfolio$</code><small>{templateSettings.terminal.shell || 'bash'}</small></div>
        </div>
      )}

      {template === 'docs' && (
        <div className="template-settings-fields">
          <TextInput label="Selo do cabecalho" onChange={(value) => setTemplateSettings((current) => ({ ...current, docs: { ...current.docs, badge: value } }))} placeholder="Docs" value={templateSettings.docs.badge} />
          <TextInput label="Titulo da sidebar" onChange={(value) => setTemplateSettings((current) => ({ ...current, docs: { ...current.docs, sidebarLabel: value } }))} placeholder="DOCUMENTATION" value={templateSettings.docs.sidebarLabel} />
          <TextInput label="Versao exibida" onChange={(value) => setTemplateSettings((current) => ({ ...current, docs: { ...current.docs, version: value } }))} placeholder="v1.0" value={templateSettings.docs.version} />
          <label className="template-option-field"><span>Largura de leitura</span><select onChange={(event) => setTemplateSettings((current) => ({ ...current, docs: { ...current.docs, contentWidth: event.target.value as TemplateSettings['docs']['contentWidth'] } }))} value={templateSettings.docs.contentWidth}><option value="focused">Focada</option><option value="wide">Ampla</option></select></label>
          <label className="template-toggle-field"><input checked={templateSettings.docs.showPageIndex} onChange={(event) => setTemplateSettings((current) => ({ ...current, docs: { ...current.docs, showPageIndex: event.target.checked } }))} type="checkbox" /><span><strong>Indice lateral</strong><small>Atalhos da pagina atual.</small></span></label>
          <div className={`template-setting-preview docs-setting-preview docs-preview-${templateSettings.docs.contentWidth}`}><span>{templateSettings.docs.sidebarLabel || 'DOCUMENTATION'}</span><strong>Portfolio <b>{templateSettings.docs.badge || 'Docs'}</b></strong><small>{templateSettings.docs.version || 'v1.0'}{templateSettings.docs.showPageIndex ? ' / indice ativo' : ''}</small></div>
        </div>
      )}
    </div>

  </StepBlock>
  )
}

