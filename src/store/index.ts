import { createStore, type StoreOptions } from 'vuex'
import type { RootState, RaceResult } from '../types'
import { generateHorses } from '../utils/horseUtils'
import { generateSchedule } from '../utils/scheduleUtils'

export const storeOptions: StoreOptions<RootState> = {
  state: (): RootState => ({
    horses: [],
    schedule: [],
    results: [],
    currentRound: 0,
    isRacing: false,
    isPaused: false,
    raceFinished: false,
  }),

  getters: {
    horses: (s) => s.horses,
    schedule: (s) => s.schedule,
    results: (s) => s.results,
    currentRound: (s) => s.currentRound,
    isRacing: (s) => s.isRacing,
    isPaused: (s) => s.isPaused,
    raceFinished: (s) => s.raceFinished,
    hasSchedule: (s) => s.schedule.length > 0,
    currentRoundData: (s) => s.schedule[s.currentRound] ?? null,
  },

  mutations: {
    SET_HORSES(state, horses) {
      state.horses = horses
    },
    SET_SCHEDULE(state, schedule) {
      state.schedule = schedule
      state.results = []
      state.currentRound = 0
      state.isRacing = false
      state.isPaused = false
      state.raceFinished = false
    },
    SET_RACING(state, val: boolean) {
      state.isRacing = val
    },
    SET_PAUSED(state, val: boolean) {
      state.isPaused = val
    },
    ADVANCE_ROUND(state) {
      state.currentRound++
    },
    ADD_RESULT(state, result: RaceResult) {
      state.results.push(result)
    },
    SET_RACE_FINISHED(state, val: boolean) {
      state.raceFinished = val
      if (val) state.isRacing = false
    },
    RESET(state) {
      state.schedule = []
      state.results = []
      state.currentRound = 0
      state.isRacing = false
      state.isPaused = false
      state.raceFinished = false
    },
  },

  actions: {
    initHorses({ commit }) {
      commit('SET_HORSES', generateHorses())
    },

    generateProgram({ commit, state }) {
      if (!state.horses.length) return
      commit('SET_SCHEDULE', generateSchedule(state.horses))
    },

    startRace({ commit, state }) {
      if (!state.horses.length || !state.schedule.length) return
      commit('SET_RACING', true)
      commit('SET_PAUSED', false)
    },

    pauseRace({ commit }) {
      commit('SET_PAUSED', true)
    },

    resumeRace({ commit }) {
      commit('SET_PAUSED', false)
    },

    resetGame({ commit }) {
      commit('RESET')
    },

    finishRound({ commit, state }, result: RaceResult) {
      commit('ADD_RESULT', result)
      if (state.currentRound < state.schedule.length - 1) {
        commit('ADVANCE_ROUND')
      } else {
        commit('SET_RACE_FINISHED', true)
      }
    },
  },
}

export default createStore<RootState>(storeOptions)
