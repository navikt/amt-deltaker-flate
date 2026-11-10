import '@testing-library/jest-dom/vitest'
import { Button } from '@navikt/ds-react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type ComponentProps, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { type DeltakerResponse } from '../../api/data/deltaker'
import { useSluttdato } from '../../utils/use-sluttdato'
import {
  DATO_UTENFOR_TILTAKGJENNOMFORING,
  getSisteGyldigeSluttDato,
  UGYLDIG_DATO,
  UGYLDIG_DATO_FORMAT,
  VARGIHET_VALG_FEILMELDING,
  VarighetValg
} from '../../utils/varighet'
import { SimpleDatePicker } from './SimpleDatePicker'

const renderDatePicker = (
  props: Partial<ComponentProps<typeof SimpleDatePicker>> = {}
) => {
  const onChange = vi.fn()
  const onValidate = vi.fn()
  const result = render(
    <SimpleDatePicker
      label="Dato"
      error={null}
      defaultMonth={new Date(2027, 6, 1)}
      onChange={onChange}
      onValidate={onValidate}
      {...props}
    />
  )

  return {
    ...result,
    user: userEvent.setup(),
    input: screen.getByRole('textbox', { name: props.label ?? 'Dato' }),
    onChange,
    onValidate
  }
}

const DatePickerMedValidering = ({ defaultDate }: { defaultDate?: Date }) => {
  const [error, setError] = useState<string | null>(null)

  return (
    <SimpleDatePicker
      label="Dato"
      error={error}
      defaultMonth={new Date(2027, 6, 1)}
      defaultDate={defaultDate}
      onChange={() => undefined}
      onValidate={(validation, _date, errorMessage) => {
        if (validation.isEmpty) {
          setError('Du må velge en dato')
        } else if (validation.isInvalid) {
          setError(errorMessage ?? UGYLDIG_DATO_FORMAT)
        } else {
          setError(null)
        }
      }}
    />
  )
}

