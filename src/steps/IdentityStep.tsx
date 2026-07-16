import type { ChangeEvent } from 'react'
import type { DevExperience } from '../models/portfolio'
import { StepBlock, TextArea, TextInput } from '../components/BuilderUI'
import { IdentityMiniPreview } from '../components/PortfolioPreviews'

interface IdentityStepProps {
  addExperience: () => void
  bio: string
  experiences: DevExperience[]
  handleProfilePhoto: (event: ChangeEvent<HTMLInputElement>) => void
  headline: string
  location: string
  moveExperience: (id: string, direction: -1 | 1) => void
  name: string
  profilePhoto: string
  profilePhotoError: string
  removeExperience: (id: string) => void
  role: string
  setBio: (value: string) => void
  setHeadline: (value: string) => void
  setLocation: (value: string) => void
  setName: (value: string) => void
  setProfilePhoto: (value: string) => void
  setProfilePhotoError: (value: string) => void
  setRole: (value: string) => void
  updateExperience: (id: string, field: keyof Omit<DevExperience, 'id'>, value: string | boolean) => void
}

export function IdentityStep({
  addExperience,
  bio,
  experiences,
  handleProfilePhoto,
  headline,
  location,
  moveExperience,
  name,
  profilePhoto,
  profilePhotoError,
  removeExperience,
  role,
  setBio,
  setHeadline,
  setLocation,
  setName,
  setProfilePhoto,
  setProfilePhotoError,
  setRole,
  updateExperience,
}: IdentityStepProps) {
  return (
  <StepBlock
    eyebrow="Etapa 1"
    title="Defina a identidade principal do portfolio."
    description="Essas informacoes formam o hero e a apresentacao inicial do portfolio dev."
  >
    <TextInput label="Nome" onChange={setName} placeholder="Ex.: Wendell Ramos" value={name} />
    <TextInput label="Cargo / assinatura" onChange={setRole} placeholder="Ex.: Desenvolvedor de Sistemas" value={role} />
    <TextInput label="Localizacao" onChange={setLocation} placeholder="Ex.: Presidente Prudente - SP" value={location} />
    <TextArea label="Chamada principal" onChange={setHeadline} placeholder="Resuma em uma frase o que voce cria e para quem." rows={3} value={headline} />
    <TextArea label="Resumo sobre voce" onChange={setBio} placeholder="Conte sua trajetoria, seus interesses e seu foco profissional." rows={5} value={bio} />
    <div className="profile-photo-field">
      <div className="profile-photo-copy">
        <strong>Foto para o Sobre mim</strong>
        <span>JPG, PNG ou WebP de ate 5 MB.</span>
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
          {profilePhoto && (
            <button onClick={() => { setProfilePhoto(''); setProfilePhotoError('') }} type="button">
              Remover
            </button>
          )}
        </div>
      </div>
      {profilePhotoError && <p className="profile-photo-error" role="alert">{profilePhotoError}</p>}
    </div>
    <div className="experience-builder">
      <div className="experience-builder-header">
        <div>
          <strong>Experiencias profissionais</strong>
          <span>Cadastre cada experiencia separadamente para gerar uma trajetoria organizada.</span>
        </div>
        <button onClick={addExperience} type="button">Adicionar experiencia</button>
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
                <button disabled={index === 0} onClick={() => moveExperience(item.id, -1)} type="button" aria-label="Mover experiencia para cima">↑</button>
                <button disabled={index === experiences.length - 1} onClick={() => moveExperience(item.id, 1)} type="button" aria-label="Mover experiencia para baixo">↓</button>
                <button onClick={() => removeExperience(item.id)} type="button">Remover</button>
              </div>
            </div>
            <div className="experience-fields">
              <TextInput label="Empresa" onChange={(value) => updateExperience(item.id, 'company', value)} placeholder="Ex.: Empresa ou projeto independente" value={item.company} />
              <TextInput label="Cidade" onChange={(value) => updateExperience(item.id, 'city', value)} placeholder="Ex.: Sao Paulo - SP ou Remoto" value={item.city} />
              <TextInput label="Cargo" onChange={(value) => updateExperience(item.id, 'role', value)} placeholder="Ex.: Desenvolvedor Front-end" value={item.role} />
              <TextArea label="Atividades realizadas" onChange={(value) => updateExperience(item.id, 'activities', value)} placeholder="Descreva responsabilidades, entregas e resultados." rows={4} value={item.activities} />
              <label className="experience-date-field">
                <span>Data de admissao</span>
                <input onChange={(event) => updateExperience(item.id, 'startDate', event.target.value)} type="month" value={item.startDate} />
              </label>
              <label className="experience-current-field">
                <input checked={item.current} onChange={(event) => updateExperience(item.id, 'current', event.target.checked)} type="checkbox" />
                <span>Trabalho atual</span>
              </label>
              <label className="experience-date-field">
                <span>Data de saida</span>
                <input disabled={item.current} onChange={(event) => updateExperience(item.id, 'endDate', event.target.value)} type="month" value={item.endDate} />
              </label>
            </div>
          </article>
        ))}
      </div>
    </div>
    <IdentityMiniPreview headline={headline} name={name} profilePhoto={profilePhoto} role={role} />
  </StepBlock>
  )
}

