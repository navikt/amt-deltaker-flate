import { Alert } from '@navikt/ds-react'

export const ErrorPage = () => {
  return (
    <Alert variant="error">
      Uff da, her skjedde det noe feil. Prøv å laste inn nettsiden på nytt eller
      ta kontakt hvis feilen vedvarer.
    </Alert>
  )
}
