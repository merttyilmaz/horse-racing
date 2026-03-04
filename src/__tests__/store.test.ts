import { describe, it, expect } from 'vitest'
import { createStore } from 'vuex'
import { storeOptions } from '../store'
import type { RootState, RaceResult } from '../types'

function freshStore() {
  return createStore<RootState>(storeOptions)
}

describe('Vuex store – initial state', () => {
  it('starts with empty horses', () => {
    expect(freshStore().state.horses).toEqual([])
  })

  it('starts with empty schedule', () => {
    expect(freshStore().state.schedule).toEqual([])
  })

  it('starts with isRacing = false', () => {
    expect(freshStore().state.isRacing).toBe(false)
  })

  it('starts with raceFinished = false', () => {
    expect(freshStore().state.raceFinished).toBe(false)
  })
})

describe('Vuex store – initHorses', () => {
  it('populates 20 horses', async () => {
    const store = freshStore()
    await store.dispatch('initHorses')
    expect(store.state.horses).toHaveLength(20)
  })
})

describe('Vuex store – generateProgram', () => {
  it('creates a 6-round schedule', async () => {
    const store = freshStore()
    await store.dispatch('initHorses')
    await store.dispatch('generateProgram')
    expect(store.state.schedule).toHaveLength(6)
  })

  it('resets results and currentRound', async () => {
    const store = freshStore()
    await store.dispatch('initHorses')
    await store.dispatch('generateProgram')
    expect(store.state.results).toEqual([])
    expect(store.state.currentRound).toBe(0)
  })

  it('does nothing when no horses', async () => {
    const store = freshStore()
    await store.dispatch('generateProgram')
    expect(store.state.schedule).toEqual([])
  })
})

describe('Vuex store – startRace', () => {
  it('sets isRacing to true', async () => {
    const store = freshStore()
    await store.dispatch('initHorses')
    await store.dispatch('generateProgram')
    await store.dispatch('startRace')
    expect(store.state.isRacing).toBe(true)
  })

  it('does nothing without a schedule', async () => {
    const store = freshStore()
    await store.dispatch('startRace')
    expect(store.state.isRacing).toBe(false)
  })
})

describe('Vuex store – pause / resume', () => {
  it('pauseRace sets isPaused to true', async () => {
    const store = freshStore()
    await store.dispatch('initHorses')
    await store.dispatch('generateProgram')
    await store.dispatch('startRace')
    await store.dispatch('pauseRace')
    expect(store.state.isPaused).toBe(true)
  })

  it('resumeRace sets isPaused to false', async () => {
    const store = freshStore()
    await store.dispatch('initHorses')
    await store.dispatch('generateProgram')
    await store.dispatch('startRace')
    await store.dispatch('pauseRace')
    await store.dispatch('resumeRace')
    expect(store.state.isPaused).toBe(false)
  })
})

describe('Vuex store – finishRound', () => {
  const mockResult: RaceResult = { round: 1, distance: 1200, finishOrder: [] }

  it('adds result to results array', async () => {
    const store = freshStore()
    await store.dispatch('initHorses')
    await store.dispatch('generateProgram')
    await store.dispatch('startRace')
    await store.dispatch('finishRound', mockResult)
    expect(store.state.results).toHaveLength(1)
    expect(store.state.results[0]).toEqual(mockResult)
  })

  it('advances currentRound after a non-final round', async () => {
    const store = freshStore()
    await store.dispatch('initHorses')
    await store.dispatch('generateProgram')
    await store.dispatch('startRace')
    await store.dispatch('finishRound', mockResult)
    expect(store.state.currentRound).toBe(1)
  })

  it('sets raceFinished after the last round', async () => {
    const store = freshStore()
    await store.dispatch('initHorses')
    await store.dispatch('generateProgram')
    await store.dispatch('startRace')
    for (let i = 1; i <= 6; i++) {
      store.commit('SET_RACING', true)
      await store.dispatch('finishRound', { round: i, distance: 1200, finishOrder: [] })
    }
    expect(store.state.raceFinished).toBe(true)
    expect(store.state.isRacing).toBe(false)
  })
})

describe('Vuex store – getters', () => {
  it('hasSchedule is false before generating', () => {
    expect(freshStore().getters.hasSchedule).toBe(false)
  })

  it('hasSchedule is true after generating', async () => {
    const store = freshStore()
    await store.dispatch('initHorses')
    await store.dispatch('generateProgram')
    expect(store.getters.hasSchedule).toBe(true)
  })

  it('currentRoundData returns first round initially', async () => {
    const store = freshStore()
    await store.dispatch('initHorses')
    await store.dispatch('generateProgram')
    expect(store.getters.currentRoundData.round).toBe(1)
  })
})
