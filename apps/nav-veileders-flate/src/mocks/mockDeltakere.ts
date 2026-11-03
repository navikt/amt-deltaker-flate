import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import {
  DeltakerlisteStatus,
  DeltakerStatusType,
  erOpplaringstiltak,
  getInnholdForTiltakskode,
  getLedetekst,
  getUtvidetInnhold,
  mockVisningsnavn,
  Oppstartstype,
  Pameldingstype,
  PrisinformasjonType,
  Tilskuddstype,
  Tiltakskode
} from 'deltaker-flate-common'
import { v4 as uuidv4 } from 'uuid'
import { deltakerSchema, DeltakerResponse } from '../api/data/deltaker.ts'
import deltakere from './deltakere.json'
import { lagOpplaringKategoriseringResponse } from './mockKodeverk.ts'

dayjs.extend(duration)

/* HVORDAN BRUKE JSON MOCK DATA
   Legg til en json test-deltaker fra dev miljø,
   fjerne den før commit eller overskriv feltene
   - arrangorNavn
   - visningsnavn
   - arrangor
   - ev vedtaksinformasjon veieder endret av
*/
export const mockDeltakere = () => {
  return {
    enkeltplassUtenRammeavtale_deltar: deltakerSchema.parse(
      deltakere.enkeltplassUtenRammeavtale_deltar
    ),
    AFT_deltar: deltakerSchema.parse(deltakere.AFT_deltar),
    defaultDeltaker: lagDefaultDeltaker()
  }
}

const lagDefaultDeltaker = (): DeltakerResponse => {
  const tiltakskode = Tiltakskode.FAG_OG_YRKESOPPLAERING
  const erEnkeltplass = true
  const statusType = DeltakerStatusType.DELTAR

  const ledetekst = getLedetekst(tiltakskode)
  const innhold = getInnholdForTiltakskode(tiltakskode)

  return {
    deltakerId: uuidv4(),
    fornavn: 'Navn',
    mellomnavn: null,
    etternavn: 'Naversen',
    deltakerliste: {
      deltakerlisteId: uuidv4(),
      deltakerlisteNavn: 'Testliste',
      tiltakskode: {
        kode: tiltakskode,
        visningsnavn: mockVisningsnavn(tiltakskode)
      },
      oppstartstype: Oppstartstype.LOPENDE,
      arrangorNavn: mockArrangorenheter[0].navn,
      arrangor: {
        navn: mockArrangorenheter[0].navn,
        organisasjonsnummer: mockArrangorenheter[0].organisasjonsnummer
      },
      startdato: dayjs().subtract(40, 'day').toDate(),
      sluttdato: dayjs().add(90, 'day').toDate(),
      status: DeltakerlisteStatus.GJENNOMFORES,
      tilgjengeligInnhold: {
        innhold: innhold,
        ledetekst: ledetekst
      },
      erEnkeltplass,
      pameldingstype: Pameldingstype.TRENGER_GODKJENNING,
      oppmoteSted:
        'Fjordgata 7b, 00 Stedet. Inngangsdør rundt svingen. Oppmøte kl. 09:00. ',
      opplaringKategoriseringValg: lagOpplaringKategoriseringResponse(
        tiltakskode,
        erEnkeltplass
      ),
      prisinformasjon: erEnkeltplass
        ? {
            type: PrisinformasjonType.IngenKostnader,
            tilleggsopplysninger: 'Det er gratis.'
          }
        : null,
      prisinformasjonTilGodkjenning: erEnkeltplass
        ? {
            type: PrisinformasjonType.Tilskudd,
            tilskudd: [
              { type: Tilskuddstype.SEMESTERAVGIFT, pris: 2500 },
              { type: Tilskuddstype.SKOLEPENGER, pris: 31000 },
              { type: Tilskuddstype.EKSAMENSGEBYR, pris: 3900 }
            ],
            tilleggsopplysninger:
              '[Fritekst: Etter avtale kan du søke Nav om refusjon for de 2 første årene. Det tredje året skal du dekke selv]'
          }
        : null,
      visningsnavn: {
        tiltakHosArrangorTittel: 'tittel',
        tiltakHosArrangorIngressTekst: 'ingress',
        kladdTiltakHosArrangorTittel: 'kladd-tittel'
      }
    },
    status: {
      id: '85a05446-7211-4bbc-88ad-970f7ef9fb04',
      type: statusType,
      aarsak: null,
      gyldigFra: dayjs().subtract(30, 'day').toDate(),
      gyldigTil: null,
      opprettet: dayjs().subtract(30, 'day').toDate()
    },
    startdato: dayjs().subtract(40, 'day').toDate(),
    sluttdato: dayjs().add(90, 'day').toDate(),
    dagerPerUke: 4,
    deltakelsesprosent: 100,
    bakgrunnsinformasjon: mockBakgrunnsinformasjon,
    deltakelsesinnhold: {
      ledetekst: ledetekst,
      innhold: getUtvidetInnhold(innhold)
    },
    vedtaksinformasjon: {
      fattet: mockHarVedtak(statusType)
        ? dayjs().subtract(3, 'day').toDate()
        : null,
      fattetAvNav: false,
      opprettet: dayjs().subtract(3, 'day').toDate(),
      opprettetAv: 'Navn Navnesen',
      sistEndret: dayjs().toDate(),
      sistEndretAv: 'Navn Navnesen',
      sistEndretAvEnhet: 'Nav Fredrikstad'
    },
    adresseDelesMedArrangor: mockDelesAdresseMedArrangor(tiltakskode),
    kanEndres: true,
    digitalBruker: true,
    harAdresse: true,
    maxVarighet: dayjs.duration(2, 'month').asMilliseconds(),
    softMaxVarighet: erEnkeltplass
      ? null
      : dayjs.duration(6, 'month').asMilliseconds(),
    forslag: [],
    importertFraArena: null,
    erUnderOppfolging: true,
    deltakelsesmengder: {
      sisteDeltakelsesmengde: {
        gyldigFra: dayjs().subtract(30, 'day').toDate(),
        deltakelsesprosent: 100,
        dagerPerUke: 4
      },
      nesteDeltakelsesmengde: null
    },
    erManueltDeltMedArrangor: true
  }
}

