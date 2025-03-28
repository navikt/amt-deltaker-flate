import { BodyLong, Heading, VStack } from '@navikt/ds-react'
import {
  DeltakelseInnhold,
  EMDASH,
  ArenaTiltakskode,
  deltakerprosentText,
  visDeltakelsesmengde
} from 'deltaker-flate-common'
import { Deltakelsesinnhold, Deltakerliste } from '../../api/data/pamelding.ts'
import { OmKurset } from '../pamelding/OmKurset.tsx'

interface Props {
  innhold: Deltakelsesinnhold | null
  bakgrunnsinformasjon: string | null
  deltakelsesprosent: number | null
  dagerPerUke: number | null
  deltakerliste: Deltakerliste
}

export const Utkast = ({
  innhold,
  bakgrunnsinformasjon,
  deltakelsesprosent,
  dagerPerUke,
  deltakerliste
}: Props) => {
  const tiltakstype = deltakerliste.tiltakstype
  const bakgrunnsinfoVisningstekst =
    bakgrunnsinformasjon && bakgrunnsinformasjon.length > 0
      ? bakgrunnsinformasjon
      : EMDASH

  const visBakgrunnsinfoVisn = !(
    tiltakstype === ArenaTiltakskode.JOBBK ||
    tiltakstype === ArenaTiltakskode.GRUFAGYRKE ||
    tiltakstype === ArenaTiltakskode.GRUPPEAMO ||
    tiltakstype === ArenaTiltakskode.DIGIOPPARB
  )

  return (
    <VStack>
      <DeltakelseInnhold
        tiltakstype={tiltakstype}
        deltakelsesinnhold={innhold}
        heading={
          <Heading level="3" size="small" className="mb-2">
            Dette er innholdet
          </Heading>
        }
        listClassName="mt-2 mb-0 [&_ul]:m-0 [&_li:not(:last-child)]:mb-2 [&_li:last-child]:m-0"
      />

      {visBakgrunnsinfoVisn && (
        <div className="mt-8">
          <Heading level="3" size="small">
            Bakgrunnsinfo
          </Heading>
          <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
            {bakgrunnsinfoVisningstekst}
          </BodyLong>
        </div>
      )}

      {visDeltakelsesmengde(tiltakstype) && (
        <>
          <Heading level="3" size="small" className="mt-8">
            Deltakelsesmengde
          </Heading>
          <BodyLong size="small" className="mt-2">
            {deltakerprosentText(deltakelsesprosent, dagerPerUke)}
          </BodyLong>
        </>
      )}

      <OmKurset
        deltakerliste={deltakerliste}
        size="small"
        className={tiltakstype === ArenaTiltakskode.JOBBK ? 'mt-8' : ''}
      />
    </VStack>
  )
}
