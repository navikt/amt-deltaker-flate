import { ErrorSummary } from '@navikt/ds-react'
import { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { PameldingEnkeltplassFormValues } from '../../model/PameldingEnkeltplassFormValues.ts'

const schemaFields: (keyof PameldingEnkeltplassFormValues)[] = [
  'beskrivelse',
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
    [submitCount] // ny ref-instans ved hvert submit-forsøk
  )

  if (Object.keys(errors).length === 0) {
    return null
  }

  return (
    <div ref={ref} tabIndex={-1}>
      <ErrorSummary
        heading="Du må rette opp i dette før du kan gå videre:"
        className="mb-4"
      >
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
