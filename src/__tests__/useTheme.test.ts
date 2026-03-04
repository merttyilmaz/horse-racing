import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'

const STORAGE_KEY = 'horse-racing-theme'

describe('useTheme', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    localStorage.clear()
    vi.resetModules()
  })

  it('reads dark from localStorage on init', async () => {
    localStorage.setItem(STORAGE_KEY, 'dark')
    const { useTheme } = await import('../composables/useTheme')
    expect(useTheme().isDark.value).toBe(true)
  })

  it('reads light from localStorage on init', async () => {
    localStorage.setItem(STORAGE_KEY, 'light')
    const { useTheme } = await import('../composables/useTheme')
    expect(useTheme().isDark.value).toBe(false)
  })

  it('applies dark class to <html> on init when stored as dark', async () => {
    localStorage.setItem(STORAGE_KEY, 'dark')
    await import('../composables/useTheme')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('does not apply dark class to <html> on init when stored as light', async () => {
    localStorage.setItem(STORAGE_KEY, 'light')
    await import('../composables/useTheme')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('falls back to prefers-color-scheme: dark when no localStorage', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
    const { useTheme } = await import('../composables/useTheme')
    expect(useTheme().isDark.value).toBe(true)
  })

  it('toggleTheme flips isDark from light to dark', async () => {
    localStorage.setItem(STORAGE_KEY, 'light')
    const { useTheme } = await import('../composables/useTheme')
    const { isDark, toggleTheme } = useTheme()
    toggleTheme()
    expect(isDark.value).toBe(true)
  })

  it('toggleTheme flips isDark from dark to light', async () => {
    localStorage.setItem(STORAGE_KEY, 'dark')
    const { useTheme } = await import('../composables/useTheme')
    const { isDark, toggleTheme } = useTheme()
    toggleTheme()
    expect(isDark.value).toBe(false)
  })

  it('toggleTheme adds dark class to <html>', async () => {
    localStorage.setItem(STORAGE_KEY, 'light')
    const { useTheme } = await import('../composables/useTheme')
    const { toggleTheme } = useTheme()
    toggleTheme()
    await nextTick()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggleTheme removes dark class from <html>', async () => {
    localStorage.setItem(STORAGE_KEY, 'dark')
    const { useTheme } = await import('../composables/useTheme')
    const { toggleTheme } = useTheme()
    toggleTheme()
    await nextTick()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('toggleTheme persists dark to localStorage', async () => {
    localStorage.setItem(STORAGE_KEY, 'light')
    const { useTheme } = await import('../composables/useTheme')
    const { toggleTheme } = useTheme()
    toggleTheme()
    await nextTick()
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark')
  })

  it('toggleTheme persists light to localStorage', async () => {
    localStorage.setItem(STORAGE_KEY, 'dark')
    const { useTheme } = await import('../composables/useTheme')
    const { toggleTheme } = useTheme()
    toggleTheme()
    await nextTick()
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light')
  })
})
