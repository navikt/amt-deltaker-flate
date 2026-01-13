import {
  DeltakerStatusAarsak,
  DeltakerStatusType,
  lagHistorikkFellesOppstart,
  Oppstartstype,
  Pameldingstype,
  UlestHendelseType
} from 'deltaker-flate-common'
import { HttpResponse } from 'msw'
import { DeltakerlisteDetaljer, Feilkode } from '../api/data/deltakerliste.ts'
import {
  createMockDeltakere,
  createMockDeltakerlisteDetaljer,
  mapMockDeltakereToDeltakere,
  mapMockDeltakerToDeltaker,
  MockDeltaker
} from './mockData.tsx'

export class MockHandler {
  tilgang = true
  stengt = false
  harAdRolle = true
  deltakerlisteDetaljer: DeltakerlisteDetaljer | null = null
  mockDeltakere: MockDeltaker[] = createMockDeltakere()

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
    return HttpResponse.json(mapMockDeltakereToDeltakere(this.mockDeltakere))
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
    const deltaker = this.mockDeltakere.find(
      (deltaker) => deltaker.id === deltakerId
    )
    return HttpResponse.json(deltaker)
  }

  getHistorikk() {
    return HttpResponse.json(lagHistorikkFellesOppstart())
  }

  setOppstartsype(oppstartstype: Oppstartstype) {
    this.deltakerlisteDetaljer = {
      ...this.deltakerlisteDetaljer,
      oppstartstype
    } as DeltakerlisteDetaljer
    return HttpResponse.json(this.deltakerlisteDetaljer)
  }

  setPameldingstype(pameldingstype: Pameldingstype) {
    this.deltakerlisteDetaljer = {
      ...this.deltakerlisteDetaljer,
      pameldingstype
    } as DeltakerlisteDetaljer
    return HttpResponse.json(this.deltakerlisteDetaljer)
  }

  slettUlestHendelse(ulestHendelseId: string) {
    this.mockDeltakere = this.mockDeltakere.map((deltaker) => {
      const ulestHendelse = deltaker.ulesteHendelser.find(
        (hendelse) => hendelse.id === ulestHendelseId
      )
      if (ulestHendelse) {
        const erNy =
          ulestHendelse.hendelse.type ==
            UlestHendelseType.InnbyggerGodkjennUtkast ||
          ulestHendelse.hendelse.type == UlestHendelseType.NavGodkjennUtkast
        return {
          ...deltaker,
          erNyDeltaker: erNy ? false : deltaker.erNyDeltaker,
          harOppdateringFraNav: !erNy ? false : deltaker.harOppdateringFraNav,
          ulesteHendelser: deltaker.ulesteHendelser.filter(
            (hendelse) => hendelse.id !== ulestHendelseId
          )
        }
      }
      return deltaker
    })
    return new HttpResponse(null, { status: 204 })
  }

  leggTilTilgang() {
    this.tilgang = true
    return new HttpResponse()
  }

  fjernTilgang() {
    this.tilgang = false
    return new HttpResponse()
  }

  delMedArrangor(delteDeltakerIder: string[]) {
    const oppdaterteDeltakere = this.mockDeltakere.map((deltaker) => {
      if (delteDeltakerIder.includes(deltaker.id)) {
        deltaker.erManueltDeltMedArrangor = true
      }
      return deltaker
    })
    this.mockDeltakere = oppdaterteDeltakere

    return HttpResponse.json(
      mapMockDeltakereToDeltakere(
        this.mockDeltakere.filter((deltaker) =>
          delteDeltakerIder.includes(deltaker.id)
        )
      )
    )
  }

  tildelPlass(delteDeltakerIder: string[]) {
    const oppdaterteDeltakere = this.mockDeltakere.map((deltaker) => {
      if (delteDeltakerIder.includes(deltaker.id)) {
        deltaker.status.type = DeltakerStatusType.VENTER_PA_OPPSTART
        deltaker.status.aarsak = null
      }
      deltaker.feilkode = null
      return deltaker
    })
    this.mockDeltakere = oppdaterteDeltakere

    return HttpResponse.json(
      mapMockDeltakereToDeltakere(
        this.mockDeltakere.filter((deltaker) =>
          delteDeltakerIder.includes(deltaker.id)
        )
      )
    )
  }

  settPaVenteliste(delteDeltakerIder: string[]) {
    const oppdaterteDeltakere = this.mockDeltakere.map((deltaker) => {
      if (delteDeltakerIder.includes(deltaker.id)) {
        deltaker.status.aarsak = null
        deltaker.feilkode = [Feilkode.MIDLERTIDIG_FEIL, null][
          ~~(Math.random() * 2)
        ]
        deltaker.status.type =
          deltaker.feilkode !== null
            ? DeltakerStatusType.VENTELISTE
            : deltaker.status.type
      }
      return deltaker
    })
    this.mockDeltakere = oppdaterteDeltakere

    return HttpResponse.json(
      mapMockDeltakereToDeltakere(
        this.mockDeltakere.filter((deltaker) =>
          delteDeltakerIder.includes(deltaker.id)
        )
      )
    )
  }

  giAvslag(deltakerId: string, aarsak: DeltakerStatusAarsak) {
    const deltaker = this.mockDeltakere.find((d) => d.id === deltakerId)!
    deltaker.status.type = DeltakerStatusType.IKKE_AKTUELL
    deltaker.status.aarsak = aarsak
    this.mockDeltakere = this.mockDeltakere.map((d) =>
      d.id === deltaker.id ? deltaker : d
    )

    return HttpResponse.json(mapMockDeltakerToDeltaker(deltaker))
  }
}
