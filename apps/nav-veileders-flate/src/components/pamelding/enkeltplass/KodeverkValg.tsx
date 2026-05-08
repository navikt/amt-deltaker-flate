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

  if (kodeverk.kategorier.length === 0) return null

  return (
    <div className="flex flex-col gap-8">
      {kodeverk.kategorier.map((kategori) => (
        <KategoriValg key={kategori.id} kategori={kategori} />
      ))}
    </div>
  )
}

const KategoriValg = ({ kategori }: { kategori: KodeverkContainer }) => {
  if (kategori.type === KodeverkAlternativType.VERDIGRUPPE) {
    return <VerdigruppeValg verdigruppe={kategori} />
  }

  if (kategori.type === KodeverkAlternativType.VERDIGRUPPE_SOK) {
    // TODO: Implementer søk-basert verdigruppe
    return null
  }

  return <GruppeValg gruppe={kategori} />
}

const GruppeValg = ({ gruppe }: { gruppe: KodeverkGruppe }) => {
  const [valgtId, setValgtId] = useState<string | null>(null)

  const options = gruppe.alternativer.map((a) => ({
    value: a.id,
    label: a.visningsnavn
  }))

  const valgt = gruppe.alternativer.find((a) => a.id === valgtId) ?? null

  return (
    <div className="flex flex-col gap-8">
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

      {valgt && <KategoriValg key={valgt.id} kategori={valgt} />}
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
