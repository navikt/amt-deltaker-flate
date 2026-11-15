import '@testing-library/jest-dom/vitest'
import { act, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFormContext } from 'react-hook-form'
import { KladdLagring } from '../../KladdLagring'
import { renderWithProviders } from './test-utils'
import { PameldingEnkeltplassFormValues } from '../../../../model/PameldingEnkeltplassFormValues'
import { EnkeltplassKladdRequest } from '../../../../api/data/kladd-request'
import { OpplaringRepresenterer } from 'deltaker-flate-common'
import { formToEnkeltplassKladdRequest } from '../../../../utils/pamelding-enkeltplass'

interface ProcessWithUnhandledRejection {
  on(event: 'unhandledRejection', listener: (reason: unknown) => void): void
  off(event: 'unhandledRejection', listener: (reason: unknown) => void): void
}

const nodeProcess = (
  globalThis as typeof globalThis & { process: ProcessWithUnhandledRejection }
).process

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

  it('auto-lagrer ikke ved montering hvis ingenting er endret', async () => {
    const { oppdaterKladd, advanceDebounce } = setupKladdLagring({
      innhold: 'eksisterende'
    })

    await advanceDebounce()

    expect(oppdaterKladd).not.toHaveBeenCalled()
  })

  it('auto-lagrer ved endring i et skjemafelt', async () => {
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

  it('auto-lagrer ved endring av valg fra kodeverket', async () => {
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

  it('auto-lagrer ved endring av sertifisering', async () => {
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

  it('samler flere endringer til ett lagringskall', async () => {
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
    const unhandledRejections: unknown[] = []
    const handleUnhandledRejection = (reason: unknown) => {
      unhandledRejections.push(reason)
    }
    nodeProcess.on('unhandledRejection', handleUnhandledRejection)

    try {
      change('innhold', 'ny tekst')
      await advanceDebounce()

      expect(screen.getByText('Lagring feilet')).toBeInTheDocument()
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(unhandledRejections).toEqual([])
    } finally {
      nodeProcess.off('unhandledRejection', handleUnhandledRejection)
    }
  })

  it('avbryter ventende lagring ved avmontering og lagrer endringer ved ny montering', async () => {
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
