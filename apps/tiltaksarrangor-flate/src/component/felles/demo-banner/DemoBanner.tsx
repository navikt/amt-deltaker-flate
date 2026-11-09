import { Alert } from '@navikt/ds-react'
import { DemoRollevelger } from '../demo-rollevelger/DemoRollevelger'

export const DemoBanner = () => {
  return (
    <Alert variant="warning">
      <b>Dette er en demo-tjeneste som er under utvikling</b>
      <br />
      Her eksperimenterer vi med ny funksjonalitet. Demoen inneholder ikke ekte
      data og kan til tider være ustabil.
      <DemoRollevelger />
    </Alert>
  )
}
