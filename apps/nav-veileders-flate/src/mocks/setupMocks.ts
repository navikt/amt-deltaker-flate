import { DeltakerStatusType } from 'deltaker-flate-common'
import { delay, http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'
import {
  avsluttDeltakelseSchema,
  endreBakgrunnsinfoSchema,
  endreDeltakelsesmengdeSchema,
  endreInnholdSchema,
  endreSluttarsakSchema,
  endreSluttdatoSchema,
  endreStartdatoSchema,
  forlengDeltakelseSchema,
  ikkeAktuellSchema
} from '../api/data/endre-deltakelse-request.ts'
import { pameldingRequestSchema } from '../api/data/pamelding-request.ts'
import { sendInnPameldingRequestSchema } from '../api/data/send-inn-pamelding-request.ts'
import { sendInnPameldingUtenGodkjenningRequestSchema } from '../api/data/send-inn-pamelding-uten-godkjenning-request.ts'
import { MockHandler } from './MockHandler.ts'
import { KOMET_ER_MASTER } from '../api/data/feature-toggle.ts'

const handler = new MockHandler()

export const worker = setupWorker(
  http.post('/amt-deltaker-bff/setup/status/:status', async ({ params }) => {
    const { status } = params

    const response = handler.setStatus(status as DeltakerStatusType)
    return response
  }),
  http.post('/amt-deltaker-bff/pamelding', async ({ request }) => {
    await delay(1000)
    const response = await request
      .json()
      .then((json) => pameldingRequestSchema.parse(json))
      .then((body) => handler.createPamelding(body.deltakerlisteId))

    return response
  }),
  http.delete('/amt-deltaker-bff/pamelding/:deltakerId', async ({ params }) => {
    await delay(1000)
    const { deltakerId } = params
    return handler.deletePamelding(deltakerId as string)
  }),
  http.post(
    '/amt-deltaker-bff/pamelding/:deltakerId',
    async ({ request, params }) => {
      await delay(1000)

      const { deltakerId } = params

      const response = await request
        .json()
        .then((json) => sendInnPameldingRequestSchema.parse(json))
        .then((body) => handler.sendInnPamelding(deltakerId as string, body))

      return response
    }
  ),
  http.post(
    '/amt-deltaker-bff/pamelding/:deltakerId/utenGodkjenning',
    async ({ request, params }) => {
      await delay(1000)

      const { deltakerId } = params

      const response = await request
        .json()
        .then((json) =>
          sendInnPameldingUtenGodkjenningRequestSchema.parse(json)
        )
        .then((body) =>
          handler.sendInnPameldingUtenGodkjenning(deltakerId as string, body)
        )

      return response
    }
  ),
  http.post(
    '/amt-deltaker-bff/deltaker/:deltakerId/ikke-aktuell',
    async ({ request }) => {
      await delay(100)

      const response = await request
        .json()
        .then((json) => ikkeAktuellSchema.parse(json))
        .then((body) => handler.endreDeltakelseIkkeAktuell(body))

      return response
    }
  ),
  http.post('/amt-deltaker-bff/deltaker/:deltakerId/reaktiver', async () => {
    return handler.endreDeltakelseReaktiver()
  }),
  http.post(
    '/amt-deltaker-bff/deltaker/:deltakerId/forleng',
    async ({ request }) => {
      await delay(1000)

      const response = await request
        .json()
        .then((json) => forlengDeltakelseSchema.parse(json))
        .then((body) => handler.endreDeltakelseForleng(body))

      return response
    }
  ),
  http.post(
    '/amt-deltaker-bff/deltaker/:deltakerId/startdato',
    async ({ request }) => {
      await delay(1000)

      const response = await request
        .json()
        .then((json) => endreStartdatoSchema.parse(json))
        .then((body) => handler.endreDeltakelseStartdato(body))

      return response
    }
  ),
  http.post(
    '/amt-deltaker-bff/deltaker/:deltakerId/bakgrunnsinformasjon',
    async ({ request }) => {
      await delay(1000)

      const response = await request
        .json()
        .then((json) => endreBakgrunnsinfoSchema.parse(json))
        .then((body) => handler.endreDeltakelseBakgrunnsinfo(body))

      return response
    }
  ),
  http.post(
    '/amt-deltaker-bff/deltaker/:deltakerId/sluttdato',
    async ({ request }) => {
      await delay(1000)

      const response = await request
        .json()
        .then((json) => endreSluttdatoSchema.parse(json))
        .then((body) => handler.endreDeltakelseSluttdato(body))

      return response
    }
  ),
  http.post(
    '/amt-deltaker-bff/deltaker/:deltakerId/sluttarsak',
    async ({ request }) => {
      await delay(100)

      const response = await request
        .json()
        .then((json) => endreSluttarsakSchema.parse(json))
        .then((body) => handler.endreDeltakelseSluttarsak(body))

      return response
    }
  ),
  http.post(
    '/amt-deltaker-bff/deltaker/:deltakerId/innhold',
    async ({ request }) => {
      await delay(100)
      const response = await request
        .json()
        .then((json) => endreInnholdSchema.parse(json))
        .then((body) => handler.endreDeltakelseInnhold(body))

      return response
    }
  ),
  http.post(
    '/amt-deltaker-bff/deltaker/:deltakerId/deltakelsesmengde',
    async ({ request }) => {
      await delay(100)
      const response = await request
        .json()
        .then((json) => endreDeltakelsesmengdeSchema.parse(json))
        .then((body) => handler.endreDeltakelsesmengde(body))

      return response
    }
  ),
  http.post(
    '/amt-deltaker-bff/deltaker/:deltakerId/avslutt',
    async ({ request }) => {
      await delay(100)

      const response = await request
        .json()
        .then((json) => avsluttDeltakelseSchema.parse(json))
        .then((body) => handler.avsluttDeltakelse(body))

      return response
    }
  ),
  http.post(
    '/amt-deltaker-bff/forslag/:forslagId/avvis',
    async ({ request, params }) => {
      await delay(1000)
      const { forslagId } = params as { forslagId: string }

      return await request.json().then(() => handler.avvisForslag(forslagId))
    }
  ),
  http.post(
    '/amt-deltaker-bff/pamelding/:deltakerId/avbryt',
    async ({ request, params }) => {
      await delay(1000)

      const { deltakerId } = params

      const response = await request
        .json()
        .then((json) => ikkeAktuellSchema.parse(json))

      // eslint-disable-next-line no-console
      console.log('Deltaker ' + { deltakerId } + ':', response)

      return new HttpResponse(null, {
        status: 200
      })
    }
  ),
  http.post(
    '/amt-deltaker-bff/pamelding/:deltakerId/kladd',
    async ({ request, params }) => {
      await delay(1000)
      const { deltakerId } = params
      const requestBody = await request.json()

      // eslint-disable-next-line no-console
      console.log('Kladd stored', deltakerId, requestBody)

      return new HttpResponse(null, {
        status: 200
      })
    }
  ),
  http.get('/amt-deltaker-bff/deltaker/:deltakerId/historikk', async () => {
    await delay(1000)
    return handler.getHistorikk()
  }),
  http.get('/amt-deltaker-bff/unleash/api/feature', async () => {
    await delay(1000)
    const toggles = {
      [KOMET_ER_MASTER]: true
    }
    return HttpResponse.json(toggles)
  })
)
