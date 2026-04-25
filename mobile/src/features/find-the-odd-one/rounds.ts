import { FIND_THE_ODD_ONE_SYMBOLS } from './data'
import type { FindTheOddOneRound } from './types'
import { shuffleArray } from '../../utils/shuffle'

export function generateFindTheOddOneRound(
  random: () => number = Math.random,
): FindTheOddOneRound {
  const shuffledSymbols = shuffleArray(FIND_THE_ODD_ONE_SYMBOLS, random)
  const baseSymbol = shuffledSymbols[0]
  const oddSymbol = shuffledSymbols[1]
  const options = shuffleArray([baseSymbol, baseSymbol, baseSymbol, oddSymbol], random)

  return {
    oddOneIndex: options.findIndex((symbol) => symbol.id === oddSymbol.id),
    options,
  }
}
