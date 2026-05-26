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
import { DeltakerResponse } from '../../../api/data/deltaker.ts'
import { KodeverkResponse } from '../../../api/data/kodeverk.ts'

interface Props {
  className?: string
  focusOnOpen?: boolean
}

export const PameldingEnkeltplassForm = ({ className, focusOnOpen }: Props) => {
  const { enhetId } = useAppContext()
  const { deltaker } = useDeltakerContext()

  const { data: kodeverk, isLoading } = useQuery({
    queryKey: ['kodeverk', deltaker.deltakerId, enhetId],
    queryFn: () => getKodeverk(deltaker.deltakerId, enhetId),
    throwOnError: false
  })

  if (isLoading) {
    return (
      <div className="mt-8">
        <Loader size="3xlarge" title="Henter skjema..." />
      </div>
    )
  }

  // Mount form etter at kodeverk er ferdig lastet, slik at useForm
  // initialiseres én gang med riktige defaultValues (inkl. forhåndsvalgte
  // kodeverk og sertifiseringer).
  return (
    <PameldingEnkeltplassFormInner
      className={className}
      focusOnOpen={focusOnOpen}
      deltaker={deltaker}
      kodeverk={kodeverk}
    />
  )
}

interface InnerProps extends Props {
  deltaker: DeltakerResponse
  kodeverk: KodeverkResponse | undefined
}

const PameldingEnkeltplassFormInner = ({
  className,
  focusOnOpen,
  deltaker,
  kodeverk
}: InnerProps) => {
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (focusOnOpen && formRef?.current) formRef.current.focus()
  }, [focusOnOpen])

  const defaultValues = generateFormDefaultValues(deltaker, kodeverk)

  const methods = useForm<PameldingEnkeltplassFormValues>({
    defaultValues,
    resolver: zodResolver(createPameldingEnkeltplassFormSchema(deltaker)),
    shouldFocusError: false
  })

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
