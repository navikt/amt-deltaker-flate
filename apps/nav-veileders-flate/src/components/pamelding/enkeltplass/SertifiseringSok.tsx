import { UNSAFE_Combobox } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'
import { PameldingEnkeltplassFormValues } from '../../../model/PameldingEnkeltplassFormValues'
import {
  KodeverkContainer,
  KodeverkSertifiseringResponse
} from '../../../api/data/kodeverk.ts'
import useDebounce from '../../../hooks/useDebounce.ts'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { sokSertifiseringer } from '../../../api/api-enkeltplass.ts'
import { useAppContext } from '../../../AppContext.tsx'
import { useState } from 'react'

export function SertifiseringSok({
  alternativ
}: {
  alternativ: KodeverkContainer
}) {
  const { enhetId } = useAppContext()
  const [sokeTekst, setSoketekst] = useState('')
  const { data: sertifiseringer = [] } = useSokKodeverkSertifiseringer(
    sokeTekst,
    enhetId
  )

  const { control } = useFormContext<PameldingEnkeltplassFormValues>()

  const sertifiseringerOptions = sertifiseringerAsOptions(sertifiseringer)

  const handleToggleSelected = (
    option: string,
    isSelected: boolean,
    current: PameldingEnkeltplassFormValues['sertifiseringValg'],
    onChange: (
      value: PameldingEnkeltplassFormValues['sertifiseringValg']
    ) => void
  ) => {
    if (isSelected) {
      const found = sertifiseringerOptions.find((o) => o.value === option)
      if (found) {
        onChange([
          ...current,
          { id: parseInt(found.value, 10), navn: found.label }
        ])
      }
    } else {
      onChange(current.filter((v) => v.id.toString() !== option))
    }
  }

  return (
    <div>
      <Controller
        control={control}
        name="sertifiseringValg"
        render={({ field }) => (
          <UNSAFE_Combobox
            id="verdigruppeSok"
            label={alternativ.visningsnavn}
            isMultiSelect
            selectedOptions={(field.value ?? []).map((v) => ({
              value: v.id.toString(),
              label: v.navn
            }))}
            ref={field.ref}
            size="small"
            onChange={setSoketekst}
            filteredOptions={sertifiseringerOptions}
            options={sertifiseringerOptions}
            onToggleSelected={(option, isSelected) =>
              handleToggleSelected(
                option,
                isSelected,
                field.value ?? [],
                field.onChange
              )
            }
          />
        )}
      />
    </div>
  )
}

function useSokKodeverkSertifiseringer(sokestreng: string, enhetId: string) {
  const debouncedSok = useDebounce(sokestreng, 300).trim()

  return useQuery({
    queryKey: ['sokKodeverkSertifiseringer', debouncedSok],
    queryFn: () => sokSertifiseringer(debouncedSok, enhetId),
    enabled: debouncedSok.length > 0,
    placeholderData: keepPreviousData,
    throwOnError: false
  })
}

function sertifiseringerAsOptions(
  sertifiseringer: KodeverkSertifiseringResponse
) {
  return sertifiseringer
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((sertifisering) => ({
      value: sertifisering.konseptId.toString(),
      label: sertifisering.label
    }))
}
