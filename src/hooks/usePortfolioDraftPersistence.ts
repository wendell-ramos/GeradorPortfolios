import { useCallback, useEffect, useRef, useState } from 'react'
import type { PortfolioDraft } from '../models/portfolio'
import { getDraftStorageErrorReason, readPortfolioDraft, writePortfolioDraft } from '../storage/portfolioDraft'
import type { DraftStorageErrorReason } from '../storage/portfolioDraft'

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
  draftErrorReason: DraftStorageErrorReason | null
  draftStatus: DraftStatus
  saveNow: () => Promise<boolean>
} {
  const [draftReady, setDraftReady] = useState(false)
  const [draftStatus, setDraftStatus] = useState<DraftStatus>('idle')
  const [draftErrorReason, setDraftErrorReason] = useState<DraftStorageErrorReason | null>(null)
  const saveSequence = useRef(0)

  const persistDraft = useCallback(async (draft: PortfolioDraft) => {
    const sequence = ++saveSequence.current
    setDraftStatus('saving')
    setDraftErrorReason(null)

    try {
      await writePortfolioDraft(draft)
      if (sequence === saveSequence.current) setDraftStatus('saved')
      return true
    } catch (error) {
      if (sequence === saveSequence.current) {
        setDraftErrorReason(getDraftStorageErrorReason(error))
        setDraftStatus('error')
      }
      return false
    }
  }, [])

  useEffect(() => {
    let active = true

    readPortfolioDraft()
      .then((draft) => {
        if (!active || !draft) return
        onRestore(draft)
        setDraftStatus('saved')
      })
      .catch((error) => {
        if (active) {
          setDraftErrorReason(getDraftStorageErrorReason(error))
          setDraftStatus('error')
        }
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

    const timeout = window.setTimeout(() => {
      void persistDraft(currentDraft)
    }, 500)

    return () => window.clearTimeout(timeout)
  }, [currentDraft, draftReady, persistDraft, setupComplete])

  const saveNow = useCallback(() => persistDraft(currentDraft), [currentDraft, persistDraft])

  return { draftReady, draftErrorReason, draftStatus, saveNow }
}
