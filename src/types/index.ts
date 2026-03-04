export interface Horse {
  id: number
  name: string
  color: string
  condition: number
}

export interface RoundSchedule {
  round: number
  distance: number
  horses: Horse[]
}

export interface RaceResult {
  round: number
  distance: number
  finishOrder: HorseResult[]
}

export interface HorseResult extends Horse {
  time: number
}

export interface RootState {
  horses: Horse[]
  schedule: RoundSchedule[]
  results: RaceResult[]
  currentRound: number
  isRacing: boolean
  isPaused: boolean
  raceFinished: boolean
}
