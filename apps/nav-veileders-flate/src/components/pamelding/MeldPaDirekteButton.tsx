import { ArrowForwardIcon } from '@navikt/aksel-icons'
import { Alert, Button, HelpText } from '@navikt/ds-react'
import {
  DeferredFetchState,
  DeltakerStatusType,
  harFellesOppstart,
  hentTiltakNavnHosArrangorTekst,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useAppContext } from '../../AppContext.tsx'
import { sendInnPameldingUtenGodkjenning } from '../../api/api.ts'
import { PameldingResponse } from '../../api/data/pamelding.ts'
import {
  DELTAKELSESOVERSIKT_LINK,
  useModiaLink
} from '../../hooks/useModiaLink.ts'
import {
  generateFormDefaultValues,
  PameldingFormValues
} from '../../model/PameldingFormValues.ts'
import { ErrorPage } from '../../pages/ErrorPage.tsx'
import { generateDirektePameldingRequestForm } from '../../utils/pamelding-form-utils.ts'
import { MeldPaDirekteModal } from '../opprett-pamelding/MeldPaDirekteModal.tsx'

interface Props {
  pamelding: PameldingResponse
  useOldPamelding?: boolean
  disabled: boolean
  className?: string
  disableForm?: (disabled: boolean) => void
  onSubmitError?: () => void
}

export const MeldPaDirekteButton = ({
  pamelding,
  disabled,
  useOldPamelding,
  className,
  disableForm,
  onSubmitError
}: Props) => {
  const { doRedirect } = useModiaLink()
  const { enhetId } = useAppContext()

  const [isDisabled, setIsDisabled] = useState<boolean>(disabled)
  const [meldPaDirekteModalOpen, setMeldPaDirekteModalOpen] =
    useState<boolean>(false)
  const [newPameldingValues, setNewPameldingValues] = useState(
    useOldPamelding ? generateFormDefaultValues(pamelding) : undefined
  )
  const erFellesOppstart = harFellesOppstart(
    pamelding.deltakerliste.oppstartstype
  )
  const methods = useFormContext<PameldingFormValues>()

  const meldPaText = erFellesOppstart ? 'Søk inn' : 'Meld på'

  const meldPaDirekteTekst =
    pamelding.status.type === DeltakerStatusType.KLADD
      ? `${meldPaText} uten å dele utkast`
      : `${meldPaText} uten godkjent utkast`

  const returnToFrontpage = () => {
    const body = erFellesOppstart
      ? {
          heading: 'Bruker er søkt inn',
          body: `Innsøkt på ${hentTiltakNavnHosArrangorTekst(pamelding.deltakerliste.tiltakskode, pamelding.deltakerliste.arrangorNavn)}.`
        }
      : {
          heading: 'Bruker er meldt på',
          body: `Vedtak om ${hentTiltakNavnHosArrangorTekst(pamelding.deltakerliste.tiltakskode, pamelding.deltakerliste.arrangorNavn)} er fattet.`
        }
    doRedirect(DELTAKELSESOVERSIKT_LINK, body)
  }

  const {
    state: sendDirekteState,
    error: meldPaDirekteError,
    doFetch: doFetchMeldPaDirekte
  } = useDeferredFetch(sendInnPameldingUtenGodkjenning, returnToFrontpage)

  const handleFormSubmit = (data: PameldingFormValues) => {
    setNewPameldingValues(data)
    setMeldPaDirekteModalOpen(true)
  }

  const handleSendOldPamelding = () => {
    setMeldPaDirekteModalOpen(true)
  }

  const sendDirekteModalConfirm = () => {
    if (newPameldingValues) {
      const request = generateDirektePameldingRequestForm(
        pamelding,
        newPameldingValues
      )
      doFetchMeldPaDirekte(pamelding.deltakerId, enhetId, request)
    }
    setMeldPaDirekteModalOpen(false)
  }

  useEffect(() => {
    const isLoading =
      sendDirekteState === DeferredFetchState.LOADING ||
      sendDirekteState === DeferredFetchState.RESOLVED
    setIsDisabled(isLoading || disabled)
    if (disableForm) {
      disableForm(isLoading || disabled)
    }
  }, [sendDirekteState, disabled])

  return (
    <div className={className ?? ''}>
      {meldPaDirekteError === DeferredFetchState.ERROR && (
        <ErrorPage message={meldPaDirekteError} />
      )}

      {sendDirekteState === DeferredFetchState.RESOLVED && (
        <Alert variant="success" className="mt-4 mb-4">
          Påmeldingen er sendt
        </Alert>
      )}

      <div className="flex items-center">
        <Button
          size="small"
          variant="secondary"
          icon={<ArrowForwardIcon aria-hidden />}
          loading={sendDirekteState === DeferredFetchState.LOADING}
          disabled={isDisabled}
          type="button"
          onClick={
            useOldPamelding
              ? handleSendOldPamelding
              : methods?.handleSubmit(handleFormSubmit, onSubmitError)
          }
        >
          {meldPaDirekteTekst}
        </Button>
        <div className="ml-2">
          <HelpText aria-label={`Hjelpetekst: ${meldPaDirekteTekst}`}>
            {`${meldPaText} uten digital godkjenning av utkastet. Brukeren skal allerede vite hvilke opplysninger som blir delt med arrangøren.`}
          </HelpText>
        </div>
      </div>

      <MeldPaDirekteModal
        pamelding={pamelding}
        open={meldPaDirekteModalOpen}
        onConfirm={sendDirekteModalConfirm}
        onCancel={() => {
          setMeldPaDirekteModalOpen(false)
        }}
      />
    </div>
  )
}
