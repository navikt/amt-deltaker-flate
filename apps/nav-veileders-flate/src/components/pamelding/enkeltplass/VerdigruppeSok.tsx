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

export function VerdigruppeSok({
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

  /*
  const getSelectedOptions = (fieldValue: string | undefined) => {
    if (!fieldValue) return []
    const fromSearch = sertifiseringerOptions.find(
      (v) => v.value === Number(fieldValue)
    )
    if (fromSearch) return [fromSearch]
    return []
  }
*/

  return (
    <div>
      <Controller
        control={control}
        name="kodeverkValg"
        render={({ field }) => (
          <UNSAFE_Combobox
            id="verdigruppeSok"
            label={alternativ.visningsnavn}
            selectedOptions={
              // TODO: finn ut hvordan dette skal fungere
              []
            }
            ref={field.ref}
            size="small"
            onChange={setSoketekst}
            filteredOptions={sertifiseringerOptions}
            options={sertifiseringerOptions}
            onToggleSelected={(option, isSelected) => {
              // TODO: tillat flere valg
              field.onChange(isSelected ? option : '')
            }}
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
