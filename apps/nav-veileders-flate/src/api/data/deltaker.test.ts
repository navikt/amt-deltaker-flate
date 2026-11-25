import { describe, expect, it } from 'vitest'
import { deltakerlisteSchema } from 'deltaker-flate-common'
import deltakere from '../../mocks/deltakere.json'
import { deltakerSchema } from './deltaker'

describe('deltakerlisteSchema', () => {
  it('bruker det felles deltakerlisteskjemaet', () => {
    expect(deltakerSchema.shape.deltakerliste).toBe(deltakerlisteSchema)
  })

  it.each([
    { navn: 'Arrangør AS', organisasjonsnummer: '123456789' },
    null,
    undefined
  ])('leser deltakerliste uten arrangorNavn med arrangør %s', (arrangor) => {
    const deltakerliste = deltakerlisteSchema.parse({
      ...deltakere.AFT_deltar.deltakerliste,
      arrangor
    })

    expect(deltakerliste.arrangor).toEqual(arrangor)
    expect(deltakerliste).not.toHaveProperty('arrangorNavn')
  })
})
