import { UNSAFE_Combobox } from '@navikt/ds-react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useAppContext } from '../../../AppContext'
import { ArrangorEnhetResponse } from '../../../api/data/arrangorSok'
import { PameldingEnkeltplassFormValues } from '../../../model/PameldingEnkeltplassFormValues'
import { useSokBrregHovedenhet } from '../../../hooks/useSokBrregHovedenhet'

interface Props {
  className?: string
}

export const ArrangorValg = ({ className }: Props) => {
  const { enhetId } = useAppContext()
  const [sokArrangor, setSokArrangor] = useState('')
  const { data: brregVirksomheter = [] } = useSokBrregHovedenhet(
    sokArrangor,
    enhetId
  )
  const arrangorHovedenhetOptions =
    getArrangorHovedenhetOptions(brregVirksomheter)
  const {
    control,
    // setValue,
    formState: { errors }
    // watch
  } = useFormContext<PameldingEnkeltplassFormValues>()

  //  const arrangorHovedenhet = watch('arrangorHovedenhet') ?? ''

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
                field.onChange(undefined)
                //setValue('arrangorHovedenhet', '')
              }
            }}
          />
        )}
      />
    </div>
  )
}

const getArrangorHovedenhetOptions = (
  brregVirksomheter: ArrangorEnhetResponse
) => {
  const options = brregVirksomheter
    .sort((a, b) => a.navn.localeCompare(b.navn))
    .map((virksomhet) => ({
      value: virksomhet.organisasjonsnummer,
      label: `${virksomhet.navn} - ${virksomhet.organisasjonsnummer}`
    }))
  return options
}
