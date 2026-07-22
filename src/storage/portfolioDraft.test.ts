import { beforeEach, describe, expect, it } from 'vitest'
import type { PortfolioDraft } from '../models/portfolio'
import { createDraft } from '../test/portfolioFixture'
import { getDraftStorageErrorReason, normalizePortfolioDraft, readPortfolioDraft, writePortfolioDraft } from './portfolioDraft'

function deleteDraftDatabase() {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase('portfy-dev')
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
    request.onblocked = () => reject(new Error('Draft database is blocked'))
  })
}

describe('portfolio draft storage', () => {
  beforeEach(async () => {
    await deleteDraftDatabase()
  })

  it('returns null when no draft was saved', async () => {
    await expect(readPortfolioDraft()).resolves.toBeNull()
  })

  it('writes and restores the complete active draft', async () => {
    const draft = createDraft({ step: 'projects', maxUnlockedStep: 3, template: 'landing' })

    await writePortfolioDraft(draft)

    await expect(readPortfolioDraft()).resolves.toEqual(draft)
  })

  it('ignores drafts with an unsupported version', async () => {
    const unsupportedDraft = {
      ...createDraft(),
      version: 2,
    } as unknown as PortfolioDraft

    await writePortfolioDraft(unsupportedDraft)

    await expect(readPortfolioDraft()).resolves.toBeNull()
  })

  it('normalizes older version 1 drafts with missing fields', () => {
    const legacyDraft = {
      version: 1,
      updatedAt: '2025-01-01T00:00:00.000Z',
      step: 'projects',
      maxUnlockedStep: 3,
      template: 'desktop',
      name: 'Portfolio antigo',
      projects: [{ id: 'legacy-project', title: 'Projeto antigo', description: 'Descricao', liveUrl: 'https://example.com' }],
    }

    const normalized = normalizePortfolioDraft(legacyDraft)

    expect(normalized).toMatchObject({
      name: 'Portfolio antigo',
      step: 'projects',
      template: 'desktop',
      resumeEnabled: false,
    })
    expect(normalized?.projects[0]).toMatchObject({
      id: 'legacy-project',
      title: 'Projeto antigo',
      category: 'Projeto',
      featured: true,
    })
    expect(normalized?.templateSettings.landing.composition).toBe('editorial')
    expect(normalized?.sections).not.toHaveLength(0)
    expect(normalized?.educations).toEqual([])
    expect(normalized?.certifications).toEqual([])
  })

  it('ignores malformed values instead of exposing them to the app', () => {
    expect(normalizePortfolioDraft(null)).toBeNull()
    expect(normalizePortfolioDraft('invalid draft')).toBeNull()
    expect(normalizePortfolioDraft({ version: 1, experiences: ['invalid'], projects: [null], contacts: [42] })).toMatchObject({
      experiences: [],
      educations: [],
      certifications: [],
      projects: [],
      contacts: [],
    })
  })

  it('preserves uploaded image and PDF data in the draft', async () => {
    const draft = createDraft({
      profilePhoto: 'data:image/png;base64,cHJvZmlsZQ==',
      resumeEnabled: true,
      resumeFile: 'data:application/pdf;base64,cGRm',
      resumeName: 'curriculo.pdf',
      projects: [{
        ...createDraft().projects[0],
        imageUrl: 'data:image/webp;base64,cHJvamV0bw==',
        imageName: 'projeto.webp',
      }],
    })

    await writePortfolioDraft(draft)
    const restored = await readPortfolioDraft()

    expect(restored?.profilePhoto).toBe(draft.profilePhoto)
    expect(restored?.resumeFile).toBe(draft.resumeFile)
    expect(restored?.projects[0].imageUrl).toBe(draft.projects[0].imageUrl)
  })

  it('classifies quota and browser availability failures', () => {
    expect(getDraftStorageErrorReason(new DOMException('Full', 'QuotaExceededError'))).toBe('quota')
    expect(getDraftStorageErrorReason(new DOMException('Denied', 'SecurityError'))).toBe('unavailable')
    expect(getDraftStorageErrorReason(new Error('Unexpected'))).toBe('unknown')
  })
})
