import { BodyLong, Heading } from '@navikt/ds-react'
import { ArenaTiltakskode, Oppstartstype } from '../model/deltaker'
import { formatDate } from '../utils/utils'

interface Props {
  tiltakstype: ArenaTiltakskode
  oppstartstype: Oppstartstype
  startdato: Date | null
  sluttdato: Date | null
  size?: 'medium' | 'small'
  className?: string
}

export const OmKurset = ({
  tiltakstype,
  oppstartstype,
  startdato,
  sluttdato,
  size,
  className
}: Props) => {
  if (
    tiltakstype !== ArenaTiltakskode.JOBBK &&
    tiltakstype !== ArenaTiltakskode.GRUPPEAMO &&
    tiltakstype !== ArenaTiltakskode.GRUFAGYRKE
  ) {
    return null
  }

  if (
    oppstartstype === Oppstartstype.LOPENDE &&
    tiltakstype === ArenaTiltakskode.JOBBK
  ) {
    return null
  }

  return (
    <section className={className ?? ''}>
      <Heading size={size ?? 'medium'} level="3">
        Om kurset
      </Heading>

      {oppstartstype === Oppstartstype.LOPENDE ? (
        <BodyLong size="small">
          Når arrangøren har en ledig plass, vil de ta kontakt med deg for å
          avtale oppstart.
        </BodyLong>
      ) : (
        <>
          <BodyLong size="small">{`Kursets oppstartsdato: ${formatDate(startdato)}`}</BodyLong>
          <BodyLong size="small">
            {`Sluttdato: ${formatDate(sluttdato)}`}
          </BodyLong>

          <BodyLong size="small" className="mt-4">
            Når det nærmer seg oppstart av kurset, vil Nav gjøre en vurdering av
            om du oppfyller kravene for å delta. Du får svar på søknaden etter
            dette.
          </BodyLong>

          <BodyLong size="small" className="mt-4">
            Hvis du oppfyller kravene, vil du bli tildelt en plass eller satt på
            venteliste. Dersom kravene til kurset ikke er oppfylt, vil du få
            avslag på søknaden.
          </BodyLong>

          {tiltakstype === ArenaTiltakskode.GRUPPEAMO && (
            <>
              <BodyLong size="small" className="mt-4">
                For å avgjøre hvem som skal få plass, kan Nav be om hjelp til
                vurdering fra arrangøren av kurset. Arrangør eller koordinator
                hos Nav vil kontakte deg hvis det er behov for et møte.
              </BodyLong>
              <BodyLong size="small" className="mt-4">
                Du vil få beskjed dersom det oversendes informasjon til
                arrangør.
              </BodyLong>
            </>
          )}
        </>
      )}
    </section>
  )
}
