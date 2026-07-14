import { Heading } from '@navikt/ds-react'
import {
  Bakgrunnsinformasjon,
  DeltakelseInnhold,
  DeltakelsesmengdeAvsnitt,
  DeltakerStatusType,
  harBakgrunnsinfo,
  hentTiltakHosArrangorIngressTekst,
  OmKurset,
  Oppmotested,
  VeilederSnakkeboble
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
        tiltaksnavnHosArrangor={hentTiltakHosArrangorIngressTekst(
          deltaker.deltakerliste.tiltakskodeDto,
          deltaker.deltakerliste.deltakerlisteNavn,
          deltaker.deltakerliste.arrangorNavn
        )}
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
        tiltakskode={deltaker.deltakerliste.tiltakskodeDto.kode}
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
