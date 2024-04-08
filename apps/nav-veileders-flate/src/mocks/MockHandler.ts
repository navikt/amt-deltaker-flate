import {
  DeltakerStatusType,
  PameldingResponse,
  Tiltakstype
} from '../api/data/pamelding.ts'
import { v4 as uuidv4 } from 'uuid'
import { HttpResponse } from 'msw'
import { SendInnPameldingRequest } from '../api/data/send-inn-pamelding-request.ts'
import { SendInnPameldingUtenGodkjenningRequest } from '../api/data/send-inn-pamelding-uten-godkjenning-request.ts'
import {
  AvsluttDeltakelseRequest,
  EndreSluttdatoRequest,
  EndreBakgrunnsinfoRequest,
  EndreStartdatoRequest,
  ForlengDeltakelseRequest,
  IkkeAktuellRequest,
  EndreSluttarsakRequest,
  EndreInnholdRequest,
  EndreDeltakelsesmengdeRequest
} from '../api/data/endre-deltakelse-request.ts'
import { EMDASH, INNHOLD_TYPE_ANNET } from '../utils/utils.ts'
import dayjs from 'dayjs'

export const getPameldingUtenInnhold = (
  statusType: DeltakerStatusType
): PameldingResponse => {
  const yesterday = dayjs().subtract(1, 'day')
  const harVedak =
    statusType !== DeltakerStatusType.KLADD &&
    statusType !== DeltakerStatusType.UTKAST_TIL_PAMELDING &&
    statusType !== DeltakerStatusType.AVBRUTT_UTKAST

  return {
    deltakerId: uuidv4(),
    fornavn: 'Pequeño',
    mellomnavn: null,
    etternavn: 'Plass',
    deltakerliste: {
      deltakerlisteId: '450e0f37-c4bb-4611-ac66-f725e05bad3e',
      deltakerlisteNavn: 'avklaring- Tinn org. - Lars',
      tiltakstype: Tiltakstype.AVKLARAG,
      arrangorNavn: 'TINN KOMMUNE ORGANISASJON',
      oppstartstype: 'LOPENDE',
      startdato: '2022-10-28',
      sluttdato: '2027-12-20'
    },
    status: {
      id: '5ac4076b-7b09-4883-9db1-bc181bd8d4f8',
      type: statusType,
      aarsak: null,
      gyldigFra: yesterday.toString(),
      gyldigTil: EMDASH,
      opprettet: yesterday.toString()
    },
    startdato: EMDASH,
    sluttdato: EMDASH,
    dagerPerUke: null,
    deltakelsesprosent: null,
    bakgrunnsinformasjon: null,
    deltakelsesinnhold: null,
    vedtaksinformasjon: {
      fattet: harVedak ? yesterday.toString() : null,
      fattetAvNav: false,
      opprettet: yesterday.toString(),
      opprettetAv: 'Navn Navnesen',
      sistEndret: dayjs().toString(),
      sistEndretAv: 'Navn Navnesen',
      sistEndretAvEnhet: 'NAV Fredrikstad'
    },
    adresseDelesMedArrangor: true,
    kanEndres: true
  }
}

export class MockHandler {
  pamelding: PameldingResponse | null = null
  deltakerIdNotAllowedToDelete = 'b21654fe-f0e6-4be1-84b5-da72ad6a4c0c'
  statusType = DeltakerStatusType.KLADD

