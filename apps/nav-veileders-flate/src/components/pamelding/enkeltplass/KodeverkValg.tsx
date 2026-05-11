import { UNSAFE_Combobox } from '@navikt/ds-react'
import { useId, useState } from 'react'
import { useDeltakerContext } from '../../tiltak/DeltakerContext.tsx'
import {
  type KodeverkContainer,
  type KodeverkGruppe,
  KodeverkAlternativType,
  type KodeverkVerdigruppe,
  Seleksjonstype,
  KodeverkResponse,
  finnAlternativMedValgteVerdier
} from '../../../api/data/kodeverk.ts'
import { useFormContext } from 'react-hook-form'

export const KodeverkValg = () => {
  const { deltaker } = useDeltakerContext()

  const tomtKodeverk: KodeverkResponse = {
    tiltakskode: deltaker.deltakerliste.tiltakskode,
    alternativer: []
  }
  const kodeverk = deltaker.deltakerliste.kodeverk ?? tomtKodeverk

  if (kodeverk.alternativer.length === 0) return null

  return (
    <div className="flex flex-col gap-8">
      {kodeverk.alternativer.map((kategori, index) => (
        <KategoriValg
          key={kategori.id ?? `kategori-${index}`}
          kategori={kategori}
        />
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
  const uniqueId = useId()

  // Hvis gruppen bare har ett barn, hopp over combobox og vis barnet direkte
  if (gruppe.alternativer.length === 1) {
    return <KategoriValg kategori={gruppe.alternativer[0]} />
  }

  const [valgtId, setValgtId] = useState<string | null>(() =>
    finnAlternativMedValgteVerdier(gruppe)
  )

  const options = gruppe.alternativer.map((a) => ({
    value: a.id ?? a.visningsnavn,
    label: a.visningsnavn
  }))

  const valgt =
    gruppe.alternativer.find((a) => (a.id ?? a.visningsnavn) === valgtId) ??
    null

  return (
    <div className="flex flex-col gap-8">
      <UNSAFE_Combobox
        id={`kodeverk-gruppe-${uniqueId}`}
        label={gruppe.visningsnavn}
        selectedOptions={options.filter((o) => o.value === valgtId)}
        size="small"
        options={options}
        isMultiSelect={false}
        onToggleSelected={(option, isSelected) => {
          setValgtId(isSelected ? option : null)
        }}
      />

      {valgt && (
        <KategoriValg key={valgt.id ?? valgt.visningsnavn} kategori={valgt} />
      )}
    </div>
  )
}

const VerdigruppeValg = ({
  verdigruppe
}: {
  verdigruppe: KodeverkVerdigruppe
}) => {
  const uniqueId = useId()
  const defaultVerdier = verdigruppe.alternativer
    .filter((v) => v.valgt)
    .map((v) => v.id)

  const [valgte, setValgte] = useState<string[]>(defaultVerdier)

  const { getValues, setValue } = useFormContext()

  const options = verdigruppe.alternativer.map((v) => ({
    value: v.id,
    label: v.visningsnavn
  }))

  // IDer som tilhører denne verdigruppen
  const egneIds = new Set(verdigruppe.alternativer.map((v) => v.id))

  function handleToggleSelected(option: string, isSelected: boolean) {
    const nyeEgneValg =
      verdigruppe.seleksjonstype === Seleksjonstype.ENKELTVALG
        ? isSelected
          ? [option]
          : []
        : isSelected
          ? [...valgte, option]
          : valgte.filter((v) => v !== option)

    setValgte(nyeEgneValg)

    // Behold valg fra andre verdigrupper, erstatt kun egne
    const andreValg = (getValues('kodeverkValg') as string[]).filter(
      (id) => !egneIds.has(id)
    )
    setValue('kodeverkValg', [...andreValg, ...nyeEgneValg], {
      shouldDirty: true
    })
  }

  return (
    <UNSAFE_Combobox
      id={`kodeverk-${uniqueId}`}
      label={verdigruppe.visningsnavn}
      selectedOptions={options.filter((o) => valgte.includes(o.value))}
      size="small"
      options={options}
      isMultiSelect={verdigruppe.seleksjonstype === Seleksjonstype.FLERVALG}
      onToggleSelected={handleToggleSelected}
    />
  )
}
