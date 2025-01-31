import { HttpResponse } from 'msw'
import { Deltakere, DeltakerlisteDetaljer } from '../api/data/deltakerliste.ts'
import {
  createMockDeltakere,
  createMockDeltakerlisteDetaljer
} from './mockData.tsx'

export class MockHandler {
  tilgang = true
  deltakerlisteDetaljer: DeltakerlisteDetaljer | null = null
  deltakere: Deltakere | null = null

  getDeltakerlisteDetaljer() {
    this.deltakerlisteDetaljer = createMockDeltakerlisteDetaljer()
    return HttpResponse.json(this.deltakerlisteDetaljer)
  }

  getDeltakere() {
    if (!this.tilgang) {
      return HttpResponse.json({ error: 'Not Authorized' }, { status: 403 })
    }
    this.deltakere = createMockDeltakere()
    return HttpResponse.json(this.deltakere)
  }

  leggTilTilgang() {
    this.tilgang = true
    return new HttpResponse()
  }
}
