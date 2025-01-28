import { HttpResponse } from 'msw'
import { Deltakere, DeltakerlisteDetaljer } from '../api/data/deltakerliste.ts'
import {
  createMockDeltakere,
  createMockDeltakerlisteDetaljer
} from './mockData.tsx'

export class MockHandler {
  deltakerlisteDetaljer: DeltakerlisteDetaljer | null = null
  deltakere: Deltakere | null = null

  getDeltakerlisteDetaljer() {
    this.deltakerlisteDetaljer = createMockDeltakerlisteDetaljer()
    return HttpResponse.json(this.deltakerlisteDetaljer)
  }

  getDeltakere() {
    this.deltakere = createMockDeltakere()
    return HttpResponse.json(this.deltakere)
  }
}
