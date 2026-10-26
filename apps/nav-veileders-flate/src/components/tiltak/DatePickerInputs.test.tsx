import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { DateValidationT } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { Tiltakskode } from 'deltaker-flate-common'
import { describe, expect, it, vi } from 'vitest'
import { VarighetValg } from '../../utils/varighet'
import { SimpleDatePicker } from './SimpleDatePicker'
import { VarighetField } from './VarighetField'

const createDateRange = () => {
  const fromDate = dayjs().add(1, 'month').startOf('month')

  return {
    fromDate: fromDate.toDate(),
    toDate: fromDate.add(12, 'months').toDate(),
    validDate: fromDate.add(10, 'days'),
    invalidDate: fromDate.subtract(1, 'day')
  }
}

describe('SimpleDatePicker', () => {
  it('oppdaterer datoen når brukeren skriver i feltet', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onValidate = vi.fn()
    const { fromDate, toDate, validDate } = createDateRange()

    render(
      <SimpleDatePicker
        label="Velg dato"
        error={null}
        fromDate={fromDate}
        toDate={toDate}
        onChange={onChange}
        onValidate={onValidate}
      />
    )

    await user.type(
      screen.getByLabelText('Velg dato'),
      validDate.format('DD.MM.YYYY')
    )

    const date = onChange.mock.lastCall?.[0]
    expect(date).toBeInstanceOf(Date)
    expect(dayjs(date).format('DD.MM.YYYY')).toBe(
      validDate.format('DD.MM.YYYY')
    )
    expect(onValidate).toHaveBeenLastCalledWith(
      expect.objectContaining({ isValidDate: true })
    )

    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('button', { pressed: true })).toHaveTextContent(
      String(validDate.date())
    )
  })

  it('avviser datoer utenfor tillatt intervall ved manuell inntasting', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onValidate = vi.fn()
    const { fromDate, toDate, invalidDate } = createDateRange()

    render(
      <SimpleDatePicker
        label="Velg dato"
        error={null}
        fromDate={fromDate}
        toDate={toDate}
        onChange={onChange}
        onValidate={onValidate}
      />
    )

    await user.type(
      screen.getByLabelText('Velg dato'),
      invalidDate.format('DD.MM.YYYY')
    )

    expect(onChange).toHaveBeenLastCalledWith(undefined)
    expect(onValidate).toHaveBeenLastCalledWith(
      expect.objectContaining({ isBefore: true, isValidDate: false })
    )
    expect(
      screen.queryByRole('button', { pressed: true })
    ).not.toBeInTheDocument()
  })
})

