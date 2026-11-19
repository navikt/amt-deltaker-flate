import { describe, expect, it } from 'vitest'
import { HistorikkEnkeltplassOkonomiGodkjent } from './HistorikkEnkeltplassOkonomiGodkjent'
import { extractText } from '../test-utils'
import {
  DeltakerHistorikk,
  enkeltplassOkonomiGodkjentSchema,
  vedtakSchema
} from '../../model/deltakerHistorikk'
import { HistorikkType } from '../../model/forslag'
import { PrisinformasjonType, Tilskuddstype } from '../../model/prisinformasjon'
import { Tiltakskode } from '../../model/deltaker'
import { OpplaringRepresenterer } from '../../model/kodeverk'
import { INNHOLD_TYPE_ANNET } from '../../utils/constants'

type EnkeltplassOkonomiGodkjent = Extract<
  DeltakerHistorikk,
  { type: HistorikkType.EnkeltplassOkonomiGodkjent }
>

const lagEnkeltplassOkonomiGodkjent = (
  overrides: Partial<EnkeltplassOkonomiGodkjent> = {}
): EnkeltplassOkonomiGodkjent => ({
  type: HistorikkType.EnkeltplassOkonomiGodkjent,
  endretAv: 'Bernt Besluttersen',
  endretAvEnhet: 'Nav Tiltak Oslo',
  endret: new Date('2026-10-15'),
  erForsteGodkjenning: true,
  prisinformasjon: null,
  ...overrides
})

const visHistorikk = (endringsHistorikk: EnkeltplassOkonomiGodkjent) =>
  extractText(
    HistorikkEnkeltplassOkonomiGodkjent({
      endringsHistorikk,
      tiltakskode: Tiltakskode.HOYERE_UTDANNING
    })
  ).join(' ')

const vedtaksdetaljer: NonNullable<
  EnkeltplassOkonomiGodkjent['vedtaksdetaljer']
> = {
  type: HistorikkType.Vedtak,
  fattet: new Date('2026-10-15T12:00:00'),
  fattetAvNav: true,
  opprettetAv: 'Bernt Besluttersen',
  opprettetAvEnhet: 'Nav Tiltak Oslo',
  opprettet: new Date('2026-10-15T11:00:00'),
  startdato: new Date('2026-11-01'),
  sluttdato: new Date('2027-06-30'),
  deltakelsesinnhold: {
    ledetekst: null,
    innhold: [
      {
        tekst: 'Annet',
        innholdskode: INNHOLD_TYPE_ANNET,
        valgt: true,
        beskrivelse: 'Opplæring ved vedtak'
      }
    ]
  },
  opplaringKategorisering: {
    valgteKategoriseringer: [
      {
        type: OpplaringRepresenterer.UTDANNINGSPROGRAM_ID,
        valgteElementer: [
          {
            id: '8288c03d-94cd-4ac2-8d28-6db590b19c71',
            visningsnavn: 'Utdanningsprogram ved vedtak'
          }
        ]
      }
    ],
    valgteSertifiseringer: []
  },
  dagerPerUke: 3,
  deltakelsesprosent: 60,
  bakgrunnsinformasjon: 'Bakgrunn ved vedtak\nAndre linje'
}

