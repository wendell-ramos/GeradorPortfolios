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
        <strong>{template === 'desktop' ? 'Area de trabalho' : template === 'terminal' ? 'Terminal' : template === 'landing' ? 'Landing page' : 'Pagina'}</strong>
        <i style={{ backgroundColor: accentColor }} />
      </div>
    </div>
    <div className={`template-settings-panel template-settings-${template}`}>
      <div className="template-settings-heading">
        <div>
          <strong>{template === 'desktop' ? 'Interface do sistema' : template === 'terminal' ? 'Ambiente do terminal' : template === 'landing' ? 'Direcao criativa' : 'Leitura da documentacao'}</strong>
          <span>{template === 'desktop' ? 'Personalize rotulos, atalhos e a janela da interface retro.' : template === 'terminal' ? 'Defina a identidade, a escala e o acabamento visual da sessao.' : template === 'landing' ? 'Ajuste narrativa, movimento e composicao dos projetos.' : 'Ajuste a identidade e a composicao de leitura do portfolio.'}</span>
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

      {template === 'landing' && (
        <div className="template-settings-fields">
          <label className="template-option-field"><span>Composicao principal</span><select onChange={(event) => setTemplateSettings((current) => ({ ...current, landing: { ...current.landing, composition: event.target.value as TemplateSettings['landing']['composition'] } }))} value={templateSettings.landing.composition}><option value="editorial">Editorial com metricas</option><option value="profile">Pessoal com foto</option><option value="projects">Projetos primeiro</option></select></label>
          <TextInput label="Chamada acima do hero" onChange={(value) => setTemplateSettings((current) => ({ ...current, landing: { ...current.landing, eyebrow: value } }))} placeholder="Disponivel para novos projetos" value={templateSettings.landing.eyebrow} />
          <TextInput label="Texto do CTA principal" onChange={(value) => setTemplateSettings((current) => ({ ...current, landing: { ...current.landing, primaryAction: value } }))} placeholder="Explorar projetos" value={templateSettings.landing.primaryAction} />
          <TextInput label="Trecho destacado no titulo" onChange={(value) => setTemplateSettings((current) => ({ ...current, landing: { ...current.landing, highlight: value } }))} placeholder="Ex.: problema real" value={templateSettings.landing.highlight} />
          <label className="template-option-field"><span>Composicao dos projetos</span><select onChange={(event) => setTemplateSettings((current) => ({ ...current, landing: { ...current.landing, projectLayout: event.target.value as TemplateSettings['landing']['projectLayout'] } }))} value={templateSettings.landing.projectLayout}><option value="showcase">Showcase alternado</option><option value="grid">Grade editorial</option></select></label>
          <label className="template-option-field"><span>Intensidade do movimento</span><select onChange={(event) => setTemplateSettings((current) => ({ ...current, landing: { ...current.landing, motion: event.target.value as TemplateSettings['landing']['motion'] } }))} value={templateSettings.landing.motion}><option value="subtle">Sutil</option><option value="expressive">Expressiva</option></select></label>
          <label className="template-toggle-field"><input checked={templateSettings.landing.showMarquee} onChange={(event) => setTemplateSettings((current) => ({ ...current, landing: { ...current.landing, showMarquee: event.target.checked } }))} type="checkbox" /><span><strong>Faixa de tecnologias</strong><small>Stack em movimento entre o hero e o conteudo.</small></span></label>
          <label className="template-toggle-field"><input checked={templateSettings.landing.showMetrics} onChange={(event) => setTemplateSettings((current) => ({ ...current, landing: { ...current.landing, showMetrics: event.target.checked } }))} type="checkbox" /><span><strong>Metricas no hero</strong><small>Numeros rapidos para reforcar experiencia e resultados.</small></span></label>
          {templateSettings.landing.showMetrics && (
            <div className="landing-metrics-fields">
              <div className="landing-metric-pair">
                <TextInput label="Metrica 1" onChange={(value) => setTemplateSettings((current) => ({ ...current, landing: { ...current.landing, metricOneValue: value } }))} placeholder="4+" value={templateSettings.landing.metricOneValue} />
                <TextInput label="Descricao" onChange={(value) => setTemplateSettings((current) => ({ ...current, landing: { ...current.landing, metricOneLabel: value } }))} placeholder="projetos publicados" value={templateSettings.landing.metricOneLabel} />
              </div>
              <div className="landing-metric-pair">
                <TextInput label="Metrica 2" onChange={(value) => setTemplateSettings((current) => ({ ...current, landing: { ...current.landing, metricTwoValue: value } }))} placeholder="2" value={templateSettings.landing.metricTwoValue} />
                <TextInput label="Descricao" onChange={(value) => setTemplateSettings((current) => ({ ...current, landing: { ...current.landing, metricTwoLabel: value } }))} placeholder="clientes atendidos" value={templateSettings.landing.metricTwoLabel} />
              </div>
              <div className="landing-metric-pair">
                <TextInput label="Metrica 3" onChange={(value) => setTemplateSettings((current) => ({ ...current, landing: { ...current.landing, metricThreeValue: value } }))} placeholder="BR" value={templateSettings.landing.metricThreeValue} />
                <TextInput label="Descricao" onChange={(value) => setTemplateSettings((current) => ({ ...current, landing: { ...current.landing, metricThreeLabel: value } }))} placeholder="Presidente Prudente, SP" value={templateSettings.landing.metricThreeLabel} />
              </div>
            </div>
          )}
          <div className={`template-setting-preview landing-setting-preview landing-preview-${templateSettings.landing.composition}`}><span>{templateSettings.landing.eyebrow || 'Disponivel'}</span><strong>{templateSettings.landing.composition === 'profile' ? 'PESSOAL' : templateSettings.landing.composition === 'projects' ? 'PROJECTS' : 'EDITORIAL'} <b>PORTFOLIO</b></strong><small>{templateSettings.landing.primaryAction || 'Explorar projetos'} / movimento {templateSettings.landing.motion}</small></div>
        </div>
      )}
    </div>

  </StepBlock>
  )
}
