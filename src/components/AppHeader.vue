<template>
  <header class="shrink-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700/60">
    <div class="max-w-screen-4xl mx-auto px-4 md:px-8 py-2 flex flex-wrap items-center gap-x-6 gap-y-2">

      <!-- Logo -->
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-8 h-8 rounded-lg bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-base shrink-0">
          🏇
        </div>
        <div class="min-w-0">
          <h1 class="text-base font-bold text-black dark:text-white leading-tight tracking-wide">{{ t('header.title') }}</h1>
          <p class="hidden sm:block text-xs text-black/50 dark:text-slate-400 leading-tight">{{ t('header.subtitle') }}</p>
        </div>
      </div>

      <!-- Status badge — full-width second row on mobile, centered middle on md+ -->
      <div class="order-3 w-full flex justify-center md:order-2 md:flex-1 md:w-auto">
        <div
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border"
          :class="statusClass"
        >
          <span class="w-1.5 h-1.5 rounded-full" :class="dotClass" />
          {{ statusText }}
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 shrink-0 ml-auto md:ml-0 order-2 md:order-3">
        <button
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
          :class="isRacing
            ? 'bg-slate-200 dark:bg-slate-700 text-black/30 dark:text-slate-500 cursor-not-allowed'
            : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-black dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'"
          :disabled="isRacing"
          @click="store.dispatch('generateProgram')"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span class="hidden sm:inline">{{ t('header.btnGenerate') }}</span>
        </button>

        <!-- Start -->
        <button
          v-if="!isRacing && !raceFinished"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
          :class="hasSchedule
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40'
            : 'bg-slate-200 dark:bg-slate-700 text-black/30 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-600'"
          :disabled="!hasSchedule"
          @click="store.dispatch('startRace')"
        >
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span class="hidden sm:inline">{{ t('header.btnStart') }}</span>
        </button>

        <!-- Pause / Resume -->
        <button
          v-else-if="isRacing"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
          :class="isPaused
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
            : 'bg-amber-500 hover:bg-amber-400 text-white'"
          @click="isPaused ? store.dispatch('resumeRace') : store.dispatch('pauseRace')"
        >
          <svg v-if="isPaused" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <svg v-else class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
          <span class="hidden sm:inline">{{ isPaused ? t('header.btnResume') : t('header.btnPause') }}</span>
        </button>

        <!-- New Race -->
        <button
          v-else-if="raceFinished"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-150 shadow-lg shadow-indigo-900/40"
          @click="store.dispatch('resetGame')"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11l-6 6-6-6m12-5a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="hidden sm:inline">{{ t('header.btnNewRace') }}</span>
        </button>

        <!-- Language toggle -->
        <button
          class="inline-flex items-center justify-center px-2.5 h-9 rounded-lg transition-all duration-150 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-xs font-bold text-black/70 dark:text-slate-300 tracking-wide"
          :title="locale === 'tr' ? 'Switch to English' : 'Türkçeye geç'"
          @click="locale = locale === 'tr' ? 'en' : 'tr'"
        >
          {{ locale === 'tr' ? 'EN' : 'TR' }}
        </button>

        <!-- Theme toggle -->
        <button
          class="inline-flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-black/70 dark:text-slate-300"
          :title="isDark ? t('header.themeToLight') : t('header.themeToDark')"
          @click="toggleTheme"
        >
          <!-- Sun: shown in dark mode, click → light -->
          <svg v-if="isDark" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 011.06 0l1.591 1.59a.75.75 0 01-1.06 1.061L6.166 7.227a.75.75 0 010-1.061z"/>
          </svg>
          <!-- Moon: shown in light mode, click → dark -->
          <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import type { RootState } from '../types'
import { useTheme } from '../composables/useTheme'

const store = useStore<RootState>()
const { t, locale } = useI18n()
const isRacing = computed(() => store.getters.isRacing)
const isPaused = computed(() => store.getters.isPaused)
const hasSchedule = computed(() => store.getters.hasSchedule)
const raceFinished = computed(() => store.getters.raceFinished)
const currentRound = computed(() => store.getters.currentRound)

const { isDark, toggleTheme } = useTheme()

const statusText = computed(() => {
  if (raceFinished.value) return t('header.statusComplete')
  if (isPaused.value) return t('header.statusPaused')
  if (isRacing.value) return t('header.statusRound', { n: currentRound.value + 1 })
  if (hasSchedule.value) return t('header.statusReady')
  return t('header.statusAwaiting')
})

const statusClass = computed(() => {
  if (raceFinished.value) return 'bg-indigo-50 dark:bg-indigo-950 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300'
  if (isPaused.value) return 'bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
  if (isRacing.value) return 'bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
  if (hasSchedule.value) return 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-black/60 dark:text-slate-300'
  return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-black/40 dark:text-slate-500'
})

const dotClass = computed(() => {
  if (raceFinished.value) return 'bg-indigo-500 dark:bg-indigo-400'
  if (isPaused.value) return 'bg-amber-500 dark:bg-amber-400'
  if (isRacing.value) return 'bg-emerald-500 dark:bg-emerald-400 animate-pulse'
  return 'bg-black/30 dark:bg-slate-500'
})
</script>
