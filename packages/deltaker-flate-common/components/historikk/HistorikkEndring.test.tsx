import { describe, expect, it } from 'vitest'
import { Tiltakskode } from '../../model/deltaker'
import {
  DeltakerEndring,
  EndrePrisinfoStatus,
  EndringType
} from '../../model/deltakerHistorikk'
import { OpplaringRepresenterer } from '../../model/kodeverk'
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
  it.each([
    {
      dagerPerUke: 3,
      deltakelsesprosent: null,
      tittel: 'Deltakelsen er endret til 3 dager i uka'
    },
    {
      dagerPerUke: null,
      deltakelsesprosent: null,
      tittel: 'Deltakelsesmengde endret'
    },
    {
      dagerPerUke: 3,
      deltakelsesprosent: 100,
      tittel: 'Deltakelsen er endret til 100\u00a0% fordelt på 3 dager i uka'
    },
    {
      dagerPerUke: null,
      deltakelsesprosent: 100,
      tittel: 'Deltakelsen er endret til 100\u00a0%'
    }
  ])(
    'viser «$tittel» og beholder endringsdetaljer',
    ({ dagerPerUke, deltakelsesprosent, tittel }) => {
      const result = HistorikkEndring({
        deltakerEndring: lagDeltakerEndring({
          type: EndringType.EndreDeltakelsesmengde,
          deltakelsesprosent,
          dagerPerUke,
          gyldigFra: new Date('2026-02-01'),
          begrunnelse: 'Deltakelsesmengden må avklares',
          pavirkerPris: false
        }),
        tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
        erEnkeltplass: false
      })
      const text = extractText(result).join(' ')

      expect(result.props.tittel).toBe(tittel)
      expect(text).toContain(tittel)
      expect(text).toMatch(/Gjelder fra:\s+01\.02\.2026/)
      expect(text).toMatch(/Navs begrunnelse:\s+Deltakelsesmengden må avklares/)
      expect(text).toContain(
        'Endret 01.01.2026 av Navn Navnesen Nav Fredrikstad.'
      )
      if (deltakelsesprosent === null) {
        expect(text).not.toContain('%')
      }
    }
  )

  it('viser bare dager for enkeltplass selv med registrert prosent', () => {
    const result = HistorikkEndring({
      deltakerEndring: lagDeltakerEndring({
        type: EndringType.EndreDeltakelsesmengde,
        deltakelsesprosent: 100,
        dagerPerUke: 3,
        gyldigFra: null,
        begrunnelse: null,
        pavirkerPris: false
      }),
      tiltakskode: Tiltakskode.HOYERE_UTDANNING,
      erEnkeltplass: true
    })

    expect(result.props.tittel).toBe('Deltakelsen er endret til 3 dager i uka')
    expect(extractText(result).join(' ')).not.toContain('%')
  })

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

  it('viser kurstype og beskrivelse for endring i opplæringskategorisering', () => {
    const deltakerEndring = lagDeltakerEndring({
      type: EndringType.EndreOpplaringKategorisering,
      opplaringKategoriseringValg: {
        valgteKategoriseringer: [
          {
            type: OpplaringRepresenterer.KURSTYPE_ID,
            valgteElementer: [
              {
                id: '79d1a970-e8f0-4ecd-8d5e-e7c8d5f3394c',
                visningsnavn: 'Norsk for arbeidslivet'
              }
            ]
          }
        ],
        valgteSertifiseringer: []
      },
      beskrivelse: 'For deltakere med norsk som andrespråk',
      pavirkerPris: true
    })

    const text = hentTekst(deltakerEndring)

    expect(text).toContain('Kurstype: Norsk for arbeidslivet')
    expect(text).toContain(
      'Beskrivelse: For deltakere med norsk som andrespråk'
    )
    expect(text).toContain(prisvarsel)
  })

  it('viser egen tilbakekall-visning for EndrePrisinfo med TILBAKEKALT', () => {
    const tekster = extractText(
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
    )
    const text = tekster.join(' ')

    expect(text).toContain('Tilbakekalt: Endre pris og betalingsbetingelser')
    expect((text.match(/Tilbakekalt/g) ?? []).length).toBe(3)
    expect(text).toContain('Tilbakekalt')
    expect(text).toContain('Endringen som ble tilbakekalt')
    expect(text).not.toContain('Endret')
  })
})
