import { setupWorker } from 'msw/browser'
import { HttpResponse, delay, http } from 'msw'
import { MockHandler } from './MockHandler.ts'
import { DeltakerStatusType } from 'deltaker-flate-model'
const handler = new MockHandler()

export const worker = setupWorker(
  http.get(
    'https://www.ekstern.dev.nav.no/person/nav-dekoratoren-api/auth',
    async () => {
      return HttpResponse.json({
        authenticated: true,
        name: 'Navn Navnesen',
        securityLevel: '4'
      })
    }
  ),
  http.post('mock/setup/status/:status', async ({ params }) => {
    const { status } = params

    const response = handler.setStatus(status as DeltakerStatusType)
    return response
  }),
  http.get('mock/innbygger/:deltakerId', async () => {
    await delay(1000)
    return handler.getDeltaker()
  }),
  http.post('mock/innbygger/:deltakerId/godkjenn-utkast', async () => {
    await delay(1000)
    return handler.godkjennUtkast()
  })
)
