import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { Tiltakskode } from 'deltaker-flate-common'
import { FormProvider, useForm } from 'react-hook-form'
import { vi } from 'vitest'
import { AppContext } from '../../../../AppContext'
import { DeltakerResponse } from '../../../../api/data/deltaker'
import { PameldingEnkeltplassFormValues } from '../../../../model/PameldingEnkeltplassFormValues'
import { DeltakerContext } from '../../../tiltak/DeltakerContext'
import { PameldingFormContext } from '../../PameldingFormContext'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export const createDeltaker = (
  arrangor: { navn: string; organisasjonsnummer: string } | null = null
) =>
  ({
    deltakerId: '1',
    deltakerliste: {
      deltakerlisteId: '1',
      deltakerlisteNavn: 'Test',
      tiltakskode: Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING,
      arrangor,
      erEnkeltplass: true,
      sluttdato: dayjs('2030-02-20').toDate()
    },
    startdato: null,
    sluttdato: null,
    maxVarighet: dayjs.duration(12, 'month').asMilliseconds(),
    softMaxVarighet: dayjs.duration(12, 'month').asMilliseconds()
  }) as DeltakerResponse

const FormWrapper = ({
  children,
  defaultValues
}: {
  children: React.ReactNode
  defaultValues?: Partial<PameldingEnkeltplassFormValues>
}) => {
  const methods = useForm<PameldingEnkeltplassFormValues>({
    defaultValues: {
      tiltakskode: Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING,
      innhold: '',
      arrangorUnderenhet: '',
      prisinformasjon: '',
      ...defaultValues
    }
  })
  return <FormProvider {...methods}>{children}</FormProvider>
}

export const renderWithProviders = (
  children: React.ReactNode,
  {
    deltaker = createDeltaker(),
    defaultValues
  }: {
    deltaker?: DeltakerResponse
    defaultValues?: Partial<PameldingEnkeltplassFormValues>
  } = {}
) => {
  return render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <AppContext.Provider
        value={{
          personident: '12345678910',
          enhetId: '0101',
          setPersonident: vi.fn(),
          setEnhetId: vi.fn()
        }}
      >
        <DeltakerContext.Provider value={{ deltaker, setDeltaker: vi.fn() }}>
          <PameldingFormContext.Provider
            value={{
              disabled: false,
              redigerUtkast: false,
              error: null,
              setRedigerUtkast: vi.fn(),
              setDisabled: vi.fn(),
              setError: vi.fn()
            }}
          >
            <FormWrapper defaultValues={defaultValues}>{children}</FormWrapper>
          </PameldingFormContext.Provider>
        </DeltakerContext.Provider>
      </AppContext.Provider>
    </QueryClientProvider>
  )
}
