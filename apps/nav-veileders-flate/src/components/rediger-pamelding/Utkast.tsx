import { BodyLong, Heading, VStack } from '@navikt/ds-react'
import {
  DeltakelseInnhold,
  EMDASH,
  Tiltakstype,
  deltakerprosentText,
  visDeltakelsesmengde
} from 'deltaker-flate-common'
import { Deltakelsesinnhold } from '../../api/data/pamelding.ts'

interface Props {
  innhold: Deltakelsesinnhold | null
  bakgrunnsinformasjon: string | null
  deltakelsesprosent: number | null
  dagerPerUke: number | null
  tiltakstype: Tiltakstype
}

export const Utkast = ({
  innhold,
  bakgrunnsinformasjon,
  deltakelsesprosent,
  dagerPerUke,
  tiltakstype
}: Props) => {
  const bakgrunnsinfoVisningstekst =
    bakgrunnsinformasjon && bakgrunnsinformasjon.length > 0
      ? bakgrunnsinformasjon
      : EMDASH

  return (
    <VStack>
      <DeltakelseInnhold
        deltakelsesinnhold={innhold}
        heading={
          <Heading level="3" size="small" className="mb-2">
            Dette er innholdet
          </Heading>
        }
        listClassName="mt-2 mb-0 [&_ul]:m-0 [&_li:not(:last-child)]:mb-2 [&_li:last-child]:m-0"
      />

      <div className="mt-8">
        {bakgrunnsinformasjon && (
          <>
            <Heading level="3" size="small">
              Bakgrunnsinfo
            </Heading>
            <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
              {bakgrunnsinfoVisningstekst}
            </BodyLong>
          </>
        )}
      </div>

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
    </VStack>
  )
}
