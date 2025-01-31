import {
  BodyLong,
  Box,
  Button,
  ConfirmationPanel,
  VStack
} from '@navikt/ds-react'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { useState } from 'react'
import { leggTilTilgang } from '../api/api'

interface Props {
  deltakerlisteId: string
  onConfirm: () => void
}

export function IkkeTilgangTilDeltakerlistePage({
  deltakerlisteId,
  onConfirm: onConfirm
}: Props) {
  const [confirmation, setConfirmation] = useState(false)
  const [confirmationError, setConfirmationError] = useState<
    string | undefined
  >(undefined)
  const { error, state, doFetch } = useDeferredFetch(leggTilTilgang)

  const handleClick = () => {
    if (!confirmation) {
      setConfirmationError('Du må bekrefte ditt behov')
    } else {
      doFetch(deltakerlisteId)
      onConfirm()
    }
  }

  return (
    <Box className="flex justify-center pt-16">
      <VStack gap="4" className="max-w-screen-sm">
        <h2 className="text-xl font-semibold">
          Du har ikke tilgang til deltakerlisten for denne gjennomføringen
        </h2>
        <BodyLong>
          Deltakerlisten er kun tilgjengelig for deg som skal administrere eller
          prioritere deltakerene på listen.
        </BodyLong>
        <BodyLong>
          Dersom du har et behov for å administrere listen, kan du registrere
          deg som koordinator for gjennomføringen her.
        </BodyLong>
        <BodyLong>
          Navnet på koordinator vil bli vist ved deltakerlisten til
          gjennomføringen i Tiltaksadministrasjon.
        </BodyLong>
        <ConfirmationPanel
          checked={confirmation}
          error={error ?? confirmationError}
          label="Jeg bekrefter at jeg har et tjenstlig behov for å se og administrere deltakerlisten for gjennomføringen"
          onChange={() =>
            setConfirmation((x) => {
              setConfirmationError(undefined)
              return !x
            })
          }
        />
        <Button
          loading={state === DeferredFetchState.LOADING}
          className="w-fit"
          onClick={handleClick}
        >
          Be om tilgang
        </Button>
      </VStack>
    </Box>
  )
}
