import type { Horse, HorseResult, RoundSchedule } from '../types'
import { getRandomHorses } from './horseUtils'

export const ROUND_DISTANCES: number[] = [1200, 1400, 1600, 1800, 2000, 2200]

export function generateSchedule(horses: Horse[]): RoundSchedule[] {
  return ROUND_DISTANCES.map((distance, index) => ({
    round: index + 1,
    distance,
    horses: getRandomHorses(horses, 10),
  }))
}

export function simulateRaceResult(horses: Horse[], distance: number): HorseResult[] {
  const results: HorseResult[] = horses.map((horse) => {
    const speedFactor = horse.condition / 100
    const randomFactor = 0.7 + Math.random() * 0.6
    const time = distance / (speedFactor * randomFactor * 10)
    return { ...horse, time: parseFloat(time.toFixed(2)) }
  })

  return results.sort((a, b) => a.time - b.time)
}
