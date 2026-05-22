import { BodyLong, Heading } from '@navikt/ds-react'
import {
  Bakgrunnsinformasjon,
  DeltakelseInnhold,
  DeltakerStatusType,
  OmKurset,
  Oppmotested,
  VeilederSnakkeboble,
  deltakerprosentText,
  harBakgrunnsinfo,
  visDeltakelsesmengde
} from 'deltaker-flate-common'
import { useDeltakerContext } from '../tiltak/DeltakerContext.tsx'

export const UtkastDeltaker = () => {
  const { deltaker } = useDeltakerContext()
  const tiltakskode = deltaker.deltakerliste.tiltakskode

  return (
    <div className="flex flex-col gap-8">
      <VeilederSnakkeboble
        pameldingstype={deltaker.deltakerliste.pameldingstype}
        arrangorNavn={deltaker.deltakerliste.arrangorNavn}
        tiltakskode={tiltakskode}
        erEnkeltplass={deltaker.deltakerliste.erEnkeltplass}
        deltakerlisteNavn={deltaker.deltakerliste.deltakerlisteNavn}
      />

      <DeltakelseInnhold
        tiltakskode={tiltakskode}
        deltakelsesinnhold={deltaker.deltakelsesinnhold}
        kodeverk={deltaker.deltakerliste.kodeverk}
        heading={
          <Heading level="3" size="small">
            Dette er innholdet
          </Heading>
        }
      />

      {harBakgrunnsinfo(tiltakskode) && (
        <Bakgrunnsinformasjon
          bakgrunnsinformasjon={deltaker.bakgrunnsinformasjon}
          headinglevel="3"
          headingsize="small"
        />
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
      />

      <Oppmotested
        oppmoteSted={deltaker.deltakerliste.oppmoteSted}
        statusType={DeltakerStatusType.UTKAST_TIL_PAMELDING}
      />
    </div>
  )
}
