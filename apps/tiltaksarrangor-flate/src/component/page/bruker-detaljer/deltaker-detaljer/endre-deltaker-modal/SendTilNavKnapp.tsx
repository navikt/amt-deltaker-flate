import { Alert, Button } from '@navikt/ds-react'
import React, { useRef, useState } from 'react'
import { isPending, usePromise } from '../../../../../utils/use-promise'

interface SendTilNavKnappProps {
  onEndringSendt: () => void
  sendEndring: () => Promise<void>
  disabled?: boolean
  forslag?: boolean
  endringFraArrangor?: boolean
  className?: string
}

const getTekst = (endringFraArrangor?: boolean, forslag?: boolean) => {
  if (endringFraArrangor) {
    return 'Lagre'
  } else if (forslag) {
    return 'Send forslag til Nav-veileder'
  } else {
    return 'Send til Nav'
  }
}

export const SendTilNavKnapp = ({
  disabled,
  sendEndring,
  onEndringSendt,
  forslag,
  endringFraArrangor,
  className
}: SendTilNavKnappProps) => {
  const [showError, setShowError] = useState<boolean>()
  const [errorMessage, setErrorMessage] = useState<string | null>()
  const opprettEndringPromise = usePromise<void>()

  const tekst = getTekst(endringFraArrangor, forslag)

  const inFlightRef = useRef(false)

  const onClick = () => {
    if (inFlightRef.current) return
    inFlightRef.current = true
    setShowError(false)
    setErrorMessage(null)

    opprettEndringPromise.setPromise(
      new Promise<void>((resolve) => resolve(sendEndring()))
        .then(
          () => true,
          (error: unknown) => {
            // Kun strenger (valideringsmeldinger) vises; andre feil gir generisk melding
            setErrorMessage(typeof error === 'string' ? error : null)
            setShowError(true)
            return false
          }
        )
        .then((success) => {
          // Callback kjøres kun ved vellykket sending og feil herfra er ikke sendingsfeil
          if (success) onEndringSendt()
        })
        .finally(() => {
          inFlightRef.current = false
        })
    )
  }

  return (
    <>
      <Button
        variant="primary"
        size="small"
        loading={isPending(opprettEndringPromise)}
        onClick={onClick}
        disabled={disabled}
        className={className}
      >
        {tekst}
      </Button>
      {showError && (
        <Alert variant="error">{errorMessage || 'Noe gikk galt'}</Alert>
      )}
    </>
  )
}
