import { UNSAFE_Combobox } from '@navikt/ds-react'
import { useId, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useDeltakerContext } from '../../tiltak/DeltakerContext.tsx'
import {
  finnAlternativMedValgteVerdier,
  getAlleVerdiIder,
  KodeverkAlternativType,
  type KodeverkContainer,
  type KodeverkGruppe,
  type KodeverkVerdigruppe,
  Seleksjonstype
} from '../../../api/data/kodeverk.ts'
import { SertifiseringSok } from './SertifiseringSok.tsx'
import { logError } from 'deltaker-flate-common'

/**
 * Rot-komponent som rendrer kodeverk-valgene for enkeltplass-påmelding.
 *
 * Kodeverket er et hierarki: Gruppe → Verdigruppe → Verdi.
 * Alle valgte verdi-IDer samles i form-feltet `kodeverkValg` (flat string-array),
 * som auto-lagres via KladdLagring.
 */
export const KodeverkValg = () => {
  const { deltaker } = useDeltakerContext()
  const kodeverk = deltaker.deltakerliste.kodeverk

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
    case KodeverkAlternativType.VERDIGRUPPE_SOK:
      if (alternativ.representerer === 'sertifiseringer') {
        return <SertifiseringSok alternativ={alternativ} />
      } else {
        logError(
          'Uventet type verdigruppe-søk: kun sertifiseringer støttes',
          alternativ
        )
        return null
      }
    case KodeverkAlternativType.GRUPPE:
      // Hopp over combobox hvis gruppen bare har ett barn — vis barnet direkte
      if (alternativ.alternativer.length === 1) {
        return <AlternativValg alternativ={alternativ.alternativer[0]} />
      }
      return <GruppeValg gruppe={alternativ} />
  }
}

/**
 * Viser en Gruppe som en combobox der brukeren velger ett alternativ.
 * Det valgte alternativet rendres rekursivt under comboboxen.
 *
 * Ved bytte av valgt alternativ fjernes forrige alternativs verdi-IDer
 * fra form-feltet `kodeverkValg` for å unngå at gamle valg henger igjen.
 */
const GruppeValg = ({ gruppe }: { gruppe: KodeverkGruppe }) => {
  const comboboxId = useId()
  const { getValues, setValue } = useFormContext()

  const [valgtId, setValgtId] = useState<string | null>(() =>
    finnAlternativMedValgteVerdier(gruppe)
  )

  const options = gruppe.alternativer.map((a) => ({
    value: a.id ?? a.visningsnavn,
    label: a.visningsnavn
  }))

  const valgtAlternativ =
    gruppe.alternativer.find((a) => (a.id ?? a.visningsnavn) === valgtId) ??
    null

  function handleValg(option: string, isSelected: boolean) {
    // Fjern verdi-IDer som tilhørte det forrige valgte alternativet
    if (valgtAlternativ) {
      const gamleIder = getAlleVerdiIder([valgtAlternativ])
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
        label={gruppe.visningsnavn}
        selectedOptions={options.filter((o) => o.value === valgtId)}
        size="small"
        options={options}
        isMultiSelect={false}
        onToggleSelected={handleValg}
      />

      {/* key={valgtId} sikrer at barnet remountes med fersk state ved bytte */}
      {valgtAlternativ && (
        <AlternativValg key={valgtId} alternativ={valgtAlternativ} />
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
  verdigruppe: KodeverkVerdigruppe
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
