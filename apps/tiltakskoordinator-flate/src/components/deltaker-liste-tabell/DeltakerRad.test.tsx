import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DeltakerStatusType } from 'deltaker-flate-common'
import { Table } from '@navikt/ds-react'
import { MemoryRouter } from 'react-router-dom'
import { Deltaker } from '../../api/data/deltakerliste'
import { HandlingValg } from '../../context-providers/HandlingContext'
import { lagTestDeltaker } from '../../test-utils/lagTestDeltaker'
import { DeltakerRad } from './DeltakerRad'

vi.mock('../../context-providers/HandlingContext', async () => {
  const actual = await vi.importActual<
    typeof import('../../context-providers/HandlingContext')
  >('../../context-providers/HandlingContext')
  return {
    ...actual,
    useHandlingContext: () => ({
      handlingValg: null,
      valgteDeltakere: [],
      setValgteDeltakere: vi.fn(),
      setHandlingValg: vi.fn()
    })
  }
})

const lagDeltaker = lagTestDeltaker

const defaultProps = {
  deltakerlisteId: 'liste-1',
  handlingValg: null as HandlingValg | null,
  erBatchHandling: false,
  erLopendeOppstart: false,
  skalViseVurderinger: false,
  disabled: false,
  selected: false,
  onGiAvslag: vi.fn()
}

const renderRad = (props?: Partial<typeof defaultProps>, deltaker?: Deltaker) =>
  render(
    <MemoryRouter>
      <Table>
        <Table.Body>
          <DeltakerRad
            deltaker={deltaker ?? lagDeltaker()}
            {...defaultProps}
            {...props}
          />
        </Table.Body>
      </Table>
    </MemoryRouter>
  )

describe('DeltakerRad', () => {
  describe('layout', () => {
    it('viser navn med etternavn først', () => {
      renderRad()
      expect(screen.getByText('Nordmann, Ola')).toBeTruthy()
    })

    it('viser nav-enhet', () => {
      renderRad()
      expect(screen.getByText('Nav Grünerløkka')).toBeTruthy()
    })

    it('viser søkt inn dato', () => {
      renderRad()
      expect(screen.getByText('15.01.2025')).toBeTruthy()
    })

    it('viser start- og sluttdato når løpende oppstart', () => {
      renderRad({ erLopendeOppstart: true })
      expect(screen.getByText('01.02.2025')).toBeTruthy()
      expect(screen.getByText('01.06.2025')).toBeTruthy()
    })

    it('skjuler start- og sluttdato når ikke løpende oppstart', () => {
      renderRad({ erLopendeOppstart: false })
      expect(screen.queryByText('01.02.2025')).toBeNull()
      expect(screen.queryByText('01.06.2025')).toBeNull()
    })

    it('viser navn som lenke når ikke disabled', () => {
      renderRad({ disabled: false })
      expect(screen.getByRole('link', { name: 'Nordmann, Ola' })).toBeTruthy()
    })

    it('viser navn som tekst når disabled', () => {
      renderRad({ disabled: true })
      expect(screen.queryByRole('link', { name: 'Nordmann, Ola' })).toBeNull()
      expect(screen.getByText('Nordmann, Ola')).toBeTruthy()
    })

    it('viser checkbox når erBatchHandling', () => {
      renderRad({
        erBatchHandling: true,
        handlingValg: HandlingValg.TILDEL_PLASS
      })
      expect(screen.getByRole('checkbox')).toBeTruthy()
    })

    it('skjuler checkbox når ikke batch-handling', () => {
      renderRad({ erBatchHandling: false })
      expect(screen.queryByRole('checkbox')).toBeNull()
    })

    it('viser gi avslag-knapp når handlingValg er GI_AVSLAG', () => {
      renderRad({ handlingValg: HandlingValg.GI_AVSLAG })
      expect(screen.getByRole('button', { name: /avslag/i })).toBeTruthy()
    })

    it('disabler gi avslag-knapp for deltaker med status som ikke kan gis avslag', () => {
      const deltaker = lagDeltaker({
        status: { type: DeltakerStatusType.DELTAR, aarsak: null }
      })
      renderRad({ handlingValg: HandlingValg.GI_AVSLAG }, deltaker)
      expect(screen.getByRole('button', { name: /avslag/i })).toHaveProperty(
        'disabled',
        true
      )
    })
  })

  describe('interaksjoner', () => {
    it('kaller onGiAvslag med deltaker ved klikk på avslag-knapp', async () => {
      const onGiAvslag = vi.fn()
      const deltaker = lagDeltaker()
      renderRad({ handlingValg: HandlingValg.GI_AVSLAG, onGiAvslag }, deltaker)

      await userEvent.click(screen.getByRole('button', { name: /avslag/i }))

      expect(onGiAvslag).toHaveBeenCalledWith(deltaker)
    })
  })
})
