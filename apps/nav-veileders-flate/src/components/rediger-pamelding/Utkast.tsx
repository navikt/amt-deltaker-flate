import { BodyLong, Heading, VStack } from '@navikt/ds-react'
import {
  DeltakelseInnhold,
  DeltakerStatusType,
  EMDASH,
  OmKurset,
  Oppmotested,
  Tiltakskode,
  deltakerprosentText,
  erKursEllerDigitalt,
  visDeltakelsesmengde
} from 'deltaker-flate-common'
import { Deltakelsesinnhold, Deltakerliste } from '../../api/data/pamelding.ts'

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
  const tiltakskode = deltakerliste.tiltakskode
  const bakgrunnsinfoVisningstekst =
    bakgrunnsinformasjon && bakgrunnsinformasjon.length > 0
      ? bakgrunnsinformasjon
      : EMDASH

  const visBakgrunnsinfo = !erKursEllerDigitalt(tiltakskode)

  return (
    <VStack>
      <DeltakelseInnhold
        tiltakskode={tiltakskode}
        deltakelsesinnhold={innhold}
        heading={
          <Heading level="3" size="small" className="mb-2">
            Dette er innholdet
          </Heading>
        }
        listClassName="mt-2 mb-0 [&_ul]:m-0 [&_li:not(:last-child)]:mb-2 [&_li:last-child]:m-0"
      />

      {visBakgrunnsinfo && (
        <div className="mt-8">
          <Heading level="3" size="small">
            Bakgrunnsinfo
          </Heading>
          <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
            {bakgrunnsinfoVisningstekst}
          </BodyLong>
        </div>
      )}

      {visDeltakelsesmengde(tiltakskode) && (
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
        tiltakskode={deltakerliste.tiltakskode}
        statusType={DeltakerStatusType.UTKAST_TIL_PAMELDING}
        oppstartstype={deltakerliste.oppstartstype}
        kreverGodkjenning={deltakerliste.kreverGodkjenning}
        startdato={deltakerliste.startdato}
        sluttdato={deltakerliste.sluttdato}
        size="small"
        visDelMedArrangorInfo
        visForUtkast
        className={tiltakskode === Tiltakskode.JOBBKLUBB ? 'mt-8' : ''}
      />

      <Oppmotested
        oppmoteSted={deltakerliste.oppmoteSted}
        statusType={DeltakerStatusType.UTKAST_TIL_PAMELDING}
        className="mt-8"
      />
    </VStack>
  )
}