  createPamelding(deltakerlisteId: string): HttpResponse {
    const yesterday = dayjs().subtract(1, 'day')
    const today = dayjs()
    const harVedak =
      this.statusType !== DeltakerStatusType.KLADD &&
      this.statusType !== DeltakerStatusType.UTKAST_TIL_PAMELDING &&
      this.statusType !== DeltakerStatusType.AVBRUTT_UTKAST

    const nyPamelding: PameldingResponse = {
      deltakerId: uuidv4(),
      fornavn: 'Navn',
      mellomnavn: null,
      etternavn: 'Naversen',
      deltakerliste: {
        deltakerlisteId: deltakerlisteId,
        deltakerlisteNavn: 'Testliste',
        tiltakstype: Tiltakstype.AVKLARAG,
        arrangorNavn: 'Den Beste Arrangøren AS',
        oppstartstype: 'LOPENDE',
        startdato: '2022-10-28',
        sluttdato: '2025-02-20'
      },
      status: {
        id: '85a05446-7211-4bbc-88ad-970f7ef9fb04',
        type: this.statusType,
        aarsak: null,
        gyldigFra: yesterday.toString(),
        gyldigTil: EMDASH,
        opprettet: yesterday.toString()
      },
      startdato: null,
      sluttdato: null,
      dagerPerUke: null,
      deltakelsesprosent: 100,
      bakgrunnsinformasjon: null,
      deltakelsesinnhold: {
        ledetekst:
          'Du får tett oppfølging og støtte av en veileder. Sammen Kartlegger dere hvordan din kompetanse, interesser og ferdigheter påvirker muligheten din til å jobbe.',
        innhold: [
          {
            tekst: 'Støtte til jobbsøking',
            innholdskode: 'type1',
            valgt: false,
            beskrivelse: null
          },
          {
            tekst: 'Karriereveiledning',
            innholdskode: 'type2',
            valgt: false,
            beskrivelse: null
          },
          {
            tekst:
              'Kartlegge hvordan helsen din påvirker muligheten din til å jobbe',
            innholdskode: 'type3',
            valgt: false,
            beskrivelse: null
          },
          {
            tekst:
              'Kartlegge hvilken støtte og tilpasning du trenger på arbeidsplassen',
            innholdskode: 'type4',
            valgt: false,
            beskrivelse: null
          },
          {
            tekst: 'Kartlegge dine forventninger til å jobbe',
            innholdskode: 'type5',
            valgt: false,
            beskrivelse: null
          },
          {
            tekst: 'Veiledning i sosial mestring',
            innholdskode: 'type6',
            valgt: false,
            beskrivelse: null
          },
          {
            tekst: 'Hjelp til å tilpasse arbeidsoppgaver og arbeidsplassen',
            innholdskode: 'type7',
            valgt: false,
            beskrivelse: null
          },
          {
            tekst: 'Veiledning til arbeidsgiver',
            innholdskode: 'type8',
            valgt: false,
            beskrivelse: null
          },
          {
            tekst: 'Oppfølging på arbeidsplassen',
            innholdskode: 'type9',
            valgt: true,
            beskrivelse: null
          },
          {
            tekst: 'Arbeidspraksis',
            innholdskode: 'type10',
            valgt: false,
            beskrivelse: null
          },
          {
            tekst: 'Annet',
            innholdskode: INNHOLD_TYPE_ANNET,
            valgt: true,
            beskrivelse: 'Beskrivelse av annet mål'
          }
        ]
      },
      vedtaksinformasjon: {
        fattet: harVedak ? yesterday.toString() : null,
        fattetAvNav: false,
        opprettet: yesterday.toString(),
        opprettetAv: 'Navn Navnesen',
        sistEndret: today.toString(),
        sistEndretAv: 'Navn Navnesen',
        sistEndretAvEnhet: 'NAV Fredrikstad'
      },
      adresseDelesMedArrangor: true,
      kanEndres: true
    }

    this.pamelding = nyPamelding
    return HttpResponse.json(nyPamelding)
  }

  getStartdato(): string {
    if (
      this.statusType === DeltakerStatusType.DELTAR ||
      this.statusType === DeltakerStatusType.HAR_SLUTTET
    ) {
      const passertDato = new Date()
      passertDato.setDate(passertDato.getDate() - 15)
      return dayjs(passertDato).format('YYYY-MM-DD')
    }
    return EMDASH
  }

  getSluttdato(): string {
    if (this.statusType === DeltakerStatusType.DELTAR) {
      const fremtidigDato = new Date()
      fremtidigDato.setDate(fremtidigDato.getDate() + 10)
      return dayjs(fremtidigDato).format('YYYY-MM-DD')
    }
    if (this.statusType === DeltakerStatusType.HAR_SLUTTET) {
      const passertDato = new Date()
      passertDato.setDate(passertDato.getDate() - 10)
      return dayjs(passertDato).format('YYYY-MM-DD')
    }
    return EMDASH
  }

  deletePamelding(deltakerId: string): HttpResponse {
    if (deltakerId === this.deltakerIdNotAllowedToDelete) {
      return new HttpResponse(null, { status: 400 })
    }

    if (this.pamelding?.deltakerId === deltakerId) {
      this.pamelding = null
      return new HttpResponse(null, { status: 200 })
    }

    return new HttpResponse(null, { status: 404 })
  }

