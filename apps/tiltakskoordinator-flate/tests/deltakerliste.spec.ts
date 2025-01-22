import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/123')
})

test.afterEach(async ({ page }) => {
  await page.close()
})

const sjekkUU = async (page: Page, testid: string) => {
  await page.getByTestId(testid).waitFor()
  const accessibilityScanResults = await new AxeBuilder({ page })
    .disableRules(['svg-img-alt'])
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  expect(accessibilityScanResults.violations).toEqual([])
}

test.describe('Smoketest og UU', () => {
  test('Tiltakskoordinator flate - Deltakerliste', async ({ page }) => {
    await sjekkUU(page, 'page_deltakerliste')
  })
})
