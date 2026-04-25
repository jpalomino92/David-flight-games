import { shuffleArray } from '../../utils/shuffle'
import { TOUCH_GAME_ANIMALS, TOUCH_TARGET_ANIMAL_ID } from './data'
import type { TouchGameRound } from './types'

export function generateTouchGameRound(
  random: () => number = Math.random,
): TouchGameRound {
  const correctAnimal = TOUCH_GAME_ANIMALS.find(
    (animal) => animal.id === TOUCH_TARGET_ANIMAL_ID,
  )

  if (!correctAnimal) {
    throw new Error('TouchGame target animal is missing from the data set.')
  }

  const distractors = shuffleArray(
    TOUCH_GAME_ANIMALS.filter((animal) => animal.id !== TOUCH_TARGET_ANIMAL_ID),
    random,
  ).slice(0, 3)

  return {
    correctOptionId: correctAnimal.id,
    options: shuffleArray([correctAnimal, ...distractors], random),
  }
}