  sendInnPamelding(
    deltakerId: string,
    request: SendInnPameldingRequest
  ): HttpResponse {
    // eslint-disable-next-line no-console
    console.log(deltakerId, request)
    return new HttpResponse(null, { status: 200 })
  }

  sendInnPameldingUtenGodkjenning(
    deltakerId: string,
    request: SendInnPameldingUtenGodkjenningRequest
  ): HttpResponse {
    // eslint-disable-next-line no-console
    console.log(deltakerId, request)
    return new HttpResponse(null, { status: 200 })
  }

  setStatus(status: DeltakerStatusType) {
    this.statusType = status
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      oppdatertPamelding.status.type = status
      oppdatertPamelding.startdato = this.getStartdato()
      oppdatertPamelding.sluttdato = this.getSluttdato()
      this.pamelding = oppdatertPamelding
      return HttpResponse.json(oppdatertPamelding)
    }
    return HttpResponse.json(this.pamelding)
  }

  endreDeltakelseIkkeAktuell(request: IkkeAktuellRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      oppdatertPamelding.status.type = DeltakerStatusType.IKKE_AKTUELL
      oppdatertPamelding.status.aarsak = request.aarsak
      oppdatertPamelding.startdato = null
      oppdatertPamelding.sluttdato = null
      this.pamelding = oppdatertPamelding
      return HttpResponse.json(oppdatertPamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseForleng(request: ForlengDeltakelseRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      oppdatertPamelding.sluttdato = request.sluttdato
      this.pamelding = oppdatertPamelding
      return HttpResponse.json(oppdatertPamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseStartdato(request: EndreStartdatoRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      oppdatertPamelding.startdato = request.startdato
      oppdatertPamelding.sluttdato = request.sluttdato
      this.pamelding = oppdatertPamelding
      return HttpResponse.json(oppdatertPamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseBakgrunnsinfo(request: EndreBakgrunnsinfoRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      oppdatertPamelding.bakgrunnsinformasjon = request.bakgrunnsinformasjon
      this.pamelding = oppdatertPamelding
      return HttpResponse.json(oppdatertPamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseSluttdato(request: EndreSluttdatoRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      oppdatertPamelding.sluttdato = request.sluttdato
      this.pamelding = oppdatertPamelding
      return HttpResponse.json(oppdatertPamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  avsluttDeltakelse(request: AvsluttDeltakelseRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      if (request.harDeltatt === false) {
        oppdatertPamelding.status.type = DeltakerStatusType.IKKE_AKTUELL
        oppdatertPamelding.status.aarsak = request.aarsak
        oppdatertPamelding.startdato = null
        oppdatertPamelding.sluttdato = null
      } else {
        oppdatertPamelding.status.type = DeltakerStatusType.HAR_SLUTTET
        oppdatertPamelding.status.aarsak = request.aarsak
        oppdatertPamelding.sluttdato = request.sluttdato
      }
      this.pamelding = oppdatertPamelding
      return HttpResponse.json(oppdatertPamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseSluttarsak(request: EndreSluttarsakRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      oppdatertPamelding.status.type = DeltakerStatusType.HAR_SLUTTET
      oppdatertPamelding.status.aarsak = request.aarsak
      this.pamelding = oppdatertPamelding
      return HttpResponse.json(oppdatertPamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseInnhold(request: EndreInnholdRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding && oppdatertPamelding.deltakelsesinnhold) {
      const nyListe = oppdatertPamelding.deltakelsesinnhold.innhold.map((i) => {
        const nyInnhold = request.innhold.find(
          (vi) => vi.innholdskode === i.innholdskode
        )
        if (nyInnhold) {
          return { ...i, valgt: true, beskrivelse: nyInnhold.beskrivelse }
        } else {
          return { ...i, valgt: false }
        }
      })
      oppdatertPamelding.deltakelsesinnhold.innhold = nyListe
      this.pamelding = oppdatertPamelding
      return HttpResponse.json(this.pamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelsesmengde(request: EndreDeltakelsesmengdeRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      oppdatertPamelding.deltakelsesprosent = request.deltakelsesprosent || null
      oppdatertPamelding.dagerPerUke = request.dagerPerUke || null
      this.pamelding = oppdatertPamelding
      return HttpResponse.json(this.pamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }
}
