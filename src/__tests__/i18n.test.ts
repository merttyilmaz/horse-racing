import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import en from '../locales/en'
import tr from '../locales/tr'

function makeI18n(locale: 'en' | 'tr') {
  return createI18n({ legacy: false, locale, fallbackLocale: 'en', messages: { en, tr } })
}

describe('i18n – English locale', () => {
  const i18n = makeI18n('en')
  const t = i18n.global.t

  it('translates header.title', () => {
    expect(t('header.title')).toBe('Horse Racing')
  })

  it('translates header.subtitle', () => {
    expect(t('header.subtitle')).toBe('6-round tournament')
  })

  it('translates header.btnGenerate', () => {
    expect(t('header.btnGenerate')).toBe('Generate')
  })

  it('translates header.btnStart', () => {
    expect(t('header.btnStart')).toBe('Start')
  })

  it('translates header.statusReady', () => {
    expect(t('header.statusReady')).toBe('Ready to Race')
  })

  it('translates header.statusAwaiting', () => {
    expect(t('header.statusAwaiting')).toBe('Awaiting Program')
  })

  it('interpolates header.statusRound with round number', () => {
    expect(t('header.statusRound', { n: 3 })).toBe('Round 3 of 6')
  })

  it('translates horses.title', () => {
    expect(t('horses.title')).toBe('Horses')
  })

  it('translates track.title', () => {
    expect(t('track.title')).toBe('Track')
  })

  it('interpolates track.roundComplete', () => {
    expect(t('track.roundComplete', { n: 2 })).toBe('Round 2 complete')
  })

  it('translates track.allComplete', () => {
    expect(t('track.allComplete')).toBe('All rounds complete!')
  })

  it('translates results.title', () => {
    expect(t('results.title')).toBe('Results')
  })
})

describe('i18n – Turkish locale', () => {
  const i18n = makeI18n('tr')
  const t = i18n.global.t

  it('translates header.title', () => {
    expect(t('header.title')).toBe('At Yarışı')
  })

  it('translates header.subtitle', () => {
    expect(t('header.subtitle')).toBe('6 turluk turnuva')
  })

  it('translates header.btnGenerate', () => {
    expect(t('header.btnGenerate')).toBe('Oluştur')
  })

  it('translates header.btnStart', () => {
    expect(t('header.btnStart')).toBe('Başlat')
  })

  it('translates header.statusReady', () => {
    expect(t('header.statusReady')).toBe('Yarışa Hazır')
  })

  it('interpolates header.statusRound with round number', () => {
    expect(t('header.statusRound', { n: 3 })).toBe('Tur 3 / 6')
  })

  it('translates horses.title', () => {
    expect(t('horses.title')).toBe('Atlar')
  })

  it('translates track.title', () => {
    expect(t('track.title')).toBe('Pist')
  })

  it('interpolates track.roundComplete', () => {
    expect(t('track.roundComplete', { n: 2 })).toBe('Tur 2 tamamlandı')
  })

  it('translates track.allComplete', () => {
    expect(t('track.allComplete')).toBe('Tüm turlar tamamlandı!')
  })

  it('translates results.title', () => {
    expect(t('results.title')).toBe('Sonuçlar')
  })
})

describe('i18n – locale switching', () => {
  it('switches all strings from EN to TR at runtime', () => {
    const i18n = makeI18n('en')
    expect(i18n.global.t('header.title')).toBe('Horse Racing')
    i18n.global.locale.value = 'tr'
    expect(i18n.global.t('header.title')).toBe('At Yarışı')
  })

  it('switches all strings from TR to EN at runtime', () => {
    const i18n = makeI18n('tr')
    expect(i18n.global.t('header.title')).toBe('At Yarışı')
    i18n.global.locale.value = 'en'
    expect(i18n.global.t('header.title')).toBe('Horse Racing')
  })

  it('interpolation still works after switching locale', () => {
    const i18n = makeI18n('en')
    i18n.global.locale.value = 'tr'
    expect(i18n.global.t('header.statusRound', { n: 5 })).toBe('Tur 5 / 6')
  })
})

describe('i18n – browser language detection', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('sets Turkish locale when browser language is tr-TR', async () => {
    vi.stubGlobal('navigator', { language: 'tr-TR' })
    const { i18n } = await import('../i18n')
    expect(i18n.global.locale.value).toBe('tr')
    vi.unstubAllGlobals()
  })

  it('sets Turkish locale when browser language is tr', async () => {
    vi.stubGlobal('navigator', { language: 'tr' })
    const { i18n } = await import('../i18n')
    expect(i18n.global.locale.value).toBe('tr')
    vi.unstubAllGlobals()
  })

  it('defaults to English for en-US', async () => {
    vi.stubGlobal('navigator', { language: 'en-US' })
    const { i18n } = await import('../i18n')
    expect(i18n.global.locale.value).toBe('en')
    vi.unstubAllGlobals()
  })

  it('defaults to English for any non-Turkish language', async () => {
    vi.stubGlobal('navigator', { language: 'de-DE' })
    const { i18n } = await import('../i18n')
    expect(i18n.global.locale.value).toBe('en')
    vi.unstubAllGlobals()
  })
})
