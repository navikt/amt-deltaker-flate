import { ErrorSummary } from '@navikt/ds-react'
import { useCallback } from 'react'
import { FieldValues, Path, useFormContext } from 'react-hook-form'
import { PameldingEnkeltplassFormValues } from '../../model/PameldingEnkeltplassFormValues'
import { PameldingFormValues } from '../../model/PameldingFormValues'

const enkeltplassFields: Path<PameldingEnkeltplassFormValues>[] = [
  'innhold',
  'startdato',
  'sluttdato',
  'arrangorUnderenhet',
  'deltakelsesmengdeValg',
  'pristype'
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

const focusFieldById = (fieldId: string) => {
  const element = document.getElementById(fieldId)

  if (!element) {
    return false
  }

  const firstFocusableChild = element.querySelector<HTMLElement>(
    'input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
  )

  const focusTarget = firstFocusableChild ?? element
  focusTarget.focus()
  focusTarget.scrollIntoView({ block: 'center' })

  return true
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

  const kodeverkErrors = Object.entries(errors).filter(
    ([key, error]) => key.startsWith('kodeverkValg_') && error?.message
  )
  const prisinformasjonErrors = Object.entries(errors).filter(
    ([key, error]) => key.startsWith('prisinformasjon_') && error?.message
  )

  return (
    <div ref={ref} tabIndex={-1} className="mb-8">
      <ErrorSummary heading="For å gå videre må du rette opp følgende:">
        {kodeverkErrors &&
          kodeverkErrors.length > 0 &&
          kodeverkErrors.map(([key, error]) => (
            <ErrorSummary.Item
              key={key}
              as="a"
              href={`#${key}`}
              onClick={(event) => {
                event.preventDefault()
                if (!focusFieldById(key)) {
                  setFocus(key as Path<T>)
                }
              }}
            >
              {error?.message as string}
            </ErrorSummary.Item>
          ))}

        {schemaFields.map((fieldName) => {
          const error = errors[fieldName]
          return (
            error && (
              <ErrorSummary.Item
                key={fieldName}
                as="a"
                href={`#${fieldName}`}
                onClick={(event) => {
                  event.preventDefault()
                  if (!focusFieldById(fieldName)) {
                    setFocus(fieldName as Path<T>)
                  }
                }}
              >
                {error.message as string}
              </ErrorSummary.Item>
            )
          )
        })}

        {prisinformasjonErrors &&
          prisinformasjonErrors.length > 0 &&
          prisinformasjonErrors.map(([key, error]) => {
            const fieldId = key.replace('prisinformasjon_', '')

            return (
              <ErrorSummary.Item
                key={key}
                as="a"
                href={`#${fieldId}`}
                onClick={(event) => {
                  event.preventDefault()
                  if (!focusFieldById(fieldId)) {
                    setFocus(fieldId as Path<T>)
                  }
                }}
              >
                {error?.message as string}
              </ErrorSummary.Item>
            )
          })}
      </ErrorSummary>
    </div>
  )
}
