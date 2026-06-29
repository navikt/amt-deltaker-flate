import { BodyLong, Heading } from '@navikt/ds-react'
import {
  Bakgrunnsinformasjon,
  DeltakelseInnhold,
  DeltakerStatusType,
  hentTiltakEllerGjennomforingNavnHosArrangorTekst,
  OmKurset,
  Oppmotested,
  VeilederSnakkeboble,
  deltakerprosentText,
  harBakgrunnsinfo,
  harDeltakelsesmengde
} from 'deltaker-flate-common'
import { useDeltakerContext } from '../tiltak/DeltakerContext.tsx'

export const UtkastDeltaker = () => {
  const { deltaker } = useDeltakerContext()
  const { tiltakskode, erEnkeltplass } = deltaker.deltakerliste

  return (
    <div className="flex flex-col gap-8">
      <VeilederSnakkeboble
        pameldingstype={deltaker.deltakerliste.pameldingstype}
        arrangorNavn={deltaker.deltakerliste.arrangorNavn}
        tiltakskode={tiltakskode}
        erEnkeltplass={deltaker.deltakerliste.erEnkeltplass}
        tiltaksnavnHosArrangor={hentTiltakEllerGjennomforingNavnHosArrangorTekst(
          tiltakskode,
          deltaker.deltakerliste.deltakerlisteNavn,
          deltaker.deltakerliste.arrangorNavn
        )}
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

      {harDeltakelsesmengde(tiltakskode, erEnkeltplass) && (
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
