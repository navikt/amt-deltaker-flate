import {
  BodyLong,
  Box,
  Button,
  ConfirmationPanel,
  VStack
} from '@navikt/ds-react'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { useEffect, useState } from 'react'
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

  useEffect(() => {
    if (!error && state === DeferredFetchState.RESOLVED) onConfirm()
  }, [error, state])

  const handleClick = async () => {
    if (!confirmation) {
      setConfirmationError('Du må bekrefte ditt behov')
    } else {
      doFetch(deltakerlisteId)
    }
  }

  return (
    <Box className="flex justify-center pt-16">
      <VStack gap="4" className="max-w-screen-sm">
        <h2 className="text-xl font-semibold">
          Du har ikke tilgang til deltakerlisten for denne gjennomføringen
        </h2>
        <BodyLong>
          Du har ikke tilgang til deltakerlisten for denne gjennomføringen
          Deltakerlisten er kun tilgjengelig for deg som er ansvarlig for å
          prioritere deltakere til kurs.
        </BodyLong>
        <BodyLong>
          Dersom du har et behov for å administrere listen, kan du registrere
          deg som koordinator for gjennomføringen her.
        </BodyLong>
        <BodyLong>Navnet ditt vil vises ved deltakerlisten.</BodyLong>
        <ConfirmationPanel
          checked={confirmation}
          error={error ?? confirmationError}
          label="Jeg bekrefter at jeg har tjenstlig behov for å se og administrere denne deltakerlisten."
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
          Gi meg tilgang
        </Button>
      </VStack>
    </Box>
  )
}
