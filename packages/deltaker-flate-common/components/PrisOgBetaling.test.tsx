import { describe, expect, it } from 'vitest'
import { PrisinformasjonType } from '../model/prisinformasjon'
import { extractText } from './test-utils'
import { PrisOgBetaling } from './PrisOgBetaling'

describe('PrisOgBetaling', () => {
  it('viser Navs begrunnelse når begrunnelse er satt', () => {
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

    expect(text).toContain('Navs begrunnelse:')
    expect(text).toContain('Dette tiltaket gir best læringsutbytte.')
  })

  it('skjuler Navs begrunnelse når visBegrunnelse er false', () => {
    const text = extractText(
      PrisOgBetaling({
        prisinformasjon: {
          type: PrisinformasjonType.Anskaffelse,
          pris: 5000,
          begrunnelse: 'Dette tiltaket gir best læringsutbytte.'
        },
        headinglevel: '2',
        visBegrunnelse: false
      })
    ).join(' ')

    expect(text).not.toContain('Navs begrunnelse:')
    expect(text).not.toContain('Dette tiltaket gir best læringsutbytte.')
    expect(text).toContain('Nav har kjøpt en plass hos opplæringsstedet.')
  })

  it('viser ikke Navs begrunnelse når begrunnelse mangler', () => {
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

    expect(text).not.toContain('Navs begrunnelse:')
  })
})
