import {PameldingRequest} from '../api/data/pamelding-request.ts'
import { PameldingResponse, Tiltakstype } from '../api/data/pamelding.ts'
import {v4 as uuidv4} from 'uuid'
import {HttpResponse} from 'msw'
import {SendInnPameldingRequest} from '../api/data/send-inn-pamelding-request.ts'
import {SendInnPameldingUtenGodkjenningRequest} from '../api/data/send-inn-pamelding-uten-godkjenning-request.ts'
import { MAL_TYPE_ANNET } from '../utils.ts'

export class MockHandler {
  pameldinger: PameldingResponse[] = []
  deltakerIdNotAllowedToDelete = 'b21654fe-f0e6-4be1-84b5-da72ad6a4c0c'

  createPamelding(request: PameldingRequest): HttpResponse {
    const nyPamelding = {
      deltakerId: uuidv4(),
      deltakerliste: {
        deltakerlisteId: request.deltakerlisteId,
        deltakerlisteNavn: 'Testliste',
        tiltakstype: Tiltakstype.ARBFORB,
        arrangorNavn: 'Den Beste Arrangøren AS',
        oppstartstype: 'løpende',
      },
      status: {
        id: '85a05446-7211-4bbc-88ad-970f7ef9fb04',
        type: 'KLADD',
        aarsak: null,
        gyldigFra: '2023-12-14T13:17:52.362471',
        gyldigTil: null,
        opprettet: '2023-12-14T13:17:52.366581'
      },
      startdato: null,
      sluttdato: null,
      dagerPerUke: null,
      deltakelsesprosent : null,
      bakgrunnsinformasjon : null,
      mal: [
        {
          visningstekst: 'Mål 1',
          type: 'type1',
          valgt: false,
          beskrivelse: null
        },
        {
          visningstekst: 'Mål 2',
          type: 'type2',
          valgt: false,
          beskrivelse: null
        },
        {
          visningstekst: 'Annet',
          type: MAL_TYPE_ANNET,
          valgt: false,
          beskrivelse: 'Beskrivelse av annet mål'
        }
      ],
      sistEndretAv : 'Z994409',
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
}
