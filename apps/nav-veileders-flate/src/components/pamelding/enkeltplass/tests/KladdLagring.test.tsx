import '@testing-library/jest-dom/vitest'
import { act, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFormContext } from 'react-hook-form'
import { trackUnhandledRejections } from 'deltaker-flate-common/test-utils/unhandled-rejections'
import { KladdLagring } from '../../KladdLagring'
import { renderWithProviders } from './test-utils'
import { PameldingEnkeltplassFormValues } from '../../../../model/PameldingEnkeltplassFormValues'
import { EnkeltplassKladdRequest } from '../../../../api/data/kladd-request'
import { OpplaringRepresenterer } from 'deltaker-flate-common'
import { formToEnkeltplassKladdRequest } from '../../../../utils/pamelding-enkeltplass'

const formToKladdRequest = (
  data: PameldingEnkeltplassFormValues
): EnkeltplassKladdRequest => formToEnkeltplassKladdRequest(data)

const FormChanger = ({
  onReady
}: {
  onReady: (setValue: (name: string, value: unknown) => void) => void
}) => {
  const { setValue } = useFormContext<PameldingEnkeltplassFormValues>()
  onReady((name, value) => setValue(name, value))
  return null
}

const setupKladdLagring = (
  defaultValues: Partial<PameldingEnkeltplassFormValues> = {}
) => {
  const oppdaterKladd = vi.fn().mockResolvedValue(200)
  let triggerChange: (name: string, value: unknown) => void = () => {}

  const utils = renderWithProviders(
    <>
      <FormChanger onReady={(fn) => (triggerChange = fn)} />
      <KladdLagring<PameldingEnkeltplassFormValues, EnkeltplassKladdRequest>
        oppdaterKladd={oppdaterKladd}
        formToKladdRequest={formToKladdRequest}
      />
    </>,
    { defaultValues }
  )

  return {
    oppdaterKladd,
    unmount: utils.unmount,
    change: (name: string, value: unknown) =>
      act(() => {
        triggerChange(name, value)
      }),
    advanceDebounce: async (ms = 2500) => {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(ms)
      })
    }
  }
}

describe('KladdLagring - auto-lagring', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('auto-lagrer ikke ved mount når ingenting er endret', async () => {
    const { oppdaterKladd, advanceDebounce } = setupKladdLagring({
      innhold: 'eksisterende'
    })

    await advanceDebounce()

    expect(oppdaterKladd).not.toHaveBeenCalled()
  })

  it('auto-lagrer når et form-felt endres', async () => {
    const { oppdaterKladd, change, advanceDebounce } = setupKladdLagring({
      innhold: ''
    })

    change('innhold', 'ny tekst')
    await advanceDebounce()

    expect(oppdaterKladd).toHaveBeenCalledTimes(1)
    expect(oppdaterKladd).toHaveBeenCalledWith(
      '1',
      '0101',
      expect.objectContaining({ beskrivelse: 'ny tekst' })
    )
  })

  it('auto-lagrer når kodeverkValg endres via setValue', async () => {
    const { oppdaterKladd, change, advanceDebounce } = setupKladdLagring({
      kategoriseringValg: []
    })

    change('kategoriseringValg', [
      {
        representerer: OpplaringRepresenterer.BRANSJE_ID,
        valgteIder: ['bransje-1']
      },
      {
        representerer: OpplaringRepresenterer.FORERKORT,
        valgteIder: ['fk-1']
      }
    ])
    await advanceDebounce()

    expect(oppdaterKladd).toHaveBeenCalledTimes(1)
    expect(oppdaterKladd).toHaveBeenCalledWith(
      '1',
      '0101',
      expect.objectContaining({
        kodeverkValg: ['bransje-1', 'fk-1']
      })
    )
  })

  it('auto-lagrer når sertifiseringValg endres via setValue', async () => {
    const { oppdaterKladd, change, advanceDebounce } = setupKladdLagring({
      sertifiseringValg: []
    })

    change('sertifiseringValg', [{ id: 90999, navn: 'Datakortet del 1' }])
    await advanceDebounce()

    expect(oppdaterKladd).toHaveBeenCalledTimes(1)
    expect(oppdaterKladd).toHaveBeenCalledWith(
      '1',
      '0101',
      expect.objectContaining({
        sertifiseringValg: [{ id: 90999, navn: 'Datakortet del 1' }]
      })
    )
  })

  it('debouncer flere endringer til ett kall', async () => {
    const { oppdaterKladd, change, advanceDebounce } = setupKladdLagring({
      innhold: ''
    })

    change('innhold', 'a')
    await advanceDebounce(500)
    change('innhold', 'ab')
    await advanceDebounce(500)
    change('innhold', 'abc')
    await advanceDebounce()

    expect(oppdaterKladd).toHaveBeenCalledTimes(1)
    expect(oppdaterKladd).toHaveBeenCalledWith(
      '1',
      '0101',
      expect.objectContaining({ beskrivelse: 'abc' })
    )
  })

  it('viser "Kladd lagret" etter vellykket lagring', async () => {
    const { change, advanceDebounce } = setupKladdLagring({ innhold: '' })

    change('innhold', 'ny tekst')
    await advanceDebounce()

    expect(screen.getByText('Kladd lagret')).toBeInTheDocument()
  })

  it('viser lagringsfeil uten global feilrapportering', async () => {
    const { oppdaterKladd, change, advanceDebounce } = setupKladdLagring({
      innhold: ''
    })
    oppdaterKladd.mockRejectedValueOnce(new Error('Request failed'))
    const unhandledRejections = trackUnhandledRejections()

    try {
      change('innhold', 'ny tekst')
      await advanceDebounce()

      expect(screen.getByText('Lagring feilet')).toBeInTheDocument()
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(unhandledRejections.rejections).toEqual([])
    } finally {
      unhandledRejections.stop()
    }
  })

  it('canceler pending lagring ved unmount og auto-lagrer fersk på remount', async () => {
    // Forste montering: endre et felt, men avmonter for lagringen starter.
    const firstMount = setupKladdLagring({ innhold: '' })
    firstMount.change('innhold', 'forkastet')
    await firstMount.advanceDebounce(500)
    firstMount.unmount()

    // Timeren skal ikke starte lagring etter avmontering.
    await firstMount.advanceDebounce(3000)
    expect(firstMount.oppdaterKladd).not.toHaveBeenCalled()

    // Ny montering: nye endringer skal lagres som vanlig.
    const secondMount = setupKladdLagring({ innhold: '' })
    secondMount.change('innhold', 'lagret')
    await secondMount.advanceDebounce()

    expect(secondMount.oppdaterKladd).toHaveBeenCalledTimes(1)
    expect(secondMount.oppdaterKladd).toHaveBeenCalledWith(
      '1',
      '0101',
      expect.objectContaining({ beskrivelse: 'lagret' })
    )
  })
})
