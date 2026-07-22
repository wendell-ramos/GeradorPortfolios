import { describe, expect, it } from 'vitest'
import type { ContactLink, DevExperience, DevProject } from '../models/portfolio'
import { isContactUrl, isHttpUrl, validateContacts, validateIdentity, validateProjects } from './validation'

const experience: DevExperience = {
  id: 'experience-1',
  company: 'Portfy',
  city: 'Remoto',
  role: 'Desenvolvedor',
  activities: 'Construcao do produto.',
  startDate: '2024-01',
  endDate: '',
  current: true,
}

const project: DevProject = {
  id: 'project-1',
  title: 'Gerador de portfolios',
  description: 'Builder para sites pessoais.',
  imageUrl: '',
  imageName: '',
  liveUrl: 'https://example.com',
  repoUrl: '',
  techs: 'React',
  category: 'Produto',
  status: 'Em desenvolvimento',
  year: '2026',
  featured: true,
}

const contact: ContactLink = {
  id: 'contact-1',
  type: 'github',
  label: 'GitHub',
  value: 'github.com/wendell-ramos',
  url: 'https://github.com/wendell-ramos',
}

function identity(overrides: Partial<Parameters<typeof validateIdentity>[0]> = {}) {
  return validateIdentity({
    bio: 'Resumo profissional',
    experiences: [experience],
    headline: 'Crio produtos digitais',
    name: 'Wendell Ramos',
    resumeEnabled: false,
    resumeFile: '',
    role: 'Desenvolvedor',
    ...overrides,
  })
}

describe('URL validation', () => {
  it('accepts only complete HTTP and HTTPS URLs for sites', () => {
    expect(isHttpUrl('https://example.com/projeto')).toBe(true)
    expect(isHttpUrl('http://localhost:4174')).toBe(true)
    expect(isHttpUrl('example.com')).toBe(false)
    expect(isHttpUrl('javascript:alert(1)')).toBe(false)
  })

  it('validates mailto separately from social links', () => {
    expect(isContactUrl('email', 'mailto:nome@example.com')).toBe(true)
    expect(isContactUrl('email', 'https://example.com')).toBe(false)
    expect(isContactUrl('github', 'mailto:nome@example.com')).toBe(false)
  })
})

describe('identity validation', () => {
  it('accepts a complete identity and a current experience', () => {
    expect(identity().valid).toBe(true)
  })

  it('keeps a completely empty experience optional', () => {
    expect(identity({ experiences: [{ ...experience, company: '', city: '', role: '', activities: '', startDate: '', current: false }] }).valid).toBe(true)
  })

  it('identifies required fields in a partially filled experience', () => {
    const result = identity({ experiences: [{ ...experience, company: '', role: '', startDate: '', current: false, endDate: '2025-01' }] })

    expect(result.valid).toBe(false)
    expect(result.experiences['experience-1']).toMatchObject({
      company: expect.any(String),
      role: expect.any(String),
      startDate: expect.any(String),
    })
  })

  it('rejects an end date before the start date', () => {
    const result = identity({ experiences: [{ ...experience, current: false, startDate: '2025-05', endDate: '2024-12' }] })

    expect(result.experiences['experience-1'].endDate).toContain('anterior')
  })

  it('requires a PDF when the resume option is enabled', () => {
    const result = identity({ resumeEnabled: true, resumeFile: '' })

    expect(result.valid).toBe(false)
    expect(result.fields.resumeFile).toContain('PDF')
  })
})

describe('project validation', () => {
  it('does not require projects when their section is disabled', () => {
    expect(validateProjects([], false).valid).toBe(true)
  })

  it('requires content and at least one project link', () => {
    const result = validateProjects([{ ...project, title: '', description: '', liveUrl: '' }], true)

    expect(result.items['project-1']).toMatchObject({
      title: expect.any(String),
      description: expect.any(String),
      links: expect.any(String),
    })
  })

  it('rejects unsafe or incomplete project URLs', () => {
    const result = validateProjects([{ ...project, liveUrl: 'javascript:alert(1)', repoUrl: 'github.com/user/repo' }], true)

    expect(result.items['project-1'].liveUrl).toBeDefined()
    expect(result.items['project-1'].repoUrl).toBeDefined()
  })
})

describe('contact validation', () => {
  it('does not require contacts when their section is disabled', () => {
    expect(validateContacts([], false).valid).toBe(true)
  })

  it('requires text and a valid URL for every added contact', () => {
    const result = validateContacts([{ ...contact, value: '', url: 'github.com/user' }], true)

    expect(result.items['contact-1'].value).toBeDefined()
    expect(result.items['contact-1'].url).toBeDefined()
  })

  it('accepts a valid email contact', () => {
    const result = validateContacts([{ ...contact, type: 'email', url: 'mailto:nome@example.com' }], true)

    expect(result.valid).toBe(true)
  })
})
