import { BodyLong, BodyShort, Button, Modal } from '@navikt/ds-react'
import {
  DeferredFetchState,
  DeltakerStatusType,
  hentTiltakNavnHosArrangorTekst,
  skalMeldePaaDirekte,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { sendInnPameldingUtenGodkjenning } from '../../../../api/api'
import { useAppContext } from '../../../../AppContext'
import {
  DELTAKELSESOVERSIKT_LINK,
  useModiaLink
} from '../../../../hooks/useModiaLink'
import { PameldingFormValues } from '../../../../model/PameldingFormValues'
import { getDeltakerNavn } from '../../../../utils/displayText'
import {
  generatePameldingRequest,
  generatePameldingRequestFromForm
} from '../../../../utils/pamelding-form-utils'
import { ConfirmInfoCard } from '../../../ConfirmInfoCard'
import { usePameldingContext } from '../../../tiltak/PameldingContext'

export interface MeldPaDirekteModalProps {
  open: boolean
  onClose: () => void
}

export enum DokumentertValg {
  SAMTALEREFERAT = 'SAMTALEREFERAT',
  DIALOGMELDING = 'DIALOGMELDING'
}

export const MeldPaDirekteModal = ({
  open,
  onClose
}: MeldPaDirekteModalProps) => {
  const { enhetId } = useAppContext()
  const { pamelding } = usePameldingContext()
  const formContext = useFormContext<PameldingFormValues>()

  const [confirmed, setConfirmed] = useState(false)
  const [confirmError, setConfirmError] = useState<string | undefined>()

  const erUtkast =
    pamelding.status.type === DeltakerStatusType.UTKAST_TIL_PAMELDING

  const { doRedirect } = useModiaLink()

  const returnToFrontpageWithSuccessMessage = () => {
    doRedirect(DELTAKELSESOVERSIKT_LINK, {
      heading: 'Bruker er meldt på',
      body: `Påmeldt ${hentTiltakNavnHosArrangorTekst(pamelding.deltakerliste.tiltakskode, pamelding.deltakerliste.arrangorNavn)}.`
    })
  }

  const meldPaDirekte = skalMeldePaaDirekte(
    pamelding.deltakerliste.pameldingstype
  )
  const meldPaText = meldPaDirekte ? 'Meld på' : 'Søk inn'

  const {
    state: fetchState,
    // error, // TODO vise feil
    doFetch: doFetchMeldPaDirekte
  } = useDeferredFetch(
    sendInnPameldingUtenGodkjenning,
    erUtkast ? undefined : returnToFrontpageWithSuccessMessage
  )

  return (
    <Modal
      open={open}
      header={{
        heading: `${meldPaText} uten digital godkjenning av utkastet`
      }}
      onClose={onClose}
    >
      <Modal.Body>
        <ConfirmInfoCard
          title="Er personen informert?"
          checkboxLabel="Ja, personen er informert"
          error={confirmError}
          isConfirmed={confirmed}
          onConfirmedChange={(checked) => {
            setConfirmed(checked)
            setConfirmError(undefined)
          }}
        >
          <BodyLong size="small">
            {`Før du ${meldPaDirekte ? 'melder på' : 'sender inn søknaden'}, skal du ha avtalt med personen om hva innholdet i tiltaket skal være, og hvilke personopplysninger som deles med arrangøren. Er personen informert?`}
          </BodyLong>
        </ConfirmInfoCard>

        <BodyLong size="small" className="mt-8 mb-4">
          {getInfoText(meldPaDirekte, pamelding.digitalBruker)}
        </BodyLong>
        <BodyShort weight="semibold">
          {`${getDeltakerNavn(pamelding)} ${meldPaDirekte ? 'meldes' : 'søkes inn'} på ${hentTiltakNavnHosArrangorTekst(pamelding.deltakerliste.tiltakskode, pamelding.deltakerliste.arrangorNavn)}`}
        </BodyShort>
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="button"
          size="small"
          onClick={() => {
            if (!confirmed) {
              setConfirmError('Du må bekrefte før du kan fortsette.')
            } else {
              doFetchMeldPaDirekte(
                pamelding.deltakerId,
                enhetId,
                formContext
                  ? generatePameldingRequestFromForm(
                      pamelding,
                      formContext.getValues()
                    )
                  : generatePameldingRequest(pamelding)
              ).then(() => onClose())
            }
          }}
          disabled={fetchState === DeferredFetchState.LOADING}
          loading={fetchState === DeferredFetchState.LOADING}
        >
          {meldPaDirekte ? 'Meld på og fatt vedtak' : 'Send søknad'}
        </Button>
        <Button
          type="button"
          size="small"
          variant="secondary"
          onClick={onClose}
          disabled={fetchState === DeferredFetchState.LOADING}
        >
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const getInfoText = (meldPaDirekte: boolean, erDigitalBruker: boolean) => {
  if (meldPaDirekte) {
    return erDigitalBruker
      ? 'Brukeren blir varslet, og finner lenke på Min side og i aktivitetsplanen. I Deltakeroversikten på nav.no ser arrangøren påmeldingen, kontaktinformasjonen til bruker og tildelt veileder.'
      : 'Brukeren mottar vedtaket på papir. I Deltakeroversikten på nav.no ser arrangøren påmeldingen, kontaktinformasjonen til bruker og tildelt veileder.'
  }
  return erDigitalBruker
    ? 'Brukeren blir varslet, og finner lenke på Min side og i aktivitetsplanen. Tiltaksansvarlig i Nav kan se søknaden i Tiltaksadministrasjon.'
    : 'Brukeren mottar informasjon om søknaden på papir. Tiltaksansvarlig i Nav kan se søknaden i Tiltaksadministrasjon.'
}
