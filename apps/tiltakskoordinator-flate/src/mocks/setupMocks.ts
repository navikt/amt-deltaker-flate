import { delay, http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'
import { MockHandler } from './MockHandler'
import {
  KOMET_ER_MASTER,
  LES_ARENA_DELTAKERE_TOGGLE_NAVN
} from '../../../../packages/deltaker-flate-common/feature-toggle/feature-toggle-data.ts'

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
  http.post(
    '/amt-deltaker-bff/tiltakskoordinator/deltakerliste/:deltakerlisteId/deltakere/sett-paa-venteliste',
    async ({ request }) => {
      await delay(500)
      const body = (await request.json()) as string[]

      return handler.settPaVenteliste(body)
    }
  ),
  http.get(
    '/amt-deltaker-bff/tiltakskoordinator/deltaker/:deltakerId',
    async ({ params }) => {
      await delay(500)
      const { deltakerId } = params
      return handler.getDeltaker(deltakerId as string)
    }
  ),
  http.get('/amt-deltaker-bff/unleash/api/feature', async () => {
    await delay(1000)
    const toggles = {
      [KOMET_ER_MASTER]: true,
      [LES_ARENA_DELTAKERE_TOGGLE_NAVN]: true
    }
    return HttpResponse.json(toggles)
  })
)
