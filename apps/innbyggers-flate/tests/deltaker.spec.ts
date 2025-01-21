import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/arbeidsmarkedstiltak/1')
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
  test('Innbyggers flate utkastside', async ({ page }) => {
    await expect(page).toHaveTitle(/Arbeidsmarkedstiltak/)
    await sjekkUU(page, 'heading_utkast')
  })

  test('Innbyggers flate tiltaksside - venter pa oppstart', async ({
    page
  }) => {
    await page
      .getByTestId('select_deltaker_status')
      .selectOption('VENTER_PA_OPPSTART')
    await expect(page.getByText('Status:')).toBeVisible()
    await expect(
      page.getByRole('main').getByText('Venter på oppstart')
    ).toBeVisible()
    await sjekkUU(page, 'heading_tiltak')
  })

  test('Innbyggers flate - tiltaksside - AVBRUTT_UTKAST', async ({ page }) => {
    await page
      .getByTestId('select_deltaker_status')
      .selectOption('AVBRUTT_UTKAST')
    await expect(
      page.getByRole('heading', { name: 'Avbrutt utkast' })
    ).toBeVisible()
    await sjekkUU(page, 'heading_avbrutt_tiltak')
  })

  test('Innbyggers flate - tiltaksside - IKKE_AKTUELL', async ({ page }) => {
    await page
      .getByTestId('select_deltaker_status')
      .selectOption('IKKE_AKTUELL')
    await expect(page.getByText('Status:')).toBeVisible()
    await sjekkUU(page, 'heading_tiltak')
  })

  test('Innbyggers flate - tiltaksside - FEILREGISTRERT', async ({ page }) => {
    await page
      .getByTestId('select_deltaker_status')
      .selectOption('FEILREGISTRERT')
    await expect(page.getByText('Status:')).toBeVisible()
    await sjekkUU(page, 'heading_feilregistrert_tiltak')
  })

  test('Innbyggers flate tiltaksside', async ({ page }) => {
    await page.getByText('Ja, det ser greit ut.').click()
    await page.getByTestId('godkjenn_utkast').click()
    await expect(page.getByTestId('heading_tiltak')).toBeVisible()
    await sjekkUU(page, 'heading_tiltak')
  })
})
