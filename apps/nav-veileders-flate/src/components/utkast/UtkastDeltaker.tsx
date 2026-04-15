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
import { useDeltakerContext } from '../tiltak/DeltakerContext.tsx'

export const UtkastDeltaker = () => {
  const { deltaker } = useDeltakerContext()
  const tiltakskode = deltaker.deltakerliste.tiltakskode
  const bakgrunnsinfoVisningstekst =
    deltaker.bakgrunnsinformasjon && deltaker.bakgrunnsinformasjon.length > 0
      ? deltaker.bakgrunnsinformasjon
      : EMDASH

  return (
    <div className="flex flex-col gap-8">
      <DeltakelseInnhold
        tiltakskode={tiltakskode}
        deltakelsesinnhold={deltaker.deltakelsesinnhold}
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
              deltaker.deltakelsesprosent,
              deltaker.dagerPerUke
            )}
          </BodyLong>
        </div>
      )}

      <OmKurset
        tiltakskode={deltaker.deltakerliste.tiltakskode}
        statusType={DeltakerStatusType.UTKAST_TIL_PAMELDING}
        oppstartstype={deltaker.deltakerliste.oppstartstype}
        pameldingstype={deltaker.deltakerliste.pameldingstype}
        erEnkeltplass={deltaker.deltakerliste.erEnkeltplass}
        startdato={deltaker.deltakerliste.startdato}
        sluttdato={deltaker.deltakerliste.sluttdato}
        size="small"
        visDelMedArrangorInfo
      />

      <Oppmotested
        oppmoteSted={deltaker.deltakerliste.oppmoteSted}
        statusType={DeltakerStatusType.UTKAST_TIL_PAMELDING}
      />
    </div>
  )
}
