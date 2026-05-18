import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { KodeverkValg } from '../KodeverkValg'
import { createDeltaker, renderWithProviders } from './test-utils'
import {
  KodeverkAlternativType,
  Seleksjonstype
} from '../../../../api/data/kodeverk'
import { DeltakerResponse } from '../../../../api/data/deltaker'

const createDeltakerMedKodeverk = (
  kodeverk: DeltakerResponse['deltakerliste']['kodeverk']
): DeltakerResponse => {
  const deltaker = createDeltaker()
  return {
    ...deltaker,
    deltakerliste: {
      ...deltaker.deltakerliste,
      kodeverk
    }
  } as DeltakerResponse
}

const bransjeVerdigruppe = {
  type: KodeverkAlternativType.VERDIGRUPPE as const,
  id: null,
  visningsnavn: 'Bransje',
  representerer: 'bransje',
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
  representerer: 'forerkort',
  seleksjonstype: Seleksjonstype.FLERVALG,
  alternativer: [
    { id: 'fk-1', visningsnavn: 'B - Personbil', valgt: false },
    { id: 'fk-2', visningsnavn: 'C1 - Lett lastebil', valgt: false },
    { id: 'fk-3', visningsnavn: 'CE - Lastebil med tilhenger', valgt: false }
  ]
}

