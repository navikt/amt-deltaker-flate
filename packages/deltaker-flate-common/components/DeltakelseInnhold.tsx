import { BodyLong, List } from '@navikt/ds-react'
import { Deltakelsesinnhold, Tiltakskode } from '../model/deltaker'
import { INNHOLD_TYPE_ANNET } from '../utils/constants'

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

  return (
    <>
      {heading ?? null}

      {deltakelsesinnhold?.ledetekst && (
        <BodyLong size="small">{deltakelsesinnhold.ledetekst}</BodyLong>
      )}

      {tiltakskode === Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET &&
        deltakelsesinnhold.innhold.length > 0 &&
        deltakelsesinnhold.innhold
          .filter((i) => i.valgt)
          .map((i) => {
            if (i.innholdskode === INNHOLD_TYPE_ANNET) {
              return (
                <BodyLong
                  className="mt-4 whitespace-pre-wrap"
                  key={i.innholdskode}
                  size="small"
                >
                  {i.beskrivelse}
                </BodyLong>
              )
            }
          })}

      {tiltakskode !== Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET &&
        deltakelsesinnhold.innhold.length > 0 && (
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

const skalViseInnhold = (
  deltakelsesinnhold: Deltakelsesinnhold | null
): deltakelsesinnhold is Deltakelsesinnhold => {
  return (
    !!deltakelsesinnhold &&
    (deltakelsesinnhold.innhold.length > 0 || !!deltakelsesinnhold.ledetekst)
  )
}
