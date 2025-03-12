import {
  BodyLong,
  Box,
  Button,
  ConfirmationPanel,
  Heading
} from '@navikt/ds-react'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { useEffect, useRef, useState } from 'react'
import { leggTilTilgang } from '../api/api'
import { useAppContext } from '../AppContext'
import { useNavigate } from 'react-router-dom'
import { getDeltakerlisteUrl } from '../navigation'

export function IkkeTilgangTilDeltakerlistePage() {
  const { deltakerlisteId } = useAppContext()
  const navigate = useNavigate()
  const [confirmation, setConfirmation] = useState(false)
  const [confirmationError, setConfirmationError] = useState<
    string | undefined
  >(undefined)
  const { error, state, doFetch } = useDeferredFetch(leggTilTilgang)

  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (!error && state === DeferredFetchState.RESOLVED) {
      navigate(getDeltakerlisteUrl(deltakerlisteId))
    }
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
      <div className="flex flex-col gap-4 max-w-screen-sm">
        <Heading
          size="small"
          level="2"
          tabIndex={-1}
          ref={headingRef}
          className="outline-none"
        >
          Du har ikke tilgang til deltakerlisten for denne gjennomføringen
        </Heading>
        <BodyLong>
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
      </div>
    </Box>
  )
}
