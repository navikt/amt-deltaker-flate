import '@testing-library/jest-dom/vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import {
  createPameldingEnkeltplassFormSchema,
  generateFormDefaultValues,
  PameldingEnkeltplassFormValues
} from '../../../../model/PameldingEnkeltplassFormValues'
import { getMockDeltaker } from '../../../../mocks/mockDeltakere'
import {
  SLUTTDATO_ETTER_STARTDATO_FEILMELDING,
  START_DATO_FOER_2000_FEILMELDING,
  UGYLDIG_DATO,
  UGYLDIG_DATO_FORMAT
} from '../../../../utils/varighet'
import { PameldingDatoer } from '../PameldingDatoer'
import { renderWithProviders } from './test-utils'

const renderPameldingDatoer = (
  defaultStartdato?: string,
  defaultSluttdato?: string
) => {
  return renderWithProviders(
    <PameldingDatoer
      defaultStartdato={defaultStartdato}
      defaultSluttdato={defaultSluttdato}
    />,
    {
      defaultValues: {
        startdato: defaultStartdato,
        sluttdato: defaultSluttdato
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
    it.each(['01032027', '01.03.27', '010327'])(
      'normaliserer startdato %s ved blur',
      async (value) => {
        const user = userEvent.setup()
        renderPameldingDatoer()

        const input = screen.getByLabelText('Startdato')
        await user.type(input, value)
        await user.tab()

        expect(input).toHaveValue('01.03.2027')
      }
    )

    it('lar bruker skrive inn startdato', async () => {
      const user = userEvent.setup()
      renderPameldingDatoer()

      const input = screen.getByLabelText('Startdato')
      await user.click(input)
      await user.type(input, '15.08.2025')
      await user.tab()

      expect(input).toHaveValue('15.08.2025')
    })

    it('lar bruker skrive inn sluttdato', async () => {
      const user = userEvent.setup()
      renderPameldingDatoer()

      const input = screen.getByLabelText('Sluttdato')
      await user.click(input)
      await user.type(input, '15.12.2025')
      await user.tab()

      expect(input).toHaveValue('15.12.2025')
    })
  })

  describe('validering ved blur', () => {
    const DatoerMedValidering = () => {
      const deltaker = getMockDeltaker()
      const methods = useForm<PameldingEnkeltplassFormValues>({
        defaultValues: {
          ...generateFormDefaultValues(deltaker),
          startdato: '',
          sluttdato: '',
          innhold: 'Beskrivelse av opplæringen'
        },
        resolver: zodResolver(createPameldingEnkeltplassFormSchema(deltaker))
      })

      return (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(() => undefined)}>
            <PameldingDatoer />
            <output aria-label="Startdato i skjema">
              {methods.watch('startdato')}
            </output>
            <output aria-label="Sluttdato i skjema">
              {methods.watch('sluttdato')}
            </output>
            <button type="submit">Send inn</button>
          </form>
        </FormProvider>
      )
    }

    it.each([
      ['Startdato', '01/03/2027'],
      ['Sluttdato', '01/03/2027'],
      ['Startdato', '1-3-27'],
      ['Sluttdato', '1-3-27']
    ])(
      'normaliserer %s med %s likt i feltet og skjemaverdien',
      async (label, value) => {
        const user = userEvent.setup()
        renderWithProviders(<DatoerMedValidering />)

        const input = screen.getByLabelText(label)
        const skjemaverdi = screen.getByLabelText(`${label} i skjema`)
        await user.type(input, value)
        await user.tab()

        expect(input).toHaveValue('01.03.2027')
        expect(skjemaverdi).toHaveTextContent('01.03.2027')
        expect(screen.queryByText(UGYLDIG_DATO_FORMAT)).not.toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Send inn' }))
        await waitFor(() =>
          expect(
            screen.getByLabelText(
              label === 'Startdato' ? 'Sluttdato' : 'Startdato'
            )
          ).toHaveAttribute('aria-invalid', 'true')
        )

        expect(input).toHaveValue('01.03.2027')
        expect(skjemaverdi).toHaveTextContent('01.03.2027')
        expect(screen.queryByText(UGYLDIG_DATO_FORMAT)).not.toBeInTheDocument()
      }
    )

    it.each(['Startdato', 'Sluttdato'])(
      'viser ikke feil for ugyldig %s før innsending',
      async (label) => {
        const user = userEvent.setup()
        renderWithProviders(<DatoerMedValidering />)

        const input = screen.getByLabelText(label)
        await user.type(input, '32.01.2027')
        await user.tab()

        expect(input).toHaveValue('32.01.2027')
        expect(screen.queryByText(UGYLDIG_DATO)).not.toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Send inn' }))

        expect(await screen.findByText(UGYLDIG_DATO)).toBeInTheDocument()
      }
    )

    it('revaliderer sluttdato ved endret startdato først etter innsending', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DatoerMedValidering />)

      const startdato = screen.getByLabelText('Startdato')
      await user.type(startdato, '01.03.2027')
      await user.type(screen.getByLabelText('Sluttdato'), '31.03.2027')
      await user.tab()
      await user.clear(startdato)
      await user.type(startdato, '01.04.2027')
      await user.tab()

      expect(
        screen.queryByText(SLUTTDATO_ETTER_STARTDATO_FEILMELDING)
      ).not.toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Send inn' }))
      expect(
        await screen.findByText(SLUTTDATO_ETTER_STARTDATO_FEILMELDING)
      ).toBeInTheDocument()

      await user.clear(startdato)
      await user.type(startdato, '01.03.2027')
      await user.tab()

      expect(
        screen.queryByText(SLUTTDATO_ETTER_STARTDATO_FEILMELDING)
      ).not.toBeInTheDocument()
    })

    it.each(['Startdato', 'Sluttdato'])(
      'viser feil ved blur etter innsending for ikke-eksisterende %s og beholder teksten',
      async (label) => {
        const user = userEvent.setup()
        renderWithProviders(<DatoerMedValidering />)

        await user.click(screen.getByRole('button', { name: 'Send inn' }))
        await waitFor(() =>
          expect(screen.getByLabelText('Startdato')).toHaveAttribute(
            'aria-invalid',
            'true'
          )
        )

        const input = screen.getByLabelText(label)
        await user.type(input, '32.01.2027')
        await user.tab()

        expect(await screen.findByText(UGYLDIG_DATO)).toBeInTheDocument()
        expect(input).toHaveValue('32.01.2027')

        await user.clear(input)
        await user.type(input, '01.03.2027')
        await user.tab()

        expect(screen.queryByText(UGYLDIG_DATO)).not.toBeInTheDocument()
      }
    )

    it('viser feil for startdato før år 2000 ved blur etter innsending', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DatoerMedValidering />)

      await user.click(screen.getByRole('button', { name: 'Send inn' }))
      await waitFor(() =>
        expect(screen.getByLabelText('Startdato')).toHaveAttribute(
          'aria-invalid',
          'true'
        )
      )

      await user.type(screen.getByLabelText('Startdato'), '01.01.0200')
      await user.tab()

      expect(
        await screen.findByText(START_DATO_FOER_2000_FEILMELDING)
      ).toBeInTheDocument()
    })
  })
})
