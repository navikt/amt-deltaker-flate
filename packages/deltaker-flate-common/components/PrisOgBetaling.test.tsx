import { describe, expect, it } from 'vitest'
import { PrisinformasjonType } from '../model/prisinformasjon'
import { extractText } from './test-utils'
import { PrisOgBetaling } from './PrisOgBetaling'

describe('PrisOgBetaling', () => {
  it('viser Nav sin begrunnelse når begrunnelse er satt', () => {
    const text = extractText(
      PrisOgBetaling({
        prisinformasjon: {
          type: PrisinformasjonType.Anskaffelse,
          pris: 5000,
          begrunnelse: 'Dette tiltaket gir best læringsutbytte.'
        },
        headinglevel: '2'
      })
    ).join(' ')

    expect(text).toContain('Nav sin begrunnelse:')
    expect(text).toContain('Dette tiltaket gir best læringsutbytte.')
  })

  it('viser ikke Nav sin begrunnelse når begrunnelse mangler', () => {
    const text = extractText(
      PrisOgBetaling({
        prisinformasjon: {
          type: PrisinformasjonType.Anskaffelse,
          pris: 5000,
          begrunnelse: null
        },
        headinglevel: '2'
      })
    ).join(' ')

    expect(text).not.toContain('Nav sin begrunnelse:')
  })
})
