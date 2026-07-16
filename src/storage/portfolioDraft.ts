import type { PortfolioDraft } from '../models/portfolio'

const databaseName = 'portfy-dev'
const storeName = 'portfolio-drafts'
const activeDraftKey = 'active-draft'

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(storeName)) request.result.createObjectStore(storeName)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function readPortfolioDraft() {
  const database = await openDatabase()
  return new Promise<PortfolioDraft | null>((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readonly')
    const request = transaction.objectStore(storeName).get(activeDraftKey)
    request.onsuccess = () => {
      const draft = request.result as PortfolioDraft | undefined
      resolve(draft?.version === 1 ? draft : null)
    }
    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => database.close()
  })
}

export async function writePortfolioDraft(draft: PortfolioDraft) {
  const database = await openDatabase()
  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite')
    transaction.objectStore(storeName).put(draft, activeDraftKey)
    transaction.oncomplete = () => { database.close(); resolve() }
    transaction.onerror = () => { database.close(); reject(transaction.error) }
  })
}
