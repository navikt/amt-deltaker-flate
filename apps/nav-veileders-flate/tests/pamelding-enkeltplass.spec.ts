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
