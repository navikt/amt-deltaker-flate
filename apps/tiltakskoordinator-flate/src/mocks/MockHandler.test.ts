import { DeltakerStatusType } from 'deltaker-flate-common'
import { describe, expect, it, beforeEach } from 'vitest'
import { MockHandler } from './MockHandler'
import { createMockDeltakere } from './mockData'

describe('MockHandler.postDeltakere', () => {
  let handler: MockHandler

  beforeEach(() => {
    handler = new MockHandler()
    handler.mockDeltakere = createMockDeltakere()
  })

  it('returnerer alle deltakere når ingen filtre er oppgitt', async () => {
    const response = handler.postDeltakere({})
    const body = await response.json()
    expect(body).toHaveLength(handler.mockDeltakere.length)
  })

  it('filtrerer på harForslagFraArrangor=true', async () => {
    const deltakeremedForslag = handler.mockDeltakere.filter(
      (d) => d.harAktiveForslag
    )
    const response = handler.postDeltakere({ harForslagFraArrangor: true })
    const body = await response.json()
    expect(body).toHaveLength(deltakeremedForslag.length)
    body.forEach((d: { harAktiveForslag: boolean }) => {
      expect(d.harAktiveForslag).toBe(true)
    })
  })

  it('filtrerer ikke på harForslagFraArrangor=false', async () => {
    const response = handler.postDeltakere({ harForslagFraArrangor: false })
    const body = await response.json()
    expect(body).toHaveLength(handler.mockDeltakere.length)
  })

  it('filtrerer på én status', async () => {
    const forventetAntall = handler.mockDeltakere.filter(
      (d) => d.status.type === DeltakerStatusType.DELTAR
    ).length
    const response = handler.postDeltakere({
      statuser: [DeltakerStatusType.DELTAR]
    })
    const body = await response.json()
    expect(body).toHaveLength(forventetAntall)
    body.forEach((d: { status: { type: string } }) => {
      expect(d.status.type).toBe(DeltakerStatusType.DELTAR)
    })
  })

  it('filtrerer på flere statuser (OR-logikk)', async () => {
    const forventetAntall = handler.mockDeltakere.filter(
      (d) =>
        d.status.type === DeltakerStatusType.DELTAR ||
        d.status.type === DeltakerStatusType.SOKT_INN
    ).length
    const response = handler.postDeltakere({
      statuser: [DeltakerStatusType.DELTAR, DeltakerStatusType.SOKT_INN]
    })
    const body = await response.json()
    expect(body).toHaveLength(forventetAntall)
  })

  it('kombinerer harForslagFraArrangor og statuser (AND-logikk)', async () => {
    const forventetAntall = handler.mockDeltakere.filter(
      (d) =>
        d.harAktiveForslag &&
        d.status.type === DeltakerStatusType.VENTER_PA_OPPSTART
    ).length
    const response = handler.postDeltakere({
      harForslagFraArrangor: true,
      statuser: [DeltakerStatusType.VENTER_PA_OPPSTART]
    })
    const body = await response.json()
    expect(body).toHaveLength(forventetAntall)
  })

  it('returnerer tom liste når ingen matcher statusfilter', async () => {
    const response = handler.postDeltakere({
      statuser: [DeltakerStatusType.UTKAST_TIL_PAMELDING]
    })
    const body = await response.json()
    expect(body).toHaveLength(0)
  })

  it('returnerer 401 når harAdRolle=false', async () => {
    handler.harAdRolle = false
    const response = handler.postDeltakere({})
    expect(response.status).toBe(401)
  })

  it('returnerer 403 når tilgang=false', async () => {
    handler.tilgang = false
    const response = handler.postDeltakere({})
    expect(response.status).toBe(403)
  })

  it('returnerer 410 når stengt=true', async () => {
    handler.stengt = true
    const response = handler.postDeltakere({})
    expect(response.status).toBe(410)
  })
})

describe('MockHandler.getDeltakereStatusCounts', () => {
  let handler: MockHandler

  beforeEach(() => {
    handler = new MockHandler()
    handler.mockDeltakere = createMockDeltakere()
  })

  it('returnerer tellinger for forespurte statuser', async () => {
    const response = handler.getDeltakereStatusCounts({
      statuser: [DeltakerStatusType.DELTAR, DeltakerStatusType.HAR_SLUTTET]
    })
    const body = await response.json()

    expect(body.DELTAR).toBeTypeOf('number')
    expect(body.HAR_SLUTTET).toBeTypeOf('number')
  })

  it('returnerer 403 ved manglende tilgang', async () => {
    handler.tilgang = false
    const response = handler.getDeltakereStatusCounts({
      statuser: [DeltakerStatusType.DELTAR]
    })
    expect(response.status).toBe(403)
  })
})
