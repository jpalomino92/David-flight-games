import { getWindowObject } from './window'

function getLocalStorage() {
  return getWindowObject()?.localStorage ?? null
}

export function readStorageJson(key, fallbackValue) {
  try {
    const storage = getLocalStorage()

    if (!storage) {
      return fallbackValue
    }

    const storedValue = storage.getItem(key)

    return storedValue ? JSON.parse(storedValue) : fallbackValue
  } catch {
    return fallbackValue
  }
}

export function writeStorageJson(key, value) {
  try {
    const storage = getLocalStorage()

    if (!storage) {
      return
    }

    storage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage failures to keep the games playable.
  }
}
