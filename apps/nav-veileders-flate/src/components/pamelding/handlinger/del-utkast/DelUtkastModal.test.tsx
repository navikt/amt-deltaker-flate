import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { trackUnhandledRejections } from 'deltaker-flate-common/test-utils/unhandled-rejections'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DelUtkastModal } from './DelUtkastModal'

const {
  oppdaterUtkastMock,
  useAppContextMock,
  useModiaLinkMock,
  doRedirectMock,
  getDeltakerNavnMock,
  generatePameldingRequestFromFormMock,
  useDeltakerContextMock,
  useFormContextMock,
  getValuesMock
} = vi.hoisted(() => ({
  oppdaterUtkastMock: vi.fn(),
  useAppContextMock: vi.fn(),
  useModiaLinkMock: vi.fn(),
  doRedirectMock: vi.fn(),
  getDeltakerNavnMock: vi.fn(),
  generatePameldingRequestFromFormMock: vi.fn(),
  useDeltakerContextMock: vi.fn(),
  useFormContextMock: vi.fn(),
  getValuesMock: vi.fn()
}))

vi.mock('../../../../api/api', () => ({
  oppdaterUtkast: oppdaterUtkastMock
}))

vi.mock('../../../../AppContext', () => ({
  useAppContext: useAppContextMock
}))

vi.mock('../../../../hooks/useModiaLink', () => ({
  DELTAKELSESOVERSIKT_LINK: '/',
  useModiaLink: useModiaLinkMock
}))

vi.mock('../../../../utils/displayText', () => ({
  getDeltakerNavn: getDeltakerNavnMock
}))

vi.mock('../../../../utils/pamelding-form-utils', () => ({
  generatePameldingRequestFromForm: generatePameldingRequestFromFormMock
}))

vi.mock('../../../tiltak/DeltakerContext', () => ({
  useDeltakerContext: useDeltakerContextMock
}))

vi.mock('react-hook-form', () => ({
  useFormContext: useFormContextMock
}))

describe('DelUtkastModal', () => {
  beforeEach(() => {
    oppdaterUtkastMock.mockReset()
    useAppContextMock.mockReturnValue({ enhetId: '0101' })
    doRedirectMock.mockReset()
    useModiaLinkMock.mockReturnValue({ doRedirect: doRedirectMock })
    getDeltakerNavnMock.mockReturnValue('Testbruker')
    generatePameldingRequestFromFormMock.mockReturnValue({})
    useDeltakerContextMock.mockReturnValue({
      deltaker: {
        deltakerId: 'deltaker-1',
        deltakerliste: {
          visningsnavn: { tiltakHosArrangorTittel: 'Testtiltak' },
          pameldingstype: 'TRENGER_GODKJENNING'
        }
      }
    })
    getValuesMock.mockReturnValue({})
    useFormContextMock.mockReturnValue({ getValues: getValuesMock })
  })

  it('viser feilmelding uten global feilrapportering ved feil under deling', async () => {
    oppdaterUtkastMock.mockRejectedValue(new Error('Request failed'))
    const unhandledRejections = trackUnhandledRejections()

    try {
      const user = userEvent.setup()
      render(<DelUtkastModal open onClose={vi.fn()} />)

      await user.click(
        screen.getByRole('button', {
          name: 'Del utkast og gjør klar søknad'
        })
      )

      expect(
        await screen.findByText(
          'Vi fikk en feil og kunne ikke dele utkastet, prøv igjen.'
        )
      ).toBeInTheDocument()
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(unhandledRejections.rejections).toEqual([])
    } finally {
      unhandledRejections.stop()
    }
  })
})
