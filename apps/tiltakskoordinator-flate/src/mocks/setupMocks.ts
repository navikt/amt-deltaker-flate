import { delay, http } from 'msw'
import { setupWorker } from 'msw/browser'
import { MockHandler } from './MockHandler'

const handler = new MockHandler()

export const worker = setupWorker(
  http.get(
    '/amt-deltaker-bff/tiltakskoordinator/deltakerliste/:deltakerlisteId',
    async () => {
      await delay(500)
      return handler.getDeltakerlisteDetaljer()
    }
  ),
  http.get(
    '/amt-deltaker-bff/tiltakskoordinator/deltakerliste/:deltakerlisteId/deltakere',
    async () => {
      await delay(500)
      return handler.getDeltakere()
    }
  ),
  http.post(
    '/amt-deltaker-bff/tiltakskoordinator/deltakerliste/:deltakerlisteId/tilgang/legg-til',
    async () => {
      await delay(500)
      return handler.leggTilTilgang()
    }
  ),
  http.post(
    '/amt-deltaker-bff/tiltakskoordinator/deltakerliste/:deltakerlisteId/deltakere/del-med-arrangor',
    async ({ request }) => {
      await delay(500)
      const body = (await request.json()) as string[]

      return handler.delMedArrangor(body)
    }
  ),
  http.get(
    '/amt-deltaker-bff/tiltakskoordinator/deltaker/:deltakerId',
    async ({ params }) => {
      await delay(500)
      const { deltakerId } = params
      return handler.getDeltaker(deltakerId as string)
    }
  )
)
