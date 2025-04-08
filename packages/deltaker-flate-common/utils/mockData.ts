import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import { v4 as uuidv4 } from 'uuid'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {
  DeltakerStatusAarsakType,
  DeltakerStatusType,
  ArenaTiltakskode,
  Vurderingstype
} from '../model/deltaker'
import {
  ArrangorEndringsType,
  DeltakerHistorikkListe,
  EndringType
} from '../model/deltakerHistorikk'
import {
  ForslagEndringAarsakType,
  ForslagEndringType,
  ForslagStatusType,
  HistorikkType
} from '../model/forslag'
import { INNHOLD_TYPE_ANNET } from './constants'

dayjs.locale(nb)
dayjs.extend(customParseFormat)

export const createHistorikk = (): DeltakerHistorikkListe => {
  return [
    {
      type: HistorikkType.Endring,
      endring: {
        type: EndringType.EndreSluttarsak,
        aarsak: { type: DeltakerStatusAarsakType.IKKE_MOTT, beskrivelse: null },
        begrunnelse: null
      },
      endretAv: 'Navn Navnesen',
      endretAvEnhet: 'Nav Fredrikstad',
      endret: dayjs().subtract(2, 'day').toDate(),
      forslag: {
        id: uuidv4(),
        type: HistorikkType.Forslag,
        opprettet: dayjs().toDate(),
        begrunnelse: null,
        arrangorNavn: 'Muligheter As',
        endring: {
          type: ForslagEndringType.Sluttarsak,
          aarsak: {
            type: ForslagEndringAarsakType.IkkeMott
          }
        },
        status: {
          type: ForslagStatusType.Godkjent,
          godkjent: dayjs().toDate()
        }
      }
    },
    {
      id: uuidv4(),
      type: HistorikkType.Forslag,
      opprettet: dayjs().toDate(),
      begrunnelse: 'Har ikke møtt opp',
      arrangorNavn: 'Muligheter As',
      endring: {
        type: ForslagEndringType.IkkeAktuell,
        aarsak: {
          type: ForslagEndringAarsakType.IkkeMott
        }
      },
      status: {
        type: ForslagStatusType.Erstattet,
        erstattet: dayjs().toDate()
      }
    },
    {
      type: HistorikkType.Endring,
      endring: {
        type: EndringType.EndreSluttdato,
        sluttdato: dayjs().toDate(),
        begrunnelse: null
      },
      endretAv: 'Navn Navnesen',
      endretAvEnhet: 'Nav Fredrikstad',
      endret: dayjs().subtract(2, 'day').toDate(),
      forslag: null
    },
    {
      type: HistorikkType.Endring,
      endring: {
        type: EndringType.EndreStartdato,
        sluttdato: dayjs().toDate(),
        startdato: dayjs().toDate(),
        begrunnelse: null
      },
      endretAv: 'Navn Navnesen',
      endretAvEnhet: 'Nav Fredrikstad',
      endret: dayjs().subtract(2, 'day').toDate(),
      forslag: {
        id: uuidv4(),
        type: HistorikkType.Forslag,
        opprettet: dayjs().toDate(),
        begrunnelse: 'Trenger mer tid',
        arrangorNavn: 'Muligheter As',
        endring: {
          type: ForslagEndringType.Startdato,
          sluttdato: dayjs().add(4, 'month').toDate(),
          startdato: dayjs().add(1, 'month').toDate()
        },
        status: {
          type: ForslagStatusType.Godkjent,
          godkjent: dayjs().toDate()
        }
      }
    },
    {
      type: HistorikkType.Endring,
      endring: {
        type: EndringType.EndreStartdato,
        sluttdato: null,
        startdato: dayjs().toDate(),
        begrunnelse: null
      },
      endretAv: 'Navn Navnesen',
      endretAvEnhet: 'Nav Fredrikstad',
      endret: dayjs().subtract(2, 'day').toDate(),
      forslag: {
        id: uuidv4(),
        type: HistorikkType.Forslag,
        opprettet: dayjs().toDate(),
        begrunnelse: 'Trenger mer tid',
        arrangorNavn: 'Muligheter As',
        endring: {
          type: ForslagEndringType.Startdato,
          sluttdato: null,
          startdato: dayjs().add(1, 'month').toDate()
        },
        status: {
          type: ForslagStatusType.Godkjent,
          godkjent: dayjs().toDate()
        }
      }
    },
    {
      type: HistorikkType.Endring,
      endring: {
        type: EndringType.ReaktiverDeltakelse,
        reaktivertDato: dayjs().toDate(),
        begrunnelse:
          'Det var en feil at deltakelsen ble satt til ikke aktuell, dette er nå rettet.'
      },
      endretAv: 'Navn Navnesen',
      endretAvEnhet: 'Nav Fredrikstad',
      endret: dayjs().subtract(2, 'day').toDate(),
      forslag: null
    },
    {
      type: HistorikkType.Endring,
      endring: {
        type: EndringType.AvsluttDeltakelse,
        aarsak: {
          type: DeltakerStatusAarsakType.FATT_JOBB,
          beskrivelse: null
        },
        sluttdato: dayjs().toDate(),
        begrunnelse: null
      },
      endretAv: 'Navn Navnesen',
      endretAvEnhet: 'Nav Fredrikstad',
      endret: dayjs().subtract(2, 'day').toDate(),
      forslag: {
        id: uuidv4(),
        type: HistorikkType.Forslag,
        opprettet: dayjs().toDate(),
        begrunnelse: 'Trenger mer tid',
        arrangorNavn: 'Muligheter As',
        endring: {
          type: ForslagEndringType.AvsluttDeltakelse,
          sluttdato: dayjs().add(1, 'month').toDate(),
          aarsak: {
            type: ForslagEndringAarsakType.FattJobb
          },
          harDeltatt: true
        },
        status: {
          type: ForslagStatusType.Godkjent,
          godkjent: dayjs().toDate()
        }
      }
    },
    {
      type: HistorikkType.Endring,
      endring: {
        type: EndringType.IkkeAktuell,
        aarsak: {
          type: DeltakerStatusAarsakType.FATT_JOBB,
          beskrivelse: null
        },
        begrunnelse: null
      },
      endretAv: 'Navn Navnesen',
      endretAvEnhet: 'Nav Fredrikstad',
      endret: dayjs().subtract(2, 'day').toDate(),
      forslag: null
    },
    {
      type: HistorikkType.Endring,
      endring: {
        type: EndringType.ForlengDeltakelse,
        sluttdato: dayjs().add(1, 'month').toDate(),
        begrunnelse: 'Forlenger fordi vi må'
      },
      endretAv: 'Navn Navnesen',
      endretAvEnhet: 'Nav Fredrikstad',
      endret: dayjs().subtract(2, 'day').toDate(),
      forslag: {
        id: uuidv4(),
        type: HistorikkType.Forslag,
        opprettet: dayjs().toDate(),
        begrunnelse: 'Trenger mer tid',
        arrangorNavn: 'Muligheter As',
        endring: {
          type: ForslagEndringType.ForlengDeltakelse,
          sluttdato: dayjs().add(1, 'month').toDate()
        },
        status: {
          type: ForslagStatusType.Godkjent,
          godkjent: dayjs().toDate()
        }
      }
    },
    {
      id: uuidv4(),
      type: HistorikkType.Forslag,
      opprettet: dayjs().toDate(),
      begrunnelse: 'Trenger mer tid til hjelp',
      arrangorNavn: 'Muligheter As',
      endring: {
        type: ForslagEndringType.ForlengDeltakelse,
        sluttdato: dayjs().add(1, 'month').toDate()
      },
      status: {
        type: ForslagStatusType.Avvist,
        avvist: dayjs().toDate(),
        avvistAv: 'Navn Navnesen',
        avvistAvEnhet: 'Nav Fredrikstad',
        begrunnelseFraNav: 'Kan ikke forlenge så lenge'
      }
    },
    {
      type: HistorikkType.Endring,
      endring: {
        type: EndringType.EndreDeltakelsesmengde,
        begrunnelse: 'Det er ok.',
        deltakelsesprosent: 80,
        dagerPerUke: 4,
        gyldigFra: dayjs().toDate()
      },
      endretAv: 'Navn Navnesen',
      endretAvEnhet: 'Nav Fredrikstad',
      endret: dayjs().subtract(2, 'day').toDate(),
      forslag: {
        id: uuidv4(),
        type: HistorikkType.Forslag,
        opprettet: dayjs().toDate(),
        begrunnelse: 'Trenger mer tid til hjelp',
        arrangorNavn: 'Muligheter As',
        endring: {
          type: ForslagEndringType.Deltakelsesmengde,
          deltakelsesprosent: 80,
          dagerPerUke: 4,
          gyldigFra: dayjs().toDate()
        },
        status: {
          type: ForslagStatusType.Godkjent,
          godkjent: dayjs().toDate()
        }
      }
    },
    {
      type: HistorikkType.EndringFraArrangor,
      id: uuidv4(),
      opprettet: dayjs().toDate(),
      arrangorNavn: 'Muligheter AS',
      endring: {
        type: ArrangorEndringsType.LeggTilOppstartsdato,
        startdato: dayjs().toDate(),
        sluttdato: dayjs().add(10, 'months').toDate()
      }
    },
    {
      type: HistorikkType.Endring,
      endring: {
        type: EndringType.EndreBakgrunnsinformasjon,
        bakgrunnsinformasjon: ''
      },
      endretAv: 'Navn Navnesen',
      endretAvEnhet: 'Nav Fredrikstad',
      endret: dayjs().subtract(2, 'day').toDate(),
      forslag: null
    },
    {
      type: HistorikkType.Endring,
      endring: {
        type: EndringType.FjernOppstartsdato,
        begrunnelse: 'Fjerner oppstartsdato'
      },
      endretAv: 'Navn Navnesen',
      endretAvEnhet: 'Nav Fredrikstad',
      endret: dayjs().subtract(20, 'day').toDate(),
      forslag: {
        id: uuidv4(),
        type: HistorikkType.Forslag,
        opprettet: dayjs().toDate(),
        begrunnelse: 'Ikke helt klart ennå',
        arrangorNavn: 'Muligheter As',
        endring: {
          type: ForslagEndringType.FjernOppstartsdato
        },
        status: {
          type: ForslagStatusType.Godkjent,
          godkjent: dayjs().toDate()
        }
      }
    },
    {
      type: HistorikkType.Endring,
      endring: {
        type: EndringType.EndreInnhold,
        ledetekst:
          'Arbeidsforberedende trening er et tilbud for deg som først ønsker å jobbe i et tilrettelagt arbeidsmiljø. Du får veiledning og støtte av en veileder. Sammen kartlegger dere hvordan din kompetanse, interesser og ferdigheter påvirker muligheten din til å jobbe.',
        innhold: [
          {
            tekst: 'Støtte til jobbsøking',
            innholdskode: 'type1',
            valgt: true,
            beskrivelse: null
          },
          {
            tekst: 'Karriereveiledning',
            innholdskode: 'type2',
            valgt: false,
            beskrivelse: null
          }
        ]
      },
      endretAv: 'Navn Navnesen',
      endretAvEnhet: 'Nav Fredrikstad',
      endret: dayjs().subtract(2, 'day').toDate(),
      forslag: null
    },
    {
      type: HistorikkType.Vedtak,
      fattet: dayjs().subtract(10, 'days').toDate(),
      bakgrunnsinformasjon: 'Bakgrunnsinformasjon',
      fattetAvNav: true,
      dagerPerUke: null,
      deltakelsesprosent: 100,
      deltakelsesinnhold: {
        ledetekst:
          'Du får tett oppfølging og støtte av en veileder. Sammen kartlegger dere hvordan din kompetanse, interesser og ferdigheter påvirker muligheten din til å jobbe.',
        innhold: [
          {
            tekst: 'Støtte til jobbsøking',
            innholdskode: 'type1',
            valgt: true,
            beskrivelse: null
          }
        ]
      },
      opprettetAv: 'Navn Navnesen',
      opprettetAvEnhet: 'Nav Fredrikstad',
      opprettet: dayjs().subtract(3, 'day').toDate()
    },
    {
      type: HistorikkType.SoktInn,
      soktInn: dayjs().subtract(10, 'days').toDate(),
      soktInnAvNav: false,
      deltakelsesinnhold: null,
      opprettetAv: 'Navn Navnesen',
      opprettetAvEnhet: 'Nav Fredrikstad',
      opprettet: dayjs().subtract(3, 'day').toDate()
    },
    {
      type: HistorikkType.ImportertFraArena,
      importertDato: dayjs().subtract(10, 'days').toDate(),
      dagerPerUke: null,
      deltakelsesprosent: 100,
      startdato: dayjs().subtract(3, 'day').toDate(),
      sluttdato: dayjs().add(3, 'day').toDate(),
      status: {
        id: '85a05446-7211-4bbc-88ad-970f7ef9fb04',
        type: DeltakerStatusType.DELTAR,
        aarsak: null,
        gyldigFra: dayjs().subtract(17, 'day').toDate(),
        gyldigTil: null,
        opprettet: dayjs().subtract(17, 'days').toDate()
      }
    },
    {
      type: HistorikkType.VurderingFraArrangor,
      vurderingstype: Vurderingstype.OPPFYLLER_IKKE_KRAVENE,
      begrunnelse: 'Oppfyller ikke kravene',
      opprettetDato: dayjs().subtract(17, 'day').toDate(),
      endretAv: 'Nav'
    }
  ]
}

