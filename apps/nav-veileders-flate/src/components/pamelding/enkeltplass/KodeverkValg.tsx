import { UNSAFE_Combobox } from '@navikt/ds-react'
import { logError, OpplaringRepresenterer } from 'deltaker-flate-common'
import { useState } from 'react'
import { FieldValues, useFormContext } from 'react-hook-form'
import {
  KodeverkAlternativType,
  type KodeverkContainer,
  KodeverkResponse,
  type KodeverkUtdanningGruppe,
  Seleksjonstype,
  KodeverkVerdigruppeBase
} from '../../../api/data/kodeverk.ts'
import { SertifiseringSok } from './SertifiseringSok.tsx'
import { PameldingEnkeltplassFormValues } from '../../../model/PameldingEnkeltplassFormValues.ts'

type KodeverkValgEntry = PameldingEnkeltplassFormValues['kodeverkValg'][number]

type KodeverkOption = {
  value: string
  label: string
}

/**
 * Rot-komponent som rendrer kodeverk-valgene for enkeltplass-påmelding.
 *
 * Kodeverket er et hierarki av UtdanningGruppe/Verdigruppe med Verdi-noder.
 * Alle valgte verdi-IDer samles i form-feltet `kodeverkValg` (liste av representerer + valgteIder),
 * som auto-lagres via KladdLagring.
 */
export const KodeverkValg = ({ kodeverk }: { kodeverk?: KodeverkResponse }) => {
  if (!kodeverk || kodeverk.alternativer.length === 0) return null

  return (
    <div className="flex flex-col gap-8">
      {kodeverk.alternativer.map((alternativ) => (
        <AlternativValg
          key={`alternativ-${alternativ.representerer}`}
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
  const {
    getValues,
    setValue,
    trigger,
    formState: { errors, submitCount }
  } = useFormContext<PameldingEnkeltplassFormValues>()

  const fieldName = getKodeverkFieldName(utdanningGruppe.representerer)
  const errorMessage = getKodeverkErrorMessage(errors, submitCount, fieldName)

  const [valgtId, setValgtId] = useState<string | null>(() => {
    const medValg = utdanningGruppe.utdanninger.find((u) =>
      u.larefag.alternativer.some((v) => v.valgt)
    )
    return medValg?.id ?? null
  })

  const options: KodeverkOption[] = utdanningGruppe.utdanninger.map((u) => ({
    value: u.id,
    label: u.visningsnavn
  }))

  const valgtUtdanning =
    utdanningGruppe.utdanninger.find((u) => u.id === valgtId) ?? null

  function handleValg(optionId: string, isSelected: boolean) {
    const gjeldendeValg = getValues('kodeverkValg')
    let nesteValg = gjeldendeValg

    if (valgtUtdanning && valgtUtdanning.id !== optionId) {
      const gamleIder = new Set(
        valgtUtdanning.larefag.alternativer.map((v) => v.id)
      )

      const valgteLarefag = getValgteIderForRepresenterer(
        gjeldendeValg,
        OpplaringRepresenterer.LAREFAG
      ).filter((id) => !gamleIder.has(id))

      nesteValg = upsertKodeverkValg(
        gjeldendeValg,
        OpplaringRepresenterer.LAREFAG,
        valgteLarefag
      )
    }

    nesteValg = upsertKodeverkValg(
      nesteValg,
      utdanningGruppe.representerer,
      isSelected ? [optionId] : []
    )

    setValue('kodeverkValg', nesteValg, { shouldDirty: true })

    setValgtId(isSelected ? optionId : null)

    if (submitCount > 0) {
      void trigger(fieldName)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <UNSAFE_Combobox
        id={fieldName}
        label={getLabel(utdanningGruppe.visningsnavn, utdanningGruppe.pakrevd)}
        selectedOptions={options.filter((o) => o.value === valgtId)}
        size="small"
        required={utdanningGruppe.pakrevd}
        options={options}
        error={errorMessage}
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
 * Leser og skriver direkte til form-feltet `kodeverkValg`.
 * For å unngå at én verdigruppe overskriver
 * en annens valg, filtrerer vi ut egne verdi-IDer og merger med resten.
 */
const VerdigruppeValg = ({
  verdigruppe
}: {
  verdigruppe: KodeverkVerdigruppeBase
}) => {
  const {
    setValue,
    trigger,
    watch,
    formState: { errors, submitCount }
  } = useFormContext<PameldingEnkeltplassFormValues>()

  const fieldName = getKodeverkFieldName(verdigruppe.representerer)
  const errorMessage = getKodeverkErrorMessage(errors, submitCount, fieldName)

  const kodeverkValg = watch('kodeverkValg')

  const egneIds = verdigruppe.alternativer.map((v) => v.id)
  const valgteEgne = getValgteIderForRepresenterer(
    kodeverkValg,
    verdigruppe.representerer
  ).filter((id) => egneIds.includes(id))

  const options: KodeverkOption[] = verdigruppe.alternativer.map((v) => ({
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
    const nesteKodeverkValg = upsertKodeverkValg(
      kodeverkValg,
      verdigruppe.representerer,
      nyeEgneValg
    )

    setValue('kodeverkValg', nesteKodeverkValg, {
      shouldDirty: true
    })

    if (submitCount > 0) {
      void trigger(fieldName)
    }
  }

  return (
    <UNSAFE_Combobox
      id={fieldName}
      label={getLabel(verdigruppe.visningsnavn, verdigruppe.pakrevd)}
      selectedOptions={options.filter((o) => valgteEgne.includes(o.value))}
      size="small"
      error={errorMessage}
      options={options}
      required={verdigruppe.pakrevd}
      isMultiSelect={verdigruppe.seleksjonstype === Seleksjonstype.FLERVALG}
      onToggleSelected={handleValg}
    />
  )
}

const getKodeverkFieldName = (representerer: OpplaringRepresenterer) =>
  `kodeverkValg_${representerer}`

const getLabel = (visningsnavn: string, pakrevd: boolean) =>
  `${visningsnavn}${pakrevd ? '' : ' (valgfri)'}`

const getValgteIderForRepresenterer = (
  kodeverkValg: KodeverkValgEntry[],
  representerer: OpplaringRepresenterer
) =>
  kodeverkValg
    .filter((valg) => valg.representerer === representerer)
    .flatMap((valg) => valg.valgteIder)

const getKodeverkErrorMessage = (
  errors: FieldValues,
  submitCount: number,
  fieldName: string
) => {
  if (submitCount === 0) {
    return undefined
  }

  const message = (errors[fieldName] as { message?: string } | undefined)
    ?.message
  return typeof message === 'string' ? message : undefined
}

const upsertKodeverkValg = (
  eksisterende: KodeverkValgEntry[],
  representerer: OpplaringRepresenterer,
  valgteIder: string[]
): KodeverkValgEntry[] => {
  const utenRepresenterer = eksisterende.filter(
    (valg) => valg.representerer !== representerer
  )

  if (valgteIder.length === 0) {
    return utenRepresenterer
  }

  return [...utenRepresenterer, { representerer, valgteIder }]
}
