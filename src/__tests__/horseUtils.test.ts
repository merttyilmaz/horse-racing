import { describe, it, expect } from 'vitest'
import { generateHorses, getRandomHorses } from '../utils/horseUtils'

describe('generateHorses', () => {
  it('generates exactly 20 horses', () => {
    expect(generateHorses()).toHaveLength(20)
  })

  it('assigns unique ids', () => {
    const horses = generateHorses()
    expect(new Set(horses.map((h) => h.id)).size).toBe(20)
  })

  it('assigns unique colors', () => {
    const horses = generateHorses()
    expect(new Set(horses.map((h) => h.color)).size).toBe(20)
  })

  it('assigns condition scores between 1 and 100', () => {
    generateHorses().forEach((h) => {
      expect(h.condition).toBeGreaterThanOrEqual(1)
      expect(h.condition).toBeLessThanOrEqual(100)
    })
  })

  it('every horse has required properties', () => {
    generateHorses().forEach((h) => {
      expect(h).toHaveProperty('id')
      expect(h).toHaveProperty('name')
      expect(h).toHaveProperty('color')
      expect(h).toHaveProperty('condition')
    })
  })
})

describe('getRandomHorses', () => {
  const horses = generateHorses()

  it('returns the requested count', () => {
    expect(getRandomHorses(horses, 10)).toHaveLength(10)
  })

  it('returns only horses from the source list', () => {
    const sourceIds = new Set(horses.map((h) => h.id))
    getRandomHorses(horses, 10).forEach((h) => expect(sourceIds.has(h.id)).toBe(true))
  })

  it('returns no duplicate horses', () => {
    const selected = getRandomHorses(horses, 10)
    expect(new Set(selected.map((h) => h.id)).size).toBe(10)
  })

  it('does not mutate the original array', () => {
    const copy = [...horses]
    getRandomHorses(horses, 10)
    expect(horses).toEqual(copy)
  })
})
