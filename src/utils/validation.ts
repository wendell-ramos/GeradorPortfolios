import type { ContactLink, ContactType, DevExperience, DevProject } from '../models/portfolio'

export type IdentityField = 'name' | 'role' | 'headline' | 'bio' | 'resumeFile'
export type ExperienceField = 'company' | 'role' | 'startDate' | 'endDate'
export type ProjectField = 'title' | 'description' | 'liveUrl' | 'repoUrl' | 'links'
export type ContactField = 'value' | 'url'

export type IdentityValidation = {
  valid: boolean
  fields: Partial<Record<IdentityField, string>>
  experiences: Record<string, Partial<Record<ExperienceField, string>>>
}

export type ProjectValidation = {
  valid: boolean
  items: Record<string, Partial<Record<ProjectField, string>>>
}

export type ContactValidation = {
  valid: boolean
  items: Record<string, Partial<Record<ContactField, string>>>
}

export function isHttpUrl(value: string) {
  try {
    const url = new URL(value.trim())
    return (url.protocol === 'http:' || url.protocol === 'https:') && Boolean(url.hostname)
  } catch {
    return false
  }
}

export function isContactUrl(type: ContactType, value: string) {
  const normalized = value.trim()

  if (type === 'email') {
    if (!normalized.toLowerCase().startsWith('mailto:')) return false
    const address = normalized.slice(7)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)
  }

  return isHttpUrl(normalized)
}

export function validateIdentity({
  bio,
  experiences,
  headline,
  name,
  resumeEnabled,
  resumeFile,
  role,
}: {
  bio: string
  experiences: DevExperience[]
  headline: string
  name: string
  resumeEnabled: boolean
  resumeFile: string
  role: string
}): IdentityValidation {
  const fields: IdentityValidation['fields'] = {}
  const experienceErrors: IdentityValidation['experiences'] = {}

  if (!name.trim()) fields.name = 'Informe seu nome.'
  if (!role.trim()) fields.role = 'Informe seu cargo ou assinatura.'
  if (!headline.trim()) fields.headline = 'Escreva uma chamada principal.'
  if (!bio.trim()) fields.bio = 'Escreva um resumo sobre voce.'
  if (resumeEnabled && !resumeFile) fields.resumeFile = 'Adicione o PDF ou desative a exibicao do curriculo.'

  experiences.forEach((experience) => {
    const hasContent = Boolean(
      experience.company.trim()
      || experience.city.trim()
      || experience.role.trim()
      || experience.activities.trim()
      || experience.startDate
      || experience.endDate
      || experience.current,
    )

    if (!hasContent) return

    const errors: Partial<Record<ExperienceField, string>> = {}
    if (!experience.company.trim()) errors.company = 'Informe a empresa ou projeto.'
    if (!experience.role.trim()) errors.role = 'Informe o cargo exercido.'
    if (!experience.startDate) errors.startDate = 'Informe o mes e o ano de inicio.'
    if (!experience.current && !experience.endDate) errors.endDate = 'Informe o termino ou marque como trabalho atual.'
    if (experience.startDate && experience.endDate && experience.endDate < experience.startDate) {
      errors.endDate = 'O termino nao pode ser anterior ao inicio.'
    }

    if (Object.keys(errors).length) experienceErrors[experience.id] = errors
  })

  return {
    valid: Object.keys(fields).length === 0 && Object.keys(experienceErrors).length === 0,
    fields,
    experiences: experienceErrors,
  }
}

export function validateProjects(projects: DevProject[], required: boolean): ProjectValidation {
  if (!required) return { valid: true, items: {} }

  const items: ProjectValidation['items'] = {}

  projects.forEach((project) => {
    const errors: Partial<Record<ProjectField, string>> = {}
    if (!project.title.trim()) errors.title = 'Informe o nome do projeto.'
    if (!project.description.trim()) errors.description = 'Descreva o projeto.'
    if (!project.liveUrl.trim() && !project.repoUrl.trim()) {
      errors.links = 'Informe pelo menos um link publicado ou de repositorio.'
    }
    if (project.liveUrl.trim() && !isHttpUrl(project.liveUrl)) {
      errors.liveUrl = 'Use uma URL completa iniciada por http:// ou https://.'
    }
    if (project.repoUrl.trim() && !isHttpUrl(project.repoUrl)) {
      errors.repoUrl = 'Use uma URL completa iniciada por http:// ou https://.'
    }

    if (Object.keys(errors).length) items[project.id] = errors
  })

  return { valid: projects.length > 0 && Object.keys(items).length === 0, items }
}

export function validateContacts(contacts: ContactLink[], required: boolean): ContactValidation {
  if (!required) return { valid: true, items: {} }

  const items: ContactValidation['items'] = {}

  contacts.forEach((contact) => {
    const errors: Partial<Record<ContactField, string>> = {}
    if (!contact.value.trim()) errors.value = 'Informe o texto exibido.'
    if (!contact.url.trim()) {
      errors.url = 'Informe o link deste contato.'
    } else if (!isContactUrl(contact.type, contact.url)) {
      errors.url = contact.type === 'email'
        ? 'Use um link de e-mail valido, como mailto:nome@email.com.'
        : 'Use uma URL completa iniciada por http:// ou https://.'
    }

    if (Object.keys(errors).length) items[contact.id] = errors
  })

  return { valid: contacts.length > 0 && Object.keys(items).length === 0, items }
}
