import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto(
    '/arbeidsmarkedstiltak/deltakelse/15462eb2-9fb0-4e37-b749-fe71a9af8d48'
  )
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
  test('Nav veileders flate - kladd', async ({ page }) => {
    await page.getByTestId('select_status').selectOption('KLADD')
    await expect(page).toHaveTitle(/Deltaker/)
    await sjekkUU(page, 'page_kladd')
  })

  test('Nav veileders flate - utkast', async ({ page }) => {
    await page.getByTestId('select_status').selectOption('UTKAST_TIL_PAMELDING')
    await expect(
      page.getByRole('heading', { name: 'Utkast til påmelding' })
    ).toBeVisible()
    await sjekkUU(page, 'page_utkast')
  })

  test('Nav veileders flate - tiltaksiden - venter pa oppstart', async ({
    page
  }) => {
    await page.getByTestId('select_status').selectOption('VENTER_PA_OPPSTART')
    await expect(
      page.locator('span').filter({ hasText: 'Venter på oppstart' })
    ).toBeVisible()
    await sjekkUU(page, 'page_tiltak')
  })

  test('Nav veileders flate - tiltaksiden - feilregistrert', async ({
    page
  }) => {
    await page.getByTestId('select_status').selectOption('FEILREGISTRERT')
    await expect(
      page.getByTestId('page_tiltak').getByText('Feilregistrert')
    ).toBeVisible()
    await expect(page.getByText('Deltakelsen kan ikke endres')).toBeVisible()
    await sjekkUU(page, 'page_tiltak')
  })

  test('Nav veileders flate - endre oppstartsdato', async ({ page }) => {
    await page.getByTestId('select_status').selectOption('DELTAR')
    await page.getByTestId('endre_deltakelse_knapp').click()
    await page.getByRole('button', { name: 'Endre oppstartsdato' }).click()
    await page.getByLabel('Ny oppstartsdato').fill('10.06.2020')
    await page.getByText('Datoen kan ikke velges fordi')
  })
})
