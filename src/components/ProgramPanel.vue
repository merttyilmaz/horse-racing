<template>
  <div class="bg-gray-800 rounded-xl overflow-hidden flex flex-col h-full">
    <div class="bg-gray-700 px-4 py-3 font-semibold text-sm text-gray-200 border-b border-gray-600">
      Program
    </div>
    <div class="overflow-y-auto flex-1 p-2 flex flex-col gap-3">
      <div
        v-for="round in schedule"
        :key="round.round"
        class="rounded-lg border transition-colors"
        :class="roundClass(round.round)"
      >
        <div
          class="px-3 py-1.5 text-xs font-bold border-b"
          :class="round.round === activeRound ? 'border-yellow-600 text-yellow-400' : 'border-gray-600 text-gray-400'"
        >
          {{ round.round }}{{ ordinal(round.round) }} Lap – {{ round.distance }}m
        </div>
        <table class="w-full text-xs">
          <thead>
            <tr class="text-gray-500">
              <th class="px-3 py-1 text-left">Pos</th>
              <th class="px-3 py-1 text-left">Name</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(horse, idx) in round.horses"
              :key="horse.id"
              class="border-t border-gray-700"
            >
              <td class="px-3 py-1 text-gray-400">{{ idx + 1 }}</td>
              <td class="px-3 py-1 flex items-center gap-2">
                <span
                  class="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                  :style="{ backgroundColor: horse.color }"
                />
                <span class="text-gray-200 truncate">{{ horse.name }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { RootState, RoundSchedule } from '../types'

const store = useStore<RootState>()
const schedule = computed<RoundSchedule[]>(() => store.getters.schedule)
const activeRound = computed<number>(() => store.getters.currentRound + 1)

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] ?? s[v] ?? s[0] ?? 'th'
}

function roundClass(round: number): string {
  if (round === activeRound.value) return 'border-yellow-600 bg-yellow-900/10'
  if (round < activeRound.value) return 'border-gray-600 opacity-60'
  return 'border-gray-600'
}
</script>
