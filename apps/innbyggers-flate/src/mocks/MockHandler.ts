import dayjs from 'dayjs'
import {
  DeltakerStatusType,
  EMDASH,
  Forslag,
  ForslagEndringAarsakType,
  ForslagEndringType,
  ForslagStatusType,
  HistorikkType,
  ArenaTiltakskode,
  createHistorikk,
  getInnholdForTiltaksType,
  getLedetekst,
  getUtvidetInnhold,
  Oppstartstype
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
  tiltakstype: ArenaTiltakskode
): DeltakerResponse => {
  const yesterday = dayjs().subtract(1, 'day')
  const innhold = getInnholdForTiltaksType(tiltakstype)
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
      tiltakstype: tiltakstype,
      arrangorNavn: 'Den Beste Arrangøren AS',
      oppstartstype: Oppstartstype.LOPENDE,
      startdato: '2022-10-28',
      sluttdato: '2027-12-20'
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
      ledetekst: getLedetekst(tiltakstype),
      innhold: getUtvidetInnhold(innhold)
    },
    vedtaksinformasjon: {
      fattet: harVedtak(statusType) ? yesterday.toString() : null,
      fattetAvNav: false,
      opprettet: yesterday.toString(),
      opprettetAv: 'Navn Navnesen',
      sistEndret: dayjs().toString(),
      sistEndretAv: 'Navn Navnesen',
      sistEndretAvEnhet: 'Nav Fredrikstad'
    },
    adresseDelesMedArrangor: true,
    forslag: [],
    importertFraArena: null,
    deltakelsesmengder: {
      nesteDeltakelsesmengde: sisteDeltakelsesmengde,
      sisteDeltakelsesmengde: sisteDeltakelsesmengde
    }
  }
}

export class MockHandler {
  deltaker: DeltakerResponse | null = null
  deltakerIdNotAllowedToDelete = 'b21654fe-f0e6-4be1-84b5-da72ad6a4c0c'
  statusType = DeltakerStatusType.UTKAST_TIL_PAMELDING
  tiltakstype = ArenaTiltakskode.ARBFORB

  getDeltaker() {
    this.deltaker = createDeltaker(this.statusType, this.tiltakstype)
    return HttpResponse.json(this.deltaker)
  }

  godkjennUtkast() {
    const oppdatertPamelding = this.deltaker
    if (oppdatertPamelding) {
      oppdatertPamelding.status.type = DeltakerStatusType.VENTER_PA_OPPSTART
      if (oppdatertPamelding.vedtaksinformasjon) {
        oppdatertPamelding.vedtaksinformasjon.fattet = dayjs().toString()
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
          .toString()
      } else if (oppdatertPamelding.vedtaksinformasjon) {
        oppdatertPamelding.vedtaksinformasjon.fattet = null
      }
      if (oppdatertPamelding.vedtaksinformasjon) {
        if (harVedtak(status)) {
          oppdatertPamelding.vedtaksinformasjon.fattet = dayjs()
            .subtract(2, 'day')
            .toString()
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

  setTiltakstype(tiltakstype: ArenaTiltakskode) {
    this.tiltakstype = tiltakstype
    const oppdatertDeltaker = this.deltaker

    if (oppdatertDeltaker) {
      oppdatertDeltaker.deltakerliste.tiltakstype = tiltakstype

      const innhold = getInnholdForTiltaksType(tiltakstype)
      oppdatertDeltaker.deltakelsesinnhold = {
        innhold: getUtvidetInnhold(innhold),
        ledetekst: getLedetekst(tiltakstype)
      }

      if (
        tiltakstype === ArenaTiltakskode.ARBFORB ||
        tiltakstype === ArenaTiltakskode.VASV
      ) {
        oppdatertDeltaker.deltakelsesprosent = 80
        oppdatertDeltaker.dagerPerUke = 4
      } else {
        oppdatertDeltaker.deltakelsesprosent = null
        oppdatertDeltaker.dagerPerUke = null
      }
      if (
        tiltakstype === ArenaTiltakskode.DIGIOPPARB ||
        tiltakstype === ArenaTiltakskode.VASV
      ) {
        oppdatertDeltaker.bakgrunnsinformasjon = null
      } else {
        oppdatertDeltaker.bakgrunnsinformasjon = bakgrunnsinformasjon
      }
      this.deltaker = oppdatertDeltaker
      return HttpResponse.json(oppdatertDeltaker)
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
    return HttpResponse.json(createHistorikk())
  }
}
