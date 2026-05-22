import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  createPameldingEnkeltplassFormSchema,
  generateFormDefaultValues,
  PameldingEnkeltplassFormValues
} from '../../../model/PameldingEnkeltplassFormValues'
import { useDeltakerContext } from '../../tiltak/DeltakerContext.tsx'
import { PameldingFormButtons } from '../FormButtons'
import { PrisOgBetaling } from './PrisOgBetaling'
import { InnholdBeskrivelse } from './InnholdBeskrivelse'
import { PameldingDatoer } from './PameldingDatoer'
import { FormErrorSummary } from '../FormErrorSummary.tsx'
import { ArrangorValg } from './ArrangorValg.tsx'
import { KodeverkValg } from './KodeverkValg.tsx'
import { useQuery } from '@tanstack/react-query'
import { useAppContext } from '../../../AppContext.tsx'
import { getKodeverk } from '../../../api/api-enkeltplass.ts'
import { Loader } from '@navikt/ds-react'

interface Props {
  className?: string
  focusOnOpen?: boolean
}

export const PameldingEnkeltplassForm = ({ className, focusOnOpen }: Props) => {
  const formRef = useRef<HTMLFormElement>(null)

  const { enhetId } = useAppContext()
  const { deltaker } = useDeltakerContext()

  useEffect(() => {
    if (focusOnOpen && formRef?.current) formRef.current.focus()
  }, [])

  const { data: kodeverk, isLoading } = useQuery({
    queryKey: ['kodeverk', deltaker.deltakerId],
    queryFn: () => getKodeverk(deltaker.deltakerId, enhetId),
    // placeholderData: keepPreviousData,
    throwOnError: false
  })

  const defaultValues = generateFormDefaultValues(deltaker, kodeverk)

  const methods = useForm<PameldingEnkeltplassFormValues>({
    defaultValues,
    resolver: zodResolver(createPameldingEnkeltplassFormSchema(deltaker)),
    shouldFocusError: false
  })

  if (isLoading) {
    return (
      <div className="mt-8">
        <Loader size="3xlarge" title="Henter skjema..." />
      </div>
    )
  }

  return (
    <form
      autoComplete="off"
      className={`${className ?? ''} flex flex-col gap-8`}
      ref={formRef}
      tabIndex={-1}
      aria-label="Skjema for påmelding"
    >
      <FormProvider {...methods}>
        <FormErrorSummary erEnkeltplass={true} />

        <KodeverkValg kodeverk={kodeverk} />

        <InnholdBeskrivelse />

        <PameldingDatoer
          defaultStartdato={defaultValues.startdato}
          defaultSluttdato={defaultValues.sluttdato}
        />

        <ArrangorValg />
        <PrisOgBetaling />

        <PameldingFormButtons />
      </FormProvider>
    </form>
  )
}
