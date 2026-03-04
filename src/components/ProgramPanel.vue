<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60 overflow-hidden flex flex-col h-full">
    <div class="px-5 py-4 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between shrink-0">
      <span class="text-sm font-bold text-black dark:text-slate-200 uppercase tracking-wider">{{ t('program.title') }}</span>
      <span v-if="schedule.length" class="text-xs font-medium text-black/50 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{{ t('program.badge') }}</span>
    </div>

    <div class="overflow-y-auto flex-1 p-2 space-y-2">
      <!-- Empty state -->
      <div v-if="!schedule.length" class="flex-1 flex flex-col items-center justify-center gap-2 text-black dark:text-slate-600 py-8">
        <svg class="w-8 h-8 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
        <p class="text-xs text-center">{{ t('program.emptyLine1') }}<br/>{{ t('program.emptyLine2') }}</p>
      </div>

      <div
        v-for="round in schedule"
        :key="round.round"
        :ref="el => { if (el) roundRefs[round.round] = el as HTMLElement }"
        class="rounded-lg border overflow-hidden transition-all duration-200"
        :class="roundClass(round.round)"
      >
        <!-- Round header -->
        <div
          class="px-3 py-2 flex items-center justify-between"
          :class="round.round === activeRound ? 'bg-amber-500/10' : 'bg-slate-50 dark:bg-slate-800/40'"
        >
          <div class="flex items-center gap-2">
            <span
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              :class="roundBadgeClass(round.round)"
            >
              {{ round.round }}
            </span>
            <span class="text-sm font-semibold" :class="round.round === activeRound ? 'text-amber-600 dark:text-amber-400' : 'text-black/50 dark:text-slate-400'">
              {{ round.distance }}m
            </span>
          </div>
          <svg v-if="round.round < activeRound" class="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          <span v-else-if="round.round === activeRound" class="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
        </div>

        <!-- Horses list -->
        <div class="divide-y divide-slate-100 dark:divide-slate-800">
          <div
            v-for="(horse, idx) in round.horses"
            :key="horse.id"
            class="flex items-center gap-2 px-3 py-1"
          >
            <span class="text-xs text-black/25 dark:text-slate-600 w-4 shrink-0">{{ idx + 1 }}</span>
            <span
              class="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-black/10 dark:ring-white/10"
              :style="{ backgroundColor: horse.color }"
            />
            <span class="text-sm text-black/60 dark:text-slate-400 truncate">{{ horse.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import type { RootState, RoundSchedule } from '../types'

const { t } = useI18n()
const store = useStore<RootState>()
const schedule = computed<RoundSchedule[]>(() => store.getters.schedule)
const activeRound = computed<number>(() => store.getters.currentRound + 1)
const roundRefs: Record<number, HTMLElement> = {}

watch(activeRound, async (round) => {
  await nextTick()
  roundRefs[round]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
})

function roundClass(round: number): string {
  if (round === activeRound.value) return 'border-amber-600/50'
  if (round < activeRound.value) return 'border-slate-200 dark:border-slate-700/40 opacity-50'
  return 'border-slate-200 dark:border-slate-700/40'
}

function roundBadgeClass(round: number): string {
  if (round === activeRound.value) return 'bg-amber-500 text-slate-900'
  if (round < activeRound.value) return 'bg-slate-200 dark:bg-slate-700 text-black/30 dark:text-slate-500'
  return 'bg-slate-200 dark:bg-slate-700 text-black/50 dark:text-slate-400'
}
</script>
