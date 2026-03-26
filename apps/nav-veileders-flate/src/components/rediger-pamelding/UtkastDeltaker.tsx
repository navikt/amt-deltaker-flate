import { BodyLong, Heading } from '@navikt/ds-react'
import {
  DeltakelseInnhold,
  DeltakerStatusType,
  EMDASH,
  OmKurset,
  Oppmotested,
  deltakerprosentText,
  harBakgrunnsinfo,
  visDeltakelsesmengde
} from 'deltaker-flate-common'
import { usePameldingContext } from '../tiltak/PameldingContext.tsx'

export const UtkastDeltaker = () => {
  const { pamelding } = usePameldingContext()
  const tiltakskode = pamelding.deltakerliste.tiltakskode
  const bakgrunnsinfoVisningstekst =
    pamelding.bakgrunnsinformasjon && pamelding.bakgrunnsinformasjon.length > 0
      ? pamelding.bakgrunnsinformasjon
      : EMDASH

  return (
    <div className="flex flex-col gap-8">
      <DeltakelseInnhold
        tiltakskode={tiltakskode}
        deltakelsesinnhold={pamelding.deltakelsesinnhold}
        heading={
          <Heading level="3" size="small" className="mb-2">
            Dette er innholdet
          </Heading>
        }
        listClassName="mt-2 mb-0 [&_ul]:m-0 [&_li:not(:last-child)]:mb-2 [&_li:last-child]:m-0"
      />

      {harBakgrunnsinfo(tiltakskode) && (
        <div>
          <Heading level="3" size="small">
            Bakgrunnsinfo
          </Heading>
          <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
            {bakgrunnsinfoVisningstekst}
          </BodyLong>
        </div>
      )}

      {visDeltakelsesmengde(tiltakskode) && (
        <div>
          <Heading level="3" size="small">
            Deltakelsesmengde
          </Heading>
          <BodyLong size="small" className="mt-2">
            {deltakerprosentText(
              pamelding.deltakelsesprosent,
              pamelding.dagerPerUke
            )}
          </BodyLong>
        </div>
      )}

      <OmKurset
        tiltakskode={pamelding.deltakerliste.tiltakskode}
        statusType={DeltakerStatusType.UTKAST_TIL_PAMELDING}
        oppstartstype={pamelding.deltakerliste.oppstartstype}
        pameldingstype={pamelding.deltakerliste.pameldingstype}
        startdato={pamelding.deltakerliste.startdato}
        sluttdato={pamelding.deltakerliste.sluttdato}
        size="small"
        visDelMedArrangorInfo
      />

      <Oppmotested
        oppmoteSted={pamelding.deltakerliste.oppmoteSted}
        statusType={DeltakerStatusType.UTKAST_TIL_PAMELDING}
      />
    </div>
  )
}
