import { UNSAFE_Combobox } from '@navikt/ds-react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useAppContext } from '../../../AppContext'
import { ArrangorEnhetResponse } from '../../../api/data/arrangorSok'
import { useSokBrregUnderenhet } from '../../../hooks/useSokBrregUnderenhet'
import { PameldingEnkeltplassFormValues } from '../../../model/PameldingEnkeltplassFormValues'
import { usePameldingFormContext } from '../PameldingFormContext'

interface Props {
  className?: string
}

export const ArrangorValg = ({ className }: Props) => {
  const { enhetId } = useAppContext()
  const { disabled } = usePameldingFormContext()
  const [sokArrangor, setSokArrangor] = useState('')

  const {
    control,
    formState: { errors }
  } = useFormContext<PameldingEnkeltplassFormValues>()

  const { data: brregVirksomheter = [] } = useSokBrregUnderenhet(
    sokArrangor,
    enhetId
  )
  const arrangorUnderenhetOptions = getArrangorOptions(brregVirksomheter)

  return (
    <div className={className}>
      <Controller
        control={control}
        name="arrangorUnderenhet"
        render={({ field }) => (
          <UNSAFE_Combobox
            id="arrangorUnderenhet"
            label="Tiltaksarrangør"
            description="Søk etter navn eller organisasjonsnummer"
            selectedOptions={arrangorUnderenhetOptions.filter(
              (v) => field.value === v.value
            )}
            ref={field.ref}
            size="small"
            onChange={setSokArrangor}
            error={errors.arrangorUnderenhet?.message}
            filteredOptions={arrangorUnderenhetOptions}
            options={arrangorUnderenhetOptions}
            disabled={disabled}
            onToggleSelected={(option, isSelected) => {
              if (isSelected) {
                field.onChange(option)
              } else {
                field.onChange(undefined)
              }
            }}
          />
        )}
      />
    </div>
  )
}

const getArrangorOptions = (enheter: ArrangorEnhetResponse) => {
  const options = enheter
    .sort((a, b) => a.navn.localeCompare(b.navn))
    .map((virksomhet) => ({
      value: virksomhet.organisasjonsnummer,
      label: `${virksomhet.navn} - ${virksomhet.organisasjonsnummer}`
    }))
  return options
}