export const getLedetekst = (tiltakstype: ArenaTiltakskode) => {
  switch (tiltakstype) {
    case ArenaTiltakskode.ARBFORB:
      return 'Arbeidsforberedende trening er et tilbud for deg som først ønsker å jobbe i et tilrettelagt arbeidsmiljø. Du får veiledning og støtte av en veileder. Sammen kartlegger dere hvordan din kompetanse, interesser og ferdigheter påvirker muligheten din til å jobbe.'
    case ArenaTiltakskode.ARBRRHDAG:
      return 'Arbeidsrettet rehabilitering fokuserer på din helse og muligheter i arbeidslivet. Du får veiledning og støtte av en veileder. Sammen kartlegger dere hvordan din helse, kompetanse, interesser og ferdigheter påvirker muligheten din til å jobbe.'
    case ArenaTiltakskode.AVKLARAG:
      return 'Avklaring skal hjelpe deg med å se hva du kan jobbe med. Du har samtaler med en veileder. Sammen kartlegger dere hvordan kompetanse, opplevelser fra tidligere arbeidsplass, interesser og ferdigheter påvirker muligheten din til å jobbe.'
    case ArenaTiltakskode.INDOPPFAG:
      return 'Du får tett oppfølging og støtte av en veileder. Sammen kartlegger dere hvordan din kompetanse, interesser og ferdigheter påvirker muligheten din til å jobbe.'
    case ArenaTiltakskode.VASV:
      return 'Varig tilrettelagt arbeid er et tilbud for deg som får uføretrygd. Du jobber i en skjermet bedrift med arbeidsoppgaver som er tilpasset deg.'
    case ArenaTiltakskode.DIGIOPPARB:
    case ArenaTiltakskode.JOBBK:
      return 'Du får oppfølging og støtte til jobbsøkingen. På kurset får du karriereveiledning, hjelp til å orientere deg på arbeidsmarkedet, skrive CV og jobbsøknad og trene på jobbintervju.'
    default:
      return null
  }
}

