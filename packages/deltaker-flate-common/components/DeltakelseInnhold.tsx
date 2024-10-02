import { BodyLong, List } from '@navikt/ds-react'
import { Deltakelsesinnhold } from '../model/deltaker'
import { INNHOLD_TYPE_ANNET } from '../utils/constants'

interface Props {
  deltakelsesinnhold: Deltakelsesinnhold | null
  heading: React.ReactNode | null
  listClassName?: string
}

export const DeltakelseInnhold = ({
  deltakelsesinnhold,
  heading,
  listClassName
}: Props) => {
  if (!deltakelsesinnhold) {
    return <></>
  }

  return (
    skalViseInnhold(deltakelsesinnhold) && (
      <>
        {heading ?? <></>}

        {deltakelsesinnhold?.ledetekst && (
          <BodyLong size="small">{deltakelsesinnhold.ledetekst}</BodyLong>
        )}

        {deltakelsesinnhold.innhold.length > 0 && (
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
  )
}

const skalViseInnhold = (deltakelsesinnhold: Deltakelsesinnhold) => {
  return deltakelsesinnhold.innhold.length > 0 || deltakelsesinnhold.ledetekst
}
