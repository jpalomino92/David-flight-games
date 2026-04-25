import { shuffleArray } from '../../core/utils/shuffle'

export const FIND_ODD_ONE_IMAGES = [
  { id: 'dog', src: '/dog.svg', name: 'Perro' },
  { id: 'monkey', src: '/monkey.svg', name: 'Mono' },
  { id: 'elephant', src: '/elephant.svg', name: 'Elefante' },
  { id: 'unicorn', src: '/unicorn.svg', name: 'Unicornio' },
  { id: 'dinosaur', src: '/dinosaur.svg', name: 'Dinosaurio' },
  { id: 'motorbike', src: '/motorbike.svg', name: 'Motocicleta' },
  { id: 'grape', src: '/grape.svg', name: 'Uva' },
  { id: 'apple', src: '/apple.svg', name: 'Manzana' },
  { id: 'sheep', src: '/sheep.svg', name: 'Oveja' },
  { id: 'football', src: '/football.svg', name: 'Pelota' },
  { id: 'hand', src: '/hand.svg', name: 'Mano' },
]

export const FIND_ODD_ONE_TOTAL_ROUNDS = 5

export function generateFindOddOneRound(random = Math.random) {
  const shuffledImages = shuffleArray(FIND_ODD_ONE_IMAGES, random)
  const baseImage = shuffledImages[0]
  const differentImage = shuffledImages[1]
  const options = shuffleArray([baseImage, baseImage, baseImage, differentImage], random)

  return {
    oddOneIndex: options.findIndex((image) => image.id === differentImage.id),
    options,
  }
}
