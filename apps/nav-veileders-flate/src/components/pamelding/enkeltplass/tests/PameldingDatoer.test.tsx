import '@testing-library/jest-dom/vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { useFormContext } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import {
  type PameldingEnkeltplassFormValues,
  createPameldingEnkeltplassFormSchema,
  generateFormDefaultValues,
  SLUTTDATO_FOR_TIDLIG_FEILMELDING,
  STARTDATO_FOR_TIDLIG_FEILMELDING
} from '../../../../model/PameldingEnkeltplassFormValues'
import {
  getMaxVarighetDato,
  getVarighetValgFeilmelding
} from '../../../../utils/varighet'
import { PameldingDatoer } from '../PameldingDatoer'
import { createDeltaker, renderWithProviders } from './test-utils'

const senesteSluttdatoFeilmelding =
  /^Seneste tillatte sluttdato er \d{2}\.\d{2}\.\d{4}\.$/

const FormStateProbe = () => {
  const {
    setError,
    watch,
    formState: { touchedFields, dirtyFields }
  } = useFormContext<PameldingEnkeltplassFormValues>()

  return (
    <>
      <span data-testid="startdato-value">{watch('startdato')}</span>
      <span data-testid="sluttdato-value">{watch('sluttdato')}</span>
      <span data-testid="startdato-touched">
        {String(!!touchedFields.startdato)}
      </span>
      <span data-testid="startdato-dirty">
        {String(!!dirtyFields.startdato)}
      </span>
      <button
        type="button"
        onClick={() =>
          setError('startdato', {
            type: 'manual',
            message: 'Testfeil startdato'
          })
        }
      >
        Sett startdatofeil
      </button>
    </>
  )
}

const renderPameldingDatoer = (
  defaultStartdato?: string,
  defaultSluttdato?: string
) => {
  const deltaker = createDeltaker({
    navn: 'Testarrangør',
    organisasjonsnummer: '123456789'
  })

  return renderWithProviders(
    <>
      <PameldingDatoer />
      <FormStateProbe />
    </>,
    {
      deltaker,
      resolver: zodResolver(createPameldingEnkeltplassFormSchema(deltaker)),
      defaultValues: {
        ...generateFormDefaultValues(deltaker),
        startdato: defaultStartdato ?? '',
        sluttdato: defaultSluttdato ?? '',
        dagerPerUke: null
      }
    }
  )
}

