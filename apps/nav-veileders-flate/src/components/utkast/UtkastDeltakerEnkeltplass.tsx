import { BodyLong, Heading } from '@navikt/ds-react'
import {
  DeltakelseInnhold,
  formatDate,
  hentGjennomforingNavnHosArrangorTekst,
  PrisOgBetaling,
  VeilederSnakkeboble
} from 'deltaker-flate-common'
import { useDeltakerContext } from '../tiltak/DeltakerContext.tsx'

export const UtkastDeltakerEnkeltplass = () => {
  const { deltaker } = useDeltakerContext()
  const tiltakskode = deltaker.deltakerliste.tiltakskode

  return (
    <div className="flex flex-col gap-8">
      <VeilederSnakkeboble
        pameldingstype={deltaker.deltakerliste.pameldingstype}
        arrangorNavn={deltaker.deltakerliste.arrangorNavn}
        tiltakskode={tiltakskode}
        erEnkeltplass={deltaker.deltakerliste.erEnkeltplass}
        tiltaksnavnHosArrangor={hentGjennomforingNavnHosArrangorTekst(
          tiltakskode,
          deltaker.deltakerliste.deltakerlisteNavn,
          deltaker.deltakerliste.arrangorNavn,
          deltaker.deltakerliste.kodeverk
        )}
      />
      <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
        <b>Dato:</b> {formatDate(deltaker.startdato)} -{' '}
        {formatDate(deltaker.sluttdato)}
      </BodyLong>

      <DeltakelseInnhold
        tiltakskode={tiltakskode}
        deltakelsesinnhold={deltaker.deltakelsesinnhold}
        kodeverk={deltaker.deltakerliste.kodeverk}
        heading={
          <Heading level="3" size="medium">
            Dette er innholdet
          </Heading>
        }
      />

      <PrisOgBetaling
        prisinformasjon={deltaker.deltakerliste.prisinformasjon}
        headinglevel="3"
      />
    </div>
  )
}
