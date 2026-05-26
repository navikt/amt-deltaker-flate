import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Deltaker } from '../../api/data/deltakerliste'
import { HandlingValg } from '../../context-providers/HandlingContext'
import { TildelPlassModal } from './TildelPlassModal'
import { SettPaVentelisteModal } from './SettPaVentelisteModal'
import { DelMedArrangorModal } from './DelMedArrangorModal'

import { lagTestDeltaker } from '../../test-utils/lagTestDeltaker'

const lagDeltaker = (id: string) => lagTestDeltaker({ id })

// API-responsobjekter – inneholder feilkode som ikke finnes på Deltaker-typen
const lagDeltakerResult = (id: string) => ({
  id,
  fornavn: 'Ola',
  etternavn: 'Nordmann',
  feilkode: null
})

const lagFeiletDeltakerResult = (id: string) => ({
  id,
  fornavn: 'Kari',
  etternavn: 'Hansen',
  feilkode: 'UKJENT'
})

// --- Mocks ---

const tildelPlassMock = vi.fn()
const settPaVentelisteMock = vi.fn()
const delMedArrangorMock = vi.fn()
const invaliderDeltakereMock = vi.fn(() => Promise.resolve())
const setHandlingUtfortText = vi.fn()
const setHandlingFeiletText = vi.fn()
const onClose = vi.fn()
const onSend = vi.fn()

let mockHandlingValg: HandlingValg | null = null
let mockValgteDeltakere: Deltaker[] = []

vi.mock('../../api/api', () => ({
  tildelPlass: (...args: unknown[]) => tildelPlassMock(...args),
  settDeltakerePaVenteliste: (...args: unknown[]) =>
    settPaVentelisteMock(...args),
  delDeltakereMedArrangor: (...args: unknown[]) => delMedArrangorMock(...args)
}))

vi.mock('../../hooks/useInvaliderDeltakere', () => ({
  useInvaliderDeltakere: () => invaliderDeltakereMock
}))

vi.mock('../../context-providers/DeltakerlisteContext', () => ({
  useDeltakerlisteContext: () => ({
    deltakerlisteDetaljer: { id: 'liste-id', navn: 'Testkurs' }
  })
}))

vi.mock('../../context-providers/HandlingContext', () => ({
  HandlingValg: {
    DEL_DELTAKERE: 'DEL_DELTAKERE',
    SETT_PA_VENTELISTE: 'SETT_PA_VENTELISTE',
    TILDEL_PLASS: 'TILDEL_PLASS',
    GI_AVSLAG: 'GI_AVSLAG'
  },
  useHandlingContext: () => ({
    handlingValg: mockHandlingValg,
    valgteDeltakere: mockValgteDeltakere,
    setHandlingUtfortText,
    setHandlingFeiletText,
    setValgteDeltakere: vi.fn(),
    setHandlingValg: vi.fn()
  })
}))

const clickSendKnapp = async (
  user: ReturnType<typeof userEvent.setup>,
  knappTekst: string
) => {
  const sendKnapp = screen.getByRole('button', {
    name: knappTekst,
    hidden: true
  })
  await user.click(sendKnapp)
}

describe('TildelPlassModal', () => {
  const knappTekst = 'Tildel plass'

  beforeEach(() => {
    vi.clearAllMocks()
    mockHandlingValg = 'TILDEL_PLASS' as HandlingValg
    mockValgteDeltakere = [lagDeltaker('1'), lagDeltaker('2')]
  })

  it('kaller tildelPlass med riktige argumenter og invaliderer', async () => {
    tildelPlassMock.mockResolvedValue([
      lagDeltakerResult('1'),
      lagDeltakerResult('2')
    ])
    const user = userEvent.setup()

    render(<TildelPlassModal open onClose={onClose} onSend={onSend} />)
    await clickSendKnapp(user, knappTekst)

    await waitFor(() => {
      expect(tildelPlassMock).toHaveBeenCalledWith('liste-id', ['1', '2'])
      expect(invaliderDeltakereMock).toHaveBeenCalled()
      expect(onSend).toHaveBeenCalled()
      expect(setHandlingUtfortText).toHaveBeenCalledWith(
        expect.stringContaining('2 deltakere ble tildelt plass.')
      )
    })
  })

  it('viser feilmelding ved API-feil', async () => {
    tildelPlassMock.mockRejectedValue(new Error('500'))
    const user = userEvent.setup()

    render(<TildelPlassModal open onClose={onClose} onSend={onSend} />)
    await clickSendKnapp(user, knappTekst)

    await waitFor(() => {
      expect(
        screen.getByText('Kunne ikke tildele plass. Vennligst prøv igjen.')
      ).toBeTruthy()
      expect(onSend).not.toHaveBeenCalled()
    })
  })

  it('fjerner feilmelding ved nytt forsøk', async () => {
    tildelPlassMock.mockRejectedValueOnce(new Error('500'))
    tildelPlassMock.mockResolvedValueOnce([
      lagDeltakerResult('1'),
      lagDeltakerResult('2')
    ])
    const user = userEvent.setup()

    render(<TildelPlassModal open onClose={onClose} onSend={onSend} />)
    await clickSendKnapp(user, knappTekst)

    await waitFor(() => {
      expect(
        screen.getByText('Kunne ikke tildele plass. Vennligst prøv igjen.')
      ).toBeTruthy()
    })

    await clickSendKnapp(user, knappTekst)

    await waitFor(() => {
      expect(
        screen.queryByText('Kunne ikke tildele plass. Vennligst prøv igjen.')
      ).toBeNull()
      expect(onSend).toHaveBeenCalled()
    })
  })

  it('kaller setHandlingFeiletText når noen deltakere feiler', async () => {
    tildelPlassMock.mockResolvedValue([
      lagDeltakerResult('1'),
      lagFeiletDeltakerResult('2')
    ])
    const user = userEvent.setup()

    render(<TildelPlassModal open onClose={onClose} onSend={onSend} />)
    await clickSendKnapp(user, knappTekst)

    await waitFor(() => {
      expect(setHandlingFeiletText).toHaveBeenCalled()
      expect(setHandlingUtfortText).not.toHaveBeenCalled()
    })
  })
})

