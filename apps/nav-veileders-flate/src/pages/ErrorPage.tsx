import { Tilbakeknapp } from '../components/Tilbakeknapp.tsx'
import { Alert, Heading } from '@navikt/ds-react'

interface ErrorPageProps {
  heading?: string | null | undefined
  message?: string | null | undefined
}

export const ErrorPage = ({ heading, message = undefined }: ErrorPageProps) => {
  return (
    <div className="m-4 max-w-[47.5rem] mx-auto">
      <Tilbakeknapp />

      <Alert variant="error">
        {heading && (
          <Heading spacing size="small" level="3">
            {heading}
          </Heading>
        )}

        {message ?? 'Noe gikk galt. Prøv igjen senere'}
      </Alert>
    </div>
  )
}
