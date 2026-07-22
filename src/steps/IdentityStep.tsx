import { useEffect, useId, useState, type ChangeEvent } from 'react'
import { BriefcaseBusiness, CalendarRange, ChevronDown, ChevronUp, FileText, ImagePlus, Plus, Trash2 } from 'lucide-react'
import type { DevExperience } from '../models/portfolio'
import type { IdentityValidation } from '../utils/validation'
import { FormSection, StepBlock, TextArea, TextInput } from '../components/BuilderUI'
import { IdentityMiniPreview } from '../components/PortfolioPreviews'

interface IdentityStepProps {
  addExperience: () => void
  bio: string
  experiences: DevExperience[]
  validationErrors: IdentityValidation
  handleProfilePhoto: (event: ChangeEvent<HTMLInputElement>) => void
  handleResumeFile: (event: ChangeEvent<HTMLInputElement>) => void
  headline: string
  location: string
  moveExperience: (id: string, direction: -1 | 1) => void
  name: string
  profilePhoto: string
  profilePhotoError: string
  removeResumeFile: () => void
  removeExperience: (id: string) => void
  resumeEnabled: boolean
  resumeFile: string
  resumeFileError: string
  resumeName: string
  role: string
  setBio: (value: string) => void
  setHeadline: (value: string) => void
  setLocation: (value: string) => void
  setName: (value: string) => void
  setProfilePhoto: (value: string) => void
  setProfilePhotoError: (value: string) => void
  setResumeEnabled: (value: boolean) => void
  setRole: (value: string) => void
  updateExperience: (id: string, field: keyof Omit<DevExperience, 'id'>, value: string | boolean) => void
}

