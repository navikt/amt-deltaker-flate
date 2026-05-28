import { UNSAFE_Combobox } from '@navikt/ds-react'
import { logError } from 'deltaker-flate-common'
import { useId, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import {
  KodeverkAlternativType,
  type KodeverkContainer,
  KodeverkResponse,
  OpplaringRepresenterer,
  type KodeverkUtdanningGruppe,
  Seleksjonstype,
  KodeverkVerdigruppeBase
} from '../../../api/data/kodeverk.ts'
import { SertifiseringSok } from './SertifiseringSok.tsx'

/**
 * Rot-komponent som rendrer kodeverk-valgene for enkeltplass-påmelding.
 *
 * Kodeverket er et hierarki av UtdanningGruppe/Verdigruppe med Verdi-noder.
 * Alle valgte verdi-IDer samles i form-feltet `kodeverkValg` (flat string-array),
 * som auto-lagres via KladdLagring.
 */
export const KodeverkValg = ({ kodeverk }: { kodeverk?: KodeverkResponse }) => {
  if (!kodeverk || kodeverk.alternativer.length === 0) return null

  return (
    <div className="flex flex-col gap-8">
      {kodeverk.alternativer.map((alternativ, index) => (
        <AlternativValg
          key={alternativ.id ?? `alternativ-${index}`}
          alternativ={alternativ}
        />
      ))}
    </div>
  )
}

/**
 * Dispatcher til riktig komponent basert på alternativ-type.
 */
const AlternativValg = ({ alternativ }: { alternativ: KodeverkContainer }) => {
  switch (alternativ.type) {
    case KodeverkAlternativType.VERDIGRUPPE:
      return <VerdigruppeValg verdigruppe={alternativ} />
    case KodeverkAlternativType.UTDANNING_GRUPPE:
      return <UtdanningGruppeValg utdanningGruppe={alternativ} />
    case KodeverkAlternativType.VERDIGRUPPE_SOK:
      if (alternativ.representerer === OpplaringRepresenterer.SERTIFISERINGER) {
        return <SertifiseringSok alternativ={alternativ} />
      } else {
        logError(
          'Uventet type verdigruppe-søk: kun sertifiseringer støttes',
          alternativ
        )
        return null
      }
  }
}

/**
 * Viser en UtdanningGruppe som en combobox over utdanningsprogram,
 * og rendrer valgt programs lærefag (Verdigruppe) under.
 */
const UtdanningGruppeValg = ({
  utdanningGruppe
}: {
  utdanningGruppe: KodeverkUtdanningGruppe
}) => {
  const comboboxId = useId()
  const { getValues, setValue } = useFormContext()

  const [valgtId, setValgtId] = useState<string | null>(() => {
    const medValg = utdanningGruppe.utdanninger.find((u) =>
      u.larefag.alternativer.some((v) => v.valgt)
    )
    return medValg?.id ?? null
  })

  const options = utdanningGruppe.utdanninger.map((u) => ({
    value: u.id,
    label: u.visningsnavn
  }))

  const valgtUtdanning =
    utdanningGruppe.utdanninger.find((u) => u.id === valgtId) ?? null

  function handleValg(option: string, isSelected: boolean) {
    if (valgtUtdanning) {
      const gamleIder = new Set(
        valgtUtdanning.larefag.alternativer.map((v) => v.id)
      )
      const gjeldende = getValues('kodeverkValg') as string[]
      setValue(
        'kodeverkValg',
        gjeldende.filter((id) => !gamleIder.has(id)),
        { shouldDirty: true }
      )
    }

    setValgtId(isSelected ? option : null)
  }

  return (
    <div className="flex flex-col gap-8">
      <UNSAFE_Combobox
        id={comboboxId}
        label={utdanningGruppe.visningsnavn}
        selectedOptions={options.filter((o) => o.value === valgtId)}
        size="small"
        options={options}
        isMultiSelect={false}
        onToggleSelected={handleValg}
      />

      {valgtUtdanning && (
        <VerdigruppeValg verdigruppe={valgtUtdanning.larefag} />
      )}
    </div>
  )
}

/**
 * Viser en Verdigruppe som en combobox der brukeren velger verdier.
 * Enkeltvalg eller flervalg styres av `seleksjonstype`.
 *
 * Leser og skriver direkte til form-feltet `kodeverkValg` (flat string-array
 * delt mellom alle verdigrupper). For å unngå at én verdigruppe overskriver
 * en annens valg, filtrerer vi ut egne verdi-IDer og merger med resten.
 */
const VerdigruppeValg = ({
  verdigruppe
}: {
  verdigruppe: KodeverkVerdigruppeBase
}) => {
  const comboboxId = useId()
  const { setValue } = useFormContext()

  // Les valgte IDer fra form-state (single source of truth)
  const kodeverkValg = (useWatch({ name: 'kodeverkValg' }) ?? []) as string[]

  // Alle verdi-IDer som tilhører denne verdigruppen
  const egneIds = new Set(verdigruppe.alternativer.map((v) => v.id))
  const valgteEgne = kodeverkValg.filter((id) => egneIds.has(id))

  const options = verdigruppe.alternativer.map((v) => ({
    value: v.id,
    label: v.visningsnavn
  }))

  function handleValg(option: string, isSelected: boolean) {
    const nyeEgneValg =
      verdigruppe.seleksjonstype === Seleksjonstype.ENKELTVALG
        ? isSelected
          ? [option]
          : []
        : isSelected
          ? [...valgteEgne, option]
          : valgteEgne.filter((v) => v !== option)

    // Behold andre verdigruppers valg, erstatt kun egne
    const andreValg = kodeverkValg.filter((id) => !egneIds.has(id))
    setValue('kodeverkValg', [...andreValg, ...nyeEgneValg], {
      shouldDirty: true
    })
  }

  return (
    <UNSAFE_Combobox
      id={comboboxId}
      label={verdigruppe.visningsnavn}
      selectedOptions={options.filter((o) => valgteEgne.includes(o.value))}
      size="small"
      options={options}
      isMultiSelect={verdigruppe.seleksjonstype === Seleksjonstype.FLERVALG}
      onToggleSelected={handleValg}
    />
  )
}
