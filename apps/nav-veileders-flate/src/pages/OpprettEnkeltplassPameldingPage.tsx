import { Detail, Heading, Tag } from '@navikt/ds-react'
import { getTiltakskodeDisplayText } from 'deltaker-flate-common'
import { Tilbakeknapp } from '../components/Tilbakeknapp.tsx'
import { usePameldingContext } from '../components/tiltak/PameldingContext.tsx'
import { PameldingEnkeltplassForm } from '../components/enkeltplass-uten-rammeavtale-pamelding/PameldingEnkeltplassForm.tsx'
import { PameldingFormContextProvider } from '../components/enkeltplass-uten-rammeavtale-pamelding/PameldingFormContext.tsx'

export const OpprettEnkeltplassPameldingPage = () => {
  const { pamelding } = usePameldingContext()

  return (
    <div
      className="md:m-auto m-4 max-w-190"
      data-testid="page_kladd_enkeltplass"
    >
      <Tilbakeknapp />
      <Heading level="1" size="large">
        {getTiltakskodeDisplayText(pamelding.deltakerliste.tiltakskode)}
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
