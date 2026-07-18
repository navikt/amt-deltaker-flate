import { Heading } from '@navikt/ds-react'
import {
  Bakgrunnsinformasjon,
  DeltakelseInnhold,
  DeltakelsesmengdeAvsnitt,
  DeltakerStatusType,
  harBakgrunnsinfo,
  OmKurset,
  Oppmotested,
  VeilederSnakkeboble
} from 'deltaker-flate-common'
import { useDeltakerContext } from '../tiltak/DeltakerContext.tsx'

export const UtkastDeltaker = () => {
  const { deltaker } = useDeltakerContext()
  const { tiltakskodeResponse, erEnkeltplass } = deltaker.deltakerliste
  const tiltakskode = tiltakskodeResponse.kode

  return (
    <div className="flex flex-col gap-8">
      <VeilederSnakkeboble
        pameldingstype={deltaker.deltakerliste.pameldingstype}
        arrangorNavn={deltaker.deltakerliste.arrangorNavn}
        tiltakskode={tiltakskode}
        erEnkeltplass={deltaker.deltakerliste.erEnkeltplass}
        tiltaksnavnHosArrangor={
          deltaker.deltakerliste.visningsnavn.tiltakHosArrangorIngressTekst
        }
      />

      <DeltakelseInnhold
        tiltakskode={tiltakskode}
        deltakelsesinnhold={deltaker.deltakelsesinnhold}
        opplaringKategoriseringValg={
          deltaker.deltakerliste.opplaringKategoriseringValg
        }
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

      <DeltakelsesmengdeAvsnitt
        tiltakskode={tiltakskode}
        erEnkeltplass={erEnkeltplass}
        deltakelsesprosent={deltaker.deltakelsesprosent}
        dagerPerUke={deltaker.dagerPerUke}
        headingLevel="3"
        headingSize="small"
        bodyClassName="mt-2"
      />

      <OmKurset
        tiltakskode={deltaker.deltakerliste.tiltakskodeResponse.kode}
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
