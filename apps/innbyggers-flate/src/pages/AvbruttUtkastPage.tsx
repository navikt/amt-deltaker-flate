import { BodyLong, Heading } from '@navikt/ds-react'
import {
  DeltakelseInnhold,
  DeltakelsesmengdeAvsnitt,
  EMDASH,
  UtkastHeader
} from 'deltaker-flate-common'
import { useDeltakerContext } from '../DeltakerContext'

export const AvbruttUtkastPage = () => {
  const { deltaker } = useDeltakerContext()
  const tiltakOgStedTekst =
    deltaker.deltakerliste.visningsnavn.tiltakHosArrangorTittel

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
        tiltakskode={deltaker.deltakerliste.tiltakskodeResponse.kode}
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

      <DeltakelsesmengdeAvsnitt
        tiltakskode={deltaker.deltakerliste.tiltakskode}
        erEnkeltplass={deltaker.deltakerliste.erEnkeltplass}
        deltakelsesprosent={deltaker.deltakelsesprosent}
        dagerPerUke={deltaker.dagerPerUke}
        headingLevel="3"
        headingSize="medium"
        headingClassName="mt-6"
        bodyClassName="mt-2"
      />
    </div>
  )
}
