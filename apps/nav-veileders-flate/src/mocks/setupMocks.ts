import {
  DeltakerStatusType,
  KOMET_ER_MASTER,
  LES_ARENA_DELTAKERE_TOGGLE_NAVN,
  Oppstartstype,
  Pameldingstype,
  Tiltakskode
} from 'deltaker-flate-common'
import { delay, http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'
import { API_URL } from '../utils/environment-utils.ts'
import {
  avsluttDeltakelseSchema,
  endreAvslutningSchema,
  endreBakgrunnsinfoSchema,
  endreDeltakelsesmengdeSchema,
  endreInnholdOpplaringKategoriseringSchema,
  endreInnholdSchema,
  endrePrisinfoSchema,
  endreSluttarsakSchema,
  endreStartdatoSchema,
  fjernOppstartsdatoSchema,
  forlengDeltakelseSchema,
  ikkeAktuellSchema
} from '../api/data/endre-deltakelse-request.ts'
import { enkeltplassPameldingSchema } from '../api/data/enkeltplass-pamelding.ts'
import {
  enkeltplassKladdSchema,
  opprettEnkeltplassKladdRequestSchema,
  opprettKladdRequestSchema
} from '../api/data/kladd-request.ts'
import { pameldingRequestSchema } from '../api/data/send-pamelding.ts'
import { MockHandler, sokArrangor } from './MockHandler.ts'

const handler = new MockHandler()

export const worker = setupWorker(
  http.post(`${API_URL}/setup/status/:status`, async ({ params }) => {
    const { status } = params
    return handler.setStatus(status as DeltakerStatusType)
  }),
  http.post(`${API_URL}/setup/tiltakskode/:tiltakskode`, async ({ params }) => {
    const { tiltakskode } = params
    return handler.setTiltakskode(tiltakskode as Tiltakskode)
  }),
  http.post(
    `${API_URL}/setup/oppstartstype/:oppstartstype`,
    async ({ params }) => {
      const { oppstartstype } = params
      return handler.setOppstartstype(oppstartstype as Oppstartstype)
    }
  ),
  http.post(
    `${API_URL}/setup/pameldingstype/:pameldingstype`,
    async ({ params }) => {
      const { pameldingstype } = params
      return handler.setPameldingstype(pameldingstype as Pameldingstype)
    }
  ),
  http.post(
    `${API_URL}/setup/er-enkeltplass/:erEnkeltplass`,
    async ({ params }) => {
      const { erEnkeltplass } = params
      return handler.setErEnkeltplass(erEnkeltplass === 'true')
    }
  ),
  http.post(`${API_URL}/kladd`, async ({ request }) => {
    await delay(1000)
    return await request
      .json()
      .then((json) => opprettKladdRequestSchema.parse(json))
      .then((body) => handler.createPamelding(body.deltakerlisteId))
  }),
  http.post(`${API_URL}/enkeltplass/opprett-kladd`, async ({ request }) => {
    await delay(1000)

    return await request
      .json()
      .then((json) => opprettEnkeltplassKladdRequestSchema.parse(json))
      .then((body) => handler.createEnkeltplassPamelding(body.tiltakskode))
  }),
  http.delete(`${API_URL}/kladd/:deltakerId`, async ({ params }) => {
    await delay(1000)
    const { deltakerId } = params
    return handler.deletePamelding(deltakerId as string)
  }),
  http.post(`${API_URL}/pamelding/:deltakerId`, async ({ request }) => {
    await delay(1000)

    return await request
      .json()
      .then((json) => pameldingRequestSchema.parse(json))
      .then((body) => handler.sendInnPamelding(body))
  }),
  http.post(
    `${API_URL}/pamelding/:deltakerId/utenGodkjenning`,
    async ({ request }) => {
      await delay(1000)

      return await request
        .json()
        .then((json) => pameldingRequestSchema.parse(json))
        .then(() => new HttpResponse(null, { status: 200 }))
    }
  ),
  http.post(
    `${API_URL}/enkeltplass/utkast/:deltakerId`,
    async ({ request }) => {
      await delay(1000)

      return await request
        .json()
        .then((json) => enkeltplassPameldingSchema.parse(json))
        .then((body) => handler.sendInnPameldingEnkeltplass(body))
    }
  ),
  http.post(
    `${API_URL}/enkeltplass/utkast/:deltakerId/del-med-innbygger`,
    async ({ request }) => {
      await delay(1000)

      return await request
        .json()
        .then((json) => enkeltplassPameldingSchema.parse(json))
        .then((body) => handler.sendInnPameldingEnkeltplass(body))
    }
  ),
  http.post(
    `${API_URL}/enkeltplass/utkast/:deltakerId/meld-paa-direkte`,
    async ({ request }) => {
      await delay(1000)

      return await request
        .json()
        .then((json) => enkeltplassPameldingSchema.parse(json))
        .then(() => new HttpResponse(null, { status: 200 }))
    }
  ),
  http.post(
    `${API_URL}/deltaker/:deltakerId/ikke-aktuell`,
    async ({ request }) => {
      await delay(100)

      return await request
        .json()
        .then((json) => ikkeAktuellSchema.parse(json))
        .then((body) => handler.endreDeltakelseIkkeAktuell(body))
    }
  ),
  http.post(`${API_URL}/deltaker/:deltakerId/reaktiver`, async () => {
    return handler.endreDeltakelseReaktiver()
  }),
  http.post(`${API_URL}/deltaker/:deltakerId/forleng`, async ({ request }) => {
    await delay(1000)

    return await request
      .json()
      .then((json) => forlengDeltakelseSchema.parse(json))
      .then((body) => handler.endreDeltakelseForleng(body))
  }),
  http.post(
    `${API_URL}/deltaker/:deltakerId/startdato`,
    async ({ request }) => {
      await delay(1000)

      return await request
        .json()
        .then((json) => endreStartdatoSchema.parse(json))
        .then((body) => handler.endreDeltakelseStartdato(body))
    }
  ),
  http.post(
    `${API_URL}/deltaker/:deltakerId/bakgrunnsinformasjon`,
    async ({ request }) => {
      await delay(1000)

      return await request
        .json()
        .then((json) => endreBakgrunnsinfoSchema.parse(json))
        .then((body) => handler.endreDeltakelseBakgrunnsinfo(body))
    }
  ),
  http.post(
    `${API_URL}/deltaker/:deltakerId/endre-prisinfo`,
    async ({ request }) => {
      await delay(1000)

      return await request
        .json()
        .then((json) => endrePrisinfoSchema.parse(json))
        .then((body) => handler.endreDeltakelsePrisinfo(body))
    }
  ),
  http.post(
    `${API_URL}/deltaker/:deltakerId/endre-innhold-kodeverk`,
    async ({ request }) => {
      await delay(1000)

      return await request
        .json()
        .then((json) => endreInnholdOpplaringKategoriseringSchema.parse(json))
        .then((body) => handler.endreDeltakelseInnholdKodeverk(body))
    }
  ),
  http.post(
    `${API_URL}/deltaker/:deltakerId/fjern-oppstartsdato`,
    async ({ request }) => {
      await delay(1000)

      return await request
        .json()
        .then((json) => fjernOppstartsdatoSchema.parse(json))
        .then((body) => handler.endreDeltakelseFjernOppstartsdato(body))
    }
  ),
  http.post(
    `${API_URL}/deltaker/:deltakerId/sluttarsak`,
    async ({ request }) => {
      await delay(100)

      return await request
        .json()
        .then((json) => endreSluttarsakSchema.parse(json))
        .then((body) => handler.endreDeltakelseSluttarsak(body))
    }
  ),
  http.post(`${API_URL}/deltaker/:deltakerId/innhold`, async ({ request }) => {
    await delay(100)

    return await request
      .json()
      .then((json) => endreInnholdSchema.parse(json))
      .then((body) => handler.endreDeltakelseInnhold(body))
  }),
  http.post(
    `${API_URL}/deltaker/:deltakerId/deltakelsesmengde`,
    async ({ request }) => {
      await delay(100)

      return await request
        .json()
        .then((json) => endreDeltakelsesmengdeSchema.parse(json))
        .then((body) => handler.endreDeltakelsesmengde(body))
    }
  ),
  http.post(`${API_URL}/deltaker/:deltakerId/avslutt`, async ({ request }) => {
    await delay(100)

    return await request
      .json()
      .then((json) => avsluttDeltakelseSchema.parse(json))
      .then((body) => handler.avsluttDeltakelse(body))
  }),
  http.post(
    `${API_URL}/deltaker/:deltakerId/endre-avslutning`,
    async ({ request }) => {
      await delay(100)

      return await request
        .json()
        .then((json) => endreAvslutningSchema.parse(json))
        .then((body) => handler.endreAvslutning(body))
    }
  ),
  http.post(
    `${API_URL}/forslag/:forslagId/avvis`,
    async ({ params, request }) => {
      await delay(1000)
      const { forslagId } = params as { forslagId: string }

      return await request.json().then(() => handler.avvisForslag(forslagId))
    }
  ),
  http.post(`${API_URL}/pamelding/:deltakerId/avbryt`, async () => {
    await delay(1000)

    return new HttpResponse(null, {
      status: 200
    })
  }),
  http.post(`${API_URL}/kladd/:deltakerId`, async () => {
    await delay(1000)

    return new HttpResponse(null, {
      status: 200
    })
  }),
  http.post(
    `${API_URL}/enkeltplass/oppdater-kladd/:deltakerId`,
    async ({ request }) => {
      await delay(1000)

      return await request
        .json()
        .then((json) => enkeltplassKladdSchema.parse(json))
        .then((body) => handler.oppdaterEnkeltplassKladd(body))
    }
  ),
  http.get(`${API_URL}/deltaker/:deltakerId/historikk`, async () => {
    await delay(1000)
    return handler.getHistorikk()
  }),
  http.get(`${API_URL}/unleash/api/feature`, async () => {
    await delay(1000)
    const toggles = {
      [KOMET_ER_MASTER]: true,
      [LES_ARENA_DELTAKERE_TOGGLE_NAVN]: true
    }
    return HttpResponse.json(toggles)
  }),
  http.get(`${API_URL}/arrangor/underenhet/sok/:term`, async ({ params }) => {
    await delay(1000)
    const { term } = params as { term: string }

    return HttpResponse.json(sokArrangor(term))
  }),
  http.get(
    `${API_URL}/enkeltplass/kodeverk-sertifiseringer/sok/:term`,
    async ({ params }) => {
      await delay(1000)
      const { term } = params as { term: string }
      return HttpResponse.json(handler.sokSertifiseringer(term))
    }
  ),
  http.get(`${API_URL}/enkeltplass/kodeverk/:deltakerId`, async () => {
    await delay(1000)
    return HttpResponse.json(handler.getKodeverk())
  }),
  http.post(
    `${API_URL}/deltaker/:deltakerId/tilbakekall-prisendring`,
    async () => {
      await delay(1000)
      return handler.tilbakekallPrisendring()
    }
  )
)