type TilgjengeligInnhold = {
  tekst: string
  innholdskode: string
}

export const getInnholdForTiltaksType = (
  tiltakstype: ArenaTiltakskode
): TilgjengeligInnhold[] => {
  const annet = { tekst: 'Annet', innholdskode: INNHOLD_TYPE_ANNET }
  switch (tiltakstype) {
    case ArenaTiltakskode.ARBFORB:
      return [
        { tekst: 'Arbeidspraksis', innholdskode: 'arbeidspraksis' },
        { tekst: 'Karriereveiledning', innholdskode: 'karriereveiledning' },
        {
          tekst:
            'Kartlegge hvordan helsen din påvirker muligheten din til å jobbe',
          innholdskode: 'kartlegge-helse'
        },
        {
          tekst:
            'Kartlegge grunnleggende ferdigheter som språk og hvordan du leser, skriver, regner og bruker datamaskin',
          innholdskode: 'kartlegge-grunnleggende-ferdigheter'
        },
        {
          tekst: 'Veiledning i sosial mestring',
          innholdskode: 'veiledning-sosialt'
        },
        {
          tekst: 'Oppfølging på arbeidsplassen',
          innholdskode: 'oppfolging-arbeidsplassen'
        },
        {
          tekst: 'Hjelp til å tilpasse arbeidsoppgaver og arbeidsplassen',
          innholdskode: 'tilpasse-arbeidsoppgaver'
        },
        annet
      ]
    case ArenaTiltakskode.ARBRRHDAG:
      return [
        { tekst: 'Arbeidsutprøving', innholdskode: 'arbeidsutprøving' },
        {
          tekst:
            'Kartlegge hvordan helsen din påvirker muligheten din til å jobbe',
          innholdskode: 'kartlegge-helse'
        },
        {
          tekst: 'Kartlegge dine forventninger til å jobbe',
          innholdskode: 'kartlegge-forventninger'
        },
        {
          tekst:
            'Kartlegge hvilken støtte og tilpasning du trenger på arbeidsplassen',
          innholdskode: 'kartlegge-arbeidsplassen'
        },
        {
          tekst: 'Veiledning om livsstil og kosthold',
          innholdskode: 'veiledning-livsstil'
        },
        {
          tekst: 'Motivasjons- og mestringsaktiviteter',
          innholdskode: 'motivasjon'
        },
        {
          tekst: 'Veiledning i sosial mestring',
          innholdskode: 'veiledning-sosialt'
        },
        {
          tekst: 'Individuelt treningsopplegg med veiledning',
          innholdskode: 'veiledning-trening'
        },
        {
          tekst: 'Oppfølging på arbeidsplassen',
          innholdskode: 'oppfolging-arbeidsplassen'
        },
        {
          tekst: 'Veiledning til arbeidsgiver',
          innholdskode: 'veiledning-arbeidsgiver'
        },
        {
          tekst: 'Hjelp til å tilpasse arbeidsoppgaver og arbeidsplassen',
          innholdskode: 'tilpasse-arbeidsoppgaver'
        },
        annet
      ]
    case ArenaTiltakskode.AVKLARAG:
      return [
        { tekst: 'Arbeidsutprøving', innholdskode: 'arbeidsutprøving' },
        { tekst: 'Karriereveiledning', innholdskode: 'karriereveiledning' },
        {
          tekst:
            'Kartlegge hvordan helsen din påvirker muligheten din til å jobbe',
          innholdskode: 'kartlegge-helse'
        },
        {
          tekst: 'Kartlegge dine forventninger til å jobbe',
          innholdskode: 'kartlegge-forventninger'
        },
        {
          tekst:
            'Kartlegge hvilken støtte og tilpasning du trenger på arbeidsplassen',
          innholdskode: 'kartlegge-arbeidsplassen'
        },
        {
          tekst:
            'Kartlegge hvilken støtte du trenger for å delta på et arbeidsmarkedstiltak',
          innholdskode: 'kartlegge-delta-tiltak'
        },
        {
          tekst:
            'Kartlegge grunnleggende ferdigheter som språk og hvordan du leser, skriver, regner og bruker datamaskin',
          innholdskode: 'kartlegge-grunnleggende-ferdigheter'
        },
        {
          tekst: 'Oppfølging på arbeidsplassen',
          innholdskode: 'oppfolging-arbeidsplassen'
        },
        {
          tekst: 'Veiledning til arbeidsgiver',
          innholdskode: 'veiledning-arbeidsgiver'
        },
        annet
      ]
    case ArenaTiltakskode.INDOPPFAG:
      return [
        { tekst: 'Støtte til å søke jobber', innholdskode: 'jobbsoking' },
        { tekst: 'Arbeidspraksis', innholdskode: 'arbeidspraksis' },
        { tekst: 'Karriereveiledning', innholdskode: 'karriereveiledning' },
        {
          tekst:
            'Kartlegge hvordan helsen din påvirker muligheten din til å jobbe',
          innholdskode: 'kartlegge-helse'
        },
        {
          tekst: 'Kartlegge dine forventninger til å jobbe',
          innholdskode: 'kartlegge-forventninger'
        },
        {
          tekst:
            'Kartlegge hvilken støtte og tilpasning du trenger på arbeidsplassen',
          innholdskode: 'kartlegge-arbeidsplassen'
        },
        {
          tekst: 'Veiledning i sosial mestring',
          innholdskode: 'veiledning-sosialt'
        },
        {
          tekst: 'Oppfølging på arbeidsplassen',
          innholdskode: 'oppfolging-arbeidsplassen'
        },
        {
          tekst: 'Veiledning til arbeidsgiver',
          innholdskode: 'veiledning-arbeidsgiver'
        },
        {
          tekst: 'Hjelp til å tilpasse arbeidsoppgaver og arbeidsplassen',
          innholdskode: 'tilpasse-arbeidsoppgaver'
        },
        annet
      ]
    case ArenaTiltakskode.VASV:
      return [annet]
    case ArenaTiltakskode.DIGIOPPARB:
    default:
      return []
  }
}

export const getUtvidetInnhold = (innhold: TilgjengeligInnhold[]) =>
  innhold.map((i) => {
    const valgt = Math.random() >= 0.5
    const erAnnet = i.innholdskode === INNHOLD_TYPE_ANNET
    return {
      tekst: i.tekst,
      innholdskode: i.innholdskode,
      valgt: valgt,
      beskrivelse:
        valgt && erAnnet
          ? 'Ønsker å kartlegge arbeidsutprøving \nTeste ulike verktøy'
          : null
    }
  })
