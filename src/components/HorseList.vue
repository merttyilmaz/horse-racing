<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60 overflow-hidden flex flex-col h-full">
    <div class="px-5 py-3 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between shrink-0">
      <span class="text-sm font-bold text-black dark:text-slate-200 uppercase tracking-wider">{{ t('horses.title') }}</span>
      <span class="text-xs font-medium text-black/50 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{{ horses.length }}</span>
    </div>

    <!-- Column headers -->
    <div class="flex items-center gap-2 px-3 py-1.5 border-b border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/60 shrink-0">
      <span class="w-3.5 shrink-0" />
      <span class="flex-1 text-xs font-semibold text-black/40 dark:text-slate-500 uppercase tracking-wider">{{ t('horses.colName') }}</span>
      <span class="text-xs font-semibold text-black/40 dark:text-slate-500 uppercase tracking-wider w-10 text-center shrink-0">{{ t('horses.colCond') }}</span>
      <span class="text-xs font-semibold text-black/40 dark:text-slate-500 uppercase tracking-wider w-7 text-right shrink-0">{{ t('horses.colNum') }}</span>
    </div>

    <div class="overflow-y-auto flex-1">
      <div
        v-for="horse in horses"
        :key="horse.id"
        data-testid="horse-item"
        class="flex items-center gap-2 px-3 py-2 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <!-- Color dot -->
        <span
          class="w-3.5 h-3.5 rounded-full shrink-0 ring-1 ring-black/10 dark:ring-white/10"
          :style="{ backgroundColor: horse.color }"
        />
        <!-- Name -->
        <span class="flex-1 text-sm text-black dark:text-slate-300 truncate min-w-0">{{ horse.name }}</span>
        <!-- Condition bar -->
        <div class="flex items-center gap-2 shrink-0">
          <div class="w-10 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all"
              :class="conditionColor(horse.condition)"
              :style="{ width: horse.condition + '%' }"
            />
          </div>
          <span class="text-sm text-black/40 dark:text-slate-500 w-7 text-right">{{ horse.condition }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import type { RootState } from '../types'

const { t } = useI18n()
const store = useStore<RootState>()
const horses = computed(() => store.getters.horses)

function conditionColor(condition: number): string {
  if (condition >= 75) return 'bg-emerald-500'
  if (condition >= 50) return 'bg-amber-400'
  return 'bg-red-500'
}
</script>
