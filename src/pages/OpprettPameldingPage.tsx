import {OpprettPameldingHeader} from '../components/opprett-pamelding/OpprettPameldingHeader.tsx'
import {Mal, PameldingResponse} from '../api/data/pamelding.ts'
import {OpprettPameldingForm} from '../components/opprett-pamelding/OpprettPameldingForm.tsx'
import {PameldingFormValues} from '../model/PameldingFormValues.ts'
import {DeferredFetchState, useDeferredFetch} from '../hooks/useDeferredFetch.ts'
import {sendInnPamelding, sendInnPameldingUtenGodkjenning} from '../api/api.ts'
import {SendInnPameldingRequest} from '../api/data/send-inn-pamelding-request.ts'
import {useAppContext} from '../AppContext.tsx'
import {Alert} from '@navikt/ds-react'

export interface OpprettPameldingPageProps {
    pamelding: PameldingResponse
}

export const OpprettPameldingPage = ({pamelding}: OpprettPameldingPageProps) => {
  const {deltakerlisteId, enhetId} = useAppContext()

  const {state: sendSomForslagState, doFetch: doFetchSendSomForslag} = useDeferredFetch(sendInnPamelding)
  const {state: sendDirekteState} = useDeferredFetch(sendInnPameldingUtenGodkjenning)

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
    doFetchSendSomForslag(deltakerlisteId, enhetId, generateRequest(data))
  }

  const onSendDirekteHandler = (/*data: PameldingFormValues*/) => {
    // console.log('SendDirekte', data)
  }

  const disableSubmit = () => {
    return sendSomForslagState === DeferredFetchState.LOADING
            || sendDirekteState === DeferredFetchState.LOADING
            || sendSomForslagState === DeferredFetchState.RESOLVED
            || sendDirekteState === DeferredFetchState.RESOLVED
  }

  return (
    <div>
      <OpprettPameldingHeader
        deltakerlisteNavn={pamelding.deltakerliste.deltakerlisteNavn}
        arrangorNavn={pamelding.deltakerliste.arrangorNavn}
        oppstartstype={pamelding.deltakerliste.oppstartstype}
      />
      <OpprettPameldingForm
        disableSubmit={disableSubmit()}
        onSendSomForslag={onSendSomForslagHandler}
        sendSomForslagLoading={sendSomForslagState === DeferredFetchState.LOADING}
        onSendDirekte={onSendDirekteHandler}
        sendDirekteLoading={sendDirekteState === DeferredFetchState.LOADING}
        tiltakstype={pamelding.deltakerliste.tiltakstype}
        mal={pamelding.mal}
      />

      {sendSomForslagState === DeferredFetchState.RESOLVED && (
        <Alert variant="success">Forslag er sendt til backenden!</Alert>
      )}

    </div>
  )

}
