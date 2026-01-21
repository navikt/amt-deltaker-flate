import dayjs from 'dayjs'
import {
  DeltakerStatusType,
  EMDASH,
  Forslag,
  ForslagEndringAarsakType,
  ForslagEndringType,
  ForslagStatusType,
  HistorikkType,
  Oppstartstype,
  Pameldingstype,
  Tiltakskode,
  createHistorikk,
  getInnholdForTiltakskode,
  getLedetekst,
  getUtvidetInnhold,
  harBakgrunnsinfo,
  lagHistorikkFellesOppstart
} from 'deltaker-flate-common'
import { HttpResponse } from 'msw'
import { v4 as uuidv4 } from 'uuid'
import { DeltakerResponse } from '../api/data/deltaker.ts'

const bakgrunnsinformasjon =
  'Ønsker å bli kontaktet via sms\nKan ikke på onsdager'
const harVedtak = (statusType: DeltakerStatusType) => {
  return (
    statusType !== DeltakerStatusType.KLADD &&
    statusType !== DeltakerStatusType.UTKAST_TIL_PAMELDING &&
    statusType !== DeltakerStatusType.AVBRUTT_UTKAST
  )
}

export const createDeltaker = (
  statusType: DeltakerStatusType,
  tiltakskode: Tiltakskode
): DeltakerResponse => {
  const yesterday = dayjs().subtract(1, 'day')
  const innhold = getInnholdForTiltakskode(tiltakskode)
  const dagerPerUke = 1
  const deltakelsesprosent = 10

  const sisteDeltakelsesmengde = {
    gyldigFra: dayjs().add(1, 'week').toDate(),
    deltakelsesprosent: 100,
    dagerPerUke: null
  }

  return {
    deltakerId: uuidv4(),
    deltakerliste: {
      deltakerlisteId: '450e0f37-c4bb-4611-ac66-f725e05bad3e',
      deltakerlisteNavn: 'Testliste',
      tiltakskode: tiltakskode,
      arrangorNavn: 'Den Beste Arrangøren AS',
      oppstartstype: Oppstartstype.LOPENDE,
      pameldingstype: Pameldingstype.DIREKTE_VEDTAK,
      startdato: dayjs('2022-10-28').toDate(),
      sluttdato: dayjs('2027-12-20').toDate(),
      erEnkeltplassUtenRammeavtale: false,
      oppmoteSted:
        'Fjordgata 7b, 00 Stedet. Inngangsdør rundt svingen. Oppmøte kl. 09:00. '
    },
    status: {
      id: '5ac4076b-7b09-4883-9db1-bc181bd8d4f8',
      type: statusType,
      aarsak: null,
      gyldigFra: yesterday.toDate(),
      gyldigTil: null,
      opprettet: yesterday.toDate()
    },
    startdato: EMDASH,
    sluttdato: EMDASH,
    dagerPerUke: dagerPerUke,
    deltakelsesprosent: deltakelsesprosent,
    bakgrunnsinformasjon: bakgrunnsinformasjon,
    deltakelsesinnhold: {
      ledetekst: getLedetekst(tiltakskode),
      innhold: getUtvidetInnhold(innhold)
    },
    vedtaksinformasjon: {
      fattet: harVedtak(statusType) ? yesterday.toDate() : null,
      fattetAvNav: false,
      opprettet: yesterday.toDate(),
      opprettetAv: 'Navn Navnesen',
      sistEndret: dayjs().toDate(),
      sistEndretAv: 'Navn Navnesen',
      sistEndretAvEnhet: 'Nav Fredrikstad'
    },
    adresseDelesMedArrangor: true,
    forslag: [],
    importertFraArena: null,
    deltakelsesmengder: {
      nesteDeltakelsesmengde: sisteDeltakelsesmengde,
      sisteDeltakelsesmengde: sisteDeltakelsesmengde
    },
    erManueltDeltMedArrangor: true
  }
}

export class MockHandler {
  deltaker: DeltakerResponse | null = null
  deltakerIdNotAllowedToDelete = 'b21654fe-f0e6-4be1-84b5-da72ad6a4c0c'
  statusType = DeltakerStatusType.UTKAST_TIL_PAMELDING
  tiltakskode = Tiltakskode.ARBEIDSFORBEREDENDE_TRENING