describe('PameldingDatoer', () => {
  describe('layout', () => {
    it('rendrer start- og sluttdato-felt', () => {
      renderPameldingDatoer()
      expect(screen.getByLabelText('Startdato')).toBeInTheDocument()
      expect(screen.getByLabelText('Sluttdato')).toBeInTheDocument()
    })

    it('viser default startdato', () => {
      renderPameldingDatoer('01.07.2025')
      expect(screen.getByLabelText('Startdato')).toHaveValue('01.07.2025')
    })

    it('viser default sluttdato', () => {
      renderPameldingDatoer('01.07.2025', '01.12.2025')
      expect(screen.getByLabelText('Sluttdato')).toHaveValue('01.12.2025')
    })
  })

  describe('interaksjoner', () => {
    it('lar bruker skrive inn startdato', async () => {
      const user = userEvent.setup()
      const startdato = dayjs().add(1, 'day').format('DD.MM.YYYY')
      renderPameldingDatoer()

      const input = screen.getByLabelText('Startdato')
      await user.click(input)
      await user.type(input, startdato)
      await user.tab()

      expect(input).toHaveValue(startdato)
      expect(screen.getByTestId('startdato-touched')).toHaveTextContent('true')
      expect(screen.getByTestId('startdato-dirty')).toHaveTextContent('true')
    })

    it('lar bruker skrive inn sluttdato', async () => {
      const user = userEvent.setup()
      const startdato = dayjs().add(1, 'day').format('DD.MM.YYYY')
      const sluttdato = dayjs().add(2, 'day').format('DD.MM.YYYY')
      renderPameldingDatoer(startdato)

      const input = screen.getByLabelText('Sluttdato')
      await user.click(input)
      await user.type(input, sluttdato)
      await user.tab()

      expect(input).toHaveValue(sluttdato)
    })

    it('lagrer ikke startdatoer før datovelgerens nedre grense', async () => {
      const user = userEvent.setup()
      renderPameldingDatoer()

      const input = screen.getByLabelText('Startdato')
      await user.type(input, '01.01.2000')
      await user.tab()

      expect(input).toHaveValue('01.01.2000')
      expect(screen.getByTestId('startdato-value')).toHaveTextContent(
        '01.01.2000'
      )
      expect(
        screen.getByText(STARTDATO_FOR_TIDLIG_FEILMELDING)
      ).toBeInTheDocument()
    })

    it('viser ikke lenger nedre-grensefeilen når startdatoen tømmes', async () => {
      const user = userEvent.setup()
      renderPameldingDatoer()

      const input = screen.getByLabelText('Startdato')
      await user.type(input, dayjs().subtract(3, 'month').format('DD.MM.YYYY'))
      await user.tab()
      expect(
        screen.getByText(STARTDATO_FOR_TIDLIG_FEILMELDING)
      ).toBeInTheDocument()

      await user.clear(input)
      await user.tab()

      expect(input).toHaveValue('')
      await waitFor(() => {
        expect(
          screen.queryByText(STARTDATO_FOR_TIDLIG_FEILMELDING)
        ).not.toBeInTheDocument()
      })
    })

    it('lagrer gyldig startdato fra tekstfeltet', async () => {
      const user = userEvent.setup()
      const startdato = dayjs().add(1, 'day').format('DD.MM.YYYY')
      renderPameldingDatoer()

      await user.type(screen.getByLabelText('Startdato'), startdato)

      expect(screen.getByTestId('startdato-value')).toHaveTextContent(startdato)
    })

    it('viser maksvarighetsfeil for sluttdato etter øvre grense ved blur', async () => {
      const user = userEvent.setup()
      const startdato = dayjs().add(1, 'day').format('DD.MM.YYYY')
      const sluttdato = dayjs().add(3, 'year').format('DD.MM.YYYY')
      renderPameldingDatoer(startdato)

      const input = screen.getByLabelText('Sluttdato')
      await user.type(input, sluttdato)
      await user.tab()

      expect(input).toHaveValue(sluttdato)
      expect(screen.getByTestId('sluttdato-value')).toHaveTextContent(sluttdato)
      expect(screen.getByText(senesteSluttdatoFeilmelding)).toBeInTheDocument()
    })

    it('viser ikke foreldet maksvarighetsfeil etter at startdatoen utvider grensen', async () => {
      const user = userEvent.setup()
      const startdato = dayjs().add(1, 'year')
      const sluttdato = startdato.add(3, 'year')
      const nyStartdato = sluttdato.subtract(6, 'month')
      renderPameldingDatoer(startdato.format('DD.MM.YYYY'))

      const sluttdatoInput = screen.getByLabelText('Sluttdato')
      await user.type(sluttdatoInput, sluttdato.format('DD.MM.YYYY'))
      await user.tab()
      expect(screen.getByText(senesteSluttdatoFeilmelding)).toBeInTheDocument()

      const startdatoInput = screen.getByLabelText('Startdato')
      await user.clear(startdatoInput)
      await user.type(startdatoInput, nyStartdato.format('DD.MM.YYYY'))
      await user.tab()
      await user.click(sluttdatoInput)
      await user.tab()

      expect(sluttdatoInput).toHaveValue(sluttdato.format('DD.MM.YYYY'))
      await waitFor(() => {
        expect(
          screen.queryByText(senesteSluttdatoFeilmelding)
        ).not.toBeInTheDocument()
      })
    })

    it('oppdaterer maksvarighetsfeilen når startdatoen fortsatt gir ugyldig sluttdato', async () => {
      const user = userEvent.setup()
      const originalStartdato = dayjs().add(1, 'year').startOf('month')
      const sluttdato = originalStartdato.add(14, 'months')
      const nyStartdato = originalStartdato.subtract(3, 'months')
      const deltaker = createDeltaker()
      const opprinneligFeilmelding = getVarighetValgFeilmelding(
        getMaxVarighetDato(deltaker, originalStartdato.toDate())?.toDate()
      )
      const nyFeilmelding = getVarighetValgFeilmelding(
        getMaxVarighetDato(deltaker, nyStartdato.toDate())?.toDate()
      )
      renderPameldingDatoer(originalStartdato.format('DD.MM.YYYY'))

      const sluttdatoInput = screen.getByLabelText('Sluttdato')
      await user.type(sluttdatoInput, sluttdato.format('DD.MM.YYYY'))
      await user.tab()
      expect(screen.getByText(opprinneligFeilmelding)).toBeInTheDocument()

      const startdatoInput = screen.getByLabelText('Startdato')
      await user.clear(startdatoInput)
      await user.type(startdatoInput, nyStartdato.format('DD.MM.YYYY'))

      await waitFor(() => {
        expect(screen.getByText(nyFeilmelding)).toBeInTheDocument()
      })
    })

    it('viser nedre grensefeil for sluttdato ved blur når startdato mangler', async () => {
      const user = userEvent.setup()
      const sluttdato = dayjs().subtract(3, 'month').format('DD.MM.YYYY')
      renderPameldingDatoer()

      const input = screen.getByLabelText('Sluttdato')
      await user.type(input, sluttdato)
      await user.tab()

      expect(screen.getByTestId('sluttdato-value')).toHaveTextContent(sluttdato)
      expect(
        screen.getByText(SLUTTDATO_FOR_TIDLIG_FEILMELDING)
      ).toBeInTheDocument()
    })

    it('beholder ugyldig startdato for skjemavalidering ved blur', async () => {
      const user = userEvent.setup()
      renderPameldingDatoer()

      const input = screen.getByLabelText('Startdato')
      await user.type(input, 'ugyldig')
      await user.tab()

      expect(input).toHaveValue('ugyldig')
      expect(screen.getByTestId('startdato-value')).toHaveTextContent('ugyldig')
    })

    it('beholder ugyldig sluttdato og viser formatfeil ved blur', async () => {
      const user = userEvent.setup()
      renderPameldingDatoer()

      const input = screen.getByLabelText('Sluttdato')
      await user.type(input, 'ugyldig')
      await user.tab()

      expect(input).toHaveValue('ugyldig')
      expect(screen.getByTestId('sluttdato-value')).toHaveTextContent('ugyldig')
      expect(
        await screen.findByText('Ugyldig datoformat: Bruk dd.mm.åååå')
      ).toBeInTheDocument()
    })

    it('beholder feilen når startdatoen fortsatt er ugyldig ved blur', async () => {
      const user = userEvent.setup()
      renderPameldingDatoer()

      await user.click(
        screen.getByRole('button', { name: 'Sett startdatofeil' })
      )
      const input = screen.getByLabelText('Startdato')
      await user.type(input, 'ugyldig')
      await user.tab()

      expect(screen.getByText('Testfeil startdato')).toBeInTheDocument()
    })
  })
})