export const mockBakgrunnsinformasjon =
  'Ønsker å bli kontaktet via sms\nKan ikke på onsdager'

export const mockHarVedtak = (statusType: DeltakerStatusType) => {
  return (
    statusType !== DeltakerStatusType.KLADD &&
    statusType !== DeltakerStatusType.UTKAST_TIL_PAMELDING &&
    statusType !== DeltakerStatusType.AVBRUTT_UTKAST
  )
}

export const mockDelesAdresseMedArrangor = (tiltakskode: Tiltakskode) => {
  return (
    tiltakskode !== Tiltakskode.JOBBKLUBB &&
    tiltakskode !== Tiltakskode.TILRETTELAGT_ARBEID_ORDINAER &&
    tiltakskode !== Tiltakskode.DIGITALT_OPPFOLGINGSTILTAK &&
    !erOpplaringstiltak(tiltakskode)
  )
}

export const mockArrangorenheter = [
  {
    organisasjonsnummer: '123456789',
    navn: 'Muligheter AS',
    underenheter: [
      {
        organisasjonsnummer: '555555555',
        navn: 'Muligheter Oslo AS'
      },
      {
        organisasjonsnummer: '666666666',
        navn: 'Muligheter Bergen AS'
      }
    ]
  },
  {
    organisasjonsnummer: '111111111',
    navn: 'Den Beste Arrangøren AS',
    underenheter: [
      {
        organisasjonsnummer: '777777777',
        navn: 'Den Beste Arrangøren Oslo AS'
      },
      {
        organisasjonsnummer: '888888888',
        navn: 'Den Beste Arrangøren Bergen AS'
      }
    ]
  },
  {
    organisasjonsnummer: '222222222',
    navn: 'Arrangør og sånt AS',
    underenheter: []
  },
  {
    organisasjonsnummer: '333333333',
    navn: 'Arrangør småfix AS',
    underenheter: []
  },
  {
    organisasjonsnummer: '444444444',
    navn: 'Arrangør og Co AS',
    underenheter: []
  }
]
