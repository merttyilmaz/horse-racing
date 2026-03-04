<template>
  <div data-testid="results-panel" class="bg-gray-800 rounded-xl overflow-hidden flex flex-col h-full">
    <div class="bg-gray-700 px-4 py-3 font-semibold text-sm text-gray-200 border-b border-gray-600">
      Results
    </div>
    <div class="overflow-y-auto flex-1 p-2 flex flex-col gap-3">
      <div
        v-for="result in results"
        :key="result.round"
        class="rounded-lg border border-gray-600"
      >
        <div class="px-3 py-1.5 text-xs font-bold border-b border-gray-600 text-green-400">
          {{ result.round }}{{ ordinal(result.round) }} Lap – {{ result.distance }}m
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
              v-for="(horse, idx) in result.finishOrder"
              :key="horse.id"
              class="border-t border-gray-700"
              :class="idx === 0 ? 'bg-yellow-900/20' : ''"
            >
              <td class="px-3 py-1 font-bold" :class="idx === 0 ? 'text-yellow-400' : 'text-gray-400'">
                {{ idx + 1 }}
              </td>
              <td class="px-3 py-1 flex items-center gap-2">
                <span
                  class="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                  :style="{ backgroundColor: horse.color }"
                />
                <span class="text-gray-200 truncate">{{ horse.name }}</span>
                <span v-if="idx === 0" class="ml-auto text-yellow-400">🏆</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!results.length" class="text-gray-500 text-sm text-center py-6">
        Results will appear here after each round.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { RootState, RaceResult } from '../types'

const store = useStore<RootState>()
const results = computed<RaceResult[]>(() => store.getters.results)

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] ?? s[v] ?? s[0] ?? 'th'
}
</script>
