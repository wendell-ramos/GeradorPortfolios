import {
  createDefaultSections,
  defaultDesktopAreaColors,
  defaultTemplateBackgrounds,
  defaultTemplateSettings,
  steps,
} from '../data/devPortfolioDefaults'
import type {
  ContactLink,
  ContactType,
  DevExperience,
  DevProject,
  DevTemplate,
  PortfolioDraft,
  PortfolioSection,
  SectionIcon,
} from '../models/portfolio'

const databaseName = 'portfy-dev'
const storeName = 'portfolio-drafts'
const activeDraftKey = 'active-draft'

export type DraftStorageErrorReason = 'blocked' | 'quota' | 'unavailable' | 'unknown'

export class DraftStorageError extends Error {
  reason: DraftStorageErrorReason

  constructor(reason: DraftStorageErrorReason, cause?: unknown) {
    super(`Portfolio draft storage failed: ${reason}`, { cause })
    this.name = 'DraftStorageError'
    this.reason = reason
  }
}

const templates: DevTemplate[] = ['desktop', 'terminal', 'landing', 'docs']
const contactTypes: ContactType[] = ['email', 'github', 'linkedin', 'whatsapp', 'instagram', 'x', 'portfolio']
const sectionIcons: SectionIcon[] = ['home', 'user', 'code', 'folder', 'mail', 'calendar', 'award', 'briefcase', 'message', 'document', 'terminal', 'link']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function stringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function booleanValue(value: unknown, fallback = false) {
  return typeof value === 'boolean' ? value : fallback
}

