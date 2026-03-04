<template>
  <div class="flex flex-col min-h-screen bg-gray-900 text-gray-100">
    <AppHeader />
    <main class="flex-1 flex gap-3 p-3 overflow-hidden" style="height: calc(100vh - 57px)">
      <div class="w-56 flex-shrink-0 flex flex-col overflow-hidden">
        <HorseList />
      </div>
      <div class="flex-1 flex flex-col overflow-hidden min-w-0">
        <RaceTrack />
      </div>
      <div class="w-64 flex-shrink-0 flex flex-col gap-3 overflow-hidden">
        <div class="flex-1 overflow-hidden">
          <ProgramPanel />
        </div>
        <div class="flex-1 overflow-hidden">
          <ResultsPanel />
        </div>
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
