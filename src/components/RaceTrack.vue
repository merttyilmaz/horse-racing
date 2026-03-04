<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60 overflow-hidden flex flex-col h-full">
    <!-- Track header -->
    <div class="px-5 py-5 border-b border-slate-200 dark:border-slate-700/60 flex items-center gap-3 shrink-0">
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <span class="text-sm font-bold text-black dark:text-slate-200 uppercase tracking-wider">{{ t('track.title') }}</span>
        <span v-if="currentRoundData" class="text-sm text-black/50 dark:text-slate-400">
          {{ t('track.roundInfo', { round: currentRoundData.round, distance: currentRoundData.distance }) }}
        </span>
        <span v-else class="text-xs text-black/30 dark:text-slate-600">{{ t('track.noRace') }}</span>
      </div>
      <transition name="fade">
        <span
          v-if="finishMessage"
          class="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-wide flex items-center gap-1"
        >
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          {{ finishMessage }}
        </span>
      </transition>
    </div>

    <!-- Lanes -->
    <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
      <div
        v-for="(horse, idx) in currentHorses"
        :key="horse.id"
        class="relative flex items-center rounded-lg overflow-hidden h-20"
      >
        <!-- Lane background -->
        <div class="absolute inset-0 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/40" />

        <!-- Lane number -->
        <span class="absolute left-2 text-base font-bold text-black/20 dark:text-slate-600 z-10 w-6 text-center select-none">
          {{ idx + 1 }}
        </span>

        <!-- Dashed track line -->
        <div class="absolute left-8 right-20 top-1/2 -translate-y-px border-t border-dashed border-slate-300 dark:border-slate-700/60 z-0" />

        <!-- Finish line -->
        <div class="absolute right-20 top-0 bottom-0 w-px z-10" :style="finishLineStyle" />

        <!-- FINISH label -->
        <span class="absolute right-9 text-xs font-bold text-amber-600/70 dark:text-amber-500/60 tracking-widest z-10 select-none" style="writing-mode: horizontal-tb">{{ t('track.finishLine') }}</span>

        <!-- Horse -->
        <div
          class="absolute z-20 flex items-center"
          :style="horseStyle(horse.id)"
        >
          <span class="text-base leading-none select-none" :title="horse.name">🐎</span>
        </div>

        <!-- Color pill on far right -->
        <div
          class="absolute right-2 flex items-center gap-1 z-10"
          :title="horse.name"
        >
          <span
            class="w-2 h-2 rounded-full ring-1 ring-black/10 dark:ring-white/10 shrink-0"
            :style="{ backgroundColor: horse.color }"
          />
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="!currentHorses.length" class="flex-1 flex flex-col items-center justify-center gap-3 text-black dark:text-slate-600 py-12">
        <svg class="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-sm">{{ t('track.emptyHint') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import type { RootState, Horse, RoundSchedule } from '../types'
import { simulateRaceResult } from '../utils/scheduleUtils'
import { useTheme } from '../composables/useTheme'

const { t } = useI18n()
const store = useStore<RootState>()
const { isDark } = useTheme()

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

const finishLineStyle = computed(() => {
  const gap = isDark.value ? '#1e293b' : '#f1f5f9'
  return { background: `repeating-linear-gradient(to bottom, #f59e0b 0px, #f59e0b 4px, ${gap} 4px, ${gap} 8px)` }
})

function resetProgress(horses: Horse[]) {
  progress.value = Object.fromEntries(horses.map((h) => [h.id, 0]))
  finishMessage.value = ''
}

function horseStyle(horseId: number) {
  const p = progress.value[horseId] ?? 0
  return {
    left: `calc(32px + ${p} * (100% - 32px - 84px))`,
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
      finishMessage.value = t('track.roundComplete', { n: roundData.round })
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
    finishMessage.value = t('track.allComplete')
    if (animationId !== null) cancelAnimationFrame(animationId)
  }
})

onBeforeUnmount(() => {
  if (animationId !== null) cancelAnimationFrame(animationId)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
