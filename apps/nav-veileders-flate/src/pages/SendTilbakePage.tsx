import {Alert, Heading} from '@navikt/ds-react'

export const SendTilbakePage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Alert variant="info">
        <Heading size="small">Tilbake til appen man kom fra</Heading>
        Her skal brukeren sendes tilbake der brukeren kom fra. Det krever endringer i urler i
        veilarbpersonflatefs, så man blir redirectet til denne siden enn så lenge.
      </Alert>
    </div>
  )
}
