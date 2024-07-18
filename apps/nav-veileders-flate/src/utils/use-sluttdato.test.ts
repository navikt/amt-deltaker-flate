import { renderHook, act } from '@testing-library/react-hooks'
import { describe, expect, it } from 'vitest'
import { MockHandler } from '../mocks/MockHandler.ts'
import {
  DATO_FØR_SLUTTDATO_FEILMELDING,
  DATO_UTENFOR_TILTAKGJENNOMFORING,
  SLUTTDATO_FØR_OPPSTARTSDATO_FEILMELDING,
  UGYLDIG_DATO_FEILMELDING,
  VARGIHET_VALG_FEILMELDING,
  VarighetValg,
  useSluttdato
} from './varighet.tsx'
import dayjs from 'dayjs'
import { useState } from 'react'
import { PameldingResponse } from '../api/data/pamelding.ts'
import { DateValidationT } from '@navikt/ds-react'

const mock = new MockHandler()
const deltakerUtenDatoer = mock.createDeltaker(
  '85a05446-7211-4bbc-88ad-970f7ef9fb04'
)
const deltakerMedDatoer = mock.createDeltaker(
  '85a05446-7211-4bbc-88ad-970f7ef9fb04',
  dayjs('2024-07-17').toDate(),
  dayjs('2024-07-20').toDate(),
  6,
  3
)

describe('useSluttdato - deltakerUtenDatoer', () => {
  it('har error uten varighet', () => {
    const { result } = renderHook(() =>
      useSluttdato(deltakerUtenDatoer, undefined)
    )
    act(() => {
      result.current.valider()
    })
    expect(result.current.error).toBe('Du må velge en varighet')
  })

  it('har error uten sluttdato', () => {
    const { result } = renderHook(() =>
      useSluttdato(deltakerUtenDatoer, VarighetValg.TRE_MANEDER)
    )
    act(() => {
      result.current.valider()
    })
    expect(result.current.error).toBe('Du må velge en sluttdato')
  })
})

const useCustomVarighetHook = (
  deltaker: PameldingResponse,
  initVarighet: VarighetValg | undefined,
  initStartdato?: Date
) => {
  const [varighetValg, setVarighetValg] = useState<VarighetValg | undefined>(
    initVarighet
  )
  const [startdato, setStartdato] = useState(initStartdato)

  const sluttdatoResultat = useSluttdato(deltaker, varighetValg, startdato)

  return { ...sluttdatoResultat, setVarighetValg, setStartdato }
}