  getDeltaker() {
    this.deltaker = createDeltaker(this.statusType, this.tiltakskode)
    return HttpResponse.json(this.deltaker)
  }

  godkjennUtkast() {
    const oppdatertPamelding = this.deltaker
    if (oppdatertPamelding) {
      oppdatertPamelding.status.type = DeltakerStatusType.VENTER_PA_OPPSTART
      if (oppdatertPamelding.vedtaksinformasjon) {
        oppdatertPamelding.vedtaksinformasjon.fattet = dayjs().toDate()
      }
      this.deltaker = oppdatertPamelding
      return HttpResponse.json(oppdatertPamelding)
    }
    return HttpResponse.json(this.deltaker)
  }

  setStatus(status: DeltakerStatusType) {
    this.statusType = status
    const oppdatertPamelding = this.deltaker

    if (oppdatertPamelding) {
      if (harVedtak(status) && oppdatertPamelding.vedtaksinformasjon) {
        oppdatertPamelding.vedtaksinformasjon.fattet = dayjs()
          .subtract(2, 'day')
          .toDate()
      } else if (oppdatertPamelding.vedtaksinformasjon) {
        oppdatertPamelding.vedtaksinformasjon.fattet = null
      }
      if (oppdatertPamelding.vedtaksinformasjon) {
        if (harVedtak(status)) {
          oppdatertPamelding.vedtaksinformasjon.fattet = dayjs()
            .subtract(2, 'day')
            .toDate()
        } else {
          oppdatertPamelding.vedtaksinformasjon.fattet = null
        }
      }

      oppdatertPamelding.status.type = status
      oppdatertPamelding.startdato = this.getStartdato(status)
      oppdatertPamelding.sluttdato = this.getSluttdato(status)
      oppdatertPamelding.forslag = this.getForslag()
      this.deltaker = oppdatertPamelding
      return HttpResponse.json(oppdatertPamelding)
    }
    return HttpResponse.json(this.deltaker)
  }

  setTiltakskode(tiltakskode: Tiltakskode) {
    this.tiltakskode = tiltakskode
    const oppdatertDeltaker = this.deltaker
    const erEnkeltplassFraArena =
      tiltakskode === Tiltakskode.ENKELTPLASS_ARBEIDSMARKEDSOPPLAERING ||
      tiltakskode === Tiltakskode.ENKELTPLASS_FAG_OG_YRKESOPPLAERING ||
      tiltakskode === Tiltakskode.HOYERE_UTDANNING

    if (oppdatertDeltaker) {
      oppdatertDeltaker.deltakerliste.tiltakskode = tiltakskode

      const innhold = getInnholdForTiltakskode(tiltakskode)
      oppdatertDeltaker.deltakelsesinnhold = {
        innhold: getUtvidetInnhold(innhold),
        ledetekst: getLedetekst(tiltakskode)
      }

      if (
        tiltakskode === Tiltakskode.ARBEIDSFORBEREDENDE_TRENING ||
        tiltakskode === Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET
      ) {
        oppdatertDeltaker.deltakelsesprosent = 80
        oppdatertDeltaker.dagerPerUke = 4
      } else {
        oppdatertDeltaker.deltakelsesprosent = null
        oppdatertDeltaker.dagerPerUke = null
      }
      if (harBakgrunnsinfo(tiltakskode)) {
        oppdatertDeltaker.bakgrunnsinformasjon = bakgrunnsinformasjon
      } else {
        oppdatertDeltaker.bakgrunnsinformasjon = null
      }

      if (erEnkeltplassFraArena) {
        oppdatertDeltaker.deltakerliste.erEnkeltplassUtenRammeavtale = true
        oppdatertDeltaker.forslag = []
        oppdatertDeltaker.importertFraArena = {
          innsoktDato: dayjs().subtract(20, 'day').toDate()
        }
      } else {
        oppdatertDeltaker.importertFraArena = null
        oppdatertDeltaker.deltakerliste.erEnkeltplassUtenRammeavtale = false
      }

      this.deltaker = oppdatertDeltaker
    }
    return HttpResponse.json(this.deltaker)
  }

  setOppstartstype(oppstartstype: Oppstartstype) {
    const oppdatertDeltaker = this.deltaker

    if (oppdatertDeltaker) {
      oppdatertDeltaker.deltakerliste.oppstartstype = oppstartstype
      this.deltaker = oppdatertDeltaker
    }
    return HttpResponse.json(this.deltaker)
  }

