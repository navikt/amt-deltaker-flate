import {PameldingRequest} from '../api/data/pamelding-request.ts'
import {DeltakerStatusType, PameldingResponse, Tiltakstype} from '../api/data/pamelding.ts'
import {v4 as uuidv4} from 'uuid'
import {HttpResponse} from 'msw'
import {SendInnPameldingRequest} from '../api/data/send-inn-pamelding-request.ts'
import {SendInnPameldingUtenGodkjenningRequest} from '../api/data/send-inn-pamelding-uten-godkjenning-request.ts'
import {ForlengDeltakelseRequest, IkkeAktuellRequest} from '../api/data/endre-deltakelse-request.ts'
import {EMDASH, MAL_TYPE_ANNET} from '../utils/utils.ts'
import dayjs from 'dayjs'

export class MockHandler {
  pameldinger: PameldingResponse[] = []
  deltakerIdNotAllowedToDelete = 'b21654fe-f0e6-4be1-84b5-da72ad6a4c0c'
  statusType = DeltakerStatusType.KLADD

  createPamelding(request: PameldingRequest): HttpResponse {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const startdato = this.statusType === DeltakerStatusType.DELTAR || this.statusType === DeltakerStatusType.HAR_SLUTTET
      ? '2023-12-01' : EMDASH

    const pameldingIngenMal: PameldingResponse = {
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
        type: DeltakerStatusType.KLADD,
        aarsak: null,
        gyldigFra: '2024-01-30T08:56:20.576553',
        gyldigTil: EMDASH,
        opprettet: '2024-01-30T08:56:21.286768'
      },
      startdato: EMDASH,
      sluttdato: EMDASH,
      dagerPerUke: null,
      deltakelsesprosent: null,
      bakgrunnsinformasjon: null,
      mal: [],
      sistEndretAv: 'Veilder',
      sistEndretAvEnhet: 'NAV Fredrikstad',
      sistEndret: yesterday.toString()
    }

    const nyPamelding: PameldingResponse = {
      deltakerId: uuidv4(),
      fornavn: 'Nav',
      mellomnavn: null,
      etternavn: 'Naversen',
      deltakerliste: {
        deltakerlisteId: request.deltakerlisteId,
        deltakerlisteNavn: 'Testliste',
        tiltakstype: Tiltakstype.ARBFORB,
        arrangorNavn: 'Den Beste Arrangøren AS',
        oppstartstype: 'løpende',
        startdato: '2022-10-28',
        sluttdato: null
      },
      status: {
        id: '85a05446-7211-4bbc-88ad-970f7ef9fb04',
        type: this.statusType,
        aarsak: null,
        gyldigFra: '2023-12-14T13:17:52.362471',
        gyldigTil: EMDASH,
        opprettet: '2023-12-14T13:17:52.366581'
      },
      startdato: startdato,
      sluttdato: this.getSluttdato(),
      dagerPerUke: null,
      deltakelsesprosent: null,
      bakgrunnsinformasjon: 'Dette er en test',
      mal: [
        {
          visningstekst: 'Støtte til jobbsøking',
          type: 'type1',
          valgt: false,
          beskrivelse: null
        },
        {
          visningstekst: 'Karriereveiledning',
          type: 'type2',
          valgt: false,
          beskrivelse: null
        },
        {
          visningstekst: 'Kartlegge hvordan helsen din påvirker muligheten din til å jobbe',
          type: 'type3',
          valgt: false,
          beskrivelse: null
        },
        {
          visningstekst: 'Kartlegge hvilken støtte og tilpasning du trenger på arbeidsplassen',
          type: 'type4',
          valgt: false,
          beskrivelse: null
        },
        {
          visningstekst: 'Kartlegge dine forventninger til å jobbe',
          type: 'type5',
          valgt: false,
          beskrivelse: null
        },
        {
          visningstekst: 'Veiledning i sosial mestring',
          type: 'type6',
          valgt: false,
          beskrivelse: null
        },
        {
          visningstekst: 'Hjelp til å tilpasse arbeidsoppgaver og arbeidsplassen',
          type: 'type7',
          valgt: false,
          beskrivelse: null
        },
        {
          visningstekst: 'Veiledning til arbeidsgiver',
          type: 'type8',
          valgt: false,
          beskrivelse: null
        },
        {
          visningstekst: 'Oppfølging på arbeidsplassen',
          type: 'type9',
          valgt: true,
          beskrivelse: null
        },
        {
          visningstekst: 'Arbeidspraksis',
          type: 'type10',
          valgt: false,
          beskrivelse: null
        },
        {
          visningstekst: 'Annet',
          type: MAL_TYPE_ANNET,
          valgt: true,
          beskrivelse: 'Beskrivelse av annet mål'
        }
      ],
      sistEndretAv: 'Veilder',
      sistEndret: yesterday.toString(),
      sistEndretAvEnhet: 'NAV Fredrikstad'
    }

    this.pameldinger.push(nyPamelding)
    this.pameldinger.push(pameldingIngenMal)
    return HttpResponse.json(nyPamelding)
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

    if (this.pameldinger.find((it) => it.deltakerId === deltakerId)) {
      this.pameldinger = this.pameldinger.filter((obj) => obj.deltakerId !== deltakerId)
      return new HttpResponse(null, { status: 200 })
    }

    return new HttpResponse(null, { status: 404 })
  }

  sendInnPamelding(deltakerId: string, request: SendInnPameldingRequest): HttpResponse {
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
  }

  endreDeltakelseIkkeAktuell(deltakerId: string, request: IkkeAktuellRequest) {
    const oppdatertPamelding = this.pameldinger.find((it) => it.deltakerId === deltakerId)

    if (oppdatertPamelding) {
      oppdatertPamelding.status.type = DeltakerStatusType.IKKE_AKTUELL
      oppdatertPamelding.status.aarsak = request.aarsak
      this.pameldinger = this.pameldinger.filter((obj) => obj.deltakerId !== deltakerId)
      this.pameldinger.push(oppdatertPamelding)
      return HttpResponse.json(oppdatertPamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseForleng(deltakerId: string, request: ForlengDeltakelseRequest) {
    const oppdatertPamelding = this.pameldinger.find((it) => it.deltakerId === deltakerId)

    if (oppdatertPamelding) {
      oppdatertPamelding.sluttdato = request.sluttdato
      this.pameldinger = this.pameldinger.filter((obj) => obj.deltakerId !== deltakerId)
      this.pameldinger.push(oppdatertPamelding)
      return HttpResponse.json(oppdatertPamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }
}