describe('useSluttdato - deltakerMedDatoer', () => {
  it('har error uten varighet2', () => {
    const { result } = renderHook(() =>
      useSluttdato(deltakerMedDatoer, undefined)
    )
    act(() => {
      result.current.valider()
    })
    expect(result.current.error).toBe('Du må velge en varighet')
  })

  it('har ikke error med varighet', () => {
    const { result } = renderHook(() =>
      useSluttdato(deltakerMedDatoer, VarighetValg.TRE_MANEDER)
    )
    expect(result.current.error).toBe(null)
  })

  it('har error med varighet over max-varighet', () => {
    const { result } = renderHook(() =>
      useSluttdato(deltakerMedDatoer, VarighetValg.TOLV_MANEDER)
    )
    expect(result.current.error).toBe(VARGIHET_VALG_FEILMELDING)
  })

  it('har error med varighet over max-varighet men ikke etter varighet endres', () => {
    const { result, rerender } = renderHook(() =>
      useCustomVarighetHook(deltakerMedDatoer, VarighetValg.TOLV_MANEDER)
    )
    expect(result.current.error).toBe(VARGIHET_VALG_FEILMELDING)

    act(() => {
      result.current.setVarighetValg(VarighetValg.TRE_MANEDER)
    })

    rerender()

    expect(result.current.error).toBe(null)
  })

  it('har error med varighet over max-varighet men ikke etter annet dato endres', () => {
    const { result, rerender } = renderHook(() =>
      useCustomVarighetHook(deltakerMedDatoer, VarighetValg.TOLV_MANEDER)
    )
    expect(result.current.error).toBe(
      'Datoen kan ikke velges fordi den er utenfor maks varighet.'
    )

    act(() => {
      result.current.handleChange(
        dayjs(deltakerMedDatoer.startdato).add(42, 'days').toDate()
      )
    })

    rerender()

    expect(result.current.error).toBe(null)
  })

  it('har error med annet-dato over max-varighet men ikke etter annet dato endres', () => {
    const { result, rerender } = renderHook(() =>
      useCustomVarighetHook(deltakerMedDatoer, VarighetValg.ANNET)
    )

    act(() => {
      result.current.handleChange(
        dayjs(deltakerMedDatoer.startdato).add(777, 'days').toDate()
      )
    })

    expect(result.current.error).toBe(VARGIHET_VALG_FEILMELDING)

    act(() => {
      result.current.handleChange(
        dayjs(deltakerMedDatoer.startdato).add(42, 'days').toDate()
      )
    })

    rerender()

    expect(result.current.error).toBe(null)
  })

  it('har error med annet-dato over max-varighet men ikke etter varighet endres', () => {
    const { result, rerender } = renderHook(() =>
      useCustomVarighetHook(deltakerMedDatoer, VarighetValg.ANNET)
    )

    act(() => {
      result.current.handleChange(
        dayjs(deltakerMedDatoer.startdato).add(777, 'days').toDate()
      )
    })

    expect(result.current.error).toBe(VARGIHET_VALG_FEILMELDING)

    act(() => {
      result.current.setVarighetValg(VarighetValg.TRE_MANEDER)
    })

    rerender()

    expect(result.current.error).toBe(null)
  })

  it('har error med annet-dato over max-varighet men ikke etter startdato endres', () => {
    const startdato = dayjs(deltakerMedDatoer.startdato)
    const { result, rerender } = renderHook(() =>
      useCustomVarighetHook(
        deltakerMedDatoer,
        VarighetValg.ANNET,
        startdato.toDate()
      )
    )

    act(() => {
      result.current.handleChange(
        dayjs(deltakerMedDatoer.startdato).add(24, 'months').toDate()
      )
    })

    expect(result.current.error).toBe(VARGIHET_VALG_FEILMELDING)

    act(() => {
      result.current.setStartdato(startdato.add(18, 'months').toDate())
    })

    rerender()

    expect(result.current.error).toBe(null)
  })

  it('har ikke error med annet-dato men har det etter startdato endres utover max-varighet', () => {
    const startdato = dayjs(deltakerMedDatoer.startdato)
    const { result, rerender } = renderHook(() =>
      useCustomVarighetHook(
        deltakerMedDatoer,
        VarighetValg.ANNET,
        startdato.toDate()
      )
    )

    act(() => {
      result.current.handleChange(
        dayjs(deltakerMedDatoer.startdato).add(5, 'months').toDate()
      )
    })

    expect(result.current.error).toBe(null)

    act(() => {
      result.current.setStartdato(startdato.subtract(1, 'month').toDate())
    })

    rerender()

    expect(result.current.error).toBe(VARGIHET_VALG_FEILMELDING)
  })

  it('beregner sluttdato fra deltakers sluttdato når startdato ikke er gitt', () => {
    const { result } = renderHook(() =>
      useSluttdato(deltakerMedDatoer, VarighetValg.TRE_MANEDER)
    )

    expect(result.current.sluttdato?.getTime()).toBe(
      dayjs(deltakerMedDatoer.sluttdato).add(3, 'months').toDate().getTime()
    )
  })

  it('beregner sluttdato fra startdato når gitt', () => {
    const startdato = dayjs(deltakerMedDatoer.startdato)
      .add(1, 'month')
      .toDate()
    const { result } = renderHook(() =>
      useSluttdato(deltakerMedDatoer, VarighetValg.TRE_MANEDER, startdato)
    )

    expect(result.current.sluttdato?.getTime()).toBe(
      dayjs(startdato).add(3, 'months').toDate().getTime()
    )
  })

  it('validerDato - dato er ugyldig - setter error', () => {
    const dagjs = dayjs(deltakerMedDatoer.startdato)
    const startdato = dagjs.toDate()

    const { result } = renderHook(() =>
      useSluttdato(deltakerMedDatoer, VarighetValg.TRE_MANEDER, startdato)
    )

    act(() => {
      result.current.validerDato(dateValidation({ isInvalid: true }), undefined)
    })

    expect(result.current.error).toBe(UGYLDIG_DATO_FEILMELDING)
  })

  it('validerDato - dato er før startdato - setter error', () => {
    const dagjs = dayjs(deltakerMedDatoer.startdato)
    const startdato = dagjs.toDate()

    const { result } = renderHook(() =>
      useSluttdato(deltakerMedDatoer, VarighetValg.TRE_MANEDER, startdato)
    )

    act(() => {
      result.current.validerDato(
        dateValidation({ isBefore: true }),
        dagjs.subtract(1, 'day').toDate()
      )
    })

    expect(result.current.error).toBe(SLUTTDATO_FØR_OPPSTARTSDATO_FEILMELDING)
  })

  it('validerDato - startdato ikke satt, dato er før sluttdato - setter error', () => {
    const { result } = renderHook(() =>
      useSluttdato(deltakerMedDatoer, VarighetValg.ANNET)
    )

    act(() => {
      result.current.validerDato(
        dateValidation({ isBefore: true }),
        dayjs(deltakerMedDatoer.sluttdato).subtract(1, 'day').toDate()
      )
    })

    expect(result.current.error).toBe(DATO_FØR_SLUTTDATO_FEILMELDING)
  })

  it('validerDato - dato er etter max varighet dato - setter error', () => {
    const { result } = renderHook(() =>
      useSluttdato(deltakerMedDatoer, VarighetValg.ANNET)
    )

    act(() => {
      result.current.validerDato(
        dateValidation({ isAfter: true }),
        dayjs(deltakerMedDatoer.sluttdato).add(12, 'months').toDate()
      )
    })

    expect(result.current.error).toBe(VARGIHET_VALG_FEILMELDING)
  })

  it('validerDato - dato er etter gjennomførings sluttdato - setter error', () => {
    const deltaker = mock.createDeltaker(
      '85a05446-7211-4bbc-88ad-970f7ef9fb04',
      dayjs(deltakerMedDatoer.deltakerliste.sluttdato)
        .subtract(3, 'months')
        .toDate(),
      dayjs(deltakerMedDatoer.deltakerliste.sluttdato)
        .subtract(1, 'months')
        .toDate(),
      12,
      12
    )
    const { result } = renderHook(() =>
      useSluttdato(deltaker, VarighetValg.ANNET)
    )

    act(() => {
      result.current.validerDato(
        dateValidation({ isAfter: true }),
        dayjs(deltaker.sluttdato).add(6, 'months').toDate()
      )
    })

    expect(result.current.error).toBe(DATO_UTENFOR_TILTAKGJENNOMFORING)
  })

  it('har en error - sluttdato er undefined', () => {
    const startdato = dayjs(deltakerMedDatoer.startdato)
    const { result, rerender } = renderHook(() =>
      useCustomVarighetHook(
        deltakerMedDatoer,
        VarighetValg.ANNET,
        startdato.toDate()
      )
    )
    act(() => {
      result.current.handleChange(
        dayjs(deltakerMedDatoer.startdato).add(24, 'months').toDate()
      )
    })
    expect(result.current.sluttdato).toBe(undefined)

    act(() => {
      result.current.setVarighetValg(VarighetValg.TRE_MANEDER)
    })
    rerender()
    expect(result.current.sluttdato).toBeTypeOf('object')

    act(() => {
      result.current.setVarighetValg(VarighetValg.TOLV_MANEDER)
    })
    rerender()
    expect(result.current.sluttdato).toBe(undefined)
  })

  it('varighet er ikke valgt - sluttdato er undefined', () => {
    const startdato = dayjs(deltakerMedDatoer.startdato)
    const { result } = renderHook(() =>
      useSluttdato(deltakerMedDatoer, undefined, startdato.toDate())
    )
    expect(result.current.sluttdato).toBe(undefined)
  })
})

function dateValidation(
  overrides: Partial<DateValidationT> = {}
): DateValidationT {
  return {
    isDisabled: false,
    isWeekend: false,
    isEmpty: false,
    isInvalid: false,
    isValidDate: false,
    isBefore: false,
    isAfter: false,
    ...overrides
  }
}