describe('VarighetField', () => {
  const renderVarighetField = (
    startDato: Date,
    sluttdato: Date,
    onChangeSluttDato: (date: Date | undefined) => void,
    onValidateSluttDato: (validation: DateValidationT) => void
  ) =>
    render(
      <VarighetField
        title="Varighet"
        startDato={startDato}
        sluttdato={sluttdato}
        tiltakskode={Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING}
        errorVarighet={null}
        errorSluttDato={null}
        defaultVarighet={VarighetValg.ANNET}
        onChangeVarighet={vi.fn()}
        onChangeSluttDato={onChangeSluttDato}
        onValidateSluttDato={onValidateSluttDato}
      />
    )

  it('oppdaterer sluttdatoen når brukeren skriver i feltet', async () => {
    const user = userEvent.setup()
    const onChangeSluttDato = vi.fn()
    const onValidateSluttDato = vi.fn()
    const { fromDate, toDate, validDate } = createDateRange()

    renderVarighetField(
      fromDate,
      toDate,
      onChangeSluttDato,
      onValidateSluttDato
    )
    await user.type(
      screen.getByLabelText('Annet - velg dato'),
      validDate.format('DD.MM.YYYY')
    )

    const date = onChangeSluttDato.mock.lastCall?.[0]
    expect(date).toBeInstanceOf(Date)
    expect(dayjs(date).format('DD.MM.YYYY')).toBe(
      validDate.format('DD.MM.YYYY')
    )
    expect(onValidateSluttDato).toHaveBeenLastCalledWith(
      expect.objectContaining({ isValidDate: true })
    )

    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('button', { pressed: true })).toHaveTextContent(
      String(validDate.date())
    )
  })

  it('avviser sluttdatoer utenfor tillatt intervall ved manuell inntasting', async () => {
    const user = userEvent.setup()
    const onChangeSluttDato = vi.fn()
    const onValidateSluttDato = vi.fn()
    const { fromDate, toDate, invalidDate } = createDateRange()

    renderVarighetField(
      fromDate,
      toDate,
      onChangeSluttDato,
      onValidateSluttDato
    )
    await user.type(
      screen.getByLabelText('Annet - velg dato'),
      invalidDate.format('DD.MM.YYYY')
    )

    expect(onChangeSluttDato).toHaveBeenLastCalledWith(undefined)
    expect(onValidateSluttDato).toHaveBeenLastCalledWith(
      expect.objectContaining({ isBefore: true, isValidDate: false }),
      invalidDate.toDate()
    )
    expect(
      screen.queryByRole('button', { pressed: true })
    ).not.toBeInTheDocument()
  })

  it('sender parsed sluttdato videre når manuell inntasting er etter øvre grense', async () => {
    const user = userEvent.setup()
    const onChangeSluttDato = vi.fn()
    const onValidateSluttDato = vi.fn()
    const { fromDate, toDate } = createDateRange()
    const invalidDate = dayjs(toDate).add(1, 'day')

    renderVarighetField(
      fromDate,
      toDate,
      onChangeSluttDato,
      onValidateSluttDato
    )
    await user.type(
      screen.getByLabelText('Annet - velg dato'),
      invalidDate.format('DD.MM.YYYY')
    )

    expect(onChangeSluttDato).toHaveBeenLastCalledWith(undefined)
    expect(onValidateSluttDato).toHaveBeenLastCalledWith(
      expect.objectContaining({ isAfter: true, isValidDate: false }),
      invalidDate.toDate()
    )
  })

  it('revaliderer datoen når grensen endres, men datoen fortsatt er utenfor', async () => {
    const user = userEvent.setup()
    const onChangeSluttDato = vi.fn()
    const onValidateSluttDato = vi.fn()
    const { fromDate, toDate } = createDateRange()
    const invalidDate = dayjs(toDate).add(1, 'day')
    const props = {
      title: 'Varighet',
      startDato: fromDate,
      sluttdato: toDate,
      tiltakskode: Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING,
      errorVarighet: null,
      errorSluttDato: null,
      defaultVarighet: VarighetValg.ANNET,
      onChangeVarighet: vi.fn(),
      onChangeSluttDato,
      onValidateSluttDato
    }

    const { rerender } = render(<VarighetField {...props} />)
    await user.type(
      screen.getByLabelText('Annet - velg dato'),
      invalidDate.format('DD.MM.YYYY')
    )
    onValidateSluttDato.mockClear()

    rerender(
      <VarighetField
        {...props}
        sluttdato={dayjs(toDate).subtract(1, 'day').toDate()}
      />
    )

    expect(onValidateSluttDato).toHaveBeenLastCalledWith(
      expect.objectContaining({ isAfter: true }),
      invalidDate.toDate()
    )
  })

  it('tar i bruk en innskrevet sluttdato når datogrensen senere utvides', async () => {
    const user = userEvent.setup()
    const onChangeSluttDato = vi.fn()
    const onValidateSluttDato = vi.fn()
    const { fromDate, toDate } = createDateRange()
    const enteredDate = dayjs(toDate).add(1, 'day')
    const props = {
      title: 'Varighet',
      startDato: fromDate,
      sluttdato: toDate,
      tiltakskode: Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING,
      errorVarighet: null,
      errorSluttDato: null,
      defaultVarighet: VarighetValg.ANNET,
      onChangeVarighet: vi.fn(),
      onChangeSluttDato,
      onValidateSluttDato
    }

    const { rerender } = render(<VarighetField {...props} />)
    const input = screen.getByLabelText('Annet - velg dato')
    await user.type(input, enteredDate.format('DD.MM.YYYY'))
    expect(onChangeSluttDato).toHaveBeenLastCalledWith(undefined)

    const expandedToDate = enteredDate.add(1, 'month').toDate()
    rerender(<VarighetField {...props} sluttdato={expandedToDate} />)

    expect(onChangeSluttDato).toHaveBeenLastCalledWith(enteredDate.toDate())
    expect(onValidateSluttDato).toHaveBeenLastCalledWith(
      expect.objectContaining({ isValidDate: true }),
      enteredDate.toDate()
    )
    expect(input).toHaveValue(enteredDate.format('DD.MM.YYYY'))
  })
})