describe('HistorikkEnkeltplassOkonomiGodkjent', () => {
  it('viser tittel og tekst for første godkjenning', () => {
    const text = extractText(
      HistorikkEnkeltplassOkonomiGodkjent({
        tiltakskode: Tiltakskode.HOYERE_UTDANNING,
        endringsHistorikk: lagEnkeltplassOkonomiGodkjent()
      })
    ).join(' ')

    expect(text).toContain('Opplæring godkjent')
    expect(text).toContain('Pris og betalingsbetingelser er godkjent')
  })

  it('viser prisinformasjonen ved senere godkjenning', () => {
    const text = extractText(
      HistorikkEnkeltplassOkonomiGodkjent({
        tiltakskode: Tiltakskode.HOYERE_UTDANNING,
        endringsHistorikk: lagEnkeltplassOkonomiGodkjent({
          erForsteGodkjenning: false,
          prisinformasjon: {
            type: PrisinformasjonType.Anskaffelse,
            pris: 20000,
            begrunnelse: null
          }
        })
      })
    ).join(' ')

    expect(text).toContain('Godkjent: Endre pris og betalingsbetingelser')
    expect((text.match(/Godkjent/g) ?? []).length).toBe(2)
    expect(text).not.toContain('vedtak er fattet')
    expect(text).toContain('Nav har kjøpt en plass hos opplæringsstedet')
    expect(text).toContain('Totalkostnaden er')
  })

  it('viser når og av hvem økonomien ble godkjent', () => {
    const text = extractText(
      HistorikkEnkeltplassOkonomiGodkjent({
        tiltakskode: Tiltakskode.HOYERE_UTDANNING,
        endringsHistorikk: lagEnkeltplassOkonomiGodkjent()
      })
    ).join(' ')

    expect(text).toContain('Bernt Besluttersen')
    expect(text).toContain('Nav Tiltak Oslo')
  })

  it('viser bare dato når endretAv og endretAvEnhetmangler', () => {
    const historikk = {
      ...lagEnkeltplassOkonomiGodkjent(),
      endretAv: null,
      endretAvEnhet: null
    } satisfies Extract<
      DeltakerHistorikk,
      { type: HistorikkType.EnkeltplassOkonomiGodkjent }
    >

    const text = extractText(
      HistorikkEnkeltplassOkonomiGodkjent({
        tiltakskode: Tiltakskode.HOYERE_UTDANNING,
        endringsHistorikk: historikk
      })
    ).join(' ')

    expect(text).toContain('Opplæring godkjent')
    expect(text).toContain('Pris og betalingsbetingelser er godkjent')
    expect(text).toContain('Endret')
    expect(text).not.toContain('Bernt Besluttersen')
  })

  it('viser detaljene og prisen fra vedtakstidspunktet ved første godkjenning', () => {
    const text = visHistorikk(
      lagEnkeltplassOkonomiGodkjent({
        vedtaksdetaljer,
        prisinformasjon: {
          type: PrisinformasjonType.Anskaffelse,
          pris: 20000,
          begrunnelse: 'Begrunnelse ved vedtak'
        }
      })
    )

    expect(text).toContain('Detaljer i vedtaket')
    expect(text).toContain('15.10.2026')
    expect(text).toContain('01.11.2026')
    expect(text).toContain('30.06.2027')
    expect(text).toContain('Opplæring ved vedtak')
    expect(text).toContain('Utdanningsprogram ved vedtak')
    expect(text).toContain('3 dager')
    expect(text).toContain('Bakgrunn ved vedtak\nAndre linje')
    expect(text.replaceAll('\u00a0', ' ')).toContain('20 000')
    expect(text).toContain('Begrunnelse ved vedtak')
    expect(text).not.toContain('ikke tilgjengelig')
  })

  it('viser ikke førstegangsvedtakets detaljer ved senere godkjenning', () => {
    const text = visHistorikk(
      lagEnkeltplassOkonomiGodkjent({
        erForsteGodkjenning: false,
        vedtaksdetaljer,
        prisinformasjon: {
          type: PrisinformasjonType.Anskaffelse,
          pris: 35000
        }
      })
    )

    expect(text).toContain('Endringen som ble godkjent')
    expect(text.replaceAll('\u00a0', ' ')).toContain('35 000')
    expect(text).not.toContain('Detaljer i vedtaket')
    expect(text).not.toContain('Bakgrunn ved vedtak')
  })

  it('forklarer manglende vedtaksgrunnlag og viser tilgjengelig historisk pris', () => {
    const text = visHistorikk(
      lagEnkeltplassOkonomiGodkjent({
        prisinformasjon: { type: PrisinformasjonType.Anskaffelse, pris: 20000 }
      })
    )

    expect(text).toContain('Detaljene i vedtaket er ikke tilgjengelige')
    expect(text.replaceAll('\u00a0', ' ')).toContain('20 000')
    expect(text).not.toContain('Historisk prisinformasjon er ikke tilgjengelig')
  })

  it('forklarer manglende historisk pris og viser tilgjengelige vedtaksdetaljer', () => {
    const text = visHistorikk(
      lagEnkeltplassOkonomiGodkjent({ vedtaksdetaljer })
    )

    expect(text).toContain('Historisk prisinformasjon er ikke tilgjengelig')
    expect(text).toContain('Opplæring ved vedtak')
    expect(text).not.toContain('Detaljene i vedtaket er ikke tilgjengelige')
  })

  it('håndterer valgfrie tomme felt i et lagret vedtak', () => {
    const text = visHistorikk(
      lagEnkeltplassOkonomiGodkjent({
        vedtaksdetaljer: {
          ...vedtaksdetaljer,
          startdato: null,
          sluttdato: null,
          deltakelsesinnhold: null,
          opplaringKategorisering: null,
          dagerPerUke: null,
          deltakelsesprosent: null,
          bakgrunnsinformasjon: null
        }
      })
    )

    expect(text).toContain('Vedtak fattet')
    expect(text).not.toContain('Bakgrunnsinfo')
    expect(text).not.toContain('Detaljene i vedtaket er ikke tilgjengelige')
  })

  it('viser historiske tilskuddsbeløp og betalingsbetingelser', () => {
    const text = visHistorikk(
      lagEnkeltplassOkonomiGodkjent({
        vedtaksdetaljer,
        prisinformasjon: {
          type: PrisinformasjonType.Tilskudd,
          tilskudd: [{ type: Tilskuddstype.SKOLEPENGER, pris: 12000 }],
          tilleggsopplysninger: 'Betalingsbetingelser ved vedtak'
        }
      })
    )

    expect(text.replaceAll('\u00a0', ' ')).toContain('12 000')
    expect(text).toContain('Utbetaling skjer når utgiftene er dokumentert')
    expect(text).toContain('Betalingsbetingelser ved vedtak')
  })

  it('viser når vedtaket ikke har kostnader', () => {
    const text = visHistorikk(
      lagEnkeltplassOkonomiGodkjent({
        vedtaksdetaljer,
        prisinformasjon: {
          type: PrisinformasjonType.IngenKostnader,
          tilleggsopplysninger: 'Gratis ved vedtak'
        }
      })
    )

    expect(text).toContain('Nav skal ikke betale for opplæringen')
    expect(text).toContain('Gratis ved vedtak')
  })
})

