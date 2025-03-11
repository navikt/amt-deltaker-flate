import { HttpResponse } from 'msw'
import { DeltakerlisteDetaljer } from '../api/data/deltakerliste.ts'
import {
  createMockDeltakere,
  createMockDeltakerlisteDetaljer,
  mapDeltakerDeltaljerToDeltaker
} from './mockData.tsx'
import { DeltakerDetaljer } from '../api/data/deltaker.ts'

export class MockHandler {
  tilgang = true
  stengt = false
  harAdRolle = true
  deltakerlisteDetaljer: DeltakerlisteDetaljer | null = null
  deltakere: DeltakerDetaljer[] = createMockDeltakere()

  getDeltakerlisteDetaljer() {
    this.deltakerlisteDetaljer = createMockDeltakerlisteDetaljer()
    return HttpResponse.json(this.deltakerlisteDetaljer)
  }

  getDeltakere() {
    if (this.stengt) {
      return HttpResponse.json(
        { error: 'Deltakerliste stengt' },
        { status: 410 }
      )
    }
    if (!this.harAdRolle) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!this.tilgang) {
      return HttpResponse.json({ error: 'Not Authorized' }, { status: 403 })
    }
    return HttpResponse.json(this.deltakere.map(mapDeltakerDeltaljerToDeltaker))
  }

  getDeltaker(deltakerId: string) {
    if (this.stengt) {
      return HttpResponse.json(
        { error: 'Deltakerliste stengt' },
        { status: 410 }
      )
    }
    if (!this.harAdRolle) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!this.tilgang) {
      return HttpResponse.json({ error: 'Not Authorized' }, { status: 403 })
    }
    const deltaker = this.deltakere.find(
      (deltaker) => deltaker.id === deltakerId
    )
    return HttpResponse.json(deltaker)
  }

  leggTilTilgang() {
    this.tilgang = true
    return new HttpResponse()
  }
}
