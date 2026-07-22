import type { CSSProperties } from 'react'
import type { DevEducation, DevExperience, DevTemplate, PortfolioSection } from '../models/portfolio'

export function moveById<T extends { id: string }>(items: T[], id: string, direction: -1 | 1) {
  const index = items.findIndex((item) => item.id === id)
  const nextIndex = index + direction
  if (index < 0 || nextIndex < 0 || nextIndex >= items.length) return items

  const next = [...items]
  const [item] = next.splice(index, 1)
  next.splice(nextIndex, 0, item)
  return next
}

export function defaultSectionSurface(template: DevTemplate) {
  return template === 'docs' ? '#ffffff' : template === 'terminal' ? '#071426' : template === 'landing' ? '#f4f1ea' : '#f8fafc'
}

export function getContrastColor(color: string) {
  const normalized = color.replace('#', '')
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return '#111827'
  const red = Number.parseInt(normalized.slice(0, 2), 16)
  const green = Number.parseInt(normalized.slice(2, 4), 16)
  const blue = Number.parseInt(normalized.slice(4, 6), 16)
  return (red * 299 + green * 587 + blue * 114) / 1000 > 150 ? '#111827' : '#f8fafc'
}

export function sectionColorStyle(section: PortfolioSection): CSSProperties | undefined {
  if (!section.backgroundColor) return undefined
  return {
    backgroundColor: section.backgroundColor,
    color: getContrastColor(section.backgroundColor),
    '--section-foreground': getContrastColor(section.backgroundColor),
  } as CSSProperties
}

export function formatExperiencePeriod(experience: DevExperience) {
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  const formatMonth = (value: string) => {
    const [year, month] = value.split('-')
    return year && month ? `${months[Number(month) - 1]} ${year}` : ''
  }
  const start = formatMonth(experience.startDate) || 'Inicio nao informado'
  const end = experience.current ? 'Atual' : formatMonth(experience.endDate) || 'Saida nao informada'
  return `${start} - ${end}`
}

export function formatEducationPeriod(education: DevEducation) {
  const start = education.startYear.trim()
  const end = education.current ? 'Em andamento' : education.endYear.trim()
  return [start, end].filter(Boolean).join(' - ') || 'Periodo nao informado'
}

export function terminalSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
