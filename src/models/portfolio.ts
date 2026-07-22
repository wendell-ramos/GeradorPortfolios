export type BuilderStep = 'identity' | 'style' | 'sections' | 'projects' | 'contact' | 'preview'
export type DevTemplate = 'desktop' | 'terminal' | 'docs' | 'landing'
export type LandingComposition = 'editorial' | 'profile' | 'projects'
export type DesktopColorTarget = 'titlebar' | 'menu' | 'window' | 'statusbar' | 'taskbar'
export type DesktopEditableTarget = 'background' | DesktopColorTarget
export type DefaultSection = 'about' | 'stack' | 'education' | 'certifications' | 'projects' | 'contact'
export type SectionIcon = 'home' | 'user' | 'code' | 'folder' | 'mail' | 'calendar' | 'award' | 'briefcase' | 'message' | 'document' | 'terminal' | 'link'

export type PortfolioSection = {
  id: string
  title: string
  description: string
  icon: SectionIcon
  backgroundColor?: string
  terminalCommand?: string
  docsGroup?: string
  enabled: boolean
  locked?: boolean
}

export type DevProject = {
  id: string
  title: string
  description: string
  imageUrl: string
  imageName: string
  liveUrl: string
  repoUrl: string
  techs: string
  category: string
  status: string
  year: string
  featured: boolean
}
export type DevExperience = { id: string; company: string; city: string; role: string; activities: string; startDate: string; endDate: string; current: boolean }
export type DevEducation = { id: string; institution: string; course: string; degree: string; location: string; startYear: string; endYear: string; current: boolean }
export type DevCertification = { id: string; name: string; issuer: string; issueDate: string; credentialId: string; credentialUrl: string }
export type ContactType = 'email' | 'github' | 'linkedin' | 'whatsapp' | 'instagram' | 'x' | 'portfolio'
export type ContactLink = { id: string; type: ContactType; label: string; value: string; url: string }
export type DevTemplateOption = { id: DevTemplate; label: string; description: string }

export type TemplateSettings = {
  desktop: { homeTitle: string; startLabel: string; shortcutSize: 'small' | 'medium' | 'large'; windowWidth: 'compact' | 'wide' }
  terminal: { bootTitle: string; host: string; shell: string; textScale: 'small' | 'medium' | 'large'; scanlines: boolean }
  docs: { badge: string; sidebarLabel: string; version: string; contentWidth: 'focused' | 'wide'; showPageIndex: boolean }
  landing: {
    composition: LandingComposition
    eyebrow: string
    primaryAction: string
    highlight: string
    resumeUrl: string
    projectLayout: 'grid' | 'showcase'
    motion: 'subtle' | 'expressive'
    showMarquee: boolean
    showMetrics: boolean
    metricOneValue: string
    metricOneLabel: string
    metricTwoValue: string
    metricTwoLabel: string
    metricThreeValue: string
    metricThreeLabel: string
  }
}

export type PortfolioDraft = {
  version: 1
  updatedAt: string
  step: BuilderStep
  maxUnlockedStep: number
  template: DevTemplate
  accentColor: string
  templateBackgrounds: Record<DevTemplate, string>
  desktopAreaColors: Record<DesktopColorTarget, string>
  templateSettings: TemplateSettings
  name: string
  role: string
  location: string
  headline: string
  bio: string
  profilePhoto: string
  resumeEnabled: boolean
  resumeFile: string
  resumeName: string
  experiences: DevExperience[]
  educations: DevEducation[]
  certifications: DevCertification[]
  stackText: string
  sections: PortfolioSection[]
  projects: DevProject[]
  contacts: ContactLink[]
}

export type PortfolioPreviewProps = {
  accentColor: string
  backgroundColor: string
  desktopAreaColors: Record<DesktopColorTarget, string>
  bio: string
  contacts: ContactLink[]
  experiences: DevExperience[]
  educations: DevEducation[]
  certifications: DevCertification[]
  headline: string
  location: string
  name: string
  profilePhoto: string
  resumeEnabled: boolean
  resumeFile: string
  resumeName: string
  projects: DevProject[]
  role: string
  sections: PortfolioSection[]
  stack: string[]
  template: DevTemplate
  templateSettings: TemplateSettings
}
