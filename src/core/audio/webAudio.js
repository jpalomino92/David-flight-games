import { getWindowObject } from '../browser/window'

let audioContext = null

function getAudioConstructor() {
  const browserWindow = getWindowObject()

  return browserWindow?.AudioContext || browserWindow?.webkitAudioContext || null
}

function getAudioContext() {
  const AudioConstructor = getAudioConstructor()

  if (!AudioConstructor) {
    return null
  }

  if (!audioContext) {
    audioContext = new AudioConstructor()
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }

  return audioContext
}

function withAudioContext(callback) {
  try {
    const context = getAudioContext()

    if (!context) {
      return
    }

    callback(context)
  } catch {
    // Web audio can fail on unsupported environments or blocked autoplay.
  }
}

export function playSuccessSound() {
  withAudioContext((context) => {
    const notes = [523.25, 659.25, 783.99, 1046.5]

    notes.forEach((frequency, index) => {
      const startAt = context.currentTime + index * 0.1
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      oscillator.frequency.value = frequency
      oscillator.type = 'sine'
      gainNode.gain.setValueAtTime(0.3, startAt)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startAt + 0.3)

      oscillator.start(startAt)
      oscillator.stop(startAt + 0.3)
    })
  })
}

export function playWrongSound() {
  withAudioContext((context) => {
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)

    oscillator.frequency.value = 150
    oscillator.type = 'sawtooth'
    gainNode.gain.setValueAtTime(0.2, context.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.4)

    oscillator.start(context.currentTime)
    oscillator.stop(context.currentTime + 0.4)
  })
}