describe('SimpleDatePicker', () => {
  describe('kalender', () => {
    it('åpner defaultMonth uten å endre eller validere verdien', async () => {
      const { user, onChange, onValidate } = renderDatePicker()

      await user.click(screen.getByRole('button', { name: 'Åpne datovelger' }))

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('juli 2027')).toBeInTheDocument()
      expect(onChange).not.toHaveBeenCalled()
      expect(onValidate).not.toHaveBeenCalled()
    })

    it('viser måneden og markeringen til defaultDate foran defaultMonth', async () => {
      const { user } = renderDatePicker({ defaultDate: new Date(2027, 7, 15) })

      await user.click(screen.getByRole('button', { name: 'Åpne datovelger' }))

      expect(screen.getByText('august 2027')).toBeInTheDocument()
      expect(screen.getByRole('button', { pressed: true })).toHaveTextContent(
        '15'
      )
    })

    it('sender valgt dato og validerer straks ved kalenderklikk', async () => {
      const { user, input, onChange, onValidate } = renderDatePicker()

      await user.click(screen.getByRole('button', { name: 'Åpne datovelger' }))
      await user.click(screen.getByRole('button', { name: 'torsdag 15' }))

      expect(input).toHaveValue('15.07.2027')
      expect(onChange).toHaveBeenLastCalledWith(new Date(2027, 6, 15))
      expect(onValidate.mock.lastCall?.[0]).toMatchObject({
        isValidDate: true
      })
      expect(onValidate.mock.lastCall?.[0].isEmpty).toBeFalsy()
      expect(onValidate.mock.lastCall?.[1]).toEqual(new Date(2027, 6, 15))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('tømmer kalendervalget straks og validerer tom verdi ved input-blur', async () => {
      const { user, input, onChange, onValidate } = renderDatePicker({
        defaultDate: new Date(2027, 6, 15)
      })

      await user.click(screen.getByRole('button', { name: 'Åpne datovelger' }))
      await user.click(screen.getByRole('button', { pressed: true }))

      expect(input).toHaveValue('')
      expect(onChange).toHaveBeenLastCalledWith(undefined)
      expect(onValidate).not.toHaveBeenCalled()

      await user.keyboard('{Escape}')
      await user.click(input)
      await user.tab()

      expect(onValidate.mock.lastCall?.[0]).toMatchObject({
        isEmpty: true,
        isValidDate: false
      })
      expect(onValidate.mock.lastCall?.[1]).toBeUndefined()
    })

    it('navigerer mellom måneder uten å endre eller validere datoen', async () => {
      const { user, input, onChange, onValidate } = renderDatePicker()

      await user.click(screen.getByRole('button', { name: 'Åpne datovelger' }))
      await user.click(
        screen.getByRole('button', { name: 'Gå til neste måned' })
      )
      expect(screen.getByText('august 2027')).toBeInTheDocument()

      await user.click(
        screen.getByRole('button', { name: 'Gå til forrige måned' })
      )
      expect(screen.getByText('juli 2027')).toBeInTheDocument()
      expect(input).toHaveValue('')
      expect(onChange).not.toHaveBeenCalled()
      expect(onValidate).not.toHaveBeenCalled()
    })

    it.each(['15.08.2027', '15082027', '15/08/2027'])(
      'viser riktig måned og valgt dag etter tastaturinput %s',
      async (value) => {
        const { user, input } = renderDatePicker({
          defaultDate: new Date(2027, 6, 1)
        })

        await user.clear(input)
        await user.type(input, value)
        await user.tab()
        await user.click(
          screen.getByRole('button', { name: 'Åpne datovelger' })
        )

        expect(screen.getByText('august 2027')).toBeInTheDocument()
        expect(screen.getByRole('button', { pressed: true })).toHaveTextContent(
          '15'
        )
      }
    )

    it('hindrer valg av datoer utenfor fromDate og toDate', async () => {
      const { user, input, onChange, onValidate } = renderDatePicker({
        fromDate: new Date(2027, 6, 10),
        toDate: new Date(2027, 6, 20)
      })

      await user.click(screen.getByRole('button', { name: 'Åpne datovelger' }))
      const forTidlig = screen.getByRole('button', { name: 'fredag 9' })
      const forSent = screen.getByRole('button', { name: 'onsdag 21' })
      expect(forTidlig).toBeDisabled()
      expect(forSent).toBeDisabled()

      await user.click(forTidlig)
      await user.click(forSent)

      expect(input).toHaveValue('')
      expect(onChange).not.toHaveBeenCalled()
      expect(onValidate).not.toHaveBeenCalled()
    })

    it.each([
      { name: 'lørdag 10', day: 10 },
      { name: 'tirsdag 20', day: 20 }
    ])('tillater valg på datogrensen $name', async ({ name, day }) => {
      const { user, input, onChange, onValidate } = renderDatePicker({
        fromDate: new Date(2027, 6, 10),
        toDate: new Date(2027, 6, 20)
      })

      await user.click(screen.getByRole('button', { name: 'Åpne datovelger' }))
      await user.click(screen.getByRole('button', { name }))

      expect(input).toHaveValue(`${day}.07.2027`)
      expect(onChange).toHaveBeenLastCalledWith(new Date(2027, 6, day))
      expect(onValidate.mock.lastCall?.[0]).toMatchObject({ isValidDate: true })
    })

    it('sender valgt dato til foreldervalideringen selv om toDate mangler', async () => {
      const { user, onValidate } = renderDatePicker({
        defaultMonth: new Date(2099, 6, 1)
      })

      await user.click(screen.getByRole('button', { name: 'Åpne datovelger' }))
      await user.click(screen.getByRole('button', { name: 'onsdag 15' }))

      expect(onValidate.mock.lastCall?.[0]).toMatchObject({ isValidDate: true })
      expect(onValidate.mock.lastCall?.[1]).toEqual(new Date(2099, 6, 15))
    })

    it('kan åpnes med tastaturet og lukkes med Escape uten datovalg', async () => {
      const { user, onChange } = renderDatePicker()

      await user.tab()
      await user.tab()
      await user.keyboard('{Enter}')
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      onChange.mockClear()

      await user.keyboard('{Escape}')

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('komponentprops', () => {
    it('beholder tilgjengelig navn når label er skjult', () => {
      const { input } = renderDatePicker({
        label: 'Forventet sluttdato',
        hideLabel: true
      })

      expect(input).toHaveAccessibleName('Forventet sluttdato')
    })

    it('viser feilmeldingen fra forelderen og markerer input som ugyldig', () => {
      const { input } = renderDatePicker({
        error: VARGIHET_VALG_FEILMELDING
      })

      expect(screen.getByText(VARGIHET_VALG_FEILMELDING)).toBeVisible()
      expect(input).toBeInvalid()
    })

    it('oppdaterer feilmeldingen når error-propen endres', () => {
      const { input, rerender, onChange, onValidate } = renderDatePicker({
        error: UGYLDIG_DATO
      })

      rerender(
        <SimpleDatePicker
          label="Dato"
          error={null}
          onChange={onChange}
          onValidate={onValidate}
        />
      )

      expect(screen.queryByText(UGYLDIG_DATO)).not.toBeInTheDocument()
      expect(input).not.toBeInvalid()
      expect(onChange).not.toHaveBeenCalled()
      expect(onValidate).not.toHaveBeenCalled()
    })

    it('videresender className til datofeltet', () => {
      const { container } = renderDatePicker({ className: 'sluttdato-felt' })

      expect(container.querySelector('.sluttdato-felt')).toContainElement(
        screen.getByRole('textbox', { name: 'Dato' })
      )
    })

    it('deaktiverer både input og kalenderknapp uten callbacker', async () => {
      const { user, input, onChange, onValidate } = renderDatePicker({
        disabled: true,
        defaultDate: new Date(2027, 6, 15)
      })
      const calendarButton = screen.getByRole('button', {
        name: 'Åpne datovelger'
      })

      expect(input).toBeDisabled()
      expect(calendarButton).toBeDisabled()
      await user.type(input, '28.07.2027')
      await user.click(calendarButton)

      expect(input).toHaveValue('15.07.2027')
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(onChange).not.toHaveBeenCalled()
      expect(onValidate).not.toHaveBeenCalled()
    })
  })

  describe('retting av synlige feil', () => {
    it.each([
      { value: '32.01.2027', message: UGYLDIG_DATO },
      { value: 'ukjent', message: UGYLDIG_DATO_FORMAT }
    ])(
      'fjerner feilen for $value umiddelbart ved gyldig kalendervalg',
      async ({ value, message }) => {
        const user = userEvent.setup()
        render(<DatePickerMedValidering />)
        const input = screen.getByRole('textbox', { name: 'Dato' })

        await user.type(input, value)
        expect(screen.queryByText(message)).not.toBeInTheDocument()
        await user.tab()
        expect(screen.getByText(message)).toBeInTheDocument()
        expect(input).toHaveAttribute('aria-invalid', 'true')

        await user.click(
          screen.getByRole('button', { name: 'Åpne datovelger' })
        )
        await user.click(screen.getByRole('button', { name: 'torsdag 15' }))

        expect(input).toHaveValue('15.07.2027')
        expect(input).not.toBeInvalid()
        expect(screen.queryByText(message)).not.toBeInTheDocument()
      }
    )

    it('fjerner påkrevd-feil ved gyldig kalendervalg', async () => {
      const user = userEvent.setup()
      render(<DatePickerMedValidering defaultDate={new Date(2027, 6, 15)} />)
      const input = screen.getByRole('textbox', { name: 'Dato' })

      await user.clear(input)
      await user.tab()
      expect(screen.getByText('Du må velge en dato')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Åpne datovelger' }))
      await user.click(screen.getByRole('button', { name: 'torsdag 15' }))

      expect(input).toHaveValue('15.07.2027')
      expect(screen.queryByText('Du må velge en dato')).not.toBeInTheDocument()
    })

    it('fjerner feilen straks ved gyldig tastaturretting', async () => {
      const user = userEvent.setup()
      render(<DatePickerMedValidering />)
      const input = screen.getByRole('textbox', { name: 'Dato' })

      await user.type(input, '31.02.2027')
      await user.tab()
      expect(screen.getByText(UGYLDIG_DATO)).toBeInTheDocument()

      await user.clear(input)
      await user.type(input, '28.02.2027')
      expect(screen.queryByText(UGYLDIG_DATO)).not.toBeInTheDocument()
      await user.tab()

      expect(screen.queryByText(UGYLDIG_DATO)).not.toBeInTheDocument()
      expect(input).toHaveValue('28.02.2027')
    })
  })

  describe('standardverdier', () => {
    it('starter med tomt felt og tilgjengelig label', () => {
      const { input, onChange, onValidate } = renderDatePicker()

      expect(input).toHaveValue('')
      expect(onChange).not.toHaveBeenCalled()
      expect(onValidate).not.toHaveBeenCalled()
    })

    it('viser defaultDate uten å sende endring eller validering', () => {
      const { input, onChange, onValidate } = renderDatePicker({
        defaultDate: new Date(2027, 6, 15)
      })

      expect(input).toHaveValue('15.07.2027')
      expect(onChange).not.toHaveBeenCalled()
      expect(onValidate).not.toHaveBeenCalled()
    })
  })

  describe('datoformater og datogrenser', () => {
    it.each([
      '15.7.2027',
      '15.07.27',
      '15072027',
      '150727',
      '15/07/2027',
      '15-07-2027'
    ])('sender riktig dato for %s ved blur', async (value) => {
      const { user, input, onChange, onValidate } = renderDatePicker()

      await user.type(input, value)
      await user.tab()

      expect(onChange).toHaveBeenLastCalledWith(new Date(2027, 6, 15))
      expect(onValidate.mock.lastCall?.[0]).toMatchObject({
        isValidDate: true,
        isBefore: false,
        isAfter: false
      })
      expect(onValidate.mock.lastCall?.[1]).toEqual(new Date(2027, 6, 15))
    })

    it.each(['15072027', '15/07/2027', '15-07-2027'])(
      'normaliserer Aksel-formatet %s ved blur',
      async (value) => {
        const { user, input } = renderDatePicker()

        await user.type(input, value)
        await user.tab()

        expect(input).toHaveValue('15.07.2027')
      }
    )

    it('lar brukeren lime inn en dato', async () => {
      const { user, input, onChange, onValidate } = renderDatePicker()

      await user.click(input)
      await user.paste('15.07.2027')
      expect(onValidate).toHaveBeenLastCalledWith(
        expect.objectContaining({ isValidDate: true }),
        new Date(2027, 6, 15)
      )
      await user.tab()

      expect(input).toHaveValue('15.07.2027')
      expect(onChange).toHaveBeenLastCalledWith(new Date(2027, 6, 15))
    })

    it('godtar skuddårsdag', async () => {
      const { user, input, onChange, onValidate } = renderDatePicker()

      await user.type(input, '29.02.2028')
      await user.tab()

      expect(onChange).toHaveBeenLastCalledWith(new Date(2028, 1, 29))
      expect(onValidate.mock.lastCall?.[0]).toMatchObject({ isValidDate: true })
    })

    it.each([
      { value: '09.07.2027', day: 9, isBefore: true, isAfter: false },
      { value: '10.07.2027', day: 10, isBefore: false, isAfter: false },
      { value: '20.07.2027', day: 20, isBefore: false, isAfter: false },
      { value: '21.07.2027', day: 21, isBefore: false, isAfter: true }
    ])(
      'sender datoen til validering, men bare gyldig dato til onChange for $value',
      async ({ value, day, isBefore, isAfter }) => {
        const { user, input, onChange, onValidate } = renderDatePicker({
          fromDate: new Date(2027, 6, 10),
          toDate: new Date(2027, 6, 20)
        })

        await user.type(input, value)
        if (isBefore || isAfter) {
          expect(onValidate).not.toHaveBeenCalled()
        }
        await user.tab()

        const expectedDate =
          isBefore || isAfter ? undefined : new Date(2027, 6, day)
        expect(onChange).toHaveBeenLastCalledWith(expectedDate)
        expect(onValidate.mock.lastCall?.[0]).toMatchObject({
          isValidDate: !isBefore && !isAfter,
          isBefore,
          isAfter
        })
        expect(onValidate.mock.lastCall?.[1]).toEqual(new Date(2027, 6, day))
      }
    )

    it.each([
      { value: '31.12.1999', isBefore: true },
      { value: '01.01.2000', isBefore: false }
    ])(
      'bruker år 2000 som standardgrense for $value',
      async ({ value, isBefore }) => {
        const { user, input, onValidate } = renderDatePicker()

        await user.type(input, value)
        await user.tab()

        expect(onValidate.mock.lastCall?.[0]).toMatchObject({ isBefore })
      }
    )

    it('bruker eksplisitt fromDate i stedet for standardgrensen', async () => {
      const { user, input, onValidate } = renderDatePicker({
        fromDate: new Date(1990, 0, 1)
      })

      await user.type(input, '15.07.1995')
      await user.tab()

      expect(onValidate.mock.lastCall?.[0]).toMatchObject({ isBefore: false })
    })
  })

  describe('tastatur og blur', () => {
    it('sender oppdatert dato og gyldig validering allerede under skriving', async () => {
      const { user, input, onChange, onValidate } = renderDatePicker()

      await user.type(input, '15.07.2027')

      expect(onChange).toHaveBeenLastCalledWith(new Date(2027, 6, 15))
      expect(onValidate).toHaveBeenLastCalledWith(
        expect.objectContaining({ isValidDate: true, isInvalid: false }),
        new Date(2027, 6, 15)
      )

      await user.tab()

      expect(onValidate.mock.lastCall?.[0]).toMatchObject({
        isValidDate: true,
        isBefore: false,
        isAfter: false
      })
      expect(onValidate.mock.lastCall?.[1]).toEqual(new Date(2027, 6, 15))
    })

    it('tømmer verdien straks og validerer tomt felt ved blur', async () => {
      const { user, input, onChange, onValidate } = renderDatePicker({
        defaultDate: new Date(2027, 6, 15)
      })

      await user.clear(input)
      expect(onChange).toHaveBeenLastCalledWith(undefined)
      expect(onValidate).not.toHaveBeenCalled()
      await user.tab()

      expect(onValidate.mock.lastCall?.[0]).toMatchObject({ isEmpty: true })
      expect(onChange).toHaveBeenLastCalledWith(undefined)
      expect(input).toHaveValue('')
    })

    it.each([
      { value: '', validation: { isEmpty: true } },
      { value: 'ukjent', validation: { isInvalid: true } },
      { value: '2027-07-15', validation: { isInvalid: true } },
      { value: '1507202', validation: { isInvalid: true } },
      {
        value: '31.12.1999',
        validation: { isBefore: true },
        validationDate: new Date(1999, 11, 31)
      },
      {
        value: '01.01.2029',
        validation: { isAfter: true },
        validationDate: new Date(2029, 0, 1)
      }
    ])(
      'sender validering for $value uten å gjenbruke gammel dato',
      async ({ value, validation, validationDate }) => {
        const { user, input, onChange, onValidate } = renderDatePicker({
          defaultDate: new Date(2027, 6, 15),
          toDate: new Date(2028, 11, 31)
        })

        await user.clear(input)
        if (value) await user.type(input, value)
        await user.tab()

        expect(onChange).toHaveBeenLastCalledWith(undefined)
        expect(onValidate).toHaveBeenLastCalledWith(
          expect.objectContaining({ ...validation, isValidDate: false }),
          validationDate
        )
      }
    )

    it.each([
      '32.2.26',
      '32.01.2027',
      '31.02.2027',
      '29.02.2026',
      '29.02.2027',
      '00.01.2027',
      '01.13.2027'
    ])(
      'skiller ugyldig kalenderdato %s fra ukjent format ved blur',
      async (value) => {
        const { user, input, onChange, onValidate } = renderDatePicker()

        await user.type(input, value)
        expect(
          onValidate.mock.calls.map(([validation]) => validation.isInvalid)
        ).not.toContain(true)
        await user.tab()

        expect(input).toHaveValue(value)
        expect(onChange).toHaveBeenLastCalledWith(undefined)
        expect(onValidate.mock.lastCall?.[0]).toMatchObject({ isInvalid: true })
        expect(onValidate.mock.lastCall?.[1]).toBeUndefined()
        expect(onValidate.mock.lastCall?.[2]).toBe(UGYLDIG_DATO)
      }
    )

    it.each(['ukjent', '15_07_2027', '15.07.', '2027-07-15'])(
      'avviser ukjent eller ufullstendig format %s ved blur',
      async (value) => {
        const { user, input, onChange, onValidate } = renderDatePicker()

        await user.type(input, value)
        expect(onValidate).not.toHaveBeenCalled()
        await user.tab()

        expect(input).toHaveValue(value)
        expect(onChange).toHaveBeenLastCalledWith(undefined)
        expect(onValidate.mock.lastCall?.[0]).toMatchObject({ isInvalid: true })
        expect(onValidate.mock.lastCall?.[1]).toBeUndefined()
        expect(onValidate.mock.lastCall?.[2]).toBeUndefined()
      }
    )
  })

  describe('sluttdatovalidering ved forlengelse', () => {
    it.each([
      { value: '02.01.2028', message: VARGIHET_VALG_FEILMELDING },
      { value: '02.01.2030', message: DATO_UTENFOR_TILTAKGJENNOMFORING }
    ])(
      'beholder riktig feil etter blur og Lagre for $value',
      async ({ value, message }) => {
        const user = userEvent.setup()
        const defaultDate = new Date(2027, 5, 1)
        const deltaker = {
          startdato: new Date(2027, 0, 1),
          sluttdato: defaultDate,
          maxVarighet: 365 * 24 * 60 * 60 * 1000,
          deltakerliste: { sluttdato: new Date(2030, 0, 1) }
        } as DeltakerResponse
        const DatePickerMedSluttdato = () => {
          const sluttdato = useSluttdato({
            deltaker,
            valgtVarighet: VarighetValg.ANNET,
            defaultAnnetDato: defaultDate,
            erForleng: true
          })

          return (
            <>
              <SimpleDatePicker
                label="Sluttdato"
                error={sluttdato.annetError}
                fromDate={defaultDate}
                toDate={getSisteGyldigeSluttDato(deltaker)}
                defaultDate={defaultDate}
                onChange={sluttdato.handleChange}
                onValidate={sluttdato.validerDato}
              />
              <Button onClick={() => sluttdato.valider()}>Lagre</Button>
            </>
          )
        }
        render(<DatePickerMedSluttdato />)
        const input = screen.getByRole('textbox', { name: 'Sluttdato' })

        await user.clear(input)
        await user.type(input, value)
        expect(screen.queryByText(message)).not.toBeInTheDocument()

        await user.tab()

        expect(screen.getByText(message)).toBeVisible()
        expect(input).toBeInvalid()

        await user.click(screen.getByRole('button', { name: 'Lagre' }))

        expect(screen.getByText(message)).toBeVisible()
        expect(input).toHaveValue(value)

        await user.clear(input)
        await user.type(input, '20.06.2027')

        expect(screen.queryByText(message)).not.toBeInTheDocument()
        expect(input).not.toBeInvalid()
      }
    )
  })
})
