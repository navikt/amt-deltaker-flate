import { Alert, Button } from '@navikt/ds-react'
import { useRef, useState } from 'react'
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
  const [errorMessage, setErrorMessage] = useState<string>()
  const opprettEndringPromise = usePromise<void>()
  // Ref-en låser handlingen umiddelbart, før React rekker å vise loading.
  // Låsen frigjøres i finally, slik at brukeren kan prøve igjen etter feil.
  const senderEndringRef = useRef(false)

  const tekst = getTekst(endringFraArrangor, forslag)

  const sendOgOppdater = async () => {
    try {
      await sendEndring()
    } catch (error: unknown) {
      setErrorMessage(
        typeof error === 'string' && error ? error : 'Noe gikk galt'
      )
      return
    }

    onEndringSendt()
  }

  const onClick = () => {
    if (senderEndringRef.current) return
    senderEndringRef.current = true
    setErrorMessage(undefined)

    opprettEndringPromise.setPromise(
      sendOgOppdater().finally(() => {
        senderEndringRef.current = false
      })
    )
  }

  return (
    <>
      <Button
        type="button"
        variant="primary"
        size="small"
        loading={isPending(opprettEndringPromise)}
        onClick={onClick}
        disabled={disabled}
        className={className}
      >
        {tekst}
      </Button>
      {errorMessage && (
        <Alert variant="error" role="alert">
          {errorMessage}
        </Alert>
      )}
    </>
  )
}