  setPameldingstype(pameldingstype: Pameldingstype) {
    const oppdatertDeltaker = this.deltaker

    if (oppdatertDeltaker) {
      oppdatertDeltaker.deltakerliste.pameldingstype = pameldingstype
      this.deltaker = oppdatertDeltaker
    }
    return HttpResponse.json(this.deltaker)
  }

  getStartdato(nyStatus: DeltakerStatusType): string {
    if (
      nyStatus === DeltakerStatusType.DELTAR ||
      nyStatus === DeltakerStatusType.HAR_SLUTTET
    ) {
      const passertDato = new Date()
      passertDato.setDate(passertDato.getDate() - 15)
      return dayjs(passertDato).format('YYYY-MM-DD')
    }
    return EMDASH
  }

  getSluttdato(nyStatus: DeltakerStatusType): string {
    if (nyStatus === DeltakerStatusType.DELTAR) {
      const fremtidigDato = new Date()
      fremtidigDato.setDate(fremtidigDato.getDate() + 10)
      return dayjs(fremtidigDato).format('YYYY-MM-DD')
    }
    if (nyStatus === DeltakerStatusType.HAR_SLUTTET) {
      const passertDato = new Date()
      passertDato.setDate(passertDato.getDate() - 10)
      return dayjs(passertDato).format('YYYY-MM-DD')
    }
    return EMDASH
  }

  getForslag(): Forslag[] {
    if (this.statusType === DeltakerStatusType.DELTAR) {
      const fremtidigDato = new Date()
      fremtidigDato.setDate(fremtidigDato.getDate() + 12)
      const sluttdato = dayjs(fremtidigDato).format('YYYY-MM-DD')
      const forslag: Forslag = {
        id: uuidv4(),
        type: HistorikkType.Forslag,
        opprettet: dayjs().toDate(),
        begrunnelse:
          'Vi har kommet i gang, men ser at det er hensiktsmessig ' +
          'å fortsette tett oppfølging nå når han er i gang med å kontakte de riktige arbeidsgiverne. ' +
          'nå er det totalt sett to hundre tegn. Ja, det er det..',
        arrangorNavn: 'Muligheter As',
        endring: {
          type: ForslagEndringType.ForlengDeltakelse,
          sluttdato: dayjs(sluttdato).toDate()
        },
        status: {
          type: ForslagStatusType.VenterPaSvar
        }
      }
      const forslagAvslutt: Forslag = {
        id: uuidv4(),
        type: HistorikkType.Forslag,
        opprettet: dayjs().toDate(),
        begrunnelse: 'Må avslutte deltakelsen',
        arrangorNavn: 'Muligheter As',
        endring: {
          type: ForslagEndringType.AvsluttDeltakelse,
          sluttdato: dayjs(sluttdato).toDate(),
          aarsak: {
            type: ForslagEndringAarsakType.Syk
          },
          harDeltatt: true
        },
        status: {
          type: ForslagStatusType.VenterPaSvar
        }
      }
      const forslagMengde: Forslag = {
        id: uuidv4(),
        type: HistorikkType.Forslag,
        opprettet: dayjs().toDate(),
        begrunnelse: 'Må avslutte deltakelsen',
        arrangorNavn: 'Muligheter As',
        endring: {
          type: ForslagEndringType.Deltakelsesmengde,
          gyldigFra: dayjs().add(2, 'weeks').toDate(),
          deltakelsesprosent: 42,
          dagerPerUke: 3
        },
        status: {
          type: ForslagStatusType.VenterPaSvar
        }
      }
      return [forslag, forslagAvslutt, forslagMengde]
    }
    if (this.statusType === DeltakerStatusType.VENTER_PA_OPPSTART) {
      const forslagIkkeAktuell: Forslag = {
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
          type: ForslagStatusType.VenterPaSvar
        }
      }
      return [forslagIkkeAktuell]
    }
    return []
  }

  getHistorikk() {
    return HttpResponse.json(
      this.deltaker?.deltakerliste.oppstartstype === Oppstartstype.FELLES
        ? lagHistorikkFellesOppstart()
        : createHistorikk()
    )
  }
}
