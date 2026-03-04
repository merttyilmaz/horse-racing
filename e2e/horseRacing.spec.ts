import { test, expect } from '@playwright/test'

test.describe('Horse Racing App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads and shows 20 horses in the list', async ({ page }) => {
    await expect(page.locator('[data-testid="horse-item"]')).toHaveCount(20)
  })

  test('shows Generate and Start buttons in the header', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Generate/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Start/i })).toBeVisible()
  })

  test('Start button is disabled before generating a program', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Start/i })).toBeDisabled()
  })

  test('Start button becomes enabled after generating', async ({ page }) => {
    await page.getByRole('button', { name: /Generate/i }).click()
    await expect(page.getByRole('button', { name: /Start/i })).toBeEnabled()
  })

  test('clicking Start shows Pause button', async ({ page }) => {
    await page.getByRole('button', { name: /Generate/i }).click()
    await page.getByRole('button', { name: /Start/i }).click()
    await expect(page.getByRole('button', { name: /Pause/i })).toBeVisible()
  })

  test('Pause / Resume cycle works', async ({ page }) => {
    await page.getByRole('button', { name: /Generate/i }).click()
    await page.getByRole('button', { name: /Start/i }).click()
    await page.getByRole('button', { name: /Pause/i }).click()
    await expect(page.getByRole('button', { name: /Resume/i })).toBeVisible()
    await page.getByRole('button', { name: /Resume/i }).click()
    await expect(page.getByRole('button', { name: /Pause/i })).toBeVisible()
  })

  test('Generate button is disabled while racing', async ({ page }) => {
    await page.getByRole('button', { name: /Generate/i }).click()
    await page.getByRole('button', { name: /Start/i }).click()
    await expect(page.getByRole('button', { name: /Generate/i })).toBeDisabled()
  })

  test('race track shows Round 1 label after starting', async ({ page }) => {
    await page.getByRole('button', { name: /Generate/i }).click()
    await page.getByRole('button', { name: /Start/i }).click()
    await expect(page.getByText(/Round 1\/6/)).toBeVisible()
  })

  test('results panel shows first round result after it completes', async ({ page }) => {
    await page.getByRole('button', { name: /Generate/i }).click()
    await page.getByRole('button', { name: /Start/i }).click()
    await expect(
      page.locator('[data-testid="results-panel"]').getByText('1/6')
    ).toBeVisible({ timeout: 15000 })
  })

  test('all 6 results appear after full race and New Race button shows', async ({ page }) => {
    await page.getByRole('button', { name: /Generate/i }).click()
    await page.getByRole('button', { name: /Start/i }).click()
    await expect(
      page.locator('[data-testid="results-panel"]').getByText('6/6')
    ).toBeVisible({ timeout: 60000 })
    await expect(page.getByRole('button', { name: /New Race/i })).toBeVisible({ timeout: 5000 })
  })

  test('New Race button resets the game', async ({ page }) => {
    await page.getByRole('button', { name: /Generate/i }).click()
    await page.getByRole('button', { name: /Start/i }).click()
    await expect(
      page.locator('[data-testid="results-panel"]').getByText('6/6')
    ).toBeVisible({ timeout: 60000 })
    await page.getByRole('button', { name: /New Race/i }).click()
    await expect(page.getByRole('button', { name: /Generate/i })).toBeEnabled()
    await expect(page.getByRole('button', { name: /Start/i })).toBeDisabled()
  })

  test('language switcher toggles UI to Turkish', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Generate/i })).toBeVisible()
    await page.getByRole('button', { name: 'TR' }).click()
    await expect(page.getByRole('button', { name: /Oluştur/i })).toBeVisible()
    await expect(page.getByRole('button', { name: 'EN' })).toBeVisible()
  })

  test('language switcher toggles back to English', async ({ page }) => {
    await page.getByRole('button', { name: 'TR' }).click()
    await page.getByRole('button', { name: 'EN' }).click()
    await expect(page.getByRole('button', { name: /Generate/i })).toBeVisible()
  })

  test('theme toggle switches between dark and light mode', async ({ page }) => {
    const html = page.locator('html')
    const initialDark = await html.evaluate((el) => el.classList.contains('dark'))
    await page.locator('header button[title]').last().click()
    const afterDark = await html.evaluate((el) => el.classList.contains('dark'))
    expect(afterDark).toBe(!initialDark)
  })
})
