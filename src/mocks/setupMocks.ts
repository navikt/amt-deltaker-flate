import {setupWorker} from 'msw/browser'
import { delay, http, HttpResponse } from 'msw'
import { MockHandler } from './MockHandler.ts'
import { pameldingRequestSchema } from '../api/data/pamelding-request.ts'
import { sendInnPameldingRequestSchema } from '../api/data/send-inn-pamelding-request.ts'
import { sendInnPameldingUtenGodkjenningRequestSchema } from '../api/data/send-inn-pamelding-uten-godkjenning-request.ts'
import { DeltakerStatusType } from '../api/data/pamelding.ts'

const handler = new MockHandler()

export const worker = setupWorker(

  http.post('/mock/setup/status/:status', async ({params}) => {
    const {status} = params
    handler.setStatus(status as DeltakerStatusType)

    return new HttpResponse(null, {
      status: 200
    })
  }),

  http.post('/mock/pamelding', async ({ request }) => {
    await delay(1000)
    const response = await request
      .json()
      .then((json) => pameldingRequestSchema.parse(json))
      .then((body) => handler.createPamelding(body))

    return response
  }),

  http.delete('/mock/pamelding/:deltakerId', async ({ params }) => {
    await delay(1000)
    const { deltakerId } = params
    return handler.deletePamelding(deltakerId as string)
  }),

  http.post('/mock/pamelding/:deltakerId', async ({ request, params }) => {
    await delay(1000)

    const { deltakerId } = params

    const response = await request
      .json()
      .then((json) => sendInnPameldingRequestSchema.parse(json))
      .then((body) => handler.sendInnPamelding(deltakerId as string, body))

    return response
  }),
  http.post('/mock/pamelding/:deltakerId/utenGodkjenning', async ({ request, params }) => {
    const { deltakerId } = params

    const response = await request
      .json()
      .then((json) => sendInnPameldingUtenGodkjenningRequestSchema.parse(json))
      .then((body) => handler.sendInnPameldingUtenGodkjenning(deltakerId as string, body))

    return response
  })
)
