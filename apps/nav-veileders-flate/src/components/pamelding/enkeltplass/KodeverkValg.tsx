import { UNSAFE_Combobox } from '@navikt/ds-react'
import { useState } from 'react'
import { useDeltakerContext } from '../../tiltak/DeltakerContext.tsx'
import {
  type KodeverkContainer,
  KodeverkAlternativType,
  type KodeverkVerdigruppe
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

  // Gruppe — render children rekursivt
  return (
    <div className="flex flex-col gap-4">
      {alternativ.alternativer.map((child) => (
        <AlternativValg key={child.id} alternativ={child} />
      ))}
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
    .map((v) => ({ value: v.id, label: v.visningsnavn }))

  const [valgte, setValgte] = useState<string[]>(
    defaultVerdier.map((v) => v.value)
  )

  const options = verdigruppe.alternativer.map((v) => ({
    value: v.id,
    label: v.visningsnavn
  }))

  const getSelectedOptions = () => {
    return options.filter((o) => valgte.includes(o.value))
  }

  return (
    <UNSAFE_Combobox
      id={`kodeverk-${verdigruppe.id}`}
      label={verdigruppe.visningsnavn}
      selectedOptions={getSelectedOptions()}
      size="small"
      options={options}
      isMultiSelect={verdigruppe.seleksjonstype === 'FLERVALG'}
      onToggleSelected={(option, isSelected) => {
        if (verdigruppe.seleksjonstype === 'ENKELTVALG') {
          setValgte(isSelected ? [option] : [])
        } else {
          setValgte(
            isSelected
              ? [...valgte, option]
              : valgte.filter((v) => v !== option)
          )
        }
      }}
    />
  )
}
