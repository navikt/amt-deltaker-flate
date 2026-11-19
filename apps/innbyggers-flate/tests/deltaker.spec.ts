import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

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
  test('viser historiske vedtaksdetaljer med tastatur i historikken', async ({
    page
  }) => {
    await page
      .getByTestId('select_tiltakskode')
      .selectOption('HOYERE_UTDANNING')
    await page
      .getByRole('checkbox', { name: 'Enkeltplass', exact: true })
      .check()
    await page.getByTestId('select_deltaker_status').selectOption('DELTAR')
    await expect(
      page.getByText(/Totalkostnaden er 10\s000 kroner/)
    ).toBeVisible()

    await page
      .getByRole('button', { name: 'Se endringer', exact: true })
      .click()
    const historikk = page.getByRole('dialog', { name: 'Endringer' })
    const detaljer = historikk.getByRole('button', {
      name: 'Detaljer i vedtaket',
      exact: true
    })
    await expect(detaljer).toHaveAttribute('aria-expanded', 'false')
    await expect(historikk.getByText('Historisk opplæring')).not.toBeVisible()
    await detaljer.focus()
    await detaljer.press('Enter')

    await expect(detaljer).toHaveAttribute('aria-expanded', 'true')
    await expect(historikk.getByText('Historisk opplæring')).toBeVisible()
    await expect(historikk.getByText('Bakgrunn ved vedtak')).toBeVisible()
    await expect(
      historikk.getByText(/01\.11\.2026.*30\.06\.2027/)
    ).toBeVisible()
    await expect(
      historikk.getByText(/Totalkostnaden er 20\s000 kroner/)
    ).toBeVisible()
    await expect(
      historikk.getByText(/Totalkostnaden er 10\s000 kroner/)
    ).not.toBeVisible()

    await detaljer.press('Space')
    await expect(detaljer).toHaveAttribute('aria-expanded', 'false')
    await expect(historikk.getByText('Historisk opplæring')).not.toBeVisible()
  })

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
