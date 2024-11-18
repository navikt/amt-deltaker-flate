import { BodyLong, Heading } from '@navikt/ds-react'
import {
  DeltakelseInnhold,
  EMDASH,
  UtkastHeader,
  deltakerprosentText,
  hentTiltakNavnHosArrangorTekst,
  visDeltakelsesmengde
} from 'deltaker-flate-common'
import { useDeltakerContext } from '../DeltakerContext'

export const AvbruttUtkastPage = () => {
  const { deltaker } = useDeltakerContext()
  const tiltakOgStedTekst = hentTiltakNavnHosArrangorTekst(
    deltaker.deltakerliste.tiltakstype,
    deltaker.deltakerliste.arrangorNavn
  )

  return (
    <div className="flex flex-col items-start mb-8">
      <Heading level="1" size="xlarge" data-testid="heading_avbrutt_tiltak">
        {tiltakOgStedTekst}
      </Heading>
      <Heading level="2" size="large" className="mt-4">
        Avbrutt utkast
      </Heading>
      <UtkastHeader vedtaksinformasjon={deltaker.vedtaksinformasjon} />

      <DeltakelseInnhold
        tiltakstype={deltaker.deltakerliste.tiltakstype}
        deltakelsesinnhold={deltaker.deltakelsesinnhold}
        heading={
          <Heading level="3" size="medium" className="mt-2 mb-2">
            Dette er innholdet
          </Heading>
        }
        listClassName="mt-2"
      />

      {deltaker.bakgrunnsinformasjon && (
        <>
          <Heading level="3" size="medium" className="mt-6">
            Bakgrunnsinfo
          </Heading>
          <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
            {deltaker.bakgrunnsinformasjon || EMDASH}
          </BodyLong>
        </>
      )}

      {visDeltakelsesmengde(deltaker.deltakerliste.tiltakstype) && (
        <>
          <Heading level="3" size="medium" className="mt-6">
            Deltakelsesmengde
          </Heading>
          <BodyLong size="small" className="mt-2">
            {deltakerprosentText(
              deltaker.deltakelsesprosent,
              deltaker.dagerPerUke
            )}
          </BodyLong>
        </>
      )}
    </div>
  )
}
