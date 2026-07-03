import { NumberTextField } from '../../NumberTextField.tsx'
import { SimpleDatePicker } from '../SimpleDatePicker.tsx'
import { DeltakerResponse } from '../../../api/data/deltaker.ts'

interface DagerPerUkeFieldProps {
  label: string
  description?: string
  dagerPerUke: number | null
  dagerPerUkeError?: string
  disabled: boolean
  onChange: (dagerPerUke: number | undefined) => void
}

export const DagerPerUkeField = ({
  label,
  description,
  dagerPerUke,
  dagerPerUkeError,
  disabled,
  onChange
}: DagerPerUkeFieldProps) => (
  <NumberTextField
    label={label}
    description={description}
    disabled={disabled}
    value={dagerPerUke ?? undefined}
    onChange={onChange}
    error={dagerPerUkeError}
    className="[&>input]:w-16 mt-6"
    id="dagerPerUke"
  />
)

interface GyldigFraFieldProps {
  deltaker: DeltakerResponse
  gyldigFra: Date | undefined
  gyldigFraError?: string
  onChange: (date: Date | undefined) => void
  onValidate: (error: string | undefined) => void
}

export const GyldigFraField = ({
  deltaker,
  gyldigFra,
  gyldigFraError,
  onChange,
  onValidate
}: GyldigFraFieldProps) => (
  <>
    {deltaker.startdato && (
      <SimpleDatePicker
        label="Fra når gjelder ny deltakelsesmengde?"
        defaultDate={gyldigFra}
        fromDate={deltaker.startdato ?? undefined}
        toDate={deltaker.sluttdato ?? undefined}
        error={gyldigFraError ?? null}
        onValidate={(validation) => {
          if (validation.isBefore) {
            onValidate(
              'Datoen kan ikke velges fordi den er før deltakers startsdato'
            )
          } else if (validation.isAfter) {
            onValidate(
              'Datoen kan ikke velges fordi den er etter deltakers sluttdato'
            )
          } else if (validation.isInvalid) {
            onValidate('Ugyldig dato')
          } else {
            onValidate(undefined)
          }
        }}
        onChange={onChange}
        className="mt-4"
      />
    )}
  </>
)
