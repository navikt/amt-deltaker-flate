import { BodyLong, Heading } from '@navikt/ds-react'
import { DeltakelseInnhold, formatDate } from 'deltaker-flate-common'
import { useDeltakerContext } from '../tiltak/DeltakerContext.tsx'
import { VeilederSnakkeboble } from 'deltaker-flate-common'

export const UtkastDeltakerEnkeltplass = () => {
  const { deltaker } = useDeltakerContext()
  const tiltakskode = deltaker.deltakerliste.tiltakskode

  return (
    <div className="flex flex-col gap-8">
      <VeilederSnakkeboble
        pameldingstype={deltaker.deltakerliste.pameldingstype}
        arrangorNavn={deltaker.deltakerliste.arrangorNavn}
        tiltakskode={tiltakskode}
        deltakerlisteNavn={deltaker.deltakerliste.deltakerlisteNavn}
      />
      <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
        <b>Dato:</b> {formatDate(deltaker.startdato)} -{' '}
        {formatDate(deltaker.sluttdato)}
      </BodyLong>
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

      <div>
        <Heading level="3" size="small">
          Pris og betalingsbetingelser
        </Heading>
        <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
          {deltaker.prisinformasjon}
        </BodyLong>
      </div>
    </div>
  )
}
