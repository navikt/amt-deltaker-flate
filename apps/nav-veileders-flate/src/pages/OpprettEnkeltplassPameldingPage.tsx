import { Detail, Heading, Tag } from '@navikt/ds-react'
import { getTiltakskodeDisplayText } from 'deltaker-flate-common'
import { Tilbakeknapp } from '../components/Tilbakeknapp.tsx'
import { useDeltakerContext } from '../components/tiltak/DeltakerContext.tsx'
import { PameldingEnkeltplassForm } from '../components/pamelding/enkeltplass/PameldingEnkeltplassForm.tsx'
import { PameldingFormContextProvider } from '../components/pamelding/PameldingFormContext.tsx'

export const OpprettEnkeltplassPameldingPage = () => {
  const { deltaker } = useDeltakerContext()

  return (
    <div
      className="md:m-auto m-4 max-w-190"
      data-testid="page_kladd_enkeltplass"
    >
      <Tilbakeknapp />
      <Heading level="1" size="large">
        {getTiltakskodeDisplayText(deltaker.deltakerliste.tiltakskode)}
      </Heading>
      <Detail className="mb-4">Enkeltplass uten rammeavtale</Detail>
      <Tag variant="outline" data-color="warning" size="small">
        Kladden er ikke delt
      </Tag>

      <PameldingFormContextProvider>
        <PameldingEnkeltplassForm className="mt-4 p-4 ax-md:p-8 bg-(--ax-bg-default)" />
      </PameldingFormContextProvider>
    </div>
  )
}
