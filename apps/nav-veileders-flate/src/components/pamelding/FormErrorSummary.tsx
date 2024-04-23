import { ErrorSummary } from '@navikt/ds-react'
import { forwardRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { PameldingFormValues } from '../../model/PameldingFormValues.ts'

export const FormErrorSummary = forwardRef<HTMLDivElement>(
  function FormErrorSummary(_props, ref: React.Ref<HTMLDivElement>) {
    const {
      setFocus,
      formState: { errors }
    } = useFormContext<PameldingFormValues>()

    return (
      <div ref={ref} tabIndex={-1}>
        {Object.keys(errors).length > 0 && (
          <ErrorSummary
            heading="Du må rette opp i dette før du kan gå videre:"
            className="mb-4"
          >
            {(
              [
                'valgteInnhold',
                'innholdAnnetBeskrivelse',
                'bakgrunnsinformasjon',
                'deltakelsesprosent',
                'dagerPerUke'
              ] as const
            ).map((errorName) => {
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
        )}
      </div>
    )
  }
)
