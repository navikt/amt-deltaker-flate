import { BodyLong, List } from '@navikt/ds-react'
import { Deltakelsesinnhold, Innhold, Tiltakskode } from '../model/deltaker'
import { INNHOLD_TYPE_ANNET } from '../utils/constants'
import { erOpplaringstiltak } from '../utils/utils'

interface Props {
  deltakelsesinnhold: Deltakelsesinnhold | null
  tiltakskode: Tiltakskode
  heading: React.ReactNode | null
  listClassName?: string
}

export const DeltakelseInnhold = ({
  deltakelsesinnhold,
  tiltakskode,
  heading,
  listClassName
}: Props) => {
  if (!skalViseInnhold(deltakelsesinnhold)) {
    return null
  }

  const harInnholdsTekst =
    tiltakskode === Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET ||
    erOpplaringstiltak(tiltakskode)

  const annetFelt: Innhold | undefined = getAnnetFeltForInnhold(
    harInnholdsTekst,
    deltakelsesinnhold
  )

  if (harInnholdsTekst && !annetFelt) {
    return null
  }

  return (
    <>
      {heading ?? null}

      {deltakelsesinnhold.ledetekst && (
        <BodyLong size="small">{deltakelsesinnhold.ledetekst}</BodyLong>
      )}

      {harInnholdsTekst && annetFelt && (
        <BodyLong
          className={`${deltakelsesinnhold.ledetekst ? 'mt-4' : ''} whitespace-pre-wrap`}
          key={annetFelt.innholdskode}
          size="small"
        >
          {annetFelt.beskrivelse}
        </BodyLong>
      )}

      {!harInnholdsTekst && deltakelsesinnhold.innhold.length > 0 && (
        <List as="ul" size="small" className={listClassName ?? ''}>
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
    </>
  )
}

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
