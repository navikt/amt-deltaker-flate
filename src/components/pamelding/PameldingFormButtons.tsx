import { Alert, Button, HStack, Heading, HelpText } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { PameldingFormValues } from '../../model/PameldingFormValues.ts'
import { useEffect, useState } from 'react'
import { TILBAKE_PAGE } from '../../Routes.tsx'
import { useAppRedirection } from '../../hooks/useAppRedirection.ts'
import { useAppContext } from '../../AppContext.tsx'
import { DeferredFetchState, useDeferredFetch } from '../../hooks/useDeferredFetch.ts'
import { deletePamelding, sendInnPamelding } from '../../api/api.ts'
import { generatePameldingRequestFromForm } from '../../utils/pamelding-form-utils.ts'
import { DeltakerStatusType, PameldingResponse } from '../../api/data/pamelding.ts'
import { DelUtkastModal } from '../opprett-pamelding/DelUtkastModal.tsx'
import { SlettKladdModal } from '../opprett-pamelding/SlettKladdModal.tsx'
import { ForkastUtkastEndringModal } from '../opprett-pamelding/ForkastUtkastEndringModal.tsx'

interface Props {
  pamelding: PameldingResponse
  disabled: boolean
  disableForm: (disable: boolean) => void
  onCancelUtkast?: () => void
}

export const PameldingFormButtons = ({
  pamelding,
  disabled,
  disableForm,
  onCancelUtkast
}: Props) => {
  const erUtkast = pamelding.status.type === DeltakerStatusType.UTKAST_TIL_PAMELDING
  const erKladd = !erUtkast

  const { doRedirect } = useAppRedirection()
  const { enhetId } = useAppContext()
  const returnToFrontpage = () => {
    doRedirect(TILBAKE_PAGE)
  }

  const [delUtkastModalOpen, setDelUtkastModalOpen] = useState(false)
  const [formData, setFormData] = useState<PameldingFormValues>()
  const [slettKladdModalOpen, setSlettKladdModalOpen] = useState(false)
  const [forkastUtkastEndringModalOpen, setForkastUtkastEndringModalOpen] = useState(false)
  const [isDisabled, setIsDisabled] = useState(disabled)

  const { handleSubmit } = useFormContext<PameldingFormValues>()

  const {
    state: sendSomForslagState,
    error: sendSomForslagError,
    doFetch: doFetchSendSomForslag
  } = useDeferredFetch(sendInnPamelding, returnToFrontpage)
  const {
    state: slettKladdState,
    error: slettKladdError,
    doFetch: doFetchSlettKladd
  } = useDeferredFetch(deletePamelding, returnToFrontpage)

  const handleFormSubmit = (data: PameldingFormValues) => {
    setFormData(data)
    setDelUtkastModalOpen(true)
  }

  useEffect(() => {
    const isLoading =
      sendSomForslagState === DeferredFetchState.LOADING ||
      slettKladdState === DeferredFetchState.LOADING

    setIsDisabled(isLoading || disabled)
    disableForm(isLoading || disabled)
  }, [sendSomForslagState, slettKladdState, disabled])

  return (
    <>
      {sendSomForslagState === DeferredFetchState.ERROR && (
        <Alert variant="error" className="mt-4 mb-4">
          <Heading size="small" spacing level="3">
            Det skjedde en feil.
          </Heading>
          {sendSomForslagError}
        </Alert>
      )}

      {slettKladdError === DeferredFetchState.ERROR && (
        <Alert variant="error" className="mt-4 mb-4">
          <Heading size="small" spacing level="3">
            Det skjedde en feil.
          </Heading>
          {slettKladdError}
        </Alert>
      )}

      {sendSomForslagState === DeferredFetchState.RESOLVED && (
        <Alert variant="success" className="mt-4 mb-4">
          Forslag er sendt til brukeren!
        </Alert>
      )}

      {slettKladdState === DeferredFetchState.RESOLVED && (
        <Alert variant="success" className="mt-4 mb-4">
          Kladden har blitt slettet
        </Alert>
      )}

      <HStack gap="4" className="mt-8">
        <div className="flex items-center">
          <Button
            size="small"
            disabled={isDisabled}
            type="button"
            onClick={handleSubmit(handleFormSubmit)}
            loading={sendSomForslagState === DeferredFetchState.LOADING}
          >
            {erUtkast ? 'Del endring' : 'Del utkast og gjør klar påmelding'}
          </Button>
          {erKladd && (
            <div className="ml-2">
              <HelpText>
                Når utkastet deles med bruker så kan de lese gjennom hva du foreslår å sende til
                arrangøren. Bruker blir varslet og kan finne lenke på innlogget nav.no og gjennom
                aktivitetsplanen. Når bruker godtar så blir vedtaket satt.
              </HelpText>
            </div>
          )}
        </div>

        {erKladd && (
          <Button
            variant="tertiary"
            size="small"
            type="button"
            disabled={isDisabled}
            onClick={() => setSlettKladdModalOpen(true)}
            loading={slettKladdState === DeferredFetchState.LOADING}
          >
            Slett kladd
          </Button>
        )}
        {erUtkast && (
          <Button
            variant="tertiary"
            size="small"
            type="button"
            disabled={isDisabled}
            onClick={() => setForkastUtkastEndringModalOpen(true)}
          >
            Forkast endring
          </Button>
        )}
      </HStack>

      <ForkastUtkastEndringModal
        open={forkastUtkastEndringModalOpen}
        onConfirm={() => {
          setForkastUtkastEndringModalOpen(false)
          if (onCancelUtkast) onCancelUtkast()
        }}
        onCancel={() => {
          setForkastUtkastEndringModalOpen(false)
        }}
      />

      <SlettKladdModal
        open={slettKladdModalOpen}
        onConfirm={() => {
          doFetchSlettKladd(pamelding.deltakerId)
          setSlettKladdModalOpen(false)
        }}
        onCancel={() => {
          setSlettKladdModalOpen(false)
        }}
      />

      <DelUtkastModal
        open={delUtkastModalOpen}
        onConfirm={() => {
          doFetchSendSomForslag(
            pamelding.deltakerId,
            enhetId,
            generatePameldingRequestFromForm(pamelding, formData)
          )
          setDelUtkastModalOpen(false)
        }}
        onCancel={() => {
          setDelUtkastModalOpen(false)
        }}
        navn={{ fornavn: 'Test', mellomnavn: 'Mellom', etternavn: 'Testersen' }}
        gjennomforingTypeText={pamelding.deltakerliste.tiltakstype}
        arrangorNavn={pamelding.deltakerliste.arrangorNavn}
      />
    </>
  )
}
