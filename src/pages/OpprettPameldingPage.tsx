import {OpprettPameldingHeader} from '../components/opprett-pamelding/OpprettPameldingHeader.tsx'
import {Mal, PameldingResponse} from '../api/data/pamelding.ts'
import {OpprettPameldingForm} from '../components/opprett-pamelding/OpprettPameldingForm.tsx'
import {PameldingFormValues} from '../model/PameldingFormValues.ts'
import {DeferredFetchState, useDeferredFetch} from '../hooks/useDeferredFetch.ts'
import {deletePamelding, sendInnPamelding, sendInnPameldingUtenGodkjenning} from '../api/api.ts'
import {SendInnPameldingRequest} from '../api/data/send-inn-pamelding-request.ts'
import {useAppContext} from '../AppContext.tsx'
import {TrashIcon} from '@navikt/aksel-icons'
import {Alert, Button, Heading} from '@navikt/ds-react'
import {AvbrytUtkastModal} from '../components/opprett-pamelding/modal/AvbrytUtkastModal.tsx'
import {useState} from 'react'
import {useAppRedirection} from '../hooks/useAppRedirection.ts'
import {TILBAKE_PAGE} from '../Routes.tsx'

export interface OpprettPameldingPageProps {
    pamelding: PameldingResponse
}

export const OpprettPameldingPage = ({pamelding}: OpprettPameldingPageProps) => {
  const {enhetId} = useAppContext()
  const {doRedirect} = useAppRedirection()

  const [avbrytModalOpen, setAvbrytModalOpen] = useState<boolean>(false)

  const onAvbrytUtkastResolvedHandler = () => {
    doRedirect(TILBAKE_PAGE)
  }

  const {
    state: sendSomForslagState,
    error: sendSomForslagError,
    doFetch: doFetchSendSomForslag
  } = useDeferredFetch(sendInnPamelding)

  const {
    state: sendDirekteState
  } = useDeferredFetch(sendInnPameldingUtenGodkjenning)

  const {
    state: avbrytUtkastState,
    doFetch: fetchAvbrytUtkast,
  } = useDeferredFetch(deletePamelding, onAvbrytUtkastResolvedHandler)

  const generateMal = (selectedMal: string[]): Mal[] => {
    return pamelding.mal.map(mal => {
      return {
        type: mal.type,
        visningstekst: mal.visningstekst,
        beskrivelse: mal.beskrivelse,
        valgt: selectedMal.find((i) => i === mal.type) !== undefined
      }
    })
  }

  const generateRequest = (data: PameldingFormValues): SendInnPameldingRequest => {
    return {
      deltakerlisteId: pamelding.deltakerliste.deltakerlisteId,
      dagerPerUke: data.dagerPerUke,
      deltakelsesprosent: data.deltakelsesprosent,
      bakgrunnsinformasjon: data.bakgrunnsinformasjon,
      mal: generateMal(data.valgteMal)
    }
  }

  const onSendSomForslagHandler = (data: PameldingFormValues) => {
    doFetchSendSomForslag(pamelding.deltakerId, enhetId, generateRequest(data))
  }

  const onSendDirekteHandler = (/*data: PameldingFormValues*/) => {
    // console.log('SendDirekte', data)
  }

  const disableButtonsAndForm = () => {
    return sendSomForslagState === DeferredFetchState.LOADING
            || sendDirekteState === DeferredFetchState.LOADING
            || avbrytUtkastState === DeferredFetchState.LOADING
            || sendSomForslagState === DeferredFetchState.RESOLVED
            || sendDirekteState === DeferredFetchState.RESOLVED
            || avbrytUtkastState == DeferredFetchState.RESOLVED
  }

  return (
    <div className="m-4">
      <OpprettPameldingHeader
        deltakerlisteNavn={pamelding.deltakerliste.deltakerlisteNavn}
        arrangorNavn={pamelding.deltakerliste.arrangorNavn}
        oppstartstype={pamelding.deltakerliste.oppstartstype}
      />
      <OpprettPameldingForm
        disableButtonsAndForm={disableButtonsAndForm()}
        onSendSomForslag={onSendSomForslagHandler}
        sendSomForslagLoading={sendSomForslagState === DeferredFetchState.LOADING}
        onSendDirekte={onSendDirekteHandler}
        sendDirekteLoading={sendDirekteState === DeferredFetchState.LOADING}
        tiltakstype={pamelding.deltakerliste.tiltakstype}
        mal={pamelding.mal}
      />

      {sendSomForslagState === DeferredFetchState.ERROR && (
        <Alert variant="error">
          <Heading size="small" spacing level="3">
              Det skjedde en feil.
          </Heading>
          {sendSomForslagError}
        </Alert>
      )}

      {sendSomForslagState === DeferredFetchState.RESOLVED && (
        <Alert variant="success">Forslag er sendt til backenden!</Alert>
      )}

      <div className="mt-4">
        <Button type="button"
          variant="tertiary"
          disabled={disableButtonsAndForm()}
          onClick={() => setAvbrytModalOpen(true)}
          icon={<TrashIcon/>}
        >
          Avbryt utkast
        </Button>
      </div>

      <AvbrytUtkastModal
        open={avbrytModalOpen}
        onConfirm={() => {
          fetchAvbrytUtkast(pamelding.deltakerId)
          setAvbrytModalOpen(false)}}
        onCancel={() => {setAvbrytModalOpen(false)}}
      />

    </div>
  )

}
