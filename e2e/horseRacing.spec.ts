import { test, expect } from '@playwright/test'

test.describe('Horse Racing App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads and shows 20 horses in the list', async ({ page }) => {
    await expect(page.locator('table tbody tr')).toHaveCount(20)
  })

  test('shows Generate Program and Start buttons in the header', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Generate Program/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Start \/ Pause/i })).toBeVisible()
  })

  test('Start button is disabled before generating a program', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Start \/ Pause/i })).toBeDisabled()
  })

  test('Start button becomes enabled after generating', async ({ page }) => {
    await page.getByRole('button', { name: /Generate Program/i }).click()
    await expect(page.getByRole('button', { name: /Start \/ Pause/i })).toBeEnabled()
  })

  test('clicking Start shows Pause button', async ({ page }) => {
    await page.getByRole('button', { name: /Generate Program/i }).click()
    await page.getByRole('button', { name: /Start \/ Pause/i }).click()
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible()
  })

  test('Pause / Resume cycle works', async ({ page }) => {
    await page.getByRole('button', { name: /Generate Program/i }).click()
    await page.getByRole('button', { name: /Start \/ Pause/i }).click()
    await page.getByRole('button', { name: 'Pause' }).click()
    await expect(page.getByRole('button', { name: /Resume/i })).toBeVisible()
    await page.getByRole('button', { name: /Resume/i }).click()
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible()
  })

  test('Generate Program button is disabled while racing', async ({ page }) => {
    await page.getByRole('button', { name: /Generate Program/i }).click()
    await page.getByRole('button', { name: /Start \/ Pause/i }).click()
    await expect(page.getByRole('button', { name: /Generate Program/i })).toBeDisabled()
  })

  test('race track shows Round 1 label after starting', async ({ page }) => {
    await page.getByRole('button', { name: /Generate Program/i }).click()
    await page.getByRole('button', { name: /Start \/ Pause/i }).click()
    await expect(page.locator('text=/Round 1/')).toBeVisible()
  })

  test('results panel shows first round result after it completes', async ({ page }) => {
    await page.getByRole('button', { name: /Generate Program/i }).click()
    await page.getByRole('button', { name: /Start \/ Pause/i }).click()
    await expect(page.locator('text=/1st Lap/')).toBeVisible({ timeout: 15000 })
  })

  test('all 6 results appear after full race and New Race button shows', async ({ page }) => {
    await page.getByRole('button', { name: /Generate Program/i }).click()
    await page.getByRole('button', { name: /Start \/ Pause/i }).click()
    await expect(
      page.locator('[data-testid="results-panel"]').getByText(/6th Lap/)
    ).toBeVisible({ timeout: 60000 })
    await expect(page.getByRole('button', { name: /New Race/i })).toBeVisible({ timeout: 5000 })
  })

  test('New Race button resets the game', async ({ page }) => {
    await page.getByRole('button', { name: /Generate Program/i }).click()
    await page.getByRole('button', { name: /Start \/ Pause/i }).click()
    await expect(
      page.locator('[data-testid="results-panel"]').getByText(/6th Lap/)
    ).toBeVisible({ timeout: 60000 })
    await page.getByRole('button', { name: /New Race/i }).click()
    await expect(page.getByRole('button', { name: /Generate Program/i })).toBeEnabled()
    await expect(page.getByRole('button', { name: /Start \/ Pause/i })).toBeDisabled()
  })
})
