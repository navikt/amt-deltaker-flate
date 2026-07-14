import { BodyLong, Heading } from '@navikt/ds-react'
import {
  DeltakelseInnhold,
  DeltakelsesmengdeVisning,
  EMDASH,
  hentTiltakHosArrangorTittel,
  UtkastHeader
} from 'deltaker-flate-common'
import { useDeltakerContext } from '../DeltakerContext'

export const AvbruttUtkastPage = () => {
  const { deltaker } = useDeltakerContext()
  const tiltakOgStedTekst = hentTiltakHosArrangorTittel(
    deltaker.deltakerliste.tiltakskode,
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
      <UtkastHeader
        vedtaksinformasjon={deltaker.vedtaksinformasjon}
        deltakerStatus={deltaker.status}
      />

      <DeltakelseInnhold
        tiltakskode={deltaker.deltakerliste.tiltakskode}
        deltakelsesinnhold={deltaker.deltakelsesinnhold}
        heading={
          <Heading level="3" size="medium" className="mt-2">
            Dette er innholdet
          </Heading>
        }
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

      <DeltakelsesmengdeVisning
        tiltakskode={deltaker.deltakerliste.tiltakskode}
        erEnkeltplass={deltaker.deltakerliste.erEnkeltplass}
        deltakelsesprosent={deltaker.deltakelsesprosent}
        dagerPerUke={deltaker.dagerPerUke}
      >
        {(text) => (
          <>
            <Heading level="3" size="medium" className="mt-6">
              Deltakelsesmengde
            </Heading>
            <BodyLong size="small" className="mt-2">
              {text}
            </BodyLong>
          </>
        )}
      </DeltakelsesmengdeVisning>
    </div>
  )
}
