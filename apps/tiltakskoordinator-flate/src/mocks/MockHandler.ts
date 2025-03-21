import { HttpResponse } from 'msw'
import { Deltakere, DeltakerlisteDetaljer } from '../api/data/deltakerliste.ts'
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
  deltakereMedDetaljer: DeltakerDetaljer[] = createMockDeltakere()
  deltakere: Deltakere = this.deltakereMedDetaljer.map(
    mapDeltakerDeltaljerToDeltaker
  )

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
    return HttpResponse.json(this.deltakere)
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
    const deltaker = this.deltakereMedDetaljer.find(
      (deltaker) => deltaker.id === deltakerId
    )
    return HttpResponse.json(deltaker)
  }

  leggTilTilgang() {
    this.tilgang = true
    return new HttpResponse()
  }

  delMedArrangor(delteDeltakerIder: string[]) {
    const oppdaterteDeltakere = this.deltakere.map((deltaker) => {
      if (delteDeltakerIder.includes(deltaker.id)) {
        deltaker.erManueltDeltMedArrangor = true
      }
      return deltaker
    })
    this.deltakere = oppdaterteDeltakere
    return HttpResponse.json(this.deltakere)
  }
}
