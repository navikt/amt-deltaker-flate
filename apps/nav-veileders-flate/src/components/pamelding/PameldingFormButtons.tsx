import { Alert, Button, HelpText, HStack } from '@navikt/ds-react'
import {
  DeferredFetchState,
  DeltakerStatusType,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { deletePamelding, sendInnPamelding } from '../../api/api.ts'
import { PameldingResponse } from '../../api/data/pamelding.ts'
import { useAppContext } from '../../AppContext.tsx'
import {
  DELTAKELSESOVERSIKT_LINK,
  useModiaLink
} from '../../hooks/useModiaLink.ts'
import { PameldingFormValues } from '../../model/PameldingFormValues.ts'
import { ErrorPage } from '../../pages/ErrorPage.tsx'
import { getDeltakerNavn } from '../../utils/displayText.ts'
import { generatePameldingRequestFromForm } from '../../utils/pamelding-form-utils.ts'
import { DelUtkastModal } from '../opprett-pamelding/DelUtkastModal.tsx'
import { ForkastUtkastEndringModal } from '../opprett-pamelding/ForkastUtkastEndringModal.tsx'
import { SlettKladdModal } from '../opprett-pamelding/SlettKladdModal.tsx'

interface Props {
  pamelding: PameldingResponse
  disabled: boolean
  disableForm: (disable: boolean) => void
  onCancelUtkast?: () => void
  onSubmitError?: () => void
}

export const PameldingFormButtons = ({
  pamelding,
  disabled,
  disableForm,
  onCancelUtkast,
  onSubmitError
}: Props) => {
  const erUtkast =
    pamelding.status.type === DeltakerStatusType.UTKAST_TIL_PAMELDING
  const erKladd = !erUtkast
  const kanDeleUtkast = pamelding.digitalBruker

  const { doRedirect } = useModiaLink()
  const { enhetId } = useAppContext()
  const returnToFrontpage = () => {
    doRedirect(DELTAKELSESOVERSIKT_LINK)
  }
  const { handleSubmit, getValues } = useFormContext<PameldingFormValues>()

  const [delUtkastModalOpen, setDelUtkastModalOpen] = useState(false)
  const [formData, setFormData] = useState(getValues())
  const [slettKladdModalOpen, setSlettKladdModalOpen] = useState(false)
  const [forkastUtkastEndringModalOpen, setForkastUtkastEndringModalOpen] =
    useState(false)
  const [isDisabled, setIsDisabled] = useState(disabled)

  const delEndringKappTekst = erUtkast
    ? 'Del endring'
    : 'Del utkast og gjør klar påmelding'

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

  const delUtkast = (newFormData: PameldingFormValues) => {
    doFetchSendSomForslag(
      pamelding.deltakerId,
      enhetId,
      generatePameldingRequestFromForm(pamelding, newFormData)
    )
  }

  const handleFormSubmit = (newFormData: PameldingFormValues) => {
    setFormData(newFormData)
    if (pamelding.status.type === DeltakerStatusType.UTKAST_TIL_PAMELDING) {
      delUtkast(newFormData)
    } else setDelUtkastModalOpen(true)
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
        <ErrorPage message={sendSomForslagError} />
      )}

      {slettKladdError === DeferredFetchState.ERROR && (
        <ErrorPage message={slettKladdError} />
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
        {kanDeleUtkast && (
          <div className="flex items-center">
            <Button
              size="small"
              disabled={isDisabled}
              type="button"
              onClick={handleSubmit(handleFormSubmit, onSubmitError)}
              loading={sendSomForslagState === DeferredFetchState.LOADING}
            >
              {delEndringKappTekst}
            </Button>
            {erKladd && (
              <div className="ml-2">
                <HelpText aria-label={`Hjelpetekst: ${delEndringKappTekst}`}>
                  Når utkastet deles med bruker så kan de lese gjennom hva du
                  foreslår å sende til arrangøren. Bruker blir varslet og kan
                  finne lenke på innlogget nav.no og gjennom aktivitetsplanen.
                  Når brukeren godtar utkastet, så fattes vedtaket.
                </HelpText>
              </div>
            )}
          </div>
        )}
        {!kanDeleUtkast && (
          <div className="flex items-center">
            <Alert variant="warning" size="small">
              Kan ikke kontaktes digitalt
            </Alert>
          </div>
        )}

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
          delUtkast(formData)
          setDelUtkastModalOpen(false)
        }}
        onCancel={() => {
          setDelUtkastModalOpen(false)
        }}
        deltakerNavn={getDeltakerNavn(pamelding)}
        tiltakstype={pamelding.deltakerliste.tiltakstype}
        arrangorNavn={pamelding.deltakerliste.arrangorNavn}
      />
    </>
  )
}
