import {PameldingRequest} from '../api/data/pamelding-request.ts'
import {PameldingResponse} from '../api/data/pamelding.ts'
import {v4 as uuidv4} from 'uuid'
import {HttpResponse} from 'msw'
import {SendInnPameldingRequest} from '../api/data/send-inn-pamelding-request.ts'
import {SendInnPameldingUtenGodkjenningRequest} from '../api/data/send-inn-pamelding-uten-godkjenning-request.ts'

export class MockHandler {
  pameldinger: PameldingResponse[] = []
  deltakerIdNotAllowedToDelete = 'b21654fe-f0e6-4be1-84b5-da72ad6a4c0c'

  createPamelding(request: PameldingRequest): HttpResponse {
    const nyPamelding = {
      deltakerId: uuidv4(),
      deltakerliste: {
        deltakerlisteId: request.deltakerlisteId,
        deltakerlisteNavn: 'Testliste',
        tiltakstype: 'VTA',
        arrangorNavn: 'Den Beste Arrangøren AS',
        oppstartstype: 'løpende',
        mal: [
          {
            visningsTekst: 'Mål 1',
            type: 'type1',
            valgt: false,
            beskrivelse: null
          },
          {
            visningsTekst: 'Mål 2',
            type: 'type2',
            valgt: true,
            beskrivelse: 'dette er en beskrivelse'
          }
        ]
      }
    }

    this.pameldinger.push(nyPamelding)
    return HttpResponse.json(nyPamelding)
  }

  deletePamelding(deltakerId: string): HttpResponse {
    if (deltakerId === this.deltakerIdNotAllowedToDelete) {
      return new HttpResponse(null, {status: 400})
    }

    if (this.pameldinger.find((it) => it.deltakerId === deltakerId)) {
      this.pameldinger = this.pameldinger.filter(obj => obj.deltakerId !== deltakerId)
      return new HttpResponse(null, {status: 200})
    }

    return new HttpResponse(null, {status: 404})
  }

  sendInnPamelding(deltakerId: string, request: SendInnPameldingRequest): HttpResponse {
    // eslint-disable-next-line no-console
    console.log(deltakerId, request)
    return new HttpResponse(null, {status: 200})
  }

  sendInnPameldingUtenGodkjenning(deltakerId: string, request: SendInnPameldingUtenGodkjenningRequest): HttpResponse {
    // eslint-disable-next-line no-console
    console.log(deltakerId, request)
    return new HttpResponse(null, {status: 200})
  }
}
