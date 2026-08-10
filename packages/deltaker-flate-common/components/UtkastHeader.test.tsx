import { describe, expect, it } from 'vitest'
import {
  DeltakerStatus,
  DeltakerStatusAarsakType,
  DeltakerStatusType,
  Vedtaksinformasjon
} from '../model/deltaker'
import { extractText } from './test-utils'
import { UtkastHeader } from './UtkastHeader'

const lagDeltakerStatus = (
  overrides: Partial<DeltakerStatus> = {}
): DeltakerStatus => ({
  id: '9f3253e5-6a0b-4cbf-ab8b-cd96e0fb6d43',
  type: DeltakerStatusType.UTKAST_TIL_PAMELDING,
  aarsak: null,
  gyldigFra: new Date('2026-01-01T00:00:00.000Z'),
  gyldigTil: null,
  opprettet: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides
})

const lagVedtaksinformasjon = (
  overrides: Partial<Vedtaksinformasjon> = {}
): Vedtaksinformasjon => ({
  fattet: null,
  fattetAvNav: true,
  opprettet: new Date('2026-01-01T08:00:00.000Z'),
  opprettetAv: 'Saksbehandler',
  sistEndret: new Date('2026-01-01T08:00:00.000Z'),
  sistEndretAv: 'Saksbehandler',
  sistEndretAvEnhet: null,
  ...overrides
})

describe('UtkastHeader', () => {
  it('viser sist endret når utkastet er endret senere samme dag', () => {
    const opprettet = new Date('2026-01-01T08:00:00.000Z')
    const sistEndret = new Date('2026-01-01T12:00:00.000Z')

    const text = extractText(
      UtkastHeader({
        vedtaksinformasjon: lagVedtaksinformasjon({
          opprettet,
          sistEndret,
          sistEndretAv: 'Annen saksbehandler'
        }),
        deltakerStatus: lagDeltakerStatus()
      })
    ).join(' ')

    expect(text).toContain('Første utkast delt:')
    expect(text).toContain('Sist endret:')
    expect(text).toContain('1. januar 2026')
    expect(text).toContain('Annen saksbehandler')
  })

  it('skjuler sist endret når backend sender samme tidspunkt som opprettet', () => {
    const opprettet = new Date('2026-01-01T08:00:00.000Z')
    const sistEndret = new Date('2026-01-01T08:00:00.000Z')

    const text = extractText(
      UtkastHeader({
        vedtaksinformasjon: lagVedtaksinformasjon({
          opprettet,
          sistEndret,
          sistEndretAv: 'Annen saksbehandler'
        }),
        deltakerStatus: lagDeltakerStatus()
      })
    ).join(' ')

    expect(text).toContain('Delt:')
    expect(text).not.toContain('Første utkast delt:')
    expect(text).not.toContain('Sist endret:')
  })

  it('skjuler sist endret når bare sistEndretAv er forskjellig', () => {
    const opprettet = new Date('2026-01-01T08:00:00.000Z')
    const sistEndret = new Date('2026-01-01T08:00:00.000Z')

    const text = extractText(
      UtkastHeader({
        vedtaksinformasjon: lagVedtaksinformasjon({
          opprettet,
          opprettetAv: 'Saksbehandler',
          sistEndret,
          sistEndretAv: 'Annen saksbehandler'
        }),
        deltakerStatus: lagDeltakerStatus()
      })
    ).join(' ')

    expect(text).toContain('Delt:')
    expect(text).toContain('Saksbehandler')
    expect(text).not.toContain('Første utkast delt:')
    expect(text).not.toContain('Sist endret:')
    expect(text).not.toContain('Annen saksbehandler')
  })

  it('viser sist endret når bare tidspunktet er forskjellig', () => {
    const opprettet = new Date('2026-01-01T08:00:00.000Z')
    const sistEndret = new Date('2026-01-01T08:00:00.001Z')

    const text = extractText(
      UtkastHeader({
        vedtaksinformasjon: lagVedtaksinformasjon({
          opprettet,
          opprettetAv: 'Saksbehandler',
          sistEndret,
          sistEndretAv: 'Saksbehandler'
        }),
        deltakerStatus: lagDeltakerStatus()
      })
    ).join(' ')

    expect(text).toContain('Første utkast delt:')
    expect(text).toContain('Sist endret:')
    expect(text).toContain('Saksbehandler')
  })

  it('viser avbrutttekst når utkastet er endret og samarbeidet er avsluttet', () => {
    const opprettet = new Date('2026-01-01T08:00:00.000Z')
    const sistEndret = new Date('2026-01-01T12:00:00.000Z')
    const gyldigFra = new Date('2026-01-03T00:00:00.000Z')

    const text = extractText(
      UtkastHeader({
        vedtaksinformasjon: lagVedtaksinformasjon({
          opprettet,
          sistEndret
        }),
        deltakerStatus: lagDeltakerStatus({
          aarsak: {
            type: DeltakerStatusAarsakType.SAMARBEIDET_MED_ARRANGOREN_ER_AVBRUTT,
            beskrivelse: null
          },
          gyldigFra
        })
      })
    ).join(' ')

    expect(text).toContain('Første utkast delt:')
    expect(text).toContain('Sist endret:')
    expect(text).toContain('3. januar 2026')
    expect(text).toContain('Samarbeidet med arrangøren er avsluttet')
  })
})
