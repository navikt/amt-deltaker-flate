import { Tiltakstype } from 'deltaker-flate-common'
import { HttpResponse } from 'msw'
import { Deltakere, DeltakerlisteDetaljer } from '../api/data/deltakerliste.ts'
import {
  createMockDeltakere,
  createMockDeltakerlisteDetaljer
} from './mockData.tsx'

export class MockHandler {
  gjennomforing: DeltakerlisteDetaljer | null = null
  deltakerliste: Deltakere | null = null
  tiltakstype = Tiltakstype.JOBBK

  getGjennomforing() {
    this.gjennomforing = createMockDeltakerlisteDetaljer(this.tiltakstype)
    return HttpResponse.json(this.gjennomforing)
  }

  getDeltakerliste() {
    this.deltakerliste = createMockDeltakere()
    return HttpResponse.json(this.deltakerliste)
  }

  setTiltakstype(tiltakstype: Tiltakstype) {
    this.tiltakstype = tiltakstype
    const oppdatertGjennomforing = this.gjennomforing

    if (oppdatertGjennomforing) {
      oppdatertGjennomforing.tiltakstype = tiltakstype

      this.gjennomforing = oppdatertGjennomforing
      return HttpResponse.json(oppdatertGjennomforing)
    }
    return HttpResponse.json(this.gjennomforing)
  }
}
