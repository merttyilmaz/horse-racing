<template>
  <div class="bg-gray-800 rounded-xl overflow-hidden flex flex-col flex-1">
    <div class="bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-200 border-b border-gray-600 flex items-center gap-3">
      <span v-if="currentRoundData">
        Round {{ currentRoundData.round }} — {{ currentRoundData.distance }}m
      </span>
      <span v-else class="text-gray-400">No race in progress</span>
      <span
        v-if="finishMessage"
        class="ml-auto text-yellow-400 font-bold text-xs tracking-wide animate-pulse"
      >
        {{ finishMessage }}
      </span>
    </div>

    <div class="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
      <div
        v-for="(horse, idx) in currentHorses"
        :key="horse.id"
        class="relative flex items-center h-10 bg-gray-900 rounded border border-gray-700"
      >
        <span class="absolute left-1 top-0 bottom-0 flex items-center text-xs text-gray-500 w-5 justify-center">
          {{ idx + 1 }}
        </span>

        <div class="absolute left-6 right-16 top-1/2 -translate-y-1/2 border-t border-dashed border-gray-700" />
        <div class="absolute right-16 top-0 bottom-0 w-px bg-yellow-500 opacity-50" />
        <span class="absolute right-10 top-0 bottom-0 flex items-center text-xs text-yellow-500 opacity-70 font-bold">
          FINISH
        </span>

        <div
          class="absolute flex items-center"
          :style="horseStyle(horse.id)"
        >
          <span class="text-lg leading-none">🐎</span>
        </div>

        <span
          class="absolute right-3 w-3 h-3 rounded-full border border-gray-500"
          :style="{ backgroundColor: horse.color }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import type { RootState, Horse, RoundSchedule } from '../types'
import { simulateRaceResult } from '../utils/scheduleUtils'

const store = useStore<RootState>()

const currentRoundData = computed<RoundSchedule | null>(() => store.getters.currentRoundData)
const isRacing = computed<boolean>(() => store.getters.isRacing)
const isPaused = computed<boolean>(() => store.getters.isPaused)
const raceFinished = computed<boolean>(() => store.getters.raceFinished)

const progress = ref<Record<number, number>>({})
const finishMessage = ref('')
const currentHorses = ref<Horse[]>([])

let animationId: number | null = null
let startTime: number | null = null
let pausedAt: number | null = null

function resetProgress(horses: Horse[]) {
  progress.value = Object.fromEntries(horses.map((h) => [h.id, 0]))
  finishMessage.value = ''
}

function horseStyle(horseId: number) {
  const p = progress.value[horseId] ?? 0
  return {
    left: `calc(24px + ${p} * (100% - 24px - 68px))`,
    top: '50%',
    transform: 'translateY(-50%)',
  }
}

function startAnimation(roundData: RoundSchedule) {
  if (animationId !== null) cancelAnimationFrame(animationId)

  const horses = roundData.horses
  currentHorses.value = horses
  resetProgress(horses)

  const raceResults = simulateRaceResult(horses, roundData.distance)
  const minTime = raceResults[0]?.time ?? 0
  const maxTime = raceResults[raceResults.length - 1]?.time ?? 0

  const horseDurations: Record<number, number> = {}
  raceResults.forEach((h) => {
    const ratio = (h.time - minTime) / (maxTime - minTime || 1)
    horseDurations[h.id] = 5000 + ratio * 3000
  })

  startTime = null
  pausedAt = null

  function animate(ts: number) {
    if (startTime === null) startTime = ts

    if (isPaused.value) {
      pausedAt = ts
      animationId = requestAnimationFrame(animate)
      return
    }

    if (pausedAt !== null) {
      startTime = (startTime ?? ts) + ts - pausedAt
      pausedAt = null
    }

    const elapsed = ts - (startTime ?? ts)
    const newProgress = { ...progress.value }
    horses.forEach((h) => {
      newProgress[h.id] = Math.min(elapsed / (horseDurations[h.id] ?? 5000), 1)
    })
    progress.value = newProgress

    if (horses.some((h) => (progress.value[h.id] ?? 0) < 1)) {
      animationId = requestAnimationFrame(animate)
    } else {
      finishMessage.value = `Round ${roundData.round} finished!`
      setTimeout(() => {
        store.dispatch('finishRound', {
          round: roundData.round,
          distance: roundData.distance,
          finishOrder: raceResults,
        })
      }, 800)
    }
  }

  animationId = requestAnimationFrame(animate)
}

watch(
  [isRacing, currentRoundData] as const,
  ([racing, roundData]) => {
    if (racing && roundData) startAnimation(roundData)
  },
  { immediate: true },
)

watch(raceFinished, (val) => {
  if (val) {
    finishMessage.value = 'All rounds complete!'
    if (animationId !== null) cancelAnimationFrame(animationId)
  }
})

onBeforeUnmount(() => {
  if (animationId !== null) cancelAnimationFrame(animationId)
})
</script>