describe('KodeverkValg', () => {
  it('rendrer ikke når kodeverk er null', () => {
    const deltaker = createDeltakerMedKodeverk(null)
    const { container } = renderWithProviders(<KodeverkValg />, { deltaker })
    expect(container).toBeEmptyDOMElement()
  })

  it('rendrer ikke når alternativer er tom', () => {
    const deltaker = createDeltakerMedKodeverk({
      tiltakskode: 'ARBEIDSMARKEDSOPPLAERING',
      alternativer: [],
      sertifiseringValg: []
    })
    const { container } = renderWithProviders(<KodeverkValg />, { deltaker })
    expect(container).toBeEmptyDOMElement()
  })

  it('rendrer combobox for en Verdigruppe', () => {
    const deltaker = createDeltakerMedKodeverk({
      tiltakskode: 'ARBEIDSMARKEDSOPPLAERING',
      alternativer: [bransjeVerdigruppe],
      sertifiseringValg: []
    })
    renderWithProviders(<KodeverkValg />, { deltaker })
    expect(screen.getByLabelText('Bransje')).toBeInTheDocument()
  })

  it('viser forhåndsvalgte verdier fra valgt: true', () => {
    const deltaker = createDeltakerMedKodeverk({
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
    })
    renderWithProviders(<KodeverkValg />, {
      deltaker,
      defaultValues: { kodeverkValg: ['bransje-1'] }
    })
    expect(
      screen.getByRole('option', { name: 'Bygg og anlegg', selected: true })
    ).toBeInTheDocument()
  })

  describe('flere verdigrupper - kodeverkValg form-felt', () => {
    it('beholder valg fra begge verdigrupper i form state', async () => {
      const user = userEvent.setup()
      const deltaker = createDeltakerMedKodeverk({
        tiltakskode: 'ARBEIDSMARKEDSOPPLAERING',
        alternativer: [bransjeVerdigruppe, forerkortVerdigruppe],
        sertifiseringValg: []
      })
      renderWithProviders(<KodeverkValg />, {
        deltaker,
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

      // Hent form-verdier via hidden input (registrert felt)
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
      const deltaker = createDeltakerMedKodeverk({
        tiltakskode: 'ARBEIDSMARKEDSOPPLAERING',
        alternativer: [bransjeVerdigruppe, forerkortVerdigruppe],
        sertifiseringValg: []
      })

      renderWithProviders(<KodeverkValg />, {
        deltaker,
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
      const deltaker = createDeltakerMedKodeverk({
        tiltakskode: 'ARBEIDSMARKEDSOPPLAERING',
        alternativer: [bransjeVerdigruppe],
        sertifiseringValg: []
      })

      renderWithProviders(<KodeverkValg />, {
        deltaker,
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

  describe('Gruppe med nestede verdigrupper', () => {
    const gruppeKodeverk = {
      tiltakskode: 'FAG_OG_YRKESOPPLAERING',
      sertifiseringValg: [],
      alternativer: [
        {
          type: KodeverkAlternativType.GRUPPE as const,
          id: null,
          visningsnavn: 'Utdanningsprogram',
          alternativer: [
            {
              type: KodeverkAlternativType.GRUPPE as const,
              id: 'bygg-id',
              visningsnavn: 'Bygg- og anleggsteknikk',
              alternativer: [
                {
                  type: KodeverkAlternativType.VERDIGRUPPE as const,
                  id: null,
                  visningsnavn: 'Lærefag',
                  representerer: 'larefag',
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
              ]
            },
            {
              type: KodeverkAlternativType.GRUPPE as const,
              id: 'elektro-id',
              visningsnavn: 'Elektro og datateknologi',
              alternativer: [
                {
                  type: KodeverkAlternativType.VERDIGRUPPE as const,
                  id: null,
                  visningsnavn: 'Lærefag',
                  representerer: 'larefag',
                  seleksjonstype: Seleksjonstype.FLERVALG,
                  alternativer: [
                    {
                      id: 'fag-3',
                      visningsnavn: 'Elektrikerfaget',
                      valgt: false
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }

    it('rendrer Gruppe som combobox med undergrupper', () => {
      const deltaker = createDeltakerMedKodeverk(gruppeKodeverk)
      renderWithProviders(<KodeverkValg />, {
        deltaker,
        defaultValues: { kodeverkValg: [] }
      })
      expect(screen.getByLabelText('Utdanningsprogram')).toBeInTheDocument()
    })

    it('viser verdigruppe etter valg av gruppe', async () => {
      const user = userEvent.setup()
      const deltaker = createDeltakerMedKodeverk(gruppeKodeverk)
      renderWithProviders(<KodeverkValg />, {
        deltaker,
        defaultValues: { kodeverkValg: [] }
      })

      const gruppeInput = screen.getByLabelText('Utdanningsprogram')
      await user.click(gruppeInput)
      await user.click(
        screen.getByRole('option', { name: 'Bygg- og anleggsteknikk' })
      )

      // Gruppe med ett barn hoppes over, viser Lærefag direkte
      expect(screen.getByLabelText('Lærefag')).toBeInTheDocument()
    })

    it('auto-åpner gruppe med valgte verdier', () => {
      const kodeverkMedValg = {
        ...gruppeKodeverk,
        alternativer: [
          {
            ...gruppeKodeverk.alternativer[0],
            alternativer: [
              {
                ...gruppeKodeverk.alternativer[0].alternativer[0],
                alternativer: [
                  {
                    ...gruppeKodeverk.alternativer[0].alternativer[0]
                      .alternativer[0],
                    alternativer: [
                      { id: 'fag-1', visningsnavn: 'Tømrerfaget', valgt: true },
                      {
                        id: 'fag-2',
                        visningsnavn: 'Rørleggerfaget',
                        valgt: false
                      }
                    ]
                  }
                ]
              },
              gruppeKodeverk.alternativer[0].alternativer[1]
            ]
          }
        ]
      }

      const deltaker = createDeltakerMedKodeverk(kodeverkMedValg)
      renderWithProviders(<KodeverkValg />, {
        deltaker,
        defaultValues: { kodeverkValg: ['fag-1'] }
      })

      // Gruppen med valgt verdi skal auto-åpnes
      expect(screen.getByLabelText('Lærefag')).toBeInTheDocument()
      expect(
        screen.getByRole('option', { name: 'Tømrerfaget', selected: true })
      ).toBeInTheDocument()
    })
  })
})
