<template>
  <div class="bg-gray-800 rounded-xl overflow-hidden flex flex-col h-full">
    <div class="bg-gray-700 px-4 py-3 font-semibold text-sm text-gray-200 border-b border-gray-600">
      Horse List (1–20)
    </div>
    <div class="overflow-y-auto flex-1">
      <table class="w-full text-sm">
        <thead class="sticky top-0 bg-gray-700 text-gray-300 text-xs uppercase">
          <tr>
            <th class="px-3 py-2 text-left">Name</th>
            <th class="px-3 py-2 text-center">Cond.</th>
            <th class="px-3 py-2 text-center">Color</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="horse in horses"
            :key="horse.id"
            class="border-t border-gray-700 hover:bg-gray-750 transition-colors"
          >
            <td class="px-3 py-2 text-gray-200">{{ horse.name }}</td>
            <td class="px-3 py-2 text-center text-gray-300">{{ horse.condition }}</td>
            <td class="px-3 py-2 text-center">
              <span
                class="inline-block w-5 h-5 rounded-full border border-gray-500"
                :style="{ backgroundColor: horse.color }"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { RootState } from '../types'

const store = useStore<RootState>()
const horses = computed(() => store.getters.horses)
</script>
