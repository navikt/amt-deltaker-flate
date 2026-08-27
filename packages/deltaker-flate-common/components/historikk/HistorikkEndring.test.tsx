import { describe, expect, it } from 'vitest'
import { Tiltakskode } from '../../model/deltaker'
import {
  DeltakerEndring,
  EndrePrisinfoStatus,
  EndringType
} from '../../model/deltakerHistorikk'
import { extractText } from '../test-utils'
import { HistorikkEndring } from './HistorikkEndring'
import { HistorikkType } from '../../model/forslag'
import { PrisinformasjonType } from '../../model/prisinformasjon.ts'

const prisvarsel =
  'Endringen forutsetter at endring i pris eller betalingsbetingelser blir godkjent. Du vil få en egen beskjed om dette.'

const lagDeltakerEndring = (
  endring: DeltakerEndring['endring']
): DeltakerEndring => ({
  type: HistorikkType.Endring,
  endring,
  endretAv: 'Navn Navnesen',
  endretAvEnhet: 'Nav Fredrikstad',
  endret: new Date('2026-01-01'),
  forslag: null
})

const lagEndringer = (pavirkerPris: boolean) => [
  {
    navn: 'opplæringskategorisering',
    deltakerEndring: lagDeltakerEndring({
      type: EndringType.EndreOpplaringKategorisering,
      opplaringKategoriseringValg: {
        valgteKategoriseringer: [],
        valgteSertifiseringer: []
      },
      beskrivelse: '',
      pavirkerPris
    })
  },
  {
    navn: 'deltakelsesmengde',
    deltakerEndring: lagDeltakerEndring({
      type: EndringType.EndreDeltakelsesmengde,
      deltakelsesprosent: 80,
      dagerPerUke: 4,
      gyldigFra: new Date('2026-01-01'),
      begrunnelse: null,
      pavirkerPris
    })
  },
  {
    navn: 'forlengelse',
    deltakerEndring: lagDeltakerEndring({
      type: EndringType.ForlengDeltakelse,
      sluttdato: new Date('2026-12-31'),
      begrunnelse: null,
      pavirkerPris
    })
  }
]

const hentTekst = (deltakerEndring: DeltakerEndring) =>
  extractText(
    HistorikkEndring({
      deltakerEndring,
      tiltakskode: Tiltakskode.ARBEIDSMARKEDSOPPLAERING,
      erEnkeltplass: true
    })
  ).join(' ')

describe('HistorikkEndring', () => {
  it.each(lagEndringer(true))(
    'viser prisvarsel for $navn når endringen påvirker pris',
    ({ deltakerEndring }) => {
      expect(hentTekst(deltakerEndring)).toContain(prisvarsel)
    }
  )

  it.each(lagEndringer(false))(
    'skjuler prisvarsel for $navn når endringen ikke påvirker pris',
    ({ deltakerEndring }) => {
      expect(hentTekst(deltakerEndring)).not.toContain(prisvarsel)
    }
  )

  it('viser egen tilbakekall-visning for EndrePrisinfo med TILBAKEKALT', () => {
    const text = extractText(
      <HistorikkEndring
        tiltakskode={Tiltakskode.ENKELTPLASS_ARBEIDSMARKEDSOPPLAERING}
        erEnkeltplass={true}
        deltakerEndring={{
          type: HistorikkType.Endring,
          endring: {
            type: EndringType.EndrePrisinfo,
            status: EndrePrisinfoStatus.TILBAKEKALT,
            begrunnelse: null,
            prisinfo: {
              type: PrisinformasjonType.Anskaffelse,
              pris: 10000,
              begrunnelse: null
            }
          },
          endretAv: 'Veileder',
          endretAvEnhet: 'Nav Oslo',
          endret: new Date('2026-08-27'),
          forslag: null
        }}
      />
    ).join(' ')

    expect(text).toContain('Tilbakekalt: Endre pris og betalingsbetingelser')
    expect(text).toContain('Tilbakekalt')
    expect(text).toContain('Endringen som ble tilbakekalt')
    expect(text).not.toContain('Endret')
  })
})