const months = [
  'Janeiro',
  'Fevereiro',
  'Marco',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const currentYear = new Date().getFullYear()
const experienceYears = Array.from({ length: currentYear - 1964 }, (_, index) => String(currentYear + 5 - index))

function ExperienceDateSelect({
  disabled = false,
  error,
  label,
  onChange,
  value,
}: {
  disabled?: boolean
  error?: string
  label: string
  onChange: (value: string) => void
  value: string
}) {
  const monthId = useId()
  const yearId = useId()
  const errorId = useId()
  const [initialYear = '', initialMonth = ''] = value.split('-')
  const [selectedMonth, setSelectedMonth] = useState(initialMonth)
  const [selectedYear, setSelectedYear] = useState(initialYear)

  useEffect(() => {
    const [nextYear = '', nextMonth = ''] = value.split('-')
    setSelectedMonth(nextMonth)
    setSelectedYear(nextYear)
  }, [value])

  const updateDate = (nextMonth: string, nextYear: string) => {
    setSelectedMonth(nextMonth)
    setSelectedYear(nextYear)
    if (nextMonth && nextYear) onChange(`${nextYear}-${nextMonth}`)
    else if (value) onChange('')
  }

  return (
    <fieldset aria-describedby={error ? errorId : undefined} className={`experience-date-field${error ? ' has-error' : ''}`} disabled={disabled}>
      <legend>{label}</legend>
      <div className="experience-date-controls">
        <label htmlFor={monthId}>Mes</label>
        <select id={monthId} onChange={(event) => updateDate(event.target.value, selectedYear)} value={selectedMonth}>
          <option value="">Mes</option>
          {months.map((monthName, index) => (
            <option key={monthName} value={String(index + 1).padStart(2, '0')}>{monthName}</option>
          ))}
        </select>
        <label htmlFor={yearId}>Ano</label>
        <select id={yearId} onChange={(event) => updateDate(selectedMonth, event.target.value)} value={selectedYear}>
          <option value="">Ano</option>
          {experienceYears.map((yearOption) => <option key={yearOption} value={yearOption}>{yearOption}</option>)}
        </select>
      </div>
      {error && <p className="field-error" id={errorId} role="alert">{error}</p>}
    </fieldset>
  )
}

export function IdentityStep({
  addExperience,
  bio,
  experiences,
  validationErrors,
  handleProfilePhoto,
  handleResumeFile,
  headline,
  location,
  moveExperience,
  name,
  profilePhoto,
  profilePhotoError,
  removeResumeFile,
  removeExperience,
  resumeEnabled,
  resumeFile,
  resumeFileError,
  resumeName,
  role,
  setBio,
  setHeadline,
  setLocation,
  setName,
  setProfilePhoto,
  setProfilePhotoError,
  setResumeEnabled,
  setRole,
  updateExperience,
}: IdentityStepProps) {
  return (
  <StepBlock
    eyebrow="Etapa 1"
    title="Defina a identidade principal do portfolio."
    description="Essas informacoes formam o hero e a apresentacao inicial do portfolio dev."
  >
    <FormSection description="As informacoes que identificam voce logo no primeiro contato." icon="profile" title="Perfil principal">
      <div className="identity-field-grid">
        <TextInput error={validationErrors.fields.name} label="Nome" onChange={setName} placeholder="Ex.: Wendell Ramos" value={name} />
        <TextInput error={validationErrors.fields.role} label="Cargo / assinatura" onChange={setRole} placeholder="Ex.: Desenvolvedor de Sistemas" value={role} />
        <div className="identity-location-field"><TextInput label="Localizacao" onChange={setLocation} placeholder="Ex.: Presidente Prudente - SP" value={location} /></div>
      </div>
    </FormSection>

    <FormSection description="Construa a mensagem que apresenta seu trabalho e sua trajetoria." title="Sua apresentacao">
      <div className="identity-story-grid">
        <TextArea error={validationErrors.fields.headline} label="Chamada principal" onChange={setHeadline} placeholder="Resuma em uma frase o que voce cria e para quem." rows={3} value={headline} />
        <TextArea error={validationErrors.fields.bio} label="Resumo sobre voce" onChange={setBio} placeholder="Conte sua trajetoria, seus interesses e seu foco profissional." rows={5} value={bio} />
      </div>
      <div className="profile-photo-field">
        <div className="profile-photo-copy">
          <span className="profile-photo-field-icon"><ImagePlus aria-hidden="true" /></span>
          <div><strong>Foto para o Sobre mim</strong><span>JPG, PNG ou WebP de ate 5 MB.</span></div>
        </div>
        <div className="profile-photo-control">
          <div className={profilePhoto ? 'profile-photo-preview has-photo' : 'profile-photo-preview'}>
            {profilePhoto
              ? <img alt={`Foto de ${name}`} src={profilePhoto} />
              : <span aria-hidden="true">{name.trim().charAt(0).toUpperCase() || 'P'}</span>}
          </div>
          <div className="profile-photo-actions">
            <label className="profile-photo-button">
              {profilePhoto ? 'Trocar foto' : 'Adicionar foto'}
              <input accept="image/jpeg,image/png,image/webp" onChange={handleProfilePhoto} type="file" />
            </label>
            {profilePhoto && <button aria-label="Remover foto" onClick={() => { setProfilePhoto(''); setProfilePhotoError('') }} type="button"><Trash2 aria-hidden="true" /></button>}
          </div>
        </div>
        {profilePhotoError && <p className="profile-photo-error" role="alert">{profilePhotoError}</p>}
      </div>
      <div className={`${resumeEnabled ? 'is-enabled' : 'is-disabled'} ${resumeFile ? 'has-file' : ''} resume-file-field`}>
        <label className="resume-enable-row">
          <input checked={resumeEnabled} onChange={(event) => setResumeEnabled(event.target.checked)} type="checkbox" />
          <span className="resume-enable-switch" aria-hidden="true"><i /></span>
          <span>
            <strong>Exibir curriculo no portfolio</strong>
            <small>Opcional. Ative para adicionar uma secao ou acesso ao seu PDF.</small>
          </span>
          <b>{resumeEnabled ? 'Ativado' : 'Desativado'}</b>
        </label>
        {resumeEnabled ? (
          <>
            <div className="resume-file-copy">
              <span className="resume-file-icon"><FileText aria-hidden="true" /></span>
              <div>
                <strong>Curriculo em PDF</strong>
                <span>Adicione um arquivo de ate 10 MB. Ele aparecera de forma adaptada em todos os estilos.</span>
              </div>
            </div>
            <div className="resume-file-status">
              <FileText aria-hidden="true" />
              <span><small>{resumeFile ? 'Arquivo selecionado' : 'Arquivo pendente'}</small><strong>{resumeName || 'Adicione um PDF para publicar'}</strong></span>
            </div>
            <div className="resume-file-actions">
              <label className="resume-file-button">
                {resumeFile ? 'Trocar PDF' : 'Adicionar PDF'}
                <input accept="application/pdf,.pdf" onChange={handleResumeFile} type="file" />
              </label>
              {resumeFile && <a href={resumeFile} rel="noreferrer" target="_blank">Visualizar</a>}
              {resumeFile && <button aria-label="Remover curriculo" onClick={removeResumeFile} type="button"><Trash2 aria-hidden="true" /></button>}
            </div>
            {resumeFileError && <p className="resume-file-error" role="alert">{resumeFileError}</p>}
            {validationErrors.fields.resumeFile && <p className="field-error resume-validation-error" role="alert">{validationErrors.fields.resumeFile}</p>}
          </>
        ) : (
          <div className="resume-disabled-note">
            <FileText aria-hidden="true" />
            <span><strong>Curriculo oculto</strong><small>Nenhum botao, comando ou secao de curriculo sera gerado.</small></span>
          </div>
        )}
      </div>
    </FormSection>
    <div className="experience-builder">
      <div className="experience-builder-header">
        <div className="experience-builder-title">
          <span><BriefcaseBusiness aria-hidden="true" /></span>
          <div><strong>Experiencias profissionais</strong><small>Monte uma trajetoria organizada e facil de percorrer.</small></div>
        </div>
        <button onClick={addExperience} type="button"><Plus aria-hidden="true" />Adicionar experiencia</button>
      </div>
      <div className="experience-list">
        {experiences.length === 0 && (
          <div className="experience-empty">
            <strong>Nenhuma experiencia cadastrada.</strong>
            <span>Voce pode deixar esta parte vazia ou adicionar sua primeira experiencia.</span>
          </div>
        )}
        {experiences.map((item, index) => (
          <article className="experience-editor" key={item.id}>
            <div className="experience-editor-title">
              <div>
                <span>Experiencia {index + 1}</span>
                <strong>{item.role || item.company || 'Nova experiencia'}</strong>
              </div>
              <div className="experience-editor-actions">
                <button disabled={index === 0} onClick={() => moveExperience(item.id, -1)} type="button" aria-label="Mover experiencia para cima"><ChevronUp aria-hidden="true" /></button>
                <button disabled={index === experiences.length - 1} onClick={() => moveExperience(item.id, 1)} type="button" aria-label="Mover experiencia para baixo"><ChevronDown aria-hidden="true" /></button>
                <button className="danger-icon-button" onClick={() => removeExperience(item.id)} type="button"><Trash2 aria-hidden="true" /><span>Remover</span></button>
              </div>
            </div>
            <div className="experience-fields">
              <TextInput error={validationErrors.experiences[item.id]?.company} label="Empresa" onChange={(value) => updateExperience(item.id, 'company', value)} placeholder="Ex.: Empresa ou projeto independente" value={item.company} />
              <TextInput label="Cidade" onChange={(value) => updateExperience(item.id, 'city', value)} placeholder="Ex.: Sao Paulo - SP ou Remoto" value={item.city} />
              <TextInput error={validationErrors.experiences[item.id]?.role} label="Cargo" onChange={(value) => updateExperience(item.id, 'role', value)} placeholder="Ex.: Desenvolvedor Front-end" value={item.role} />
              <TextArea label="Atividades realizadas" onChange={(value) => updateExperience(item.id, 'activities', value)} placeholder="Descreva responsabilidades, entregas e resultados." rows={3} value={item.activities} />
              <section className="experience-period">
                <div className="experience-period-heading">
                  <span><CalendarRange aria-hidden="true" /></span>
                  <div><strong>Periodo da experiencia</strong><small>Informe quando esse trabalho aconteceu.</small></div>
                </div>
                <div className="experience-period-fields">
                  <ExperienceDateSelect error={validationErrors.experiences[item.id]?.startDate} label="Inicio" onChange={(value) => updateExperience(item.id, 'startDate', value)} value={item.startDate} />
                  <ExperienceDateSelect disabled={item.current} error={validationErrors.experiences[item.id]?.endDate} label="Termino" onChange={(value) => updateExperience(item.id, 'endDate', value)} value={item.endDate} />
                  <label className="experience-current-field">
                    <input checked={item.current} onChange={(event) => updateExperience(item.id, 'current', event.target.checked)} type="checkbox" />
                    <span><strong>Trabalho atualmente aqui</strong><small>O termino fica definido como atual.</small></span>
                  </label>
                </div>
              </section>
            </div>
          </article>
        ))}
      </div>
    </div>
    <IdentityMiniPreview headline={headline} name={name} profilePhoto={profilePhoto} resumeName={resumeEnabled ? resumeName : ''} role={role} />
  </StepBlock>
  )
}
