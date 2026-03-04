<template>
  <div class="flex flex-col h-screen bg-slate-100 text-gray-900 dark:bg-slate-950 dark:text-gray-100 overflow-hidden">
    <AppHeader />
    <main class="flex-1 grid gap-4 p-4 min-h-0 layout-grid">
      <!-- Horse List -->
      <div class="overflow-hidden flex flex-col">
        <HorseList />
      </div>

      <!-- Race Track -->
      <div class="overflow-hidden flex flex-col min-w-0">
        <RaceTrack />
      </div>

      <!-- Program -->
      <div class="overflow-hidden flex flex-col">
        <ProgramPanel />
      </div>

      <!-- Results -->
      <div class="overflow-hidden flex flex-col">
        <ResultsPanel />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import type { RootState } from './types'
import AppHeader from './components/AppHeader.vue'
import HorseList from './components/HorseList.vue'
import RaceTrack from './components/RaceTrack.vue'
import ProgramPanel from './components/ProgramPanel.vue'
import ResultsPanel from './components/ResultsPanel.vue'

const store = useStore<RootState>()
onMounted(() => store.dispatch('initHorses'))
</script>

<style scoped>
.layout-grid {
  grid-template-columns: 260px 2fr 280px 280px;
  grid-template-rows: 1fr;
  overflow: hidden;
}

/* Large screens: slightly compact side columns */
@media (max-width: 1279px) {
  .layout-grid {
    grid-template-columns: 180px 2fr 220px 220px;
  }
}

/* Tablet: 2×2 grid */
@media (max-width: 1023px) {
  .layout-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    overflow: hidden;
  }
}

/* Mobile: single column stack with scroll */
@media (max-width: 767px) {
  .layout-grid {
    grid-template-columns: 1fr;
    grid-template-rows: 280px 360px 380px 380px;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