describe('enkeltplassOkonomiGodkjentSchema', () => {
  it('støtter vedtaksinnslag uten de nye historiske feltene', () => {
    const eldreVedtak = { ...vedtaksdetaljer }
    delete eldreVedtak.startdato
    delete eldreVedtak.sluttdato
    delete eldreVedtak.opplaringKategorisering
    const parsed = vedtakSchema.parse(JSON.parse(JSON.stringify(eldreVedtak)))

    expect(parsed.startdato).toBeUndefined()
    expect(parsed.sluttdato).toBeUndefined()
    expect(parsed.opplaringKategorisering).toBeUndefined()
    expect(parsed.fattet).toEqual(vedtaksdetaljer.fattet)
    expect(parsed.deltakelsesinnhold).toEqual(
      vedtaksdetaljer.deltakelsesinnhold
    )
  })

  it('konverterer historiske datoer i API-responsen', () => {
    const response = JSON.parse(
      JSON.stringify(lagEnkeltplassOkonomiGodkjent({ vedtaksdetaljer }))
    )
    const parsed = enkeltplassOkonomiGodkjentSchema.parse(response)

    expect(parsed.vedtaksdetaljer).toEqual(vedtaksdetaljer)
    expect(parsed.vedtaksdetaljer).toEqual(
      vedtakSchema.parse(response.vedtaksdetaljer)
    )
  })

  it.each([undefined, null])(
    'støtter eldre responser uten detaljer (%s)',
    (detaljer) => {
      const parsed = enkeltplassOkonomiGodkjentSchema.parse(
        JSON.parse(
          JSON.stringify(
            lagEnkeltplassOkonomiGodkjent({ vedtaksdetaljer: detaljer })
          )
        )
      )

      expect(parsed.vedtaksdetaljer).toBe(detaljer)
    }
  )

  it('avviser ugyldige datatyper i vedtaksdetaljene', () => {
    const parsed = enkeltplassOkonomiGodkjentSchema.safeParse(
      JSON.parse(
        JSON.stringify({
          ...lagEnkeltplassOkonomiGodkjent({ vedtaksdetaljer }),
          vedtaksdetaljer: { ...vedtaksdetaljer, dagerPerUke: 'tre' }
        })
      )
    )

    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      expect(parsed.error.issues.map((issue) => issue.path)).toEqual([
        ['vedtaksdetaljer', 'dagerPerUke']
      ])
    }
  })
})
