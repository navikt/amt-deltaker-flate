import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  createPameldingEnkeltplassFormSchema,
  generateFormDefaultValues,
  PameldingEnkeltplassFormValues
} from '../../../model/PameldingEnkeltplassFormValues'
import { usePameldingContext } from '../../tiltak/PameldingContext'
import { PameldingFormButtons } from '../FormButtons'
import { PrisOgBetaling } from './PrisOgBetaling'
import { InnholdBeskrivelse } from './InnholdBeskrivelse'
import { PameldingDatoer } from './PameldingDatoer'
import { FormErrorSummary } from '../FormErrorSummary.tsx'

interface Props {
  className?: string
  focusOnOpen?: boolean
}

export const PameldingEnkeltplassForm = ({ className, focusOnOpen }: Props) => {
  const formRef = useRef<HTMLFormElement>(null)

  const { pamelding } = usePameldingContext()
  const defaultValues = generateFormDefaultValues(pamelding)

  const methods = useForm<PameldingEnkeltplassFormValues>({
    defaultValues,
    resolver: zodResolver(createPameldingEnkeltplassFormSchema(pamelding)),
    shouldFocusError: false
  })

  useEffect(() => {
    if (focusOnOpen && formRef?.current) formRef.current.focus()
  }, [])

  return (
    <form
      autoComplete="off"
      className={className}
      ref={formRef}
      tabIndex={-1}
      aria-label="Skjema for påmelding"
    >
      <FormProvider {...methods}>
        <FormErrorSummary erEnkeltplass={true} />

        <InnholdBeskrivelse />

        <PameldingDatoer
          className="mt-8"
          defaultStartdato={defaultValues.startdato}
          defaultSluttdato={defaultValues.sluttdato}
        />

        <PrisOgBetaling className="mt-8" />

        <PameldingFormButtons className="mt-8" />
      </FormProvider>
    </form>
  )
}
