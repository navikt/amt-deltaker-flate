import { GlobalAlert } from '@navikt/ds-react'

export function ErrorFallback() {
  return (
    <GlobalAlert status="error">
      <GlobalAlert.Header>
        <GlobalAlert.Title>Noe gikk galt</GlobalAlert.Title>
      </GlobalAlert.Header>
      <GlobalAlert.Content>
        Noe gikk galt. Prøv igjen senere.
      </GlobalAlert.Content>
    </GlobalAlert>
  )
}
