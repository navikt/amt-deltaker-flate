import '@testing-library/jest-dom'
import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { KladdLagring } from '../../KladdLagring'
import { KodeverkValg } from '../KodeverkValg'
import { renderWithProviders, createDeltaker } from './test-utils'
import {
  KodeverkAlternativType,
  Seleksjonstype
} from '../../../../api/data/kodeverk'
import { PameldingEnkeltplassFormValues } from '../../../../model/PameldingEnkeltplassFormValues'
import { EnkeltplassKladdRequest } from '../../../../api/data/kladd-request'
import { DeltakerResponse } from '../../../../api/data/deltaker'

const formToKladdRequest = (
  data: PameldingEnkeltplassFormValues
): EnkeltplassKladdRequest => ({
  beskrivelse: data.innhold,
  prisinformasjon: data.prisinformasjon,
  arrangorUnderenhet: data.arrangorUnderenhet,
  startdato: data.startdato,
  sluttdato: data.sluttdato,
  kodeverkValg: data.kodeverkValg
})

const bransjeVerdigruppe = {
  type: KodeverkAlternativType.VERDIGRUPPE as const,
  id: null,
  visningsnavn: 'Bransje',
  representerer: 'bransje',
  seleksjonstype: Seleksjonstype.ENKELTVALG,
  alternativer: [
    { id: 'bransje-1', visningsnavn: 'Bygg og anlegg', valgt: false },
    { id: 'bransje-2', visningsnavn: 'Helse og omsorg', valgt: false }
  ]
}

const lagDeltakerMedKodeverk = (
  alternativer: (typeof bransjeVerdigruppe)[]
): DeltakerResponse => {
  const base = createDeltaker()
  return {
    ...base,
    deltakerliste: {
      ...base.deltakerliste,
      kodeverk: {
        tiltakskode: 'ARBEIDSMARKEDSOPPLAERING',
        alternativer
      }
    }
  } as DeltakerResponse
}

describe('KodeverkValg + KladdLagring integrasjon', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('auto-lagrer kladd når bruker velger verdi i KodeverkValg', async () => {
    const oppdaterKladd = vi.fn().mockResolvedValue(200)
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

    const deltaker = lagDeltakerMedKodeverk([bransjeVerdigruppe])

    renderWithProviders(
      <>
        <KodeverkValg />
        <KladdLagring<PameldingEnkeltplassFormValues, EnkeltplassKladdRequest>
          oppdaterKladd={oppdaterKladd}
          formToKladdRequest={formToKladdRequest}
        />
      </>,
      { deltaker, defaultValues: { kodeverkValg: [] } }
    )

    // Bruker klikker i Bransje-comboboxen og velger en verdi
    const input = screen.getByLabelText('Bransje')
    await user.click(input)
    await user.click(screen.getByRole('option', { name: 'Bygg og anlegg' }))

    // La debounce-timeren løpe ut
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500)
    })

    expect(oppdaterKladd).toHaveBeenCalledTimes(1)
    expect(oppdaterKladd).toHaveBeenCalledWith(
      '1',
      '0101',
      expect.objectContaining({ kodeverkValg: ['bransje-1'] })
    )
  })

  it('viser lagrede valg ved mount og auto-lagrer endring', async () => {
    const oppdaterKladd = vi.fn().mockResolvedValue(200)
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

    // Backend har lagret bransje-1 som valgt
    const deltaker = lagDeltakerMedKodeverk([
      {
        ...bransjeVerdigruppe,
        alternativer: [
          { id: 'bransje-1', visningsnavn: 'Bygg og anlegg', valgt: true },
          { id: 'bransje-2', visningsnavn: 'Helse og omsorg', valgt: false }
        ]
      }
    ])

    renderWithProviders(
      <>
        <KodeverkValg />
        <KladdLagring<PameldingEnkeltplassFormValues, EnkeltplassKladdRequest>
          oppdaterKladd={oppdaterKladd}
          formToKladdRequest={formToKladdRequest}
        />
      </>,
      { deltaker, defaultValues: { kodeverkValg: ['bransje-1'] } }
    )

    // Verifiser at lagret verdi vises ved mount
    expect(
      screen.getByRole('option', { name: 'Bygg og anlegg', selected: true })
    ).toBeInTheDocument()

    // La initial debounce-timer løpe ut — skal ikke trigge lagring siden ingenting er endret
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500)
    })
    expect(oppdaterKladd).not.toHaveBeenCalled()

    // Bruker bytter til ny verdi
    const input = screen.getByLabelText('Bransje')
    await user.click(input)
    await user.click(screen.getByRole('option', { name: 'Helse og omsorg' }))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500)
    })

    // Skal lagre med ny verdi
    expect(oppdaterKladd).toHaveBeenCalledTimes(1)
    expect(oppdaterKladd).toHaveBeenCalledWith(
      '1',
      '0101',
      expect.objectContaining({ kodeverkValg: ['bransje-2'] })
    )
  })
})
