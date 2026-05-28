import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { KodeverkValg } from '../KodeverkValg'
import { renderWithProviders } from './test-utils'
import {
  KodeverkAlternativType,
  OpplaringRepresenterer,
  KodeverkResponse,
  Seleksjonstype
} from '../../../../api/data/kodeverk'

const bransjeVerdigruppe = {
  type: KodeverkAlternativType.VERDIGRUPPE as const,
  id: null,
  visningsnavn: 'Bransje',
  pakrevd: false,
  representerer: OpplaringRepresenterer.BRANSJE_ID,
  seleksjonstype: Seleksjonstype.ENKELTVALG,
  alternativer: [
    { id: 'bransje-1', visningsnavn: 'Bygg og anlegg', valgt: false },
    { id: 'bransje-2', visningsnavn: 'Helse og omsorg', valgt: false },
    { id: 'bransje-3', visningsnavn: 'IT og teknologi', valgt: false }
  ]
}

const forerkortVerdigruppe = {
  type: KodeverkAlternativType.VERDIGRUPPE as const,
  id: null,
  visningsnavn: 'Førerkort',
  pakrevd: false,
  representerer: OpplaringRepresenterer.FORERKORT,
  seleksjonstype: Seleksjonstype.FLERVALG,
  alternativer: [
    { id: 'fk-1', visningsnavn: 'B - Personbil', valgt: false },
    { id: 'fk-2', visningsnavn: 'C1 - Lett lastebil', valgt: false },
    { id: 'fk-3', visningsnavn: 'CE - Lastebil med tilhenger', valgt: false }
  ]
}

