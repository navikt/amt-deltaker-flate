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

interface Props {
  className?: string
  focusOnOpen?: boolean
}

export const PameldingEnkeltplassForm = ({ className, focusOnOpen }: Props) => {
  const formRef = useRef<HTMLFormElement>(null)

  const { deltaker } = useDeltakerContext()
  const defaultValues = generateFormDefaultValues(deltaker)

  const methods = useForm<PameldingEnkeltplassFormValues>({
    defaultValues,
    resolver: zodResolver(createPameldingEnkeltplassFormSchema(deltaker)),
    shouldFocusError: false
  })

  useEffect(() => {
    if (focusOnOpen && formRef?.current) formRef.current.focus()
  }, [])

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

        <KodeverkValg />

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
