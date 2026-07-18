import { BodyLong, Heading } from '@navikt/ds-react'
import {
  DeltakelseInnhold,
  DeltakelsesmengdeAvsnitt,
  formatDate,
  PrisOgBetaling,
  VeilederSnakkeboble
} from 'deltaker-flate-common'
import { useDeltakerContext } from '../tiltak/DeltakerContext.tsx'

export const UtkastDeltakerEnkeltplass = () => {
  const { deltaker } = useDeltakerContext()
  const tiltakskode = deltaker.deltakerliste.tiltakskodeResponse

  return (
    <div className="flex flex-col gap-8">
      <VeilederSnakkeboble
        pameldingstype={deltaker.deltakerliste.pameldingstype}
        arrangorNavn={deltaker.deltakerliste.arrangorNavn}
        tiltakskode={tiltakskode.kode}
        erEnkeltplass={deltaker.deltakerliste.erEnkeltplass}
        tiltaksnavnHosArrangor={
          deltaker.deltakerliste.visningsnavn.tiltakHosArrangorIngressTekst
        }
      />
      <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
        <b>Dato:</b> {formatDate(deltaker.startdato)} -{' '}
        {formatDate(deltaker.sluttdato)}
      </BodyLong>

      <DeltakelseInnhold
        tiltakskode={tiltakskode.kode}
        deltakelsesinnhold={deltaker.deltakelsesinnhold}
        opplaringKategoriseringValg={
          deltaker.deltakerliste.opplaringKategoriseringValg
        }
        heading={
          <Heading level="3" size="medium">
            Dette er innholdet
          </Heading>
        }
      />

      <DeltakelsesmengdeAvsnitt
        tiltakskode={tiltakskode.kode}
        erEnkeltplass={true}
        deltakelsesprosent={deltaker.deltakelsesprosent}
        dagerPerUke={deltaker.dagerPerUke}
        headingLevel="3"
        headingSize="small"
        bodyClassName="mt-2"
      />

      <PrisOgBetaling
        prisinformasjon={deltaker.deltakerliste.prisinformasjon}
        headinglevel="3"
      />
    </div>
  )
}
