import { ErrorSummary } from '@navikt/ds-react'
import { useCallback } from 'react'
import { FieldValues, Path, useFormContext } from 'react-hook-form'
import { PameldingEnkeltplassFormValues } from '../../model/PameldingEnkeltplassFormValues'
import { PameldingFormValues } from '../../model/PameldingFormValues'

const enkeltplassFields: Path<PameldingEnkeltplassFormValues>[] = [
  'innhold',
  'startdato',
  'sluttdato',
  'arrangorHovedenhet',
  'arrangorUnderenhet',
  'prisinformasjon'
]

const standardFields: Path<PameldingFormValues>[] = [
  'valgteInnhold',
  'innholdAnnetBeskrivelse',
  'bakgrunnsinformasjon',
  'deltakelsesprosent',
  'dagerPerUke'
]

export const FormErrorSummary = ({
  erEnkeltplass
}: {
  erEnkeltplass: boolean
}) => {
  if (erEnkeltplass) {
    return (
      <_FormErrorSummary<PameldingEnkeltplassFormValues>
        schemaFields={enkeltplassFields}
      />
    )
  }
  return (
    <_FormErrorSummary<PameldingFormValues> schemaFields={standardFields} />
  )
}

interface _FormErrorSummaryProps<T extends FieldValues> {
  schemaFields: Path<T>[]
}

const _FormErrorSummary = <T extends FieldValues>({
  schemaFields
}: _FormErrorSummaryProps<T>) => {
  const {
    setFocus,
    formState: { errors, submitCount }
  } = useFormContext<T>()

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) node.focus()
    },
    [submitCount]
  )

  if (Object.keys(errors).length === 0) {
    return null
  }

  return (
    <div ref={ref} tabIndex={-1} className="mb-8">
      <ErrorSummary heading="For å gå videre må du rette opp følgende:">
        {schemaFields.map((fieldName) => {
          const error = errors[fieldName]
          return (
            error && (
              <ErrorSummary.Item
                key={fieldName}
                as="button"
                type="button"
                onClick={() => setFocus(fieldName)}
              >
                {error.message as string}
              </ErrorSummary.Item>
            )
          )
        })}
      </ErrorSummary>
    </div>
  )
}
