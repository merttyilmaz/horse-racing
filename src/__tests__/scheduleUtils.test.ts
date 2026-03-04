import { describe, it, expect } from 'vitest'
import { generateSchedule, simulateRaceResult, ROUND_DISTANCES } from '../utils/scheduleUtils'
import { generateHorses } from '../utils/horseUtils'
import type { HorseResult } from '../types'

describe('ROUND_DISTANCES', () => {
  it('has exactly 6 rounds', () => {
    expect(ROUND_DISTANCES).toHaveLength(6)
  })

  it('matches the spec: 1200 to 2200 in 200m steps', () => {
    expect(ROUND_DISTANCES).toEqual([1200, 1400, 1600, 1800, 2000, 2200])
  })

  it('distances are in ascending order', () => {
    for (let i = 1; i < ROUND_DISTANCES.length; i++) {
      expect(ROUND_DISTANCES[i] ?? 0).toBeGreaterThan(ROUND_DISTANCES[i - 1] ?? 0)
    }
  })
})

describe('generateSchedule', () => {
  const horses = generateHorses()
  const schedule = generateSchedule(horses)

  it('produces 6 rounds', () => {
    expect(schedule).toHaveLength(6)
  })

  it('assigns correct distances to each round', () => {
    schedule.forEach((round, idx) => {
      expect(round.distance).toBe(ROUND_DISTANCES[idx])
    })
  })

  it('each round has 10 horses', () => {
    schedule.forEach((round) => {
      expect(round.horses).toHaveLength(10)
    })
  })

  it('round numbers are 1–6', () => {
    schedule.forEach((round, idx) => {
      expect(round.round).toBe(idx + 1)
    })
  })

  it('horses in each round are from the source pool', () => {
    const sourceIds = new Set(horses.map((h) => h.id))
    schedule.forEach((round) => {
      round.horses.forEach((h) => expect(sourceIds.has(h.id)).toBe(true))
    })
  })
})

describe('simulateRaceResult', () => {
  const horses = generateHorses().slice(0, 10)
  const result = simulateRaceResult(horses, 1200)

  it('returns all horses', () => {
    expect(result).toHaveLength(10)
  })

  it('horses are sorted by finish time ascending', () => {
    for (let i = 1; i < result.length; i++) {
      expect(result[i]?.time ?? 0).toBeGreaterThanOrEqual(result[i - 1]?.time ?? 0)
    }
  })

  it('every horse has a numeric time > 0', () => {
    result.forEach((h) => {
      expect(typeof h.time).toBe('number')
      expect(h.time).toBeGreaterThan(0)
    })
  })

  it('preserves horse properties', () => {
    result.forEach((h) => {
      expect(h).toHaveProperty('id')
      expect(h).toHaveProperty('name')
      expect(h).toHaveProperty('color')
      expect(h).toHaveProperty('condition')
    })
  })

  it('longer distances produce longer finish times on average', () => {
    const short = simulateRaceResult(horses, 1200)
    const long = simulateRaceResult(horses, 2200)
    const avg = (arr: HorseResult[]) => arr.reduce((s, h) => s + h.time, 0) / arr.length
    expect(avg(long)).toBeGreaterThan(avg(short))
  })
})
