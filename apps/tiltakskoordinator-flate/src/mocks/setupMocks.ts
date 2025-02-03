import { delay, http } from 'msw'
import { setupWorker } from 'msw/browser'
import { MockHandler } from './MockHandler'

const handler = new MockHandler()

export const worker = setupWorker(
  http.get(
    '/amt-deltaker-bff/tiltakskoordinator/deltakerliste/:deltakerlisteId',
    async () => {
      await delay(1000)
      return handler.getDeltakerlisteDetaljer()
    }
  ),
  http.get(
    '/amt-deltaker-bff/tiltakskoordinator/deltakerliste/:deltakerlisteId/deltakere',
    async () => {
      await delay(1000)
      return handler.getDeltakere()
    }
  ),
  http.post(
    '/amt-deltaker-bff/tiltakskoordinator/deltakerliste/:deltakerlisteId/tilgang/legg-til',
    async () => {
      await delay(1000)
      return handler.leggTilTilgang()
    }
  )
)
