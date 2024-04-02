import { Tilbakeknapp } from '../components/Tilbakeknapp.tsx'
import { Alert, Heading } from '@navikt/ds-react'

interface ErrorPageProps {
  heading?: string | null | undefined
  message?: string | null | undefined
}

export const ErrorPage = (
  {
    heading = 'Noe gikk galt, prøv igjen senere.',
    message = undefined
  }: ErrorPageProps
) => {
  return (
    <div>
      <Tilbakeknapp/>
      
      <Alert variant="error">
        <Heading spacing size="small" level="3">
          {heading}
        </Heading>
        {message}
      </Alert>
    </div>
  )
}
