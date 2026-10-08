import { renderHook, act } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { UGYLDIG_DATO_FEILMELDING, VarighetValg } from './varighet.ts'
import dayjs from 'dayjs'
import { useState } from 'react'
import { DeltakerResponse } from '../api/data/deltaker.ts'
import { dateValidation } from '../components/tiltak/VarighetField.tsx'
import { useSluttdato } from './use-sluttdato.ts'
import {
  deltakerMedDatoer,
  deltakerUtenDatoer,
  senesteSluttdatoFeilmelding
} from './use-sluttdato.test-utils.ts'

describe('useSluttdato - deltakerUtenDatoer', () => {
  it('har error uten varighet', () => {
    const { result } = renderHook(() =>
      useSluttdato({ deltaker: deltakerUtenDatoer, valgtVarighet: undefined })
    )
    act(() => {
      result.current.valider()
    })
    expect(result.current.error).toBe('Du må velge en varighet')
  })
})

const useCustomVarighetHook = (
  deltaker: DeltakerResponse,
  initVarighet: VarighetValg | undefined,
  initStartdato?: Date,
  defaultAnnetDato?: Date
) => {
  const [valgtVarighet, setVarighetValg] = useState<VarighetValg | undefined>(
    initVarighet
  )
  const [startdato, setStartdato] = useState(initStartdato)

  const sluttdatoResultat = useSluttdato({
    deltaker,
    valgtVarighet,
    defaultAnnetDato,
    startdato
  })

  return { ...sluttdatoResultat, setVarighetValg, setStartdato }
}

describe('useSluttdato - deltakerMedDatoer', () => {
  it('har error uten varighet2', () => {
    const { result } = renderHook(() =>
      useSluttdato({ deltaker: deltakerMedDatoer, valgtVarighet: undefined })
    )
    act(() => {
      result.current.valider()
    })
    expect(result.current.error).toBe('Du må velge en varighet')
  })

  it('har ikke error med varighet', () => {
    const { result } = renderHook(() =>
      useSluttdato({
        deltaker: deltakerMedDatoer,
        valgtVarighet: VarighetValg.ANNET
      })
    )
    expect(result.current.error).toBe(null)
  })

  it('har error når ANNET er valgt men ingen dato er valgt', () => {
    const { result } = renderHook(() =>
      useSluttdato({
        deltaker: deltakerMedDatoer,
        valgtVarighet: VarighetValg.ANNET,
        defaultAnnetDato: undefined
      })
    )
    act(() => {
      result.current.valider()
    })
    expect(result.current.error).toBe('Du må velge en sluttdato')
  })

  it('har error med varighet over max-varighet', () => {
    const { result } = renderHook(() =>
      useSluttdato({
        deltaker: deltakerMedDatoer,
        valgtVarighet: VarighetValg.TOLV_MANEDER
      })
    )
    expect(result.current.error).toMatch(senesteSluttdatoFeilmelding)
  })

  it('har error med varighet over max-varighet men ikke etter varighet endres', () => {
    const { result, rerender } = renderHook(() =>
      useCustomVarighetHook(deltakerMedDatoer, VarighetValg.TOLV_MANEDER)
    )
    expect(result.current.error).toMatch(senesteSluttdatoFeilmelding)

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
    expect(result.current.error).toMatch(senesteSluttdatoFeilmelding)

    act(() => {
      result.current.setVarighetValg(VarighetValg.ANNET)
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

    expect(result.current.error).toMatch(senesteSluttdatoFeilmelding)

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

    expect(result.current.error).toMatch(senesteSluttdatoFeilmelding)

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

    expect(result.current.error).toMatch(senesteSluttdatoFeilmelding)

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

    expect(result.current.error).toMatch(senesteSluttdatoFeilmelding)
  })

  it('beregner sluttdato fra deltakers sluttdato når startdato ikke er gitt', () => {
    const { result } = renderHook(() =>
      useSluttdato({
        deltaker: deltakerMedDatoer,
        valgtVarighet: VarighetValg.TRE_MANEDER
      })
    )

    expect(result.current.sluttdato?.getTime()).toBe(
      dayjs(deltakerMedDatoer.sluttdato)
        .subtract(1, 'day')
        .add(3, 'months')
        .toDate()
        .getTime()
    )
  })

  it('beregner sluttdato fra startdato når gitt', () => {
    const startdato = dayjs(deltakerMedDatoer.startdato)
      .add(1, 'month')
      .toDate()
    const { result } = renderHook(() =>
      useSluttdato({
        deltaker: deltakerMedDatoer,
        valgtVarighet: VarighetValg.TRE_MANEDER,
        startdato
      })
    )

    expect(result.current.sluttdato?.getTime()).toBe(
      dayjs(startdato).subtract(1, 'day').add(3, 'months').toDate().getTime()
    )
  })

  it('beholder formatfeilen når startdato endres mens datofeltet er ugyldig', () => {
    const startdato = dayjs(deltakerMedDatoer.startdato)
    const { result } = renderHook(() =>
      useCustomVarighetHook(
        deltakerMedDatoer,
        VarighetValg.ANNET,
        startdato.toDate()
      )
    )

    act(() => {
      result.current.validerDato(dateValidation({ isInvalid: true }))
    })
    expect(result.current.error).toBe(UGYLDIG_DATO_FEILMELDING)

    act(() => {
      result.current.setStartdato(startdato.add(1, 'day').toDate())
    })
    expect(result.current.error).toBe(UGYLDIG_DATO_FEILMELDING)

    let isValid: boolean | undefined
    act(() => {
      isValid = result.current.valider()
    })
    expect(isValid).toBe(false)
    expect(result.current.error).toBe(UGYLDIG_DATO_FEILMELDING)
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

  it('gjenoppretter ikke forrige sluttdato etter ugyldig inntasting', () => {
    const startdato = dayjs(deltakerMedDatoer.startdato).toDate()
    const sluttdato = dayjs(deltakerMedDatoer.startdato)
      .add(10, 'days')
      .toDate()
    const { result } = renderHook(() =>
      useCustomVarighetHook(
        deltakerMedDatoer,
        VarighetValg.ANNET,
        startdato,
        sluttdato
      )
    )

    expect(result.current.sluttdato).toEqual(sluttdato)

    act(() => {
      result.current.handleChange(undefined)
      result.current.validerDato(dateValidation({ isAfter: true }))
    })
    expect(result.current.sluttdato).toBeUndefined()

    act(() => {
      result.current.setStartdato(dayjs(startdato).add(1, 'day').toDate())
    })

    expect(result.current.sluttdato).toBeUndefined()
    act(() => {
      result.current.valider()
    })
    expect(result.current.error).toBe('Du må velge en sluttdato')
  })

  it('varighet er ikke valgt - sluttdato er undefined', () => {
    const startdato = dayjs(deltakerMedDatoer.startdato)
    const { result } = renderHook(() =>
      useSluttdato({
        deltaker: deltakerMedDatoer,
        valgtVarighet: undefined,
        startdato: startdato.toDate()
      })
    )
    expect(result.current.sluttdato).toBe(undefined)
  })
})
