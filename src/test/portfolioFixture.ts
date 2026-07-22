import { createPresetDevPortfolio } from '../data/devPortfolioDefaults'
import type { PortfolioDraft, PortfolioPreviewProps } from '../models/portfolio'

export function createDraft(overrides: Partial<PortfolioDraft> = {}): PortfolioDraft {
  const preset = createPresetDevPortfolio()

  return {
    version: 1,
    updatedAt: '2026-07-22T12:00:00.000Z',
    step: 'identity',
    maxUnlockedStep: 0,
    ...preset,
    ...overrides,
  }
}

export function createPreviewProps(
  overrides: Partial<PortfolioPreviewProps> = {},
): PortfolioPreviewProps {
  const draft = createDraft()

  return {
    accentColor: draft.accentColor,
    backgroundColor: draft.templateBackgrounds[draft.template],
    desktopAreaColors: draft.desktopAreaColors,
    bio: draft.bio,
    contacts: draft.contacts,
    experiences: draft.experiences,
    headline: draft.headline,
    location: draft.location,
    name: draft.name,
    profilePhoto: draft.profilePhoto,
    resumeEnabled: draft.resumeEnabled,
    resumeFile: draft.resumeFile,
    resumeName: draft.resumeName,
    projects: draft.projects,
    role: draft.role,
    sections: draft.sections,
    stack: draft.stackText.split('\n'),
    template: draft.template,
    templateSettings: draft.templateSettings,
    ...overrides,
  }
}
