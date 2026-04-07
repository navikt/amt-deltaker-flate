import { UNSAFE_Combobox } from '@navikt/ds-react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useAppContext } from '../../../AppContext'
import { ArrangorEnhetResponse } from '../../../api/data/arrangorSok'
import { PameldingEnkeltplassFormValues } from '../../../model/PameldingEnkeltplassFormValues'
import {
  useBrregUnderenheter,
  useSokBrregHovedenhet
} from '../../../hooks/useSokBrregHovedenhet'

interface Props {
  className?: string
}

export const ArrangorValg = ({ className }: Props) => {
  const { enhetId } = useAppContext()
  const [sokArrangor, setSokArrangor] = useState('')

  const {
    control,
    setValue,
    formState: { errors },
    watch
  } = useFormContext<PameldingEnkeltplassFormValues>()

  const { data: brregVirksomheter = [] } = useSokBrregHovedenhet(
    sokArrangor,
    enhetId
  )
  const arrangorHovedenhetOptions = getArrangorOptions(brregVirksomheter)

  const arrangorHovedenhet = watch('arrangorHovedenhet') ?? ''
  const { data: brregUnderenheter = [] } = useBrregUnderenheter(
    arrangorHovedenhet,
    enhetId
  )
  const arrangorUnderenhetOptions = getArrangorOptions(brregUnderenheter ?? [])

  return (
    <div className={className}>
      <Controller
        control={control}
        name="arrangorHovedenhet"
        render={({ field }) => (
          <UNSAFE_Combobox
            id="arrangorHovedenhet"
            label="Tiltaksarrangørens hovedenhet"
            description="Søk etter navn eller organisasjonsnummer"
            selectedOptions={arrangorHovedenhetOptions.filter((v) =>
              field.value?.includes(v.value)
            )}
            size="small"
            onChange={setSokArrangor}
            name={field.name}
            error={errors.arrangorHovedenhet?.message}
            filteredOptions={arrangorHovedenhetOptions}
            options={arrangorHovedenhetOptions}
            onToggleSelected={(option, isSelected) => {
              if (isSelected) {
                field.onChange(option)
              } else {
                field.onChange()
                setValue('arrangorUnderenhet', '')
              }
            }}
          />
        )}
      />

      <Controller
        control={control}
        name="arrangorUnderenhet"
        render={({ field }) => (
          <UNSAFE_Combobox
            id="arrangorUnderenhet"
            className="mt-8"
            label="Tiltaksarrangørens underenhet"
            description="Velg underenhet for arrangøren"
            selectedOptions={arrangorUnderenhetOptions.filter((v) =>
              field.value?.includes(v.value)
            )}
            size="small"
            disabled={arrangorUnderenhetOptions.length === 0}
            name={field.name}
            error={errors.arrangorUnderenhet?.message}
            options={arrangorUnderenhetOptions}
            onToggleSelected={(option, isSelected) => {
              if (isSelected) {
                field.onChange(option)
              } else {
                field.onChange()
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
