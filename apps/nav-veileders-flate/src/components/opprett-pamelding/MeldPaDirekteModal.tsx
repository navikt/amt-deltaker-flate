import { BodyLong, BodyShort, ConfirmationPanel, Modal } from '@navikt/ds-react'
import {
  harFellesOppstart,
  hentTiltakNavnHosArrangorTekst
} from 'deltaker-flate-common'
import { useState } from 'react'
import { PameldingResponse } from '../../api/data/pamelding'
import { getDeltakerNavn } from '../../utils/displayText'
import { ModalFooter } from '../ModalFooter'

export interface MeldPaDirekteModalProps {
  pamelding: PameldingResponse
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export enum DokumentertValg {
  SAMTALEREFERAT = 'SAMTALEREFERAT',
  DIALOGMELDING = 'DIALOGMELDING'
}

export const MeldPaDirekteModal = ({
  pamelding,
  open,
  onConfirm,
  onCancel
}: MeldPaDirekteModalProps) => {
  const [confirmed, setConfirmed] = useState(false)
  const [hasError, setHasError] = useState<boolean>(false)

  const erFellesOppstart = harFellesOppstart(
    pamelding.deltakerliste.oppstartstype
  )
  const meldPaText = erFellesOppstart ? 'Søk inn' : 'Meld på'

  const handleMeldPaDirekte = () => {
    if (confirmed) onConfirm()
    else setHasError(true)
  }

  const handleCHangeConfirm = () => {
    setConfirmed((oldValue) => !oldValue)
    setHasError(false)
  }

  return (
    <Modal
      open={open}
      header={{
        heading: `${meldPaText} uten digital godkjenning av utkastet`
      }}
      onClose={onCancel}
    >
      <Modal.Body>
        <ConfirmationPanel
          size="small"
          checked={confirmed}
          onChange={handleCHangeConfirm}
          error={hasError && 'Du må bekrefte før du kan fortsette.'}
          label="Ja, personen er informert"
        >
          <BodyLong size="small">
            {`Før du ${erFellesOppstart ? 'sender inn søknaden' : 'melder på'}, skal du ha avtalt med personen om hva innholdet i tiltaket skal være, og hvilke personopplysninger som deles med arrangøren. Er personen informert?`}
          </BodyLong>
        </ConfirmationPanel>
        <BodyLong size="small" className="mt-8 mb-4">
          {getInfoText(erFellesOppstart, pamelding.digitalBruker)}
        </BodyLong>
        <BodyShort weight="semibold">
          {`${getDeltakerNavn(pamelding)} ${erFellesOppstart ? 'søkes inn' : 'meldes'} på ${hentTiltakNavnHosArrangorTekst(pamelding.deltakerliste.tiltakstype, pamelding.deltakerliste.arrangorNavn)}`}
        </BodyShort>
      </Modal.Body>
      <ModalFooter
        confirmButtonText={
          erFellesOppstart ? 'Send søknad' : 'Meld på og fatt vedtak'
        }
        cancelButtonText="Avbryt"
        onConfirm={handleMeldPaDirekte}
        onCancel={onCancel}
      />
    </Modal>
  )
}

const getInfoText = (erFellesOppstart: boolean, erDigitalBruker: boolean) => {
  if (erFellesOppstart) {
    return erDigitalBruker
      ? 'Brukeren blir varslet, og finner lenke på Min side og i aktivitetsplanen. Tiltaksansvarlig i Nav kan se søknaden i Tiltaksadministrasjon.'
      : 'Brukeren mottar informasjon om søknaden på papir. Tiltaksansvarlig i Nav kan se søknaden i Tiltaksadministrasjon.'
  }
  return erDigitalBruker
    ? 'Brukeren blir varslet, og finner lenke på Min side og i aktivitetsplanen. I Deltakeroversikten på nav.no ser arrangøren påmeldingen, kontaktinformasjonen til bruker og tildelt veileder.'
    : 'Brukeren mottar vedtaket på papir. I Deltakeroversikten på nav.no ser arrangøren påmeldingen, kontaktinformasjonen til bruker og tildelt veileder.'
}
