import { describe, expect, it } from 'vitest'
import { Tiltakskode } from '../model/deltaker'
import {
  DeltakelsesmengdeBodyLongSection,
  DeltakelsesmengdeInline
} from './DeltakelsesmengdeHistorikkVisning'
import { extractText } from './test-utils'

describe.each([
  {
    navn: 'DeltakelsesmengdeBodyLongSection',
    komponent: DeltakelsesmengdeBodyLongSection,
    prefiks: 'Deltakelsesmengde '
  },
  {
    navn: 'DeltakelsesmengdeInline',
    komponent: DeltakelsesmengdeInline,
    prefiks: 'Deltakelsesmengde: '
  }
])('$navn', ({ komponent, prefiks }) => {
  const props = {
    tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
    erEnkeltplass: false,
    deltakelsesprosent: 80,
    dagerPerUke: 3
  }

  it('viser deltakelsesprosent og dager per uke', () => {
    const result = komponent(props)

    expect(extractText(result).join(' ')).toBe(
      `${prefiks}80\u00a0% fordelt på 3 dager i uka`
    )
  })

  it('viser bare prosent når dager per uke mangler', () => {
    const result = komponent({ ...props, dagerPerUke: null })

    expect(extractText(result).join(' ')).toBe(`${prefiks}80\u00a0%`)
  })

  it('viser 100 prosent når prosent og dager per uke mangler', () => {
    const result = komponent({
      ...props,
      deltakelsesprosent: null,
      dagerPerUke: null
    })

    expect(extractText(result).join(' ')).toBe(`${prefiks}100\u00a0%`)
  })

  it('viser bare dager per uke for enkeltplass', () => {
    const result = komponent({
      ...props,
      tiltakskode: Tiltakskode.HOYERE_UTDANNING,
      erEnkeltplass: true
    })

    expect(extractText(result).join(' ')).toBe(`${prefiks}3 dager i uka`)
  })

  it('returnerer null når tiltaket ikke har deltakelsesmengde', () => {
    const result = komponent({
      ...props,
      tiltakskode: Tiltakskode.OPPFOLGING
    })

    expect(result).toBeNull()
  })

  it.each([null, 0])(
    'returnerer null for enkeltplass med %s dager per uke',
    (dagerPerUke) => {
      const result = komponent({ ...props, erEnkeltplass: true, dagerPerUke })

      expect(result).toBeNull()
    }
  )

  it('bruker oppgitt className', () => {
    const result = komponent({ ...props, className: 'mt-4' })

    expect(result?.props.className).toBe('mt-4')
  })
})
