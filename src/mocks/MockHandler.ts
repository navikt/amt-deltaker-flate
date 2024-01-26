import { PameldingRequest } from '../api/data/pamelding-request.ts'
import { DeltakerStatusType, PameldingResponse, Tiltakstype } from '../api/data/pamelding.ts'
import { v4 as uuidv4 } from 'uuid'
import { HttpResponse } from 'msw'
import { SendInnPameldingRequest } from '../api/data/send-inn-pamelding-request.ts'
import { SendInnPameldingUtenGodkjenningRequest } from '../api/data/send-inn-pamelding-uten-godkjenning-request.ts'
import { MAL_TYPE_ANNET } from '../utils.ts'
import { IkkeAktuellRequest } from '../api/data/endre-deltakelse-request.ts'

export class MockHandler {
  pameldinger: PameldingResponse[] = []
  deltakerIdNotAllowedToDelete = 'b21654fe-f0e6-4be1-84b5-da72ad6a4c0c'
  statusType = DeltakerStatusType.KLADD

  createPamelding(request: PameldingRequest): HttpResponse {
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
        oppstartstype: 'løpende'
      },
      status: {
        id: '85a05446-7211-4bbc-88ad-970f7ef9fb04',
        type: this.statusType,
        aarsak: null,
        gyldigFra: '2023-12-14T13:17:52.362471',
        gyldigTil: null,
        opprettet: '2023-12-14T13:17:52.366581'
      },
      startdato: null,
      sluttdato: null,
      dagerPerUke: 4.5,
      deltakelsesprosent: 95,
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
          valgt: true,
          beskrivelse: null
        },
        {
          visningstekst: 'Kartlegge hvordan helsen din påvirker muligheten din til å jobbe',
          type: 'type3',
          valgt: true,
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
          valgt: true,
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
      sistEndretAv: 'Z994409'
    }

    this.pameldinger.push(nyPamelding)
    return HttpResponse.json(nyPamelding)
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
      oppdatertPamelding.status.aarsak = request.arsak
      this.pameldinger = this.pameldinger.filter((obj) => obj.deltakerId !== deltakerId)
      this.pameldinger.push(oppdatertPamelding)
      return HttpResponse.json(oppdatertPamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }
}
