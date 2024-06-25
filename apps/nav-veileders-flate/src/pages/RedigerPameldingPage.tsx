import { PencilIcon, XMarkIcon } from '@navikt/aksel-icons'
import { Button, VStack } from '@navikt/ds-react'
import {
  DeferredFetchState,
  DeltakerStatusType,
  UtkastHeader,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useEffect, useState } from 'react'
import { useAppContext } from '../AppContext.tsx'
import { avbrytUtkast } from '../api/api.ts'
import { HorisontalLine } from '../components/HorisontalLine.tsx'
import { Tilbakeknapp } from '../components/Tilbakeknapp.tsx'
import { MeldPaDirekteButton } from '../components/pamelding/MeldPaDirekteButton.tsx'
import { PameldingForm } from '../components/pamelding/PameldingForm.tsx'
import { PameldingHeader } from '../components/pamelding/PameldingHeader.tsx'
import { AvbrytUtkastDeltMedBrukerModal } from '../components/rediger-pamelding/AvbrytUtkastDeltMedBrukerModal.tsx'
import { Utkast } from '../components/rediger-pamelding/Utkast.tsx'
import { usePameldingContext } from '../components/tiltak/PameldingContext.tsx'
import {
  DELTAKELSESOVERSIKT_LINK,
  useModiaLink
} from '../hooks/useModiaLink.ts'
import { ErrorPage } from './ErrorPage.tsx'
import { PameldingResponse } from '../api/data/pamelding.ts'

export const RedigerPameldingPage = () => {
  const [avbrytModalOpen, setAvbrytModalOpen] = useState<boolean>(false)
  const [redigerUtkast, setRedigerUtkast] = useState<boolean>(false)
  const [idDisabled, setIsDisabled] = useState<boolean>(false)
  const { pamelding, setPamelding } = usePameldingContext()

  const { doRedirect } = useModiaLink()
  const { enhetId } = useAppContext()

  const erUtkastAvbrutt =
    pamelding.status.type === DeltakerStatusType.AVBRUTT_UTKAST
  const tittel = erUtkastAvbrutt ? 'Avbrutt utkast' : 'Utkast til påmelding'

  const returnToFrontpage = () => {
    doRedirect(DELTAKELSESOVERSIKT_LINK)
  }

  const handleDelEndring = (pamelding: PameldingResponse) => {
    setPamelding(pamelding)
    setRedigerUtkast(false)
    setIsDisabled(false)
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
    <div className="max-w-[47.5rem] md:m-auto m-4" data-testid="page_utkast">
      <Tilbakeknapp />
      <div>
        <PameldingHeader
          title={tittel}
          tiltakstype={pamelding.deltakerliste.tiltakstype}
          arrangorNavn={pamelding.deltakerliste.arrangorNavn}
          deltakerlisteId={pamelding.deltakerliste.deltakerlisteId}
        />
        <UtkastHeader
          visStatusVenterPaaBruker={!erUtkastAvbrutt}
          vedtaksinformasjon={pamelding.vedtaksinformasjon}
          erNAVVeileder
        />
      </div>

      <VStack gap="2" align="start" className="md:p-8 p-4 bg-white">
        {redigerUtkast && (
          <PameldingForm
            focusOnOpen
            pamelding={pamelding}
            disabled={idDisabled}
            disableForm={(disabled) => setIsDisabled(disabled)}
            onCancelUtkast={() => setRedigerUtkast(false)}
            onDelEndring={handleDelEndring}
          />
        )}

        {!redigerUtkast && (
          <>
            <Utkast
              innhold={pamelding.deltakelsesinnhold}
              bakgrunnsinformasjon={pamelding.bakgrunnsinformasjon}
              deltakelsesprosent={pamelding.deltakelsesprosent}
              dagerPerUke={pamelding.dagerPerUke}
              tiltakstype={pamelding.deltakerliste.tiltakstype}
            />
            {pamelding.status.type ===
              DeltakerStatusType.UTKAST_TIL_PAMELDING && (
              <>
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
                  <ErrorPage message={avbrytUtkastError} />
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
          </>
        )}
        <AvbrytUtkastDeltMedBrukerModal
          open={avbrytModalOpen}
          onConfirm={() => {
            fetchAvbrytUtkast(pamelding.deltakerId, enhetId)
            setAvbrytModalOpen(false)
          }}
          onCancel={() => {
            setAvbrytModalOpen(false)
          }}
        />
      </VStack>
    </div>
  )
}
