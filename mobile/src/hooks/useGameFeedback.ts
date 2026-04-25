import {
  AUDIO_CUE,
  celebrate as runCelebrateFeedback,
  feedbackCapabilities,
  notifyError as runErrorFeedback,
  notifySuccess as runSuccessFeedback,
  playAudioCue,
  tap as runTapFeedback,
} from '../services/feedback/mobileFeedback'
import { useSettingsStore } from '../stores/settings/SettingsStoreProvider'

export function useGameFeedback() {
  const { state } = useSettingsStore()

  return {
    capabilities: feedbackCapabilities,
    celebrate() {
      if (state.config.hapticsEnabled) {
        runCelebrateFeedback()
      }

      if (state.config.audioEnabled) {
        playAudioCue(AUDIO_CUE.CELEBRATION)
      }
    },
    notifyError() {
      if (state.config.hapticsEnabled) {
        runErrorFeedback()
      }

      if (state.config.audioEnabled) {
        playAudioCue(AUDIO_CUE.ERROR)
      }
    },
    notifySuccess() {
      if (state.config.hapticsEnabled) {
        runSuccessFeedback()
      }

      if (state.config.audioEnabled) {
        playAudioCue(AUDIO_CUE.SUCCESS)
      }
    },
    tap() {
      if (state.config.hapticsEnabled) {
        runTapFeedback()
      }

      if (state.config.audioEnabled) {
        playAudioCue(AUDIO_CUE.TAP)
      }
    },
  }
}
