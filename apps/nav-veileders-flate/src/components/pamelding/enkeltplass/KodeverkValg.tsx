import { UNSAFE_Combobox } from '@navikt/ds-react'
import { useState } from 'react'
import { useDeltakerContext } from '../../tiltak/DeltakerContext.tsx'
import {
  type KodeverkContainer,
  type KodeverkGruppe,
  KodeverkAlternativType,
  type KodeverkVerdigruppe,
  Seleksjonstype
} from '../../../api/data/kodeverk.ts'

export const KodeverkValg = () => {
  const { deltaker } = useDeltakerContext()
  const kodeverk = deltaker.deltakerliste.kodeverk

  if (kodeverk.alternativer.length === 0) return null

  return (
    <div className="flex flex-col gap-6 mb-6">
      {kodeverk.alternativer.map((alternativ) => (
        <AlternativValg key={alternativ.id} alternativ={alternativ} />
      ))}
    </div>
  )
}

const AlternativValg = ({ alternativ }: { alternativ: KodeverkContainer }) => {
  if (alternativ.type === KodeverkAlternativType.VERDIGRUPPE) {
    return <VerdigruppeValg verdigruppe={alternativ} />
  }

  if (alternativ.type === KodeverkAlternativType.VERDIGRUPPE_SOK) {
    // TODO: Implementer søk-basert verdigruppe
    return null
  }

  return <GruppeValg gruppe={alternativ} />
}

const GruppeValg = ({ gruppe }: { gruppe: KodeverkGruppe }) => {
  const [valgtId, setValgtId] = useState<string | null>(null)

  const options = gruppe.alternativer.map((a) => ({
    value: a.id ?? '',
    label: a.visningsnavn
  }))

  const valgt = gruppe.alternativer.find((a) => a.id === valgtId) ?? null

  return (
    <div className="flex flex-col gap-4">
      <UNSAFE_Combobox
        id={`kodeverk-gruppe-${gruppe.id}`}
        label={gruppe.visningsnavn}
        selectedOptions={options.filter((o) => o.value === valgtId)}
        size="small"
        options={options}
        isMultiSelect={false}
        onToggleSelected={(option, isSelected) => {
          setValgtId(isSelected ? option : null)
        }}
      />

      {valgt && <AlternativValg key={valgt.id} alternativ={valgt} />}
    </div>
  )
}

const VerdigruppeValg = ({
  verdigruppe
}: {
  verdigruppe: KodeverkVerdigruppe
}) => {
  const defaultVerdier = verdigruppe.alternativer
    .filter((v) => v.valgt)
    .map((v) => v.id)

  const [valgte, setValgte] = useState<string[]>(defaultVerdier)

  const options = verdigruppe.alternativer.map((v) => ({
    value: v.id,
    label: v.visningsnavn
  }))

  const handleToggleSelected = (option: string, isSelected: boolean) => {
    if (verdigruppe.seleksjonstype === Seleksjonstype.ENKELTVALG) {
      setValgte(isSelected ? [option] : [])
    } else {
      setValgte(
        isSelected ? [...valgte, option] : valgte.filter((v) => v !== option)
      )
    }
  }

  return (
    <UNSAFE_Combobox
      id={`kodeverk-${verdigruppe.id}`}
      label={verdigruppe.visningsnavn}
      selectedOptions={options.filter((o) => valgte.includes(o.value))}
      size="small"
      options={options}
      isMultiSelect={verdigruppe.seleksjonstype === Seleksjonstype.FLERVALG}
      onToggleSelected={handleToggleSelected}
    />
  )
}
