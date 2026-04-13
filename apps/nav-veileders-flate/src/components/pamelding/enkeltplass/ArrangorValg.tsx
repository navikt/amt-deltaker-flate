import { UNSAFE_Combobox } from '@navikt/ds-react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useAppContext } from '../../../AppContext'
import { ArrangorEnhetResponse } from '../../../api/data/arrangorSok'
import { useSokBrregUnderenhet } from '../../../hooks/useSokBrregUnderenhet'
import { PameldingEnkeltplassFormValues } from '../../../model/PameldingEnkeltplassFormValues'
import { usePameldingFormContext } from '../PameldingFormContext'
import { useDeltakerContext } from '../../tiltak/DeltakerContext'

interface Props {
  className?: string
}

export const ArrangorValg = ({ className }: Props) => {
  const { enhetId } = useAppContext()
  const { disabled } = usePameldingFormContext()
  const { deltaker } = useDeltakerContext()
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

  const getSelectedOptions = (fieldValue: string | undefined) => {
    if (!fieldValue) return []
    const fromSearch = arrangorUnderenhetOptions.find(
      (v) => v.value === fieldValue
    )
    if (fromSearch) return [fromSearch]

    const initArrangorOption = deltaker.deltakerliste.arrangor
      ? getArrangorOptions([deltaker.deltakerliste.arrangor])[0]
      : undefined

    if (initArrangorOption && fieldValue === initArrangorOption.value)
      return [initArrangorOption]
    return []
  }

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
            selectedOptions={getSelectedOptions(field.value)}
            ref={field.ref}
            size="small"
            onChange={setSokArrangor}
            error={errors.arrangorUnderenhet?.message}
            filteredOptions={arrangorUnderenhetOptions}
            options={arrangorUnderenhetOptions}
            disabled={disabled}
            onToggleSelected={(option, isSelected) => {
              field.onChange(isSelected ? option : '')
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