describe('SettPaVentelisteModal', () => {
  const knappTekst = 'Sett på venteliste'

  beforeEach(() => {
    vi.clearAllMocks()
    mockHandlingValg = 'SETT_PA_VENTELISTE' as HandlingValg
    mockValgteDeltakere = [lagDeltaker('1')]
  })

  it('kaller settDeltakerePaVenteliste og invaliderer', async () => {
    settPaVentelisteMock.mockResolvedValue([lagDeltakerResult('1')])
    const user = userEvent.setup()

    render(<SettPaVentelisteModal open onClose={onClose} onSend={onSend} />)
    await clickSendKnapp(user, knappTekst)

    await waitFor(() => {
      expect(settPaVentelisteMock).toHaveBeenCalledWith('liste-id', ['1'])
      expect(invaliderDeltakereMock).toHaveBeenCalled()
      expect(onSend).toHaveBeenCalled()
      expect(setHandlingUtfortText).toHaveBeenCalledWith(
        expect.stringContaining('venteliste')
      )
    })
  })

  it('viser feilmelding ved API-feil', async () => {
    settPaVentelisteMock.mockRejectedValue(new Error('500'))
    const user = userEvent.setup()

    render(<SettPaVentelisteModal open onClose={onClose} onSend={onSend} />)
    await clickSendKnapp(user, knappTekst)

    await waitFor(() => {
      expect(
        screen.getByText(
          'Kunne ikke sette på venteliste. Vennligst prøv igjen.'
        )
      ).toBeTruthy()
      expect(onSend).not.toHaveBeenCalled()
    })
  })
})

describe('DelMedArrangorModal', () => {
  const knappTekst = 'Del med arrangør'

  beforeEach(() => {
    vi.clearAllMocks()
    mockHandlingValg = 'DEL_DELTAKERE' as HandlingValg
    mockValgteDeltakere = [lagDeltaker('1')]
  })

  it('kaller delDeltakereMedArrangor og invaliderer', async () => {
    delMedArrangorMock.mockResolvedValue([lagDeltakerResult('1')])
    const user = userEvent.setup()

    render(<DelMedArrangorModal open onClose={onClose} onSend={onSend} />)
    await clickSendKnapp(user, knappTekst)

    await waitFor(() => {
      expect(delMedArrangorMock).toHaveBeenCalledWith('liste-id', ['1'])
      expect(invaliderDeltakereMock).toHaveBeenCalled()
      expect(onSend).toHaveBeenCalled()
      expect(setHandlingUtfortText).toHaveBeenCalledWith(
        expect.stringContaining('delt med arrangør')
      )
    })
  })

  it('viser feilmelding ved API-feil', async () => {
    delMedArrangorMock.mockRejectedValue(new Error('500'))
    const user = userEvent.setup()

    render(<DelMedArrangorModal open onClose={onClose} onSend={onSend} />)
    await clickSendKnapp(user, knappTekst)

    await waitFor(() => {
      expect(
        screen.getByText('Kunne ikke dele med arrangør. Vennligst prøv igjen.')
      ).toBeTruthy()
      expect(onSend).not.toHaveBeenCalled()
    })
  })
})
