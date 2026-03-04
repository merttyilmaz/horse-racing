<template>
  <header class="bg-gray-900 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
    <h1 class="text-xl font-bold text-white tracking-wide">🏇 Horse Racing</h1>
    <div class="flex items-center gap-3">
      <button
        class="px-5 py-2 rounded-lg font-semibold text-sm transition-colors"
        :class="isRacing ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white'"
        :disabled="isRacing"
        @click="store.dispatch('generateProgram')"
      >
        Generate Program
      </button>

      <button
        v-if="!isRacing && !raceFinished"
        class="px-5 py-2 rounded-lg font-semibold text-sm transition-colors"
        :class="hasSchedule ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'"
        :disabled="!hasSchedule"
        @click="store.dispatch('startRace')"
      >
        Start / Pause
      </button>

      <button
        v-else-if="isRacing"
        class="px-5 py-2 rounded-lg font-semibold text-sm transition-colors"
        :class="isPaused ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-yellow-600 hover:bg-yellow-500 text-white'"
        @click="isPaused ? store.dispatch('resumeRace') : store.dispatch('pauseRace')"
      >
        {{ isPaused ? 'Resume' : 'Pause' }}
      </button>

      <button
        v-else-if="raceFinished"
        class="px-5 py-2 rounded-lg font-semibold text-sm bg-blue-600 hover:bg-blue-500 text-white transition-colors"
        @click="store.dispatch('resetGame')"
      >
        New Race
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { RootState } from '../types'

const store = useStore<RootState>()
const isRacing = computed(() => store.getters.isRacing)
const isPaused = computed(() => store.getters.isPaused)
const hasSchedule = computed(() => store.getters.hasSchedule)
const raceFinished = computed(() => store.getters.raceFinished)
</script>
