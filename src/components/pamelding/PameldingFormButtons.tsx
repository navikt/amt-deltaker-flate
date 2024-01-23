import { Alert, Button, Heading, HelpText, VStack } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { PameldingFormValues } from '../../model/PameldingFormValues.ts'
import { useEffect, useState } from 'react'
import { TILBAKE_PAGE } from '../../Routes.tsx'
import { useAppRedirection } from '../../hooks/useAppRedirection.ts'
import { useAppContext } from '../../AppContext.tsx'
import { DeferredFetchState, useDeferredFetch } from '../../hooks/useDeferredFetch.ts'
import { sendInnPamelding, sendInnPameldingUtenGodkjenning } from '../../api/api.ts'
import { MeldPaDirekteModal } from '../opprett-pamelding/MeldPaDirekteModal.tsx'
import { Begrunnelse } from '../../api/data/send-inn-pamelding-uten-godkjenning-request.ts'
import {
  generateDirektePameldingRequestForm,
  generatePameldingRequestFromForm
} from '../../utils/pamelding-form-utils.ts'
import { PameldingResponse } from '../../api/data/pamelding.ts'
import { DelUtkastModal } from '../opprett-pamelding/DelUtkastModal.tsx'

interface Props {
    pamelding: PameldingResponse,
    disableForm: (disable: boolean) => void
}

export const PameldingFormButtons = (
  {
    pamelding,
    disableForm
  }: Props
) => {
  const FORSLAG_BTN_ID = 'sendSomForslagBtn'
  const DIREKTE_BTN_ID = 'sendDirekteBtn'

  const {doRedirect} = useAppRedirection()
  const {enhetId} = useAppContext()

  const [meldPaDirekteModalOpen, setMeldPaDirekteModalOpen] = useState<boolean>(false)
  const [delUtkastModalOpen, setDelUtkastModalOpen] = useState<boolean>(false)

  const [formData, setFormData] = useState<PameldingFormValues>()

  const {handleSubmit} = useFormContext<PameldingFormValues>()

  const returnToFrontpage = () => {
    doRedirect(TILBAKE_PAGE)
  }

  const {
    state: sendSomForslagState,
    error: sendSomForslagError,
    doFetch: doFetchSendSomForslag
  } = useDeferredFetch(sendInnPamelding, returnToFrontpage)

  const {
    state: sendDirekteState,
    error: meldPaDirekteError,
    doFetch: doFetchMeldPaDirekte
  } = useDeferredFetch(sendInnPameldingUtenGodkjenning, returnToFrontpage)

  const handleFormSubmit =
        (submitType: 'sendSomForslagBtn' | 'sendDirekteBtn') => (data: PameldingFormValues) => {
          if (submitType === FORSLAG_BTN_ID) {
            setFormData(data)
            setDelUtkastModalOpen(true)
          } else if (submitType === DIREKTE_BTN_ID) {
            setFormData(data)
            setMeldPaDirekteModalOpen(true)
          } else {
            throw new Error(`no handler for ${submitType}`)
          }
        }

  const sendDirekteModalConfirm = (begrunnelseType: string) => {
    const begrunnelse: Begrunnelse = {
      type: begrunnelseType,
      beskrivelse: null
    }

    const request = generateDirektePameldingRequestForm(pamelding, formData, begrunnelse)

    doFetchMeldPaDirekte(pamelding.deltakerId, enhetId, request)
    setMeldPaDirekteModalOpen(false)
  }

  const disableButtons = () => {
    return (
      sendDirekteState === DeferredFetchState.LOADING
            || sendDirekteState === DeferredFetchState.RESOLVED
            || sendSomForslagState === DeferredFetchState.LOADING
            || sendSomForslagState === DeferredFetchState.RESOLVED
    )
  }

  useEffect(() => {
    disableForm(disableButtons())
  }, [sendDirekteState, sendSomForslagState, disableButtons])

  return (
    <>
      {sendSomForslagState === DeferredFetchState.ERROR && (
        <Alert variant="error">
          <Heading size="small" spacing level="3">
                        Det skjedde en feil.
          </Heading>
          {sendSomForslagError}
        </Alert>
      )}

      {sendSomForslagState === DeferredFetchState.RESOLVED && (
        <Alert variant="success">Forslag er sendt til brukeren!</Alert>
      )}

      {meldPaDirekteError === DeferredFetchState.ERROR && (
        <Alert variant="error">
          <Heading size="small" spacing level="3">
                        Det skjedde en feil.
          </Heading>
          {meldPaDirekteError}
        </Alert>
      )}

      {sendDirekteState === DeferredFetchState.RESOLVED && (
        <Alert variant="success">Påmeldingen er sendt</Alert>
      )}

      <VStack gap="4" className="mt-8">
        <div className="flex items-center">
          <Button
            size="small"
            loading={sendSomForslagState === DeferredFetchState.LOADING}
            disabled={disableButtons()}
            type="button"
            onClick={handleSubmit(handleFormSubmit(FORSLAG_BTN_ID))}
          >
                        Del utkast og gjør klar vedtaket
          </Button>
          <div className="ml-4">
            <HelpText>
                            Når utkastet deles med bruker så kan de lese gjennom hva du foreslår å sende til
                            arrangøren. Bruker blir varslet og kan finne lenke på innlogget nav.no og gjennom
                            aktivitetsplanen. Når bruker godtar så blir vedtaket satt.
            </HelpText>
          </div>
        </div>

        <div className="flex items-center">
          <Button
            size="small"
            variant="secondary"
            loading={sendDirekteState === DeferredFetchState.LOADING}
            disabled={disableButtons()}
            type="button"
            onClick={handleSubmit(handleFormSubmit(DIREKTE_BTN_ID))}
          >
                        Fortsett uten å dele utkastet
          </Button>
          <div className="ml-4">
            <HelpText>
                            Utkastet deles ikke til brukeren. Brukeren skal allerede vite hvilke opplysninger
                            som blir delt med tiltaksarrangør.
            </HelpText>
          </div>
        </div>
      </VStack>

      <DelUtkastModal
        open={delUtkastModalOpen}
        onConfirm={() => {
          doFetchSendSomForslag(pamelding.deltakerId, enhetId, generatePameldingRequestFromForm(pamelding, formData))
          setDelUtkastModalOpen(false)
        }}
        onCancel={() => {
          setDelUtkastModalOpen(false)
        }}
        navn={{fornavn: 'Test', mellomnavn: 'Mellom', etternavn: 'Testersen'}}
        gjennomforingTypeText={pamelding.deltakerliste.tiltakstype}
        arrangorNavn={pamelding.deltakerliste.arrangorNavn}
      />

      <MeldPaDirekteModal
        open={meldPaDirekteModalOpen}
        onConfirm={sendDirekteModalConfirm}
        onCancel={() => {
          setMeldPaDirekteModalOpen(false)
        }}
      />
    </>
  )
}
