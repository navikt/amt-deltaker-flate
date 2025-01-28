import { Tiltakstype } from 'deltaker-flate-common'
import { HttpResponse } from 'msw'
import { Deltakere, DeltakerlisteDetaljer } from '../api/data/deltakerliste.ts'
import {
  createMockDeltakere,
  createMockDeltakerlisteDetaljer
} from './mockData.tsx'

export class MockHandler {
  deltakerlisteDetaljer: DeltakerlisteDetaljer | null = null
  deltakere: Deltakere | null = null
  tiltakstype = Tiltakstype.JOBBK

  getDeltakerlisteDetaljer() {
    this.deltakerlisteDetaljer = createMockDeltakerlisteDetaljer(
      this.tiltakstype
    )
    return HttpResponse.json(this.deltakerlisteDetaljer)
  }

  getDeltakere() {
    this.deltakere = createMockDeltakere()
    return HttpResponse.json(this.deltakere)
  }

  setTiltakstype(tiltakstype: Tiltakstype) {
    this.tiltakstype = tiltakstype
    const oppdatertGjennomforing = this.deltakerlisteDetaljer

    if (oppdatertGjennomforing) {
      //oppdatertGjennomforing.tiltakstype = tiltakstype

      this.deltakerlisteDetaljer = oppdatertGjennomforing
      return HttpResponse.json(oppdatertGjennomforing)
    }
    return HttpResponse.json(this.deltakerlisteDetaljer)
  }
}
