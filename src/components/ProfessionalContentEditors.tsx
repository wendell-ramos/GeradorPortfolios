import { Award, GraduationCap, Plus } from 'lucide-react'
import type { DevCertification, DevEducation } from '../models/portfolio'
import { isHttpUrl } from '../utils/validation'
import { TextInput } from './BuilderUI'

type EducationField = keyof Omit<DevEducation, 'id'>
type CertificationField = keyof Omit<DevCertification, 'id'>

interface ProfessionalContentEditorsProps {
  certifications: DevCertification[]
  educations: DevEducation[]
  hasCertificationsSection: boolean
  hasEducationSection: boolean
  addCertification: () => void
  addEducation: () => void
  moveCertification: (id: string, direction: -1 | 1) => void
  moveEducation: (id: string, direction: -1 | 1) => void
  removeCertification: (id: string) => void
  removeEducation: (id: string) => void
  updateCertification: <K extends CertificationField>(id: string, field: K, value: DevCertification[K]) => void
  updateEducation: <K extends EducationField>(id: string, field: K, value: DevEducation[K]) => void
}

export function ProfessionalContentEditors({
  addCertification,
  addEducation,
  certifications,
  educations,
  hasCertificationsSection,
  hasEducationSection,
  moveCertification,
  moveEducation,
  removeCertification,
  removeEducation,
  updateCertification,
  updateEducation,
}: ProfessionalContentEditorsProps) {
  return (
    <div className="professional-content-editors">
      {hasEducationSection && (
        <section className="structured-content-editor">
          <header>
            <span><GraduationCap aria-hidden="true" /></span>
            <div><strong>Formacao academica</strong><small>Instituicao, curso e periodo de cada formacao.</small></div>
            <button className="primary-button" onClick={addEducation} type="button"><Plus aria-hidden="true" />Adicionar formacao</button>
          </header>
          <div className="structured-entry-list">
            {educations.length === 0 && <div className="structured-empty"><strong>Nenhuma formacao adicionada</strong><p>Adicione apenas o que fizer sentido para seu perfil.</p></div>}
            {educations.map((education, index) => (
              <article className="structured-entry" key={education.id}>
                <div className="structured-entry-heading">
                  <div><span>Formacao {index + 1}</span><strong>{education.course || 'Nova formacao'}</strong></div>
                  <div>
                    <button disabled={index === 0} onClick={() => moveEducation(education.id, -1)} type="button">Subir</button>
                    <button disabled={index === educations.length - 1} onClick={() => moveEducation(education.id, 1)} type="button">Descer</button>
                    <button onClick={() => removeEducation(education.id)} type="button">Remover</button>
                  </div>
                </div>
                <div className="structured-entry-grid">
                  <TextInput label="Instituicao" onChange={(value) => updateEducation(education.id, 'institution', value)} placeholder="Ex.: Universidade do Oeste Paulista" value={education.institution} />
                  <TextInput label="Curso" onChange={(value) => updateEducation(education.id, 'course', value)} placeholder="Ex.: Sistemas de Informacao" value={education.course} />
                  <TextInput label="Nivel / titulacao" onChange={(value) => updateEducation(education.id, 'degree', value)} placeholder="Ex.: Bacharelado" value={education.degree} />
                  <TextInput label="Localizacao" onChange={(value) => updateEducation(education.id, 'location', value)} placeholder="Ex.: Presidente Prudente - SP" value={education.location} />
                  <TextInput label="Ano de inicio" onChange={(value) => updateEducation(education.id, 'startYear', value)} placeholder="2024" value={education.startYear} />
                  <TextInput label="Ano de termino" onChange={(value) => updateEducation(education.id, 'endYear', value)} placeholder="2027" value={education.endYear} />
                </div>
                <label className="structured-current-field">
                  <input checked={education.current} onChange={(event) => updateEducation(education.id, 'current', event.target.checked)} type="checkbox" />
                  <span><strong>Estou cursando atualmente</strong><small>O periodo sera exibido como "Em andamento".</small></span>
                </label>
              </article>
            ))}
          </div>
        </section>
      )}

      {hasCertificationsSection && (
        <section className="structured-content-editor">
          <header>
            <span><Award aria-hidden="true" /></span>
            <div><strong>Cursos e certificacoes</strong><small>Credenciais, instituicoes emissoras e links de validacao.</small></div>
            <button className="primary-button" onClick={addCertification} type="button"><Plus aria-hidden="true" />Adicionar certificado</button>
          </header>
          <div className="structured-entry-list">
            {certifications.length === 0 && <div className="structured-empty"><strong>Nenhum certificado adicionado</strong><p>O campo e opcional e pode ficar vazio.</p></div>}
            {certifications.map((certification, index) => (
              <article className="structured-entry" key={certification.id}>
                <div className="structured-entry-heading">
                  <div><span>Certificado {index + 1}</span><strong>{certification.name || 'Novo certificado'}</strong></div>
                  <div>
                    <button disabled={index === 0} onClick={() => moveCertification(certification.id, -1)} type="button">Subir</button>
                    <button disabled={index === certifications.length - 1} onClick={() => moveCertification(certification.id, 1)} type="button">Descer</button>
                    <button onClick={() => removeCertification(certification.id)} type="button">Remover</button>
                  </div>
                </div>
                <div className="structured-entry-grid">
                  <TextInput label="Nome do curso ou certificacao" onChange={(value) => updateCertification(certification.id, 'name', value)} placeholder="Ex.: React com TypeScript" value={certification.name} />
                  <TextInput label="Instituicao emissora" onChange={(value) => updateCertification(certification.id, 'issuer', value)} placeholder="Ex.: Alura" value={certification.issuer} />
                  <TextInput label="Data de emissao" onChange={(value) => updateCertification(certification.id, 'issueDate', value)} placeholder="07/2026" value={certification.issueDate} />
                  <TextInput label="Codigo da credencial" onChange={(value) => updateCertification(certification.id, 'credentialId', value)} placeholder="Opcional" value={certification.credentialId} />
                  <div className="structured-wide-field"><TextInput error={certification.credentialUrl && !isHttpUrl(certification.credentialUrl) ? 'Use uma URL completa iniciada por http:// ou https://.' : undefined} label="Link da credencial" onChange={(value) => updateCertification(certification.id, 'credentialUrl', value)} placeholder="https://..." value={certification.credentialUrl} /></div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
