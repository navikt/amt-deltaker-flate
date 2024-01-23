import {PameldingResponse} from '../api/data/pamelding.ts'
import {generateFormDefaultValues, PameldingFormValues} from '../model/PameldingFormValues.ts'
import {DeferredFetchState, useDeferredFetch} from '../hooks/useDeferredFetch.ts'
import {deletePamelding, sendInnPamelding, sendInnPameldingUtenGodkjenning} from '../api/api.ts'
import {useAppContext} from '../AppContext.tsx'
import {TrashIcon} from '@navikt/aksel-icons'
import {Alert, Button, Heading} from '@navikt/ds-react'
import {useState} from 'react'
import {useAppRedirection} from '../hooks/useAppRedirection.ts'
import {TILBAKE_PAGE} from '../Routes.tsx'

import {PameldingHeader} from '../components/pamelding/PameldingHeader.tsx'
import {PameldingForm} from '../components/pamelding/PameldingForm.tsx'
import {AvbrytKladdModal} from '../components/opprett-pamelding/AvbrytKladdModal.tsx'
import {DelUtkastModal} from '../components/opprett-pamelding/DelUtkastModal.tsx'
import {MeldPaDirekteModal} from '../components/opprett-pamelding/MeldPaDirekteModal.tsx'
import {generatePameldingRequestFromForm} from '../utils/pamelding-form-utils.ts'

export interface OpprettPameldingPageProps {
    pamelding: PameldingResponse
}

export const OpprettPameldingPage = ({pamelding}: OpprettPameldingPageProps) => {
  const {enhetId} = useAppContext()
  const {doRedirect} = useAppRedirection()

  const [avbrytModalOpen, setAvbrytModalOpen] = useState<boolean>(false)
  const [delUtkastModalOpen, setDelUtkastModalOpen] = useState<boolean>(false)
  const [meldPaDirekteModalOpen, setMeldPaDirekteModalOpen] = useState<boolean>(false)

  const [formData, setFormData] = useState<PameldingFormValues>()

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

  const {state: avbrytUtkastState, doFetch: fetchAvbrytUtkast} = useDeferredFetch(
    deletePamelding,
    returnToFrontpage
  )

  const onSendSomForslagHandler = (data: PameldingFormValues) => {
    setFormData(data)
    setDelUtkastModalOpen(true)
  }

  const disableButtonsAndForm = () => {
    return (
      sendSomForslagState === DeferredFetchState.LOADING ||
            sendDirekteState === DeferredFetchState.LOADING ||
            avbrytUtkastState === DeferredFetchState.LOADING ||
            sendSomForslagState === DeferredFetchState.RESOLVED ||
            sendDirekteState === DeferredFetchState.RESOLVED ||
            avbrytUtkastState == DeferredFetchState.RESOLVED
    )
  }

  return (
    <div className="m-4">
      <PameldingHeader
        tiltakstype={pamelding.deltakerliste.tiltakstype}
        arrangorNavn={pamelding.deltakerliste.arrangorNavn}
      />

      <PameldingForm
        disableButtonsAndForm={disableButtonsAndForm()}
        onSendSomForslag={onSendSomForslagHandler}
        sendSomForslagLoading={sendSomForslagState === DeferredFetchState.LOADING}
        tiltakstype={pamelding.deltakerliste.tiltakstype}
        pamelding={pamelding}
        mal={pamelding.mal}
        defaultValues={generateFormDefaultValues(pamelding)}
      />

      {sendSomForslagState === DeferredFetchState.ERROR && (
        <Alert variant="error">
          <Heading size="small" spacing level="3">
                        Det skjedde en feil.
          </Heading>
          {sendSomForslagError}
        </Alert>
      )}

      {meldPaDirekteError === DeferredFetchState.ERROR && (
        <Alert variant="error">
          <Heading size="small" spacing level="3">
                        Det skjedde en feil.
          </Heading>
          {meldPaDirekteError}
        </Alert>
      )}

      {sendSomForslagState === DeferredFetchState.RESOLVED && (
        <Alert variant="success">Forslag er sendt til brukeren!</Alert>
      )}
      {sendDirekteState === DeferredFetchState.RESOLVED && (
        <Alert variant="success">Pmeldingen er sendt</Alert>
      )}

      <Button
        size="small"
        variant="tertiary"
        className="mt-2"
        disabled={disableButtonsAndForm()}
        onClick={() => setAvbrytModalOpen(true)}
        icon={<TrashIcon/>}
      >
                Avbryt
      </Button>

      <AvbrytKladdModal
        open={avbrytModalOpen}
        onConfirm={() => {
          fetchAvbrytUtkast(pamelding.deltakerId)
          setAvbrytModalOpen(false)
        }}
        onCancel={() => {
          setAvbrytModalOpen(false)
        }}
      />

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
        onConfirm={() => {
          doFetchMeldPaDirekte(pamelding.deltakerId, enhetId, generatePameldingRequestFromForm(pamelding, formData))
          setMeldPaDirekteModalOpen(false)
        }}
        onCancel={() => {
          setMeldPaDirekteModalOpen(false)
        }}
      />
    </div>
  )
}
