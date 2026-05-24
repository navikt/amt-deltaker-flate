import { DeltakerStatusType } from 'deltaker-flate-common'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it
} from 'vitest'
import { v4 as uuidv4 } from 'uuid'
import { getDeltakere, getDeltakerStatusCounts, TilgangsFeil } from './api'
import { lagMockDeltaker } from '../mocks/mockData'

const DELTAKERLISTE_ID = uuidv4()
const API_BASE = '/amt-deltaker-bff'
const ENDPOINT = (id: string) =>
  `${API_BASE}/tiltakskoordinator/deltakerliste/${id}/deltakere`
const STATUS_COUNTS_ENDPOINT = (id: string) =>
  `${API_BASE}/tiltakskoordinator/deltakerliste/${id}/deltakere/status-counts`

const mockDeltakere = [
  {
    ...lagMockDeltaker(),
    status: { type: DeltakerStatusType.DELTAR, aarsak: null },
    harAktiveForslag: true
  },
  {
    ...lagMockDeltaker(),
    status: { type: DeltakerStatusType.SOKT_INN, aarsak: null },
    harAktiveForslag: false
  }
]

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('getDeltakere', () => {
  let parsedBody: Record<string, unknown> = {}

  beforeEach(() => {
    parsedBody = {}
  })

  it('sender POST til riktig URL', async () => {
    let calledUrl = ''
    server.use(
      http.post(ENDPOINT(DELTAKERLISTE_ID), ({ request }) => {
        calledUrl = request.url
        return HttpResponse.json(mockDeltakere)
      })
    )

    await getDeltakere(DELTAKERLISTE_ID)
    expect(calledUrl).toContain('/deltakere')
  })

  it('sender statuser i body når de er oppgitt', async () => {
    server.use(
      http.post(ENDPOINT(DELTAKERLISTE_ID), async ({ request }) => {
        parsedBody = (await request.json()) as Record<string, unknown>
        return HttpResponse.json(mockDeltakere)
      })
    )

    await getDeltakere(DELTAKERLISTE_ID, {
      statuser: [DeltakerStatusType.DELTAR]
    })

    expect(parsedBody.statuser).toEqual([DeltakerStatusType.DELTAR])
  })

  it('sender handlingFilterValg i body når det er oppgitt', async () => {
    server.use(
      http.post(ENDPOINT(DELTAKERLISTE_ID), async ({ request }) => {
        parsedBody = (await request.json()) as Record<string, unknown>
        return HttpResponse.json(mockDeltakere)
      })
    )

    await getDeltakere(DELTAKERLISTE_ID, {
      handlingFilterValg: ['AktiveForslag']
    })

    expect(parsedBody.handlingFilterValg).toEqual(['AktiveForslag'])
  })

  it('sender ikke gjennomforingId i body', async () => {
    server.use(
      http.post(ENDPOINT(DELTAKERLISTE_ID), async ({ request }) => {
        parsedBody = (await request.json()) as Record<string, unknown>
        return HttpResponse.json(mockDeltakere)
      })
    )

    await getDeltakere(DELTAKERLISTE_ID, {
      statuser: [DeltakerStatusType.DELTAR]
    })

    expect(parsedBody.gjennomforingId).toBeUndefined()
  })

  it('returnerer deltakere ved 200-svar', async () => {
    server.use(
      http.post(ENDPOINT(DELTAKERLISTE_ID), () =>
        HttpResponse.json(mockDeltakere)
      )
    )

    const result = await getDeltakere(DELTAKERLISTE_ID)
    expect(Array.isArray(result)).toBe(true)
    expect((result as unknown[]).length).toBe(mockDeltakere.length)
  })

  it('returnerer TilgangsFeil.ManglerADGruppe ved 401', async () => {
    server.use(
      http.post(ENDPOINT(DELTAKERLISTE_ID), () =>
        HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
      )
    )

    const result = await getDeltakere(DELTAKERLISTE_ID)
    expect(result).toBe(TilgangsFeil.ManglerADGruppe)
  })

  it('returnerer TilgangsFeil.IkkeTilgangTilDeltakerliste ved 403', async () => {
    server.use(
      http.post(ENDPOINT(DELTAKERLISTE_ID), () =>
        HttpResponse.json({ error: 'Forbidden' }, { status: 403 })
      )
    )

    const result = await getDeltakere(DELTAKERLISTE_ID)
    expect(result).toBe(TilgangsFeil.IkkeTilgangTilDeltakerliste)
  })

  it('returnerer TilgangsFeil.DeltakerlisteStengt ved 410', async () => {
    server.use(
      http.post(ENDPOINT(DELTAKERLISTE_ID), () =>
        HttpResponse.json({ error: 'Gone' }, { status: 410 })
      )
    )

    const result = await getDeltakere(DELTAKERLISTE_ID)
    expect(result).toBe(TilgangsFeil.DeltakerlisteStengt)
  })

  it('kaster feil ved 500', async () => {
    server.use(
      http.post(ENDPOINT(DELTAKERLISTE_ID), () =>
        HttpResponse.json({ error: 'Server Error' }, { status: 500 })
      )
    )

    await expect(getDeltakere(DELTAKERLISTE_ID)).rejects.toThrow()
  })
})

describe('getDeltakerStatusCounts', () => {
  it('returnerer status-tellinger fra backend', async () => {
    const counts = {
      statusCounts: {
        VENTER_PA_OPPSTART: 1,
        DELTAR: 6,
        HAR_SLUTTET: 10
      },
      handlingCounts: {
        AktiveForslag: 3,
        OppdateringFraNav: 2,
        NyeDeltakere: 1
      }
    }

    server.use(
      http.post(STATUS_COUNTS_ENDPOINT(DELTAKERLISTE_ID), () =>
        HttpResponse.json(counts)
      )
    )

    const result = await getDeltakerStatusCounts(DELTAKERLISTE_ID, {
      statuser: [
        DeltakerStatusType.VENTER_PA_OPPSTART,
        DeltakerStatusType.DELTAR,
        DeltakerStatusType.HAR_SLUTTET
      ]
    })

    expect(result).toEqual(counts)
  })

  it('returnerer tilgangsfeil ved 403', async () => {
    server.use(
      http.post(STATUS_COUNTS_ENDPOINT(DELTAKERLISTE_ID), () =>
        HttpResponse.json({ error: 'Forbidden' }, { status: 403 })
      )
    )

    const result = await getDeltakerStatusCounts(DELTAKERLISTE_ID, {
      statuser: [DeltakerStatusType.DELTAR]
    })

    expect(result).toBe(TilgangsFeil.IkkeTilgangTilDeltakerliste)
  })
})
