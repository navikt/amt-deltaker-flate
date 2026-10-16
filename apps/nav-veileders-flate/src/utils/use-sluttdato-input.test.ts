import { act, renderHook } from '@testing-library/react'
import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { dateValidation } from '../components/tiltak/VarighetField'
import {
  DATO_FOER_SLUTTDATO_FEILMELDING,
  DATO_UTENFOR_TILTAKGJENNOMFORING,
  getMaxVarighetDato,
  getVarighetValgFeilmelding,
  SLUTTDATO_FOER_OPPSTARTSDATO_FEILMELDING,
  UGYLDIG_DATO_FEILMELDING
} from './varighet'
import { useSluttdatoInput } from './use-sluttdato-input'
import {
  createDeltaker,
  deltakerMedDatoer,
  senesteSluttdatoFeilmelding
} from './use-sluttdato.test-utils'

describe('useSluttdatoInput', () => {
  it('viser formatfeil for ugyldig dato', () => {
    const { result } = renderHook(() =>
      useSluttdatoInput({
        deltaker: deltakerMedDatoer,
        defaultDato: undefined
      })
    )

    act(() => {
      result.current.validate(dateValidation({ isInvalid: true }))
    })

    expect(result.current.error).toBe(UGYLDIG_DATO_FEILMELDING)
  })

  it('beholder formatfeilen når startdato endres mens datofeltet er ugyldig', () => {
    const startdato = dayjs(deltakerMedDatoer.startdato).toDate()
    const { result, rerender } = renderHook(
      ({ currentStartdato }) =>
        useSluttdatoInput({
          deltaker: deltakerMedDatoer,
          defaultDato: undefined,
          startdato: currentStartdato
        }),
      { initialProps: { currentStartdato: startdato } }
    )

    act(() => {
      result.current.validate(dateValidation({ isInvalid: true }))
    })
    expect(result.current.error).toBe(UGYLDIG_DATO_FEILMELDING)

    rerender({ currentStartdato: dayjs(startdato).add(1, 'day').toDate() })

    expect(result.current.error).toBe(UGYLDIG_DATO_FEILMELDING)
  })

  it('viser feil når sluttdato er før startdato', () => {
    const startdato = dayjs(deltakerMedDatoer.startdato)
    const { result } = renderHook(() =>
      useSluttdatoInput({
        deltaker: deltakerMedDatoer,
        defaultDato: undefined,
        startdato: startdato.toDate()
      })
    )

    act(() => {
      result.current.validate(
        dateValidation({ isBefore: true }),
        startdato.subtract(1, 'day').toDate()
      )
    })

    expect(result.current.error).toBe(SLUTTDATO_FOER_OPPSTARTSDATO_FEILMELDING)
  })

  it('viser feil når sluttdato er før deltakerens sluttdato og startdato mangler', () => {
    const { result } = renderHook(() =>
      useSluttdatoInput({
        deltaker: deltakerMedDatoer,
        defaultDato: undefined
      })
    )

    act(() => {
      result.current.validate(
        dateValidation({ isBefore: true }),
        dayjs(deltakerMedDatoer.sluttdato).subtract(1, 'day').toDate()
      )
    })

    expect(result.current.error).toBe(DATO_FOER_SLUTTDATO_FEILMELDING)
  })

  it('viser feil når en inntastet sluttdato går over maks varighet', () => {
    const { result } = renderHook(() =>
      useSluttdatoInput({
        deltaker: deltakerMedDatoer,
        defaultDato: undefined
      })
    )

    act(() => {
      result.current.validate(
        dateValidation({ isAfter: true }),
        dayjs(deltakerMedDatoer.sluttdato).add(12, 'months').toDate()
      )
    })

    expect(result.current.error).toMatch(senesteSluttdatoFeilmelding)
  })

  it('viser maksvarighetsfeil når DatePicker ikke gir den avviste datoen', () => {
    const startdato = dayjs(deltakerMedDatoer.startdato).toDate()
    const { result } = renderHook(() =>
      useSluttdatoInput({
        deltaker: deltakerMedDatoer,
        defaultDato: undefined,
        startdato
      })
    )

    act(() => {
      result.current.validate(dateValidation({ isAfter: true }))
    })

    expect(result.current.error).toMatch(senesteSluttdatoFeilmelding)
  })

  it('godtar en eksisterende sluttdato over ny maksvarighet, men ikke en senere dato', () => {
    const opprinneligSluttdato = '2025-06-01'
    const deltaker = createDeltaker('2024-07-17', opprinneligSluttdato, 6, 3)
    const deltakerUtenTiltaksgrense = {
      ...deltaker,
      deltakerliste: { ...deltaker.deltakerliste, sluttdato: null }
    }
    const startdato = dayjs(deltakerUtenTiltaksgrense.startdato).toDate()
    const maksDato = getMaxVarighetDato(deltakerUtenTiltaksgrense, startdato)

    if (!maksDato) {
      throw new Error('Forventet en beregnet maksvarighetsdato')
    }

    const { result } = renderHook(() =>
      useSluttdatoInput({
        deltaker: deltakerUtenTiltaksgrense,
        defaultDato: undefined,
        startdato
      })
    )

    act(() => {
      result.current.validate(
        dateValidation({ isAfter: true }),
        maksDato.add(1, 'day').toDate()
      )
    })
    expect(result.current.error).toBe(null)
    expect(result.current.sluttdato).toEqual(maksDato.add(1, 'day').toDate())

    act(() => {
      result.current.validate(
        dateValidation({ isAfter: true }),
        dayjs(opprinneligSluttdato).add(1, 'day').toDate()
      )
    })
    expect(result.current.error).toBe(
      getVarighetValgFeilmelding(dayjs(opprinneligSluttdato).toDate())
    )
    expect(result.current.sluttdato).toBeUndefined()
  })

  it('beholder range-feilen når startdato endres mens sluttdato ikke er valgt', () => {
    const startdato = dayjs(deltakerMedDatoer.startdato)
    const { result, rerender } = renderHook(
      ({ currentStartdato }) =>
        useSluttdatoInput({
          deltaker: deltakerMedDatoer,
          defaultDato: undefined,
          startdato: currentStartdato
        }),
      { initialProps: { currentStartdato: startdato.toDate() } }
    )
    const avvistSluttdato = startdato.add(8, 'months').toDate()

    act(() => {
      result.current.validate(
        dateValidation({ isAfter: true }),
        avvistSluttdato
      )
    })
    const feilmelding = result.current.error
    expect(feilmelding).toMatch(senesteSluttdatoFeilmelding)

    rerender({ currentStartdato: startdato.add(1, 'day').toDate() })

    expect(result.current.error).toBe(feilmelding)
  })

  it('viser feil for dato etter tiltaksperioden når DatePicker ikke gir datoen', () => {
    const deltaker = createDeltaker('2024-07-17', '2024-07-20', 100, 12)
    const startdato = dayjs(deltaker.startdato).toDate()
    const { result } = renderHook(() =>
      useSluttdatoInput({
        deltaker,
        defaultDato: undefined,
        startdato
      })
    )

    act(() => {
      result.current.validate(dateValidation({ isAfter: true }))
    })

    expect(result.current.error).toBe(DATO_UTENFOR_TILTAKGJENNOMFORING)
  })

  it('viser feil for dato etter tiltaksperiodens sluttdato', () => {
    const deltaker = createDeltaker(
      dayjs(deltakerMedDatoer.deltakerliste.sluttdato)
        .subtract(3, 'months')
        .toString(),
      dayjs(deltakerMedDatoer.deltakerliste.sluttdato)
        .subtract(1, 'months')
        .toString(),
      12,
      12
    )
    const { result } = renderHook(() =>
      useSluttdatoInput({ deltaker, defaultDato: undefined })
    )

    act(() => {
      result.current.validate(
        dateValidation({ isAfter: true }),
        dayjs(deltaker.sluttdato).add(6, 'months').toDate()
      )
    })

    expect(result.current.error).toBe(DATO_UTENFOR_TILTAKGJENNOMFORING)
  })
})
