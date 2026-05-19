import { BodyLong, List } from '@navikt/ds-react'
import { Deltakelsesinnhold, Innhold, Tiltakskode } from '../model/deltaker'
import { INNHOLD_TYPE_ANNET } from '../utils/constants'
import { erOpplaringstiltak } from '../utils/utils'
import {
  KodeverkAlternativType,
  KodeverkContainer,
  KodeverkGruppe,
  KodeverkVerdigruppe,
  KodeverkResponse,
  Seleksjonstype
} from '../../../apps/nav-veileders-flate/src/api/data/kodeverk'

interface Props {
  deltakelsesinnhold: Deltakelsesinnhold | null
  kodeverk?: KodeverkResponse | null
  tiltakskode: Tiltakskode
  heading: React.ReactNode | null
  listClassName?: string // TODO fjerne denne? la en flex her istedet for å forenkle. Må sjekke stedene den brukes, for er noen verdier som er rare å sende inn
}

export const DeltakelseInnhold = ({
  deltakelsesinnhold,
  kodeverk,
  tiltakskode,
  heading
}: Props) => {
  if (!skalViseInnhold(deltakelsesinnhold)) {
    return null
  }

  const harInnholdsTekst =
    tiltakskode === Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET ||
    tiltakskode === Tiltakskode.TILPASSET_JOBBSTOTTE ||
    erOpplaringstiltak(tiltakskode)

  const annetFelt: Innhold | undefined = getAnnetFeltForInnhold(
    harInnholdsTekst,
    deltakelsesinnhold
  )

  if (harInnholdsTekst && !annetFelt) {
    return null
  }

  const bransje = kodeverk?.alternativer
    .find(erBransjeVerdigruppe)
    ?.alternativer.find((verdi) => verdi.valgt)?.visningsnavn

  const utdanningsprogram = kodeverk?.alternativer
    .find(erUtdanningsprogramGruppe)
    ?.alternativer.find(erBransjeVerdigruppe)
    ?.alternativer.find((verdi) => verdi.valgt)?.visningsnavn

  const valgtKodeverk = kodeverk
    ? [
        ...getKodeverkValgteAlternativer(kodeverk.alternativer),
        ...kodeverk.sertifiseringValg.map((s) => s.navn)
      ]
    : []

  return (
    <div className="flex flex-col gap-4">
      <div>
        {heading ?? null}
        {deltakelsesinnhold.ledetekst && (
          <BodyLong size="small">{deltakelsesinnhold.ledetekst}</BodyLong>
        )}
      </div>

      {harInnholdsTekst && annetFelt && (
        <BodyLong
          className="whitespace-pre-wrap"
          key={annetFelt.innholdskode}
          size="small"
        >
          {annetFelt.beskrivelse}
        </BodyLong>
      )}

      {(bransje || utdanningsprogram) && (
        <BodyLong className="whitespace-pre-wrap" size="small">
          {bransje || utdanningsprogram}
        </BodyLong>
      )}

      {!harInnholdsTekst && deltakelsesinnhold.innhold.length > 0 && (
        <List as="ul" size="small">
          {deltakelsesinnhold.innhold
            .filter((i) => i.valgt)
            .map((i) => (
              <List.Item
                key={i.innholdskode}
                className="mt-2 whitespace-pre-wrap"
              >
                {i.innholdskode === INNHOLD_TYPE_ANNET
                  ? i.beskrivelse
                  : i.tekst}
              </List.Item>
            ))}
        </List>
      )}

      {valgtKodeverk.length > 0 && (
        <List as="ul" size="small">
          {valgtKodeverk.map((navn) => (
            <List.Item key={navn} className="mt-2 whitespace-pre-wrap">
              {navn}
            </List.Item>
          ))}
        </List>
      )}
    </div>
  )
}

const erBransjeVerdigruppe = (
  alternativ: KodeverkContainer
): alternativ is KodeverkVerdigruppe =>
  alternativ.type === KodeverkAlternativType.VERDIGRUPPE &&
  alternativ.visningsnavn === 'Bransje' &&
  alternativ.seleksjonstype === Seleksjonstype.ENKELTVALG

const erUtdanningsprogramGruppe = (
  alternativ: KodeverkContainer
): alternativ is KodeverkGruppe =>
  alternativ.type === KodeverkAlternativType.GRUPPE &&
  alternativ.visningsnavn === 'Utdanningsprogram'

const getKodeverkValgteAlternativer = (
  alternativer: KodeverkContainer[]
): string[] =>
  alternativer.flatMap((a) => {
    if (a.type === KodeverkAlternativType.VERDIGRUPPE) {
      const ekskluder: boolean = erBransjeVerdigruppe(a)
      if (ekskluder) return []
      return a.alternativer.filter((v) => v.valgt).map((v) => v.visningsnavn)
    }
    if (a.type === KodeverkAlternativType.GRUPPE) {
      const ekskluder: boolean = erUtdanningsprogramGruppe(a)
      if (ekskluder) return []
      return getKodeverkValgteAlternativer(a.alternativer)
    }
    return []
  })

const getAnnetFeltForInnhold = (
  harInnholdsTekst: boolean,
  deltakelsesinnhold: Deltakelsesinnhold
): Innhold | undefined => {
  if (!harInnholdsTekst) {
    return undefined
  }
  return deltakelsesinnhold.innhold.find(
    (i) => i.innholdskode === INNHOLD_TYPE_ANNET && i.valgt
  )
}

const skalViseInnhold = (
  deltakelsesinnhold: Deltakelsesinnhold | null
): deltakelsesinnhold is Deltakelsesinnhold => {
  return (
    !!deltakelsesinnhold &&
    (deltakelsesinnhold.innhold.length > 0 || !!deltakelsesinnhold.ledetekst)
  )
}
