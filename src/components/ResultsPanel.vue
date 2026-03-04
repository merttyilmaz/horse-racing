<template>
  <div data-testid="results-panel" class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60 overflow-hidden flex flex-col h-full">
    <div class="px-5 py-4 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between shrink-0">
      <span class="text-sm font-bold text-black dark:text-slate-200 uppercase tracking-wider">{{ t('results.title') }}</span>
      <span v-if="results.length" class="text-xs font-medium text-black/50 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{{ results.length }}/6</span>
    </div>

    <div ref="scrollEl" class="overflow-y-auto flex-1 p-2 space-y-2">
      <!-- Empty state -->
      <div v-if="!results.length" class="flex-1 flex flex-col items-center justify-center gap-2 text-black dark:text-slate-600 py-8">
        <svg class="w-8 h-8 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p class="text-xs text-center">{{ t('results.emptyLine1') }}<br/>{{ t('results.emptyLine2') }}</p>
      </div>

      <div
        v-for="result in results"
        :key="result.round"
        class="rounded-lg border border-slate-200 dark:border-slate-700/40 overflow-hidden"
      >
        <!-- Round header -->
        <div class="px-3 py-2 bg-slate-50 dark:bg-slate-800/40 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {{ result.round }}
          </span>
          <span class="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{{ result.distance }}m</span>
          <svg class="w-3.5 h-3.5 text-emerald-500 ml-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>

        <!-- Finish order -->
        <div class="divide-y divide-slate-100 dark:divide-slate-800">
          <div
            v-for="(horse, idx) in result.finishOrder"
            :key="horse.id"
            class="flex items-center gap-2 px-3 py-1"
            :class="idx === 0 ? 'bg-amber-500/5' : ''"
          >
            <!-- Position medal -->
            <span
              class="text-xs font-bold w-4 shrink-0 text-center"
              :class="idx === 0 ? 'text-amber-600 dark:text-amber-400' : idx === 1 ? 'text-black/40 dark:text-slate-400' : idx === 2 ? 'text-amber-700/70 dark:text-amber-700' : 'text-black/25 dark:text-slate-600'"
            >
              {{ idx + 1 }}
            </span>
            <span
              class="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-black/10 dark:ring-white/10"
              :style="{ backgroundColor: horse.color }"
            />
            <span class="text-sm truncate" :class="idx === 0 ? 'text-black dark:text-slate-200 font-medium' : 'text-black/60 dark:text-slate-400'">
              {{ horse.name }}
            </span>
            <span v-if="idx === 0" class="ml-auto text-sm">🏆</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import type { RootState, RaceResult } from '../types'

const { t } = useI18n()
const store = useStore<RootState>()
const results = computed<RaceResult[]>(() => store.getters.results)
const scrollEl = ref<HTMLElement | null>(null)

watch(() => results.value.length, async () => {
  await nextTick()
  if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
})
</script>
