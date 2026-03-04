import type { Horse } from '../types'

const HORSE_NAMES: string[] = [
  'Thunder Bolt', 'Silver Wind', 'Golden Blaze', 'Dark Storm',
  'Iron Hoof', 'Wild Spirit', 'Mystic Fire', 'Ocean Breeze',
  'Shadow Dancer', 'Star Gazer', 'Red Fury', 'Blue Thunder',
  'Night Rider', 'Sand Storm', 'Arctic Fox', 'Crimson Dawn',
  'Jade Dragon', 'Steel Arrow', 'Copper Coast', 'Ivory Mane',
]

const HORSE_COLORS: string[] = [
  '#e74c3c', '#3498db', '#f1c40f', '#2ecc71',
  '#9b59b6', '#e67e22', '#1abc9c', '#e91e63',
  '#00bcd4', '#8bc34a', '#ff5722', '#607d8b',
  '#9c27b0', '#03a9f4', '#ff9800', '#4caf50',
  '#f44336', '#673ab7', '#009688', '#795548',
]

export function generateHorses(): Horse[] {
  return HORSE_NAMES.map((name, index) => ({
    id: index + 1,
    name,
    color: HORSE_COLORS[index] as string,
    condition: Math.floor(Math.random() * 100) + 1,
  }))
}

export function getRandomHorses(horses: Horse[], count = 10): Horse[] {
  return [...horses].sort(() => Math.random() - 0.5).slice(0, count)
}
