import { createI18n } from 'vue-i18n'
import en from './locales/en'
import tr from './locales/tr'

const browserLang = navigator.language.startsWith('tr') ? 'tr' : 'en'

export const i18n = createI18n({
  legacy: false,
  locale: browserLang,
  fallbackLocale: 'en',
  messages: { en, tr },
})
