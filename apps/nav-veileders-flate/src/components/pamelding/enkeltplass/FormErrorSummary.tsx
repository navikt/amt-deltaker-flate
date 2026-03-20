import { ErrorSummary } from '@navikt/ds-react'
import { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { PameldingEnkeltplassFormValues } from '../../../model/PameldingEnkeltplassFormValues'

const schemaFields: (keyof PameldingEnkeltplassFormValues)[] = [
  'innhold',
  'startdato',
  'sluttdato',
  'prisinformasjon'
]

export const FormErrorSummary = () => {
  const {
    setFocus,
    formState: { errors, submitCount }
  } = useFormContext<PameldingEnkeltplassFormValues>()

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) node.focus()
    },
    // ny ref-instans ved hvert submit-forsøk
    // VI vil bare fokusere opp på error summary ved submit
    [submitCount]
  )

  if (Object.keys(errors).length === 0) {
    return null
  }

  return (
    <div ref={ref} tabIndex={-1} className="mb-8">
      <ErrorSummary heading="Du må rette opp i dette før du kan gå videre:">
        {schemaFields.map((errorName) => {
          const error = errors[errorName]

          return (
            error && (
              <ErrorSummary.Item
                key={errorName}
                as="button"
                type="button"
                onClick={() => setFocus(errorName)}
              >
                {error.message}
              </ErrorSummary.Item>
            )
          )
        })}
      </ErrorSummary>
    </div>
  )
}
