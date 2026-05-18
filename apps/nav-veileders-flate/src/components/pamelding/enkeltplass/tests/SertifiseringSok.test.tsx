import '@testing-library/jest-dom'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SertifiseringSok } from '../SertifiseringSok'
import { renderWithProviders } from './test-utils'
import {
  KodeverkAlternativType,
  KodeverkContainer,
  Seleksjonstype,
  VerdigruppeSokKilde
} from '../../../../api/data/kodeverk'

const sokSertifiseringerMock = vi.fn()

vi.mock('../../../../api/api-enkeltplass.ts', () => ({
  sokSertifiseringer: (term: string, enhetId: string) =>
    sokSertifiseringerMock(term, enhetId)
}))

// Hopp over debounce for raskere tester
vi.mock('../../../../hooks/useDebounce.ts', () => ({
  default: <T,>(value: T) => value
}))

const sertifiseringAlternativ: KodeverkContainer = {
  type: KodeverkAlternativType.VERDIGRUPPE_SOK,
  id: null,
  visningsnavn: 'Sertifiseringer',
  representerer: 'sertifiseringer',
  seleksjonstype: Seleksjonstype.FLERVALG,
  kilde: VerdigruppeSokKilde.JANZZ_SERTIFISERING
}

describe('SertifiseringSok', () => {
  beforeEach(() => {
    sokSertifiseringerMock.mockReset()
  })

  describe('layout', () => {
    it('rendrer combobox med riktig label', () => {
      sokSertifiseringerMock.mockResolvedValue([])
      renderWithProviders(
        <SertifiseringSok alternativ={sertifiseringAlternativ} />
      )
      expect(screen.getByLabelText('Sertifiseringer')).toBeInTheDocument()
    })

    it('viser forhåndsvalgte sertifiseringer som chips', () => {
      sokSertifiseringerMock.mockResolvedValue([])
      renderWithProviders(
        <SertifiseringSok alternativ={sertifiseringAlternativ} />,
        {
          defaultValues: {
            sertifiseringValg: [
              { id: 1, navn: 'Datakortet del 1' },
              { id: 2, navn: 'Datakortet del 2' }
            ]
          }
        }
      )
      expect(
        screen.getByRole('button', { name: /Datakortet del 1/ })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /Datakortet del 2/ })
      ).toBeInTheDocument()
    })

    it('kaller ikke API når søkestreng er tom', () => {
      sokSertifiseringerMock.mockResolvedValue([])
      renderWithProviders(
        <SertifiseringSok alternativ={sertifiseringAlternativ} />
      )
      expect(sokSertifiseringerMock).not.toHaveBeenCalled()
    })
  })

  describe('interaksjoner', () => {
    it('søker etter sertifiseringer når brukeren skriver', async () => {
      const user = userEvent.setup()
      sokSertifiseringerMock.mockResolvedValue([
        { konseptId: 90999, label: 'Datakortet del 1' },
        { konseptId: 2, label: 'Sertifisert zumba-instruktør' }
      ])

      renderWithProviders(
        <SertifiseringSok alternativ={sertifiseringAlternativ} />
      )

      await user.type(screen.getByLabelText('Sertifiseringer'), 'datakort')

      await waitFor(() => {
        expect(sokSertifiseringerMock).toHaveBeenCalledWith('datakort', '0101')
      })
      expect(
        await screen.findByRole('option', { name: 'Datakortet del 1' })
      ).toBeInTheDocument()
    })

    it('legger til sertifisering når brukeren velger et søketreff', async () => {
      const user = userEvent.setup()
      sokSertifiseringerMock.mockResolvedValue([
        { konseptId: 90999, label: 'Datakortet del 1' }
      ])

      renderWithProviders(
        <SertifiseringSok alternativ={sertifiseringAlternativ} />,
        {
          defaultValues: { sertifiseringValg: [] }
        }
      )

      await user.type(screen.getByLabelText('Sertifiseringer'), 'datakort')
      const treff = await screen.findByRole('option', {
        name: 'Datakortet del 1'
      })
      await user.click(treff)

      expect(
        screen.getByRole('option', {
          name: 'Datakortet del 1',
          selected: true
        })
      ).toBeInTheDocument()
    })

    it('fjerner sertifisering når brukeren klikker bort et valg', async () => {
      const user = userEvent.setup()
      sokSertifiseringerMock.mockResolvedValue([
        { konseptId: 1, label: 'Datakortet del 1' }
      ])

      renderWithProviders(
        <SertifiseringSok alternativ={sertifiseringAlternativ} />,
        {
          defaultValues: {
            sertifiseringValg: [{ id: 1, navn: 'Datakortet del 1' }]
          }
        }
      )

      // Søk for å få fram option-en, deretter klikk for å avvelge
      await user.type(screen.getByLabelText('Sertifiseringer'), 'datakort')
      const valgt = await screen.findByRole('option', {
        name: 'Datakortet del 1',
        selected: true
      })
      await user.click(valgt)

      await waitFor(() => {
        expect(
          screen.queryByRole('option', {
            name: 'Datakortet del 1',
            selected: true
          })
        ).not.toBeInTheDocument()
      })
    })
  })
})
