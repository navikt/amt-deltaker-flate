import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, test } from '@playwright/test'
import dayjs from 'dayjs'

const gaTilEnkeltplassKladd = async (page: Page) => {
  await page.goto('/arbeidsmarkedstiltak/deltakelse/tiltak/HOYERE_UTDANNING')
  await page.getByTestId('select_status').selectOption('KLADD')
  await page.getByTestId('select_tiltakskode').selectOption('HOYERE_UTDANNING')
  await page.getByTestId('page_kladd_enkeltplass').waitFor()
}

const sjekkUU = async (page: Page) => {
  const results = await new AxeBuilder({ page })
    .disableRules(['svg-img-alt'])
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  expect(results.violations).toEqual([])
}

test.describe('Enkeltplass påmelding', () => {
  test.beforeEach(async ({ page }) => {
    await gaTilEnkeltplassKladd(page)
  })

  test('viser enkeltplass kladd-side', async ({ page }) => {
    await expect(page.getByText('Kladden er ikke delt')).toBeVisible()
    await expect(
      page.getByRole('form', { name: 'Skjema for påmelding' })
    ).toBeVisible()
  })

  test('viser historiske vedtaksdetaljer med tastatur i historikken', async ({
    page
  }) => {
    await page
      .getByTestId('select_tiltakskode')
      .selectOption('ARBEIDSMARKEDSOPPLAERING')
    await page.getByTestId('select_status').selectOption('DELTAR')
    await expect(
      page.getByText(/Totalkostnaden er 100\s000 kroner/)
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
      historikk.getByText(/Totalkostnaden er 100\s000 kroner/)
    ).not.toBeVisible()

    await detaljer.press('Space')
    await expect(detaljer).toHaveAttribute('aria-expanded', 'false')
    await expect(historikk.getByText('Historisk opplæring')).not.toBeVisible()

    const senereGodkjenning = historikk.getByRole('button', {
      name: 'Endringen som ble godkjent',
      exact: true
    })
    await senereGodkjenning.click()
    await expect(senereGodkjenning).toHaveAttribute('aria-expanded', 'true')
  })

  test('UU - enkeltplass kladd', async ({ page }) => {
    await sjekkUU(page)
  })

  test('viser feiloppsummering ved valideringsfeil', async ({ page }) => {
    await page.getByRole('button', { name: 'Del utkast med brukeren' }).click()

    await expect(
      page.getByText('For å gå videre må du rette opp følgende:')
    ).toBeVisible()
  })

  test.skip('kan fylle ut skjema og dele utkast', async ({ page }) => {
    await page.getByLabel('Dette er innholdet').fill('Kurs i arbeidsmarkedsfag')

    const startdato = page.getByLabel('Startdato')
    const sluttdato = page.getByLabel('Sluttdato')
    await startdato.fill(dayjs().format('DD.MM.YYYY'))
    await startdato.blur()
    await sluttdato.fill(dayjs().add(1, 'month').format('DD.MM.YYYY'))
    await sluttdato.blur()

    await page
      .getByRole('combobox', { name: 'Tiltaksarrangør - underenhet' })
      .fill('as')
    await page.getByLabel('Muligheter Bergen AS -').click()

    await page
      .getByLabel('Pris og betalingsbetingelser')
      .fill('10 000 kr per semester')

    await page.getByRole('button', { name: 'Del utkast med brukeren' }).click()

    await expect(
      page.getByRole('heading', { name: 'Del utkast og gjør klar påmelding' })
    ).toBeVisible()
  })
})
