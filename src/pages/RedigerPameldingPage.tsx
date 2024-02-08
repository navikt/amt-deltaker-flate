import { PameldingResponse } from '../api/data/pamelding.ts'
import { PameldingHeader } from '../components/pamelding/PameldingHeader.tsx'
import { RedigerPameldingHeader } from '../components/rediger-pamelding/RedigerPameldingHeader.tsx'
import { PameldingForm } from '../components/pamelding/PameldingForm.tsx'
import { Alert, Button, Heading, VStack } from '@navikt/ds-react'
import { PencilIcon, XMarkIcon } from '@navikt/aksel-icons'
import { useEffect, useState } from 'react'
import { AvbrytUtkastDeltMedBrukerModal } from '../components/rediger-pamelding/AvbrytUtkastDeltMedBrukerModal.tsx'
import { useAppRedirection } from '../hooks/useAppRedirection.ts'
import { TILBAKE_PAGE } from '../Routes.tsx'
import { DeferredFetchState, useDeferredFetch } from '../hooks/useDeferredFetch.ts'
import { avbrytUtkast } from '../api/api.ts'
import { useAppContext } from '../AppContext.tsx'
import { AvbrytUtkastRequest } from '../api/data/avbryt-utkast-request.ts'
import { Utkast } from '../components/rediger-pamelding/Utkast.tsx'
import { HorisontalLine } from '../components/HorisontalLine.tsx'
import { MeldPaDirekteButton } from '../components/pamelding/MeldPaDirekteButton.tsx'

export interface RedigerPameldingPageProps {
  pamelding: PameldingResponse
}

export const RedigerPameldingPage = ({ pamelding }: RedigerPameldingPageProps) => {
  const [avbrytModalOpen, setAvbrytModalOpen] = useState<boolean>(false)
  const [redigerUtkast, setRedigerUtkast] = useState<boolean>(false)
  const [idDisabled, setIsDisabled] = useState<boolean>(false)

  const { doRedirect } = useAppRedirection()
  const { enhetId } = useAppContext()

  const returnToFrontpage = () => {
    doRedirect(TILBAKE_PAGE)
  }

  const {
    state: avbrytUtkastState,
    error: avbrytUtkastError,
    doFetch: fetchAvbrytUtkast
  } = useDeferredFetch(avbrytUtkast, returnToFrontpage)

  useEffect(() => {
    setIsDisabled(avbrytUtkastState === DeferredFetchState.LOADING)
  }, [avbrytUtkastState])

  return (
    <div>
      <div className="space-y-4">
        <div>
          <PameldingHeader
            tiltakstype={pamelding.deltakerliste.tiltakstype}
            arrangorNavn={pamelding.deltakerliste.arrangorNavn}
          />
          <RedigerPameldingHeader {...pamelding.vedtaksinformasjon} />
        </div>

        <VStack gap="2" align="start" className="p-8 bg-white">
          {redigerUtkast && (
            <PameldingForm
              focusOnOpen
              pamelding={pamelding}
              disabled={idDisabled}
              disableForm={(disabled) => setIsDisabled(disabled)}
              onCancelUtkast={() => setRedigerUtkast(false)}
            />
          )}

          {!redigerUtkast && (
            <>
              <Utkast
                innhold={pamelding.innhold}
                bakgrunnsinformasjon={pamelding.bakgrunnsinformasjon}
              />
              <Button
                size="small"
                variant="secondary"
                icon={<PencilIcon />}
                disabled={idDisabled}
                onClick={() => setRedigerUtkast(true)}
                className="mt-8"
              >
                Endre utkastet
              </Button>
              <HorisontalLine className="mt-8 mb-8" />
              <MeldPaDirekteButton
                className="mb-2"
                pamelding={pamelding}
                disabled={idDisabled}
                useOldPamelding
                disableForm={(disabled) => setIsDisabled(disabled)}
              />
              {avbrytUtkastState === DeferredFetchState.ERROR && (
                <Alert variant="error" className="mt-4 mb-4">
                  <Heading size="small" spacing level="3">
                    Det skjedde en feil.
                  </Heading>
                  {avbrytUtkastError}
                </Alert>
              )}
              <Button
                size="small"
                variant="secondary"
                disabled={idDisabled}
                onClick={() => {
                  setAvbrytModalOpen(true)
                }}
                loading={avbrytUtkastState === DeferredFetchState.LOADING}
                icon={<XMarkIcon />}
              >
                Avbryt utkast til påmelding
              </Button>
            </>
          )}
        </VStack>
      </div>

      <AvbrytUtkastDeltMedBrukerModal
        open={avbrytModalOpen}
        onConfirm={(request: AvbrytUtkastRequest) => {
          fetchAvbrytUtkast(pamelding.deltakerId, enhetId, request)
          setAvbrytModalOpen(false)
        }}
        onCancel={() => {
          setAvbrytModalOpen(false)
        }}
      />
    </div>
  )
}