function createId(prefix: string) {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function normalizeExperience(value: unknown): DevExperience | null {
  if (!isRecord(value)) return null
  return {
    id: stringValue(value.id, createId('experience')),
    company: stringValue(value.company),
    city: stringValue(value.city),
    role: stringValue(value.role),
    activities: stringValue(value.activities),
    startDate: stringValue(value.startDate),
    endDate: stringValue(value.endDate),
    current: booleanValue(value.current),
  }
}

function normalizeProject(value: unknown, index: number): DevProject | null {
  if (!isRecord(value)) return null
  return {
    id: stringValue(value.id, createId('project')),
    title: stringValue(value.title),
    description: stringValue(value.description),
    imageUrl: stringValue(value.imageUrl),
    imageName: stringValue(value.imageName),
    liveUrl: stringValue(value.liveUrl),
    repoUrl: stringValue(value.repoUrl),
    techs: stringValue(value.techs),
    category: stringValue(value.category, 'Projeto'),
    status: stringValue(value.status, 'Concluido'),
    year: stringValue(value.year),
    featured: booleanValue(value.featured, index === 0),
  }
}

function normalizeContact(value: unknown): ContactLink | null {
  if (!isRecord(value)) return null
  const type = contactTypes.includes(value.type as ContactType) ? value.type as ContactType : 'portfolio'
  return {
    id: stringValue(value.id, createId('contact')),
    type,
    label: stringValue(value.label, type === 'email' ? 'E-mail' : 'Portfolio'),
    value: stringValue(value.value),
    url: stringValue(value.url),
  }
}

function normalizeSection(value: unknown): PortfolioSection | null {
  if (!isRecord(value)) return null
  const icon = sectionIcons.includes(value.icon as SectionIcon) ? value.icon as SectionIcon : 'document'
  return {
    id: stringValue(value.id, createId('section')),
    title: stringValue(value.title, 'Nova secao'),
    description: stringValue(value.description),
    icon,
    backgroundColor: typeof value.backgroundColor === 'string' ? value.backgroundColor : undefined,
    terminalCommand: typeof value.terminalCommand === 'string' ? value.terminalCommand : undefined,
    docsGroup: typeof value.docsGroup === 'string' ? value.docsGroup : undefined,
    enabled: booleanValue(value.enabled, true),
    locked: typeof value.locked === 'boolean' ? value.locked : undefined,
  }
}

export function normalizePortfolioDraft(value: unknown): PortfolioDraft | null {
  if (!isRecord(value) || value.version !== 1) return null

  const template = templates.includes(value.template as DevTemplate) ? value.template as DevTemplate : 'desktop'
  const savedBackgrounds = isRecord(value.templateBackgrounds) ? value.templateBackgrounds : {}
  const savedDesktopColors = isRecord(value.desktopAreaColors) ? value.desktopAreaColors : {}
  const savedSettings = isRecord(value.templateSettings) ? value.templateSettings : {}
  const desktopSettings = isRecord(savedSettings.desktop) ? savedSettings.desktop : {}
  const terminalSettings = isRecord(savedSettings.terminal) ? savedSettings.terminal : {}
  const docsSettings = isRecord(savedSettings.docs) ? savedSettings.docs : {}
  const landingSettings = isRecord(savedSettings.landing) ? savedSettings.landing : {}
  const savedStep = steps.some((item) => item.id === value.step) ? value.step as PortfolioDraft['step'] : 'identity'
  const sections = Array.isArray(value.sections)
    ? value.sections.map(normalizeSection).filter((item): item is PortfolioSection => Boolean(item))
    : createDefaultSections()

  return {
    version: 1,
    updatedAt: stringValue(value.updatedAt, new Date().toISOString()),
    step: savedStep,
    maxUnlockedStep: Math.min(Math.max(typeof value.maxUnlockedStep === 'number' ? value.maxUnlockedStep : 0, 0), steps.length - 1),
    template,
    accentColor: stringValue(value.accentColor, '#2563eb'),
    templateBackgrounds: {
      desktop: stringValue(savedBackgrounds.desktop, defaultTemplateBackgrounds.desktop),
      terminal: stringValue(savedBackgrounds.terminal, defaultTemplateBackgrounds.terminal),
      landing: stringValue(savedBackgrounds.landing, defaultTemplateBackgrounds.landing),
      docs: stringValue(savedBackgrounds.docs, defaultTemplateBackgrounds.docs),
    },
    desktopAreaColors: {
      titlebar: stringValue(savedDesktopColors.titlebar, defaultDesktopAreaColors.titlebar),
      menu: stringValue(savedDesktopColors.menu, defaultDesktopAreaColors.menu),
      window: stringValue(savedDesktopColors.window, defaultDesktopAreaColors.window),
      statusbar: stringValue(savedDesktopColors.statusbar, defaultDesktopAreaColors.statusbar),
      taskbar: stringValue(savedDesktopColors.taskbar, defaultDesktopAreaColors.taskbar),
    },
    templateSettings: {
      desktop: { ...defaultTemplateSettings.desktop, ...desktopSettings },
      terminal: { ...defaultTemplateSettings.terminal, ...terminalSettings },
      docs: { ...defaultTemplateSettings.docs, ...docsSettings },
      landing: { ...defaultTemplateSettings.landing, ...landingSettings },
    } as PortfolioDraft['templateSettings'],
    name: stringValue(value.name),
    role: stringValue(value.role),
    location: stringValue(value.location),
    headline: stringValue(value.headline),
    bio: stringValue(value.bio),
    profilePhoto: stringValue(value.profilePhoto),
    resumeEnabled: booleanValue(value.resumeEnabled),
    resumeFile: stringValue(value.resumeFile),
    resumeName: stringValue(value.resumeName),
    experiences: Array.isArray(value.experiences)
      ? value.experiences.map(normalizeExperience).filter((item): item is DevExperience => Boolean(item))
      : [],
    stackText: stringValue(value.stackText),
    sections,
    projects: Array.isArray(value.projects)
      ? value.projects.map(normalizeProject).filter((item): item is DevProject => Boolean(item))
      : [],
    contacts: Array.isArray(value.contacts)
      ? value.contacts.map(normalizeContact).filter((item): item is ContactLink => Boolean(item))
      : [],
  }
}

export function getDraftStorageErrorReason(error: unknown): DraftStorageErrorReason {
  if (error instanceof DraftStorageError) return error.reason
  if (error instanceof DOMException && error.name === 'QuotaExceededError') return 'quota'
  if (error instanceof DOMException && ['InvalidStateError', 'NotAllowedError', 'SecurityError'].includes(error.name)) return 'unavailable'
  return 'unknown'
}

function storageError(error: unknown) {
  return error instanceof DraftStorageError
    ? error
    : new DraftStorageError(getDraftStorageErrorReason(error), error)
}

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new DraftStorageError('unavailable'))
      return
    }

    let request: IDBOpenDBRequest
    try {
      request = indexedDB.open(databaseName, 1)
    } catch (error) {
      reject(storageError(error))
      return
    }

    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(storeName)) request.result.createObjectStore(storeName)
    }
    request.onsuccess = () => {
      request.result.onversionchange = () => request.result.close()
      resolve(request.result)
    }
    request.onerror = () => reject(storageError(request.error))
    request.onblocked = () => reject(new DraftStorageError('blocked'))
  })
}

export async function readPortfolioDraft() {
  const database = await openDatabase()
  return new Promise<PortfolioDraft | null>((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readonly')
    const request = transaction.objectStore(storeName).get(activeDraftKey)
    request.onsuccess = () => resolve(normalizePortfolioDraft(request.result))
    request.onerror = () => reject(storageError(request.error))
    transaction.oncomplete = () => database.close()
    transaction.onabort = () => { database.close(); reject(storageError(transaction.error)) }
    transaction.onerror = () => { database.close(); reject(storageError(transaction.error)) }
  })
}

export async function writePortfolioDraft(draft: PortfolioDraft) {
  const database = await openDatabase()
  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite')
    const request = transaction.objectStore(storeName).put(draft, activeDraftKey)
    request.onerror = () => reject(storageError(request.error))
    transaction.oncomplete = () => { database.close(); resolve() }
    transaction.onabort = () => { database.close(); reject(storageError(transaction.error)) }
    transaction.onerror = () => { database.close(); reject(storageError(transaction.error)) }
  })
}
