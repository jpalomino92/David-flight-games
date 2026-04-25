import { Vibration } from 'react-native'

const AUDIO_CUE = {
  CELEBRATION: 'celebration',
  ERROR: 'error',
  SUCCESS: 'success',
  TAP: 'tap',
} as const

type AudioCue = (typeof AUDIO_CUE)[keyof typeof AUDIO_CUE]

interface FeedbackCapabilities {
  audioMode: 'placeholder'
  hasAudio: boolean
  hasHaptics: boolean
  hapticsMode: 'vibration'
}

const feedbackCapabilities: FeedbackCapabilities = {
  audioMode: 'placeholder',
  hasAudio: false,
  hasHaptics: true,
  hapticsMode: 'vibration',
}

function playAudioCue(_: AudioCue) {
  return false
}

function tap() {
  Vibration.vibrate(10)
}

function notifySuccess() {
  Vibration.vibrate([0, 24])
}

function notifyError() {
  Vibration.vibrate([0, 40, 40, 30])
}

function celebrate() {
  Vibration.vibrate([0, 20, 40, 30, 40, 60])
}

export { AUDIO_CUE, celebrate, feedbackCapabilities, notifyError, notifySuccess, playAudioCue, tap }
export type { AudioCue, FeedbackCapabilities }
