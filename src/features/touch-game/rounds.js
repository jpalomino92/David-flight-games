import { shuffleArray } from '../../core/utils/shuffle'

export const TOUCH_TARGET_ANIMAL = '🐶'
export const TOUCH_GAME_ANIMALS = ['🐶', '🐱', '🦊', '🐻', '🐰', '🐼', '🦁', '🐯']

export function createTouchGameRound(random = Math.random) {
  const otherAnimals = TOUCH_GAME_ANIMALS.filter((animal) => animal !== TOUCH_TARGET_ANIMAL)
  const roundDistractors = shuffleArray(otherAnimals, random).slice(0, 3)

  return {
    correctAnswer: TOUCH_TARGET_ANIMAL,
    options: shuffleArray([TOUCH_TARGET_ANIMAL, ...roundDistractors], random),
  }
}
