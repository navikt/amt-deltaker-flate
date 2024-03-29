import { Alert, Button, Heading, HelpText } from '@navikt/ds-react'
import { generateFormDefaultValues, PameldingFormValues } from '../../model/PameldingFormValues.ts'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../AppContext.tsx'
import { DeferredFetchState, useDeferredFetch } from '../../hooks/useDeferredFetch.ts'
import { sendInnPameldingUtenGodkjenning } from '../../api/api.ts'
import { MeldPaDirekteModal } from '../opprett-pamelding/MeldPaDirekteModal.tsx'
import { generateDirektePameldingRequestForm } from '../../utils/pamelding-form-utils.ts'
import { DeltakerStatusType, PameldingResponse } from '../../api/data/pamelding.ts'
import { ArrowForwardIcon } from '@navikt/aksel-icons'
import { useFormContext } from 'react-hook-form'
import { DELTAKELSESOVERSIKT_LINK, useModiaLink } from '../../hooks/useModiaLink.ts'

interface Props {
  pamelding: PameldingResponse
  useOldPamelding?: boolean
  disabled: boolean
  className?: string
  disableForm?: (disabled: boolean) => void
}

export const MeldPaDirekteButton = ({
  pamelding,
  disabled,
  useOldPamelding,
  className,
  disableForm
}: Props) => {
  const {doRedirect} = useModiaLink()
  const {enhetId} = useAppContext()

  const [isDisabled, setIsDisabled] = useState<boolean>(disabled)
  const [meldPaDirekteModalOpen, setMeldPaDirekteModalOpen] = useState<boolean>(false)
  const [newPameldingValues, setNewPameldingValues] = useState(
    useOldPamelding ? generateFormDefaultValues(pamelding) : undefined
  )

  const methods = useFormContext<PameldingFormValues>()
  const meldPaDirekteTekst =
    pamelding.status.type === DeltakerStatusType.KLADD
      ? 'Meld på uten å dele utkast'
      : 'Meld på uten godkjent utkast'

  const returnToFrontpage = () => {
    doRedirect(DELTAKELSESOVERSIKT_LINK)
  }

  const {
    state: sendDirekteState,
    error: meldPaDirekteError,
    doFetch: doFetchMeldPaDirekte
  } = useDeferredFetch(sendInnPameldingUtenGodkjenning, returnToFrontpage)

  const handleFormSubmit = (data: PameldingFormValues) => {
    setNewPameldingValues(data)
    setMeldPaDirekteModalOpen(true)
  }

  const handleSendOldPamelding = () => {
    setMeldPaDirekteModalOpen(true)
  }

  const sendDirekteModalConfirm = () => {
    if (newPameldingValues) {
      const request = generateDirektePameldingRequestForm(pamelding, newPameldingValues)
      doFetchMeldPaDirekte(pamelding.deltakerId, enhetId, request)
    }
    setMeldPaDirekteModalOpen(false)
  }

  useEffect(() => {
    const isLoading =
      sendDirekteState === DeferredFetchState.LOADING ||
      sendDirekteState === DeferredFetchState.RESOLVED
    setIsDisabled(isLoading || disabled)
    disableForm && disableForm(isLoading || disabled)
  }, [sendDirekteState, disabled])

  return (
    <div className={className ?? ''}>
      {meldPaDirekteError === DeferredFetchState.ERROR && (
        <Alert variant="error" className="mt-4 mb-4">
          <Heading size="small" spacing level="3">
            Det skjedde en feil.
          </Heading>
          {meldPaDirekteError}
        </Alert>
      )}

      {sendDirekteState === DeferredFetchState.RESOLVED && (
        <Alert variant="success" className="mt-4 mb-4">
          Påmeldingen er sendt
        </Alert>
      )}

      <div className="flex items-center">
        <Button
          size="small"
          variant="secondary"
          icon={<ArrowForwardIcon/>}
          loading={sendDirekteState === DeferredFetchState.LOADING}
          disabled={isDisabled}
          type="button"
          onClick={
            useOldPamelding ? handleSendOldPamelding : methods?.handleSubmit(handleFormSubmit)
          }
        >
          {meldPaDirekteTekst}
        </Button>
        <div className="ml-2">
          <HelpText aria-label={`Hjelpetekst: ${meldPaDirekteTekst}`}>
            Utkastet deles ikke til brukeren. Brukeren skal allerede vite hvilke opplysninger som
            blir delt med tiltaksarrangør.
          </HelpText>
        </div>
      </div>

      <MeldPaDirekteModal
        pamelding={pamelding}
        open={meldPaDirekteModalOpen}
        onConfirm={sendDirekteModalConfirm}
        onCancel={() => {
          setMeldPaDirekteModalOpen(false)
        }}
      />
    </div>
  )
}
