import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { Tiltakskode } from '../model/deltaker'
import { DeltakelsesmengdeInfo } from './DeltakelsesmengdeInfo'
import { extractText } from './test-utils'

describe('DeltakelsesmengdeInfo', () => {
  it('viser deltakelsesmengde for arbeidsforberedende trening', () => {
    const result = DeltakelsesmengdeInfo({
      tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
      erEnkeltplass: false,
      deltakelsesprosent: 80,
      dagerPerUke: 3
    })
    const text = extractText(result).join(' ')

    expect(text).toContain('Deltakelsesmengde')
    expect(text).toContain('80\u00a0% fordelt på 3 dager i uka')
    expect(text).not.toContain('Nåværende periode:')
    expect(text).not.toContain('Neste periode')
  })

  it('viser deltakelsesmengde for varig tilrettelagt arbeid', () => {
    const result = DeltakelsesmengdeInfo({
      tiltakskode: Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET,
      erEnkeltplass: false,
      deltakelsesprosent: 50,
      dagerPerUke: 2
    })

    expect(extractText(result)).toContain('50\u00a0% fordelt på 2 dager i uka')
  })

  it('viser bare prosent når dager per uke ikke er satt', () => {
    const result = DeltakelsesmengdeInfo({
      tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
      erEnkeltplass: false,
      deltakelsesprosent: 80,
      dagerPerUke: null
    })

    expect(extractText(result)).toEqual(['Deltakelsesmengde', '80\u00a0%'])
  })

  it('viser 100 prosent når deltakelsesprosent ikke er satt', () => {
    const result = DeltakelsesmengdeInfo({
      tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
      erEnkeltplass: false,
      deltakelsesprosent: null,
      dagerPerUke: null
    })

    expect(extractText(result)).toEqual(['Deltakelsesmengde', '100\u00a0%'])
  })

  it('viser bare dager per uke for enkeltplass', () => {
    const result = DeltakelsesmengdeInfo({
      tiltakskode: Tiltakskode.HOYERE_UTDANNING,
      erEnkeltplass: true,
      deltakelsesprosent: 60,
      dagerPerUke: 1
    })

    expect(extractText(result)).toEqual(['Deltakelsesmengde', '1 dag i uka'])
  })

  it('skjuler deltakelsesmengde for tiltak som ikke støtter det', () => {
    const result = DeltakelsesmengdeInfo({
      tiltakskode: Tiltakskode.OPPFOLGING,
      erEnkeltplass: false,
      deltakelsesprosent: 80,
      dagerPerUke: 3
    })

    expect(result).toBeNull()
  })

  it('skjuler deltakelsesmengde for enkeltplass når dager per uke mangler', () => {
    const result = DeltakelsesmengdeInfo({
      tiltakskode: Tiltakskode.HOYERE_UTDANNING,
      erEnkeltplass: true,
      deltakelsesprosent: null,
      dagerPerUke: null
    })

    expect(result).toBeNull()
  })

  it('skjuler deltakelsesmengde for enkeltplass med null dager per uke', () => {
    const result = DeltakelsesmengdeInfo({
      tiltakskode: Tiltakskode.HOYERE_UTDANNING,
      erEnkeltplass: true,
      deltakelsesprosent: null,
      dagerPerUke: 0
    })

    expect(result).toBeNull()
  })

  it('viser nåværende og neste deltakelsesmengde når neste periode er satt', () => {
    const gyldigFra = dayjs().add(1, 'month')
    const result = DeltakelsesmengdeInfo({
      tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
      erEnkeltplass: false,
      deltakelsesprosent: 80,
      dagerPerUke: 3,
      nesteDeltakelsesmengde: {
        deltakelsesprosent: 60,
        dagerPerUke: 2,
        gyldigFra: gyldigFra.toDate()
      }
    })
    const text = extractText(result).join(' ')

    expect(text).toContain('Nåværende periode:')
    expect(text).toContain('80\u00a0% fordelt på 3 dager i uka')
    expect(text).toContain('Neste periode (fom.')
    expect(text).toContain(gyldigFra.format('DD.MM.YYYY'))
    expect(text).toContain('60\u00a0% fordelt på 2 dager i uka')
  })
})