describe('KodeverkValg', () => {
  it('rendrer ikke når kodeverk er undefined', () => {
    const { container } = renderWithProviders(<KodeverkValg />)
    expect(container).toBeEmptyDOMElement()
  })

  it('rendrer ikke når alternativer er tom', () => {
    const kodeverk: KodeverkResponse = {
      tiltakskode: 'ARBEIDSMARKEDSOPPLAERING',
      alternativer: [],
      sertifiseringValg: []
    }
    const { container } = renderWithProviders(
      <KodeverkValg kodeverk={kodeverk} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('rendrer combobox for en Verdigruppe', () => {
    const kodeverk: KodeverkResponse = {
      tiltakskode: 'ARBEIDSMARKEDSOPPLAERING',
      alternativer: [bransjeVerdigruppe],
      sertifiseringValg: []
    }
    renderWithProviders(<KodeverkValg kodeverk={kodeverk} />)
    expect(screen.getByLabelText('Bransje')).toBeInTheDocument()
  })

  it('viser forhåndsvalgte verdier fra valgt: true', () => {
    const kodeverk: KodeverkResponse = {
      tiltakskode: 'ARBEIDSMARKEDSOPPLAERING',
      alternativer: [
        {
          ...bransjeVerdigruppe,
          alternativer: bransjeVerdigruppe.alternativer.map((v) =>
            v.id === 'bransje-1' ? { ...v, valgt: true } : v
          )
        }
      ],
      sertifiseringValg: []
    }
    renderWithProviders(<KodeverkValg kodeverk={kodeverk} />, {
      defaultValues: { kodeverkValg: ['bransje-1'] }
    })
    expect(
      screen.getByRole('option', { name: 'Bygg og anlegg', selected: true })
    ).toBeInTheDocument()
  })

  describe('flere verdigrupper - kodeverkValg form-felt', () => {
    it('beholder valg fra begge verdigrupper i form state', async () => {
      const user = userEvent.setup()
      const kodeverk: KodeverkResponse = {
        tiltakskode: 'ARBEIDSMARKEDSOPPLAERING',
        alternativer: [bransjeVerdigruppe, forerkortVerdigruppe],
        sertifiseringValg: []
      }
      renderWithProviders(<KodeverkValg kodeverk={kodeverk} />, {
        defaultValues: { kodeverkValg: [] }
      })

      // Velg i Bransje
      const bransjeInput = screen.getByLabelText('Bransje')
      await user.click(bransjeInput)
      const byggOption = screen.getByRole('option', { name: 'Bygg og anlegg' })
      await user.click(byggOption)

      // Velg i Førerkort
      const forerkortInput = screen.getByLabelText('Førerkort')
      await user.click(forerkortInput)
      const personbilOption = screen.getByRole('option', {
        name: 'B - Personbil'
      })
      await user.click(personbilOption)

      // Sjekk at begge valg finnes i DOM (selected state)
      expect(
        screen.getByRole('option', { name: 'Bygg og anlegg', selected: true })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('option', { name: 'B - Personbil', selected: true })
      ).toBeInTheDocument()
    })

    it('endring i én verdigruppe overskriver ikke den andre', async () => {
      const user = userEvent.setup()
      const kodeverk: KodeverkResponse = {
        tiltakskode: 'ARBEIDSMARKEDSOPPLAERING',
        alternativer: [bransjeVerdigruppe, forerkortVerdigruppe],
        sertifiseringValg: []
      }

      renderWithProviders(<KodeverkValg kodeverk={kodeverk} />, {
        defaultValues: { kodeverkValg: [] }
      })

      // Velg i Bransje
      const bransjeInput = screen.getByLabelText('Bransje')
      await user.click(bransjeInput)
      await user.click(screen.getByRole('option', { name: 'Bygg og anlegg' }))

      // Velg i Førerkort
      const forerkortInput = screen.getByLabelText('Førerkort')
      await user.click(forerkortInput)
      await user.click(screen.getByRole('option', { name: 'B - Personbil' }))

      // Velg enda en i Førerkort
      await user.click(forerkortInput)
      await user.click(
        screen.getByRole('option', { name: 'C1 - Lett lastebil' })
      )

      // Bransje-valget skal fremdeles være der
      expect(
        screen.getByRole('option', { name: 'Bygg og anlegg', selected: true })
      ).toBeInTheDocument()

      // Begge førerkort-valgene skal være der
      expect(
        screen.getByRole('option', { name: 'B - Personbil', selected: true })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('option', {
          name: 'C1 - Lett lastebil',
          selected: true
        })
      ).toBeInTheDocument()
    })

    it('enkeltvalg erstatter forrige valg i samme verdigruppe', async () => {
      const user = userEvent.setup()
      const kodeverk: KodeverkResponse = {
        tiltakskode: 'ARBEIDSMARKEDSOPPLAERING',
        alternativer: [bransjeVerdigruppe],
        sertifiseringValg: []
      }

      renderWithProviders(<KodeverkValg kodeverk={kodeverk} />, {
        defaultValues: { kodeverkValg: [] }
      })

      const bransjeInput = screen.getByLabelText('Bransje')

      // Velg Bygg og anlegg
      await user.click(bransjeInput)
      await user.click(screen.getByRole('option', { name: 'Bygg og anlegg' }))
      expect(
        screen.getByRole('option', { name: 'Bygg og anlegg', selected: true })
      ).toBeInTheDocument()

      // Velg Helse og omsorg (erstatter Bygg)
      await user.click(bransjeInput)
      await user.click(screen.getByRole('option', { name: 'Helse og omsorg' }))
      expect(
        screen.getByRole('option', {
          name: 'Helse og omsorg',
          selected: true
        })
      ).toBeInTheDocument()
      expect(
        screen.queryByRole('option', {
          name: 'Bygg og anlegg',
          selected: true
        })
      ).not.toBeInTheDocument()
    })
  })

  describe('UtdanningGruppe med lærefag', () => {
    const gruppeKodeverk: KodeverkResponse = {
      tiltakskode: 'FAG_OG_YRKESOPPLAERING',
      sertifiseringValg: [],
      alternativer: [
        {
          type: KodeverkAlternativType.UTDANNING_GRUPPE,
          id: null,
          visningsnavn: 'Utdanningsprogram',
          representerer: OpplaringRepresenterer.UTDANNINGSPROGRAM_ID,
          pakrevd: true,
          utdanninger: [
            {
              id: 'bygg-id',
              visningsnavn: 'Bygg- og anleggsteknikk',
              larefag: {
                type: KodeverkAlternativType.VERDIGRUPPE,
                id: null,
                visningsnavn: 'Lærefag',
                pakrevd: false,
                representerer: OpplaringRepresenterer.LAREFAG,
                seleksjonstype: Seleksjonstype.FLERVALG,
                alternativer: [
                  { id: 'fag-1', visningsnavn: 'Tømrerfaget', valgt: false },
                  {
                    id: 'fag-2',
                    visningsnavn: 'Rørleggerfaget',
                    valgt: false
                  }
                ]
              }
            },
            {
              id: 'elektro-id',
              visningsnavn: 'Elektro og datateknologi',
              larefag: {
                type: KodeverkAlternativType.VERDIGRUPPE,
                id: null,
                visningsnavn: 'Lærefag',
                pakrevd: false,
                representerer: OpplaringRepresenterer.LAREFAG,
                seleksjonstype: Seleksjonstype.FLERVALG,
                alternativer: [
                  {
                    id: 'fag-3',
                    visningsnavn: 'Elektrikerfaget',
                    valgt: false
                  }
                ]
              }
            }
          ]
        }
      ]
    }

    it('rendrer UtdanningGruppe som combobox', () => {
      renderWithProviders(<KodeverkValg kodeverk={gruppeKodeverk} />, {
        defaultValues: { kodeverkValg: [] }
      })
      expect(screen.getByLabelText('Utdanningsprogram')).toBeInTheDocument()
    })

    it('viser lærefag etter valg av utdanningsprogram', async () => {
      const user = userEvent.setup()
      renderWithProviders(<KodeverkValg kodeverk={gruppeKodeverk} />, {
        defaultValues: { kodeverkValg: [] }
      })

      const gruppeInput = screen.getByLabelText('Utdanningsprogram')
      await user.click(gruppeInput)
      await user.click(
        screen.getByRole('option', { name: 'Bygg- og anleggsteknikk' })
      )

      expect(screen.getByLabelText('Lærefag')).toBeInTheDocument()
    })

    it('auto-åpner utdanningsprogram med valgte verdier', () => {
      const byggGruppe = gruppeKodeverk.alternativer[0]
      if (byggGruppe.type !== KodeverkAlternativType.UTDANNING_GRUPPE) {
        throw new Error('Forventet UTDANNING_GRUPPE')
      }
      const valgtUtdanning = byggGruppe.utdanninger[0]
      const larefagVerdigruppe = valgtUtdanning.larefag
      if (larefagVerdigruppe.type !== KodeverkAlternativType.VERDIGRUPPE) {
        throw new Error('Forventet VERDIGRUPPE')
      }

      const kodeverkMedValg: KodeverkResponse = {
        ...gruppeKodeverk,
        alternativer: [
          {
            ...byggGruppe,
            utdanninger: [
              {
                ...valgtUtdanning,
                larefag: {
                  ...larefagVerdigruppe,
                  alternativer: [
                    { id: 'fag-1', visningsnavn: 'Tømrerfaget', valgt: true },
                    {
                      id: 'fag-2',
                      visningsnavn: 'Rørleggerfaget',
                      valgt: false
                    }
                  ]
                }
              },
              byggGruppe.utdanninger[1]
            ]
          }
        ]
      }

      renderWithProviders(<KodeverkValg kodeverk={kodeverkMedValg} />, {
        defaultValues: { kodeverkValg: ['fag-1'] }
      })

      expect(screen.getByLabelText('Lærefag')).toBeInTheDocument()
      expect(
        screen.getByRole('option', { name: 'Tømrerfaget', selected: true })
      ).toBeInTheDocument()
    })
  })
})
