import { describe, expect, it } from 'vitest'
import {
  lagDeltakerNavnEtternavnForst,
  lagDeltakerNavn,
  listDeltakerNavn,
  erAdresseBeskyttet,
  formaterTelefonnummer
} from './utils'
import { Beskyttelsesmarkering } from '../api/data/deltakerliste'
import { lagTestDeltaker } from '../test-utils/lagTestDeltaker'

const lagDeltaker = lagTestDeltaker

describe('lagDeltakerNavnEtternavnForst', () => {
  it('returnerer etternavn, fornavn', () => {
    expect(
      lagDeltakerNavnEtternavnForst(
        lagDeltaker({ fornavn: 'Ola', etternavn: 'Nordmann' })
      )
    ).toBe('Nordmann, Ola')
  })

  it('inkluderer mellomnavn', () => {
    expect(
      lagDeltakerNavnEtternavnForst(
        lagDeltaker({
          fornavn: 'Ola',
          etternavn: 'Nordmann',
          mellomnavn: 'Hansen'
        })
      )
    ).toBe('Nordmann, Ola Hansen')
  })

  it('håndterer tomt etternavn uten komma', () => {
    expect(
      lagDeltakerNavnEtternavnForst(
        lagDeltaker({ fornavn: 'Ola', etternavn: '' })
      )
    ).toBe('Ola')
  })
})

describe('lagDeltakerNavn', () => {
  it('returnerer fornavn etternavn', () => {
    expect(
      lagDeltakerNavn(lagDeltaker({ fornavn: 'Ola', etternavn: 'Nordmann' }))
    ).toBe('Ola Nordmann')
  })

  it('inkluderer mellomnavn', () => {
    expect(
      lagDeltakerNavn(
        lagDeltaker({
          fornavn: 'Ola',
          etternavn: 'Nordmann',
          mellomnavn: 'Hansen'
        })
      )
    ).toBe('Ola Hansen Nordmann')
  })
})

describe('listDeltakerNavn', () => {
  it('returnerer ett navn uten og', () => {
    expect(
      listDeltakerNavn([lagDeltaker({ fornavn: 'Ola', etternavn: 'Nordmann' })])
    ).toBe('Ola Nordmann')
  })

  it('returnerer to navn med og', () => {
    expect(
      listDeltakerNavn([
        lagDeltaker({ fornavn: 'Ola', etternavn: 'Nordmann' }),
        lagDeltaker({ fornavn: 'Kari', etternavn: 'Hansen' })
      ])
    ).toBe('Ola Nordmann og Kari Hansen')
  })

  it('returnerer tre navn med komma og og', () => {
    expect(
      listDeltakerNavn([
        lagDeltaker({ fornavn: 'Ola', etternavn: 'Nordmann' }),
        lagDeltaker({ fornavn: 'Kari', etternavn: 'Hansen' }),
        lagDeltaker({ fornavn: 'Per', etternavn: 'Olsen' })
      ])
    ).toBe('Ola Nordmann, Kari Hansen og Per Olsen')
  })
})

describe('erAdresseBeskyttet', () => {
  it('returnerer false for tom liste', () => {
    expect(erAdresseBeskyttet([])).toBe(false)
  })

  it('returnerer true for fortrolig', () => {
    expect(erAdresseBeskyttet([Beskyttelsesmarkering.FORTROLIG])).toBe(true)
  })

  it('returnerer true for strengt fortrolig', () => {
    expect(erAdresseBeskyttet([Beskyttelsesmarkering.STRENGT_FORTROLIG])).toBe(
      true
    )
  })

  it('returnerer true for strengt fortrolig utland', () => {
    expect(
      erAdresseBeskyttet([Beskyttelsesmarkering.STRENGT_FORTROLIG_UTLAND])
    ).toBe(true)
  })

  it('returnerer false for skjermet', () => {
    expect(erAdresseBeskyttet([Beskyttelsesmarkering.SKJERMET])).toBe(false)
  })
})

describe('formaterTelefonnummer', () => {
  it('returnerer null for undefined', () => {
    expect(formaterTelefonnummer(undefined)).toBeNull()
  })

  it('returnerer null for tom string', () => {
    expect(formaterTelefonnummer('')).toBeNull()
  })

  it('formaterer 8-sifret nummer med mellomrom', () => {
    expect(formaterTelefonnummer('12345678')).toBe('12 34 56 78')
  })

  it('fjerner +47-prefiks', () => {
    expect(formaterTelefonnummer('+4712345678')).toBe('12 34 56 78')
  })

  it('fjerner 47-prefiks når lengde er 10', () => {
    expect(formaterTelefonnummer('4712345678')).toBe('12 34 56 78')
  })

  it('fjerner 0047-prefiks når lengde er 12', () => {
    expect(formaterTelefonnummer('004712345678')).toBe('12 34 56 78')
  })

  it('returnerer uformatert nummer som ikke er 8 sifre', () => {
    expect(formaterTelefonnummer('123456789')).toBe('123456789')
  })
})
