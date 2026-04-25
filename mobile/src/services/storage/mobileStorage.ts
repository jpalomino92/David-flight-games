import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_PERSISTENCE_MODE = {
  DURABLE: 'durable',
  MEMORY_FALLBACK: 'memory-fallback',
} as const

type StoragePersistenceMode =
  (typeof STORAGE_PERSISTENCE_MODE)[keyof typeof STORAGE_PERSISTENCE_MODE]

interface StorageAdapter {
  getItem: (key: string) => Promise<string | null>
  removeItem: (key: string) => Promise<void>
  setItem: (key: string, value: string) => Promise<void>
}

interface MobileStorageMetadata {
  adapterName: string
  persistenceMode: StoragePersistenceMode
}

const adapter: StorageAdapter = AsyncStorage

const mobileStorageMeta: MobileStorageMetadata = {
  adapterName: '@react-native-async-storage/async-storage',
  persistenceMode: STORAGE_PERSISTENCE_MODE.DURABLE,
}

async function readJsonValue<T>(key: string, fallbackValue: T): Promise<T> {
  const rawValue = await adapter.getItem(key)

  if (!rawValue) {
    return fallbackValue
  }

  try {
    return JSON.parse(rawValue) as T
  } catch {
    return fallbackValue
  }
}

async function writeJsonValue<T>(key: string, value: T) {
  await adapter.setItem(key, JSON.stringify(value))
}

export { mobileStorageMeta, readJsonValue, STORAGE_PERSISTENCE_MODE, writeJsonValue }
export type { MobileStorageMetadata, StoragePersistenceMode }
