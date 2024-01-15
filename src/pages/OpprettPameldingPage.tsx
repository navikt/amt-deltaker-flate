import {Mal, PameldingResponse} from '../api/data/pamelding.ts'
import {generateFormDefaultValues, PameldingFormValues} from '../model/PameldingFormValues.ts'
import {DeferredFetchState, useDeferredFetch} from '../hooks/useDeferredFetch.ts'
import {deletePamelding, sendInnPamelding, sendInnPameldingUtenGodkjenning} from '../api/api.ts'
import {SendInnPameldingRequest} from '../api/data/send-inn-pamelding-request.ts'
import {useAppContext} from '../AppContext.tsx'
import {TrashIcon} from '@navikt/aksel-icons'
import {Alert, Button, Heading} from '@navikt/ds-react'
import {useState} from 'react'
import {useAppRedirection} from '../hooks/useAppRedirection.ts'
import {TILBAKE_PAGE} from '../Routes.tsx'

import {PameldingHeader} from '../components/pamelding/PameldingHeader.tsx'
import {PameldingForm} from '../components/pamelding/PameldingForm.tsx'
import { AvbrytKladdModal } from '../components/opprett-pamelding/AvbrytKladdModal.tsx'
import { DelUtkastModal } from '../components/opprett-pamelding/DelUtkastModal.tsx'
import { MeldPaDirekteModal } from '../components/opprett-pamelding/MeldPaDirekteModal.tsx'

export interface OpprettPameldingPageProps {
  pamelding: PameldingResponse
}

export const OpprettPameldingPage = ({ pamelding }: OpprettPameldingPageProps) => {
  const { enhetId } = useAppContext()
  const { doRedirect } = useAppRedirection()

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

  const { state: avbrytUtkastState, doFetch: fetchAvbrytUtkast } = useDeferredFetch(
    deletePamelding,
    returnToFrontpage
  )

  const generateMal = (selectedMal: string[]): Mal[] => {
    return pamelding.mal.map((mal) => {
      return {
        type: mal.type,
        visningstekst: mal.visningstekst,
        beskrivelse: mal.beskrivelse,
        valgt: selectedMal.find((i) => i === mal.type) !== undefined
      }
    })
  }

  const generateRequest = (data: PameldingFormValues | undefined): SendInnPameldingRequest => {
    if (!data) {
      throw new Error('data should not be undefined')
    }

    return {
      deltakerlisteId: pamelding.deltakerliste.deltakerlisteId,
      dagerPerUke: data.dagerPerUke,
      deltakelsesprosent: data.deltakelsesprosent,
      bakgrunnsinformasjon: data.bakgrunnsinformasjon,
      mal: generateMal(data.valgteMal)
    }
  }

  const onSendSomForslagHandler = (data: PameldingFormValues) => {
    setFormData(data)
    setDelUtkastModalOpen(true)
  }

  const onSendDirekteHandler = (data: PameldingFormValues) => {
    setFormData(data)
    setMeldPaDirekteModalOpen(true)
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
        onSendDirekte={onSendDirekteHandler}
        sendDirekteLoading={sendDirekteState === DeferredFetchState.LOADING}
        tiltakstype={pamelding.deltakerliste.tiltakstype}
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
        icon={<TrashIcon />}
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
          doFetchSendSomForslag(pamelding.deltakerId, enhetId, generateRequest(formData))
          setDelUtkastModalOpen(false)
        }}
        onCancel={() => {
          setDelUtkastModalOpen(false)
        }}
        navn={{ fornavn: 'Test', mellomnavn: 'Mellom', etternavn: 'Testersen' }}
        gjennomforingTypeText={pamelding.deltakerliste.tiltakstype}
        arrangorNavn={pamelding.deltakerliste.arrangorNavn}
      />

      <MeldPaDirekteModal
        open={meldPaDirekteModalOpen}
        onConfirm={() => {
          doFetchMeldPaDirekte(pamelding.deltakerId, enhetId, generateRequest(formData))
          setMeldPaDirekteModalOpen(false)
        }}
        onCancel={() => {
          setMeldPaDirekteModalOpen(false)
        }}
      />
    </div>
  )
}
