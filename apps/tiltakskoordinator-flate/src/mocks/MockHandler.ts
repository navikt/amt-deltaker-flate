import {
  DeltakerStatusAarsak,
  DeltakerStatusType,
  lagHistorikkFellesOppstart
} from 'deltaker-flate-common'
import { HttpResponse } from 'msw'
import { DeltakerDetaljer } from '../api/data/deltaker.ts'
import { Deltakere, DeltakerlisteDetaljer } from '../api/data/deltakerliste.ts'
import {
  createMockDeltakere,
  createMockDeltakerlisteDetaljer,
  mapDeltakerDeltaljerToDeltaker
} from './mockData.tsx'

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

  getHistorikk() {
    return HttpResponse.json(lagHistorikkFellesOppstart())
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

    return HttpResponse.json(
      this.deltakere.filter((deltaker) =>
        delteDeltakerIder.includes(deltaker.id)
      )
    )
  }

  tildelPlass(delteDeltakerIder: string[]) {
    const oppdaterteDeltakere = this.deltakere.map((deltaker) => {
      if (delteDeltakerIder.includes(deltaker.id)) {
        deltaker.status.type = DeltakerStatusType.VENTER_PA_OPPSTART
        deltaker.status.aarsak = null
      }
      return deltaker
    })
    this.deltakere = oppdaterteDeltakere

    return HttpResponse.json(
      this.deltakere.filter((deltaker) =>
        delteDeltakerIder.includes(deltaker.id)
      )
    )
  }

  settPaVenteliste(delteDeltakerIder: string[]) {
    const oppdaterteDeltakere = this.deltakere.map((deltaker) => {
      if (delteDeltakerIder.includes(deltaker.id)) {
        deltaker.status.type = DeltakerStatusType.VENTELISTE
        deltaker.status.aarsak = null
      }
      return deltaker
    })
    this.deltakere = oppdaterteDeltakere

    return HttpResponse.json(
      this.deltakere.filter((deltaker) =>
        delteDeltakerIder.includes(deltaker.id)
      )
    )
  }

  giAvslag(deltakerId: string, aarsak: DeltakerStatusAarsak) {
    const deltaker = this.deltakere.find((d) => d.id === deltakerId)!
    deltaker.status.type = DeltakerStatusType.IKKE_AKTUELL
    deltaker.status.aarsak = aarsak
    this.deltakere = this.deltakere.map((d) =>
      d.id === deltaker.id ? deltaker : d
    )

    return HttpResponse.json(deltaker)
  }
}
