import { ref, watch } from 'vue'

const STORAGE_KEY = 'horse-racing-theme'

function getInitialDark(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) return stored === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const isDark = ref(getInitialDark())

// Apply class immediately on module load
document.documentElement.classList.toggle('dark', isDark.value)

watch(isDark, (val) => {
  document.documentElement.classList.toggle('dark', val)
  localStorage.setItem(STORAGE_KEY, val ? 'dark' : 'light')
})

export function useTheme() {
  return {
    isDark,
    toggleTheme: () => { isDark.value = !isDark.value },
  }
}
