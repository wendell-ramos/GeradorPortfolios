import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { PortfolioDraft } from '../models/portfolio'
import { readPortfolioDraft, writePortfolioDraft } from '../storage/portfolioDraft'

export type DraftStatus = 'idle' | 'saving' | 'saved' | 'error'

interface PortfolioDraftPersistenceOptions {
  currentDraft: PortfolioDraft
  onRestore: (draft: PortfolioDraft) => void
  setupComplete: boolean
}

export function usePortfolioDraftPersistence({
  currentDraft,
  onRestore,
  setupComplete,
}: PortfolioDraftPersistenceOptions): {
  draftReady: boolean
  draftStatus: DraftStatus
  setDraftStatus: Dispatch<SetStateAction<DraftStatus>>
} {
  const [draftReady, setDraftReady] = useState(false)
  const [draftStatus, setDraftStatus] = useState<DraftStatus>('idle')

  useEffect(() => {
    let active = true

    readPortfolioDraft()
      .then((draft) => {
        if (!active || !draft) return
        onRestore(draft)
        setDraftStatus('saved')
      })
      .catch(() => {
        if (active) setDraftStatus('error')
      })
      .finally(() => {
        if (active) setDraftReady(true)
      })

    return () => {
      active = false
    }
  }, [onRestore])

  useEffect(() => {
    if (!draftReady || !setupComplete) return

    setDraftStatus('saving')
    const timeout = window.setTimeout(() => {
      writePortfolioDraft(currentDraft)
        .then(() => setDraftStatus('saved'))
        .catch(() => setDraftStatus('error'))
    }, 500)

    return () => window.clearTimeout(timeout)
  }, [currentDraft, draftReady, setupComplete])

  return { draftReady, draftStatus, setDraftStatus }
}
