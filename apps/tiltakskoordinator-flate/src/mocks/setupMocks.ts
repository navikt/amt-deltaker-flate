import {
  DeltakerStatusAarsak,
  KOMET_ER_MASTER,
  LES_ARENA_DELTAKERE_TOGGLE_NAVN
} from 'deltaker-flate-common'
import { delay, http, HttpResponse } from 'msw'
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
    '/amt-deltaker-bff/tiltakskoordinator/deltakerliste/:deltakerlisteId/tilgang/fjern',
    async () => {
      await delay(500)
      return handler.fjernTilgang()
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
    '/amt-deltaker-bff/tiltakskoordinator/deltakerliste/:deltakerlisteId/deltakere/tildel-plass',
    async ({ request }) => {
      await delay(500)
      const body = (await request.json()) as string[]

      return handler.tildelPlass(body)
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
  http.post(
    '/amt-deltaker-bff/tiltakskoordinator/deltakerliste/:deltakerlisteId/deltakere/gi-avslag',
    async ({ request }) => {
      await delay(500)
      const body = (await request.json()) as {
        deltakerId: string
        aarsak: DeltakerStatusAarsak
      }

      return handler.giAvslag(body.deltakerId, body.aarsak)
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
  }),
  http.get(
    '/amt-deltaker-bff/tiltakskoordinator/deltaker/:deltakerId/historikk',
    async () => {
      await delay(1000)
      return handler.getHistorikk()
    }
  ),
  http.delete(
    '/amt-deltaker-bff/tiltakskoordinator/ulest-hendelse/:ulestHendelseId',
    async ({ params }) => {
      await delay(1000)
      const { ulestHendelseId } = params
      return handler.slettUlestHendelse(ulestHendelseId as string)
    }
  )
)
