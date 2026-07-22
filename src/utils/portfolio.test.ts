import { describe, expect, it } from 'vitest'
import {
  formatExperiencePeriod,
  getContrastColor,
  moveById,
  sectionColorStyle,
  terminalSlug,
} from './portfolio'

describe('portfolio utils', () => {
  it('moves an item while preserving the remaining order', () => {
    const items = [{ id: 'one' }, { id: 'two' }, { id: 'three' }]

    expect(moveById(items, 'two', -1).map((item) => item.id)).toEqual(['two', 'one', 'three'])
    expect(moveById(items, 'two', 1).map((item) => item.id)).toEqual(['one', 'three', 'two'])
    expect(items.map((item) => item.id)).toEqual(['one', 'two', 'three'])
  })

  it('does not move an item beyond the list boundaries', () => {
    const items = [{ id: 'one' }, { id: 'two' }]

    expect(moveById(items, 'one', -1)).toBe(items)
    expect(moveById(items, 'two', 1)).toBe(items)
  })

  it('chooses a readable foreground for light and dark colors', () => {
    expect(getContrastColor('#ffffff')).toBe('#111827')
    expect(getContrastColor('#020617')).toBe('#f8fafc')
    expect(getContrastColor('invalid')).toBe('#111827')
  })

  it('creates a section style with matching foreground variables', () => {
    expect(sectionColorStyle({
      id: 'custom',
      title: 'Custom',
      description: '',
      icon: 'document',
      enabled: true,
      backgroundColor: '#020617',
    })).toEqual({
      backgroundColor: '#020617',
      color: '#f8fafc',
      '--section-foreground': '#f8fafc',
    })
  })

  it('formats current and completed experience periods', () => {
    const baseExperience = {
      id: 'experience',
      company: 'Company',
      city: 'Remote',
      role: 'Developer',
      activities: 'Development',
      startDate: '2024-01',
      endDate: '2025-03',
      current: false,
    }

    expect(formatExperiencePeriod(baseExperience)).toBe('jan 2024 - mar 2025')
    expect(formatExperiencePeriod({ ...baseExperience, current: true, endDate: '' })).toBe('jan 2024 - Atual')
  })

  it('normalizes labels into terminal commands', () => {
    expect(terminalSlug('Cursos e Certificacoes')).toBe('cursos-e-certificacoes')
    expect(terminalSlug('  Projetos C# / .NET  ')).toBe('projetos-c-net')
  })
})
