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
import {sendInnPamelding} from '../api/api.ts'
import {TILBAKE_PAGE} from '../Routes.tsx'
import {generatePameldingRequestFromForm} from '../utils/pamelding-form-utils.ts'

export interface RedigerPameldingPageProps {
    pamelding: PameldingResponse
}

export const RedigerPameldingPage = ({pamelding}: RedigerPameldingPageProps) => {
  const {enhetId} = useAppContext()
  const {doRedirect} = useAppRedirection()

  const [avbrytModalOpen, setAvbrytModalOpen] = useState<boolean>(false)
  const [delUtkastModalOpen, setDelUtkastModalOpen] = useState<boolean>(false)

  const [formData, setFormData] = useState<PameldingFormValues>()

  const returnToFrontpage = () => {
    doRedirect(TILBAKE_PAGE)
  }

  const {
    state: sendSomForslagState,
    error: sendSomForslagError,
    doFetch: doFetchSendSomForslag
  } = useDeferredFetch(sendInnPamelding, returnToFrontpage)

  const onSendSomForslagHandler = (data: PameldingFormValues) => {
    setFormData(data)
    setDelUtkastModalOpen(true)
  }

  const disableButtonsAndForm = () => {
    return (
      sendSomForslagState === DeferredFetchState.LOADING ||
            sendSomForslagState === DeferredFetchState.RESOLVED
    )
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
          tiltakstype={pamelding.deltakerliste.tiltakstype}
          pamelding={pamelding}
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

        {sendSomForslagState === DeferredFetchState.RESOLVED && (
          <Alert variant="success">Forslag er sendt til brukeren!</Alert>
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

    </div>
  )
}
