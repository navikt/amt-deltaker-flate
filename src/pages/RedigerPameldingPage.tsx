import {PameldingResponse} from '../api/data/pamelding.ts'
import {PameldingHeader} from '../components/pamelding/PameldingHeader.tsx'
import {RedigerPameldingHeader} from '../components/rediger-pamelding/RedigerPameldingHeader.tsx'
import {PameldingForm} from '../components/pamelding/PameldingForm.tsx'
import {generateFormDefaultValues, PameldingFormValues} from '../model/PameldingFormValues.ts'
import {Alert, Button, Heading} from '@navikt/ds-react'
import {TrashIcon} from '@navikt/aksel-icons'
import {useState} from 'react'
import {AvbrytUtkastDeltMedBrukerModal} from '../components/rediger-pamelding/AvbrytUtkastDeltMedBrukerModal.tsx'
import {useAppContext} from '../AppContext.tsx'
import {useAppRedirection} from '../hooks/useAppRedirection.ts'
import {DelUtkastModal} from '../components/opprett-pamelding/DelUtkastModal.tsx'
import {DeferredFetchState, useDeferredFetch} from '../hooks/useDeferredFetch.ts'
import {sendInnPamelding, sendInnPameldingUtenGodkjenning} from '../api/api.ts'
import {TILBAKE_PAGE} from '../Routes.tsx'
import {generateDirektePameldingRequestForm, generatePameldingRequestFromForm} from '../utils/pamelding-form-utils.ts'
import {MeldPaDirekteModal} from '../components/opprett-pamelding/MeldPaDirekteModal.tsx'
import {Begrunnelse} from '../api/data/send-inn-pamelding-uten-godkjenning-request.ts'

export interface RedigerPameldingPageProps {
    pamelding: PameldingResponse
}

export const RedigerPameldingPage = ({pamelding}: RedigerPameldingPageProps) => {
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
            sendSomForslagState === DeferredFetchState.RESOLVED
    )
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

  return (
    <div>
      <div className="space-y-4">
        <div>
          <PameldingHeader
            tiltakstype={pamelding.deltakerliste.tiltakstype}
            arrangorNavn={pamelding.deltakerliste.arrangorNavn}
          />
          <RedigerPameldingHeader
            status={pamelding.status.type}
            endretAv={pamelding.sistEndretAv}
          />
        </div>

        <PameldingForm
          disableButtonsAndForm={disableButtonsAndForm()}
          onSendSomForslag={onSendSomForslagHandler}
          sendSomForslagLoading={sendSomForslagState === DeferredFetchState.LOADING}
          onSendDirekte={onSendDirekteHandler}
          sendDirekteLoading={sendDirekteState === DeferredFetchState.LOADING}
          tiltakstype={pamelding.deltakerliste.tiltakstype}
          mal={pamelding.mal}
          defaultValues={generateFormDefaultValues(pamelding)}
          bakgrunnsinformasjon={pamelding.bakgrunnsinformasjon ?? undefined}
          deltakelsesprosent={pamelding.deltakelsesprosent ?? undefined}
          dagerPerUke={pamelding.dagerPerUke ?? undefined}
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

      </div>

      <Button
        size="small"
        variant="tertiary"
        disabled={false}
        className="mt-2"
        onClick={() => {
          setAvbrytModalOpen(true)
        }}
        icon={<TrashIcon/>}
      >
                Avbryt utkast
      </Button>

      <AvbrytUtkastDeltMedBrukerModal
        open={avbrytModalOpen}
        onConfirm={() => {
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
        onConfirm={sendDirekteModalConfirm}
        onCancel={() => {
          setMeldPaDirekteModalOpen(false)
        }}
      />

    </div>
  )
}
