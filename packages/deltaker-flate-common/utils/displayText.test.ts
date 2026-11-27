import { describe, expect, it } from 'vitest'
import { EndrePrisinfoStatus, EndringType } from '../model/deltakerHistorikk'
import { deltakerprosentText, getEndringsTittel } from './displayText'

describe('deltakerprosentText', () => {
  it.each([
    {
      navn: 'enkeltplass uten dager',
      deltakelsesprosent: null,
      dagerPerUke: null,
      expected: ''
    },
    {
      navn: 'enkeltplass med 1 dag',
      deltakelsesprosent: null,
      dagerPerUke: 1,
      expected: '1 dag i uka'
    },
    {
      navn: 'enkeltplass med flere dager',
      deltakelsesprosent: null,
      dagerPerUke: 3,
      expected: '3 dager i uka'
    },
    {
      navn: 'enkeltplass med hundre prosent og fem dager',
      deltakelsesprosent: 100,
      dagerPerUke: 5,
      expected: '100\u00A0% fordelt på 5 dager i uka'
    },
    {
      navn: 'enkeltplass med prosent uten dager',
      deltakelsesprosent: 60,
      dagerPerUke: null,
      expected: '60\u00A0%'
    },
    {
      navn: 'enkeltplass med null prosent',
      deltakelsesprosent: 0,
      dagerPerUke: 2,
      expected: '0\u00A0% fordelt på 2 dager i uka'
    },
    {
      navn: 'gruppe uten dager',
      deltakelsesprosent: 80,
      dagerPerUke: null,
      expected: '80\u00A0%'
    },
    {
      navn: 'gruppe med prosent og dager',
      deltakelsesprosent: 50,
      dagerPerUke: 3,
      expected: '50\u00A0% fordelt på 3 dager i uka'
    },
    {
      navn: 'gruppe uten prosent viser bare dager',
      deltakelsesprosent: null,
      dagerPerUke: 2,
      expected: '2 dager i uka'
    },
    {
      navn: 'gruppe uten prosent eller dager viser ingen mengde',
      deltakelsesprosent: null,
      dagerPerUke: null,
      expected: ''
    },
    {
      navn: 'eksplisitt hundre prosent beholdes',
      deltakelsesprosent: 100,
      dagerPerUke: null,
      expected: '100\u00A0%'
    }
  ])('$navn', ({ deltakelsesprosent, dagerPerUke, expected }) => {
    expect(deltakerprosentText(deltakelsesprosent, dagerPerUke)).toBe(expected)
  })

  it('har aldri trailing mellomrom for vanlige gruppe-verdier', () => {
    expect(deltakerprosentText(80, null)).not.toMatch(/\s$/)
    expect(deltakerprosentText(80, 3)).not.toMatch(/\s$/)
  })

  it('0 dager behandles som manglende dager', () => {
    expect(deltakerprosentText(80, 0)).toBe('80\u00A0%')
    expect(deltakerprosentText(null, 0)).toBe('')
  })

  it('bevarer prosent med desimaler uten avrunding', () => {
    expect(deltakerprosentText(62.5, 3)).toBe(
      '62.5\u00A0% fordelt på 3 dager i uka'
    )
  })
})

describe('getEndringsTittel', () => {
  it('bruker fallback-tittel når enkeltplass mangler dagerPerUke', () => {
    expect(
      getEndringsTittel({
        type: EndringType.EndreDeltakelsesmengde,
        deltakelsesprosent: null,
        dagerPerUke: null,
        gyldigFra: null,
        begrunnelse: null,
        pavirkerPris: false
      })
    ).toBe('Deltakelsesmengde endret')
  })

  it('should return tittel for EndreAvslutning', () => {
    expect(
      getEndringsTittel({
        type: EndringType.EndreAvslutning,
        aarsak: null,
        sluttdato: null,
        begrunnelse: null,
        harFullfort: null
      })
    ).toBe('Avslutning endret')
  })

  it('should return tittel for EndrePrisinfo', () => {
    expect(
      getEndringsTittel({
        type: EndringType.EndrePrisinfo,
        prisinfo: null,
        begrunnelse: null,
        status: null
      })
    ).toBe('Pris og betalingsbetingelser er endret')
  })

  it('should return tittel for EndrePrisinfo med TILBAKEKALT', () => {
    expect(
      getEndringsTittel({
        type: EndringType.EndrePrisinfo,
        prisinfo: null,
        begrunnelse: null,
        status: EndrePrisinfoStatus.TILBAKEKALT
      })
    ).toBe('Tilbakekalt: Endre pris og betalingsbetingelser')
  })

  it('should return tittel for EndreOpplaringKategorisering', () => {
    expect(
      getEndringsTittel({
        type: EndringType.EndreOpplaringKategorisering,
        opplaringKategoriseringValg: {
          valgteKategoriseringer: [],
          valgteSertifiseringer: []
        },
        beskrivelse: '',
        pavirkerPris: false
      })
    ).toBe('Innholdet er endret')
  })
})
