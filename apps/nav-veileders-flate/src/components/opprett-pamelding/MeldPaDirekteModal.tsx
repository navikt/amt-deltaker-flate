import { BodyLong, BodyShort, ConfirmationPanel, Modal } from '@navikt/ds-react'
import { useState } from 'react'
import { PameldingResponse } from '../../api/data/pamelding'
import { getDeltakerNavn, hentTiltakNavnHosArrangørTekst } from '../../utils/displayText'
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
      header={{ heading: 'Meld på uten digital godkjenning av utkastet' }}
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
            Før du melder på skal du ha avtalt med personen hvilke personopplysninger som deles med
            arrangøren, og dere skal være enige om hva innholdet i tiltaket skal være. Er personen
            informert?
          </BodyLong>
        </ConfirmationPanel>
        <BodyLong size="small" className="mt-8 mb-4">
          Brukeren blir varslet, og finner lenke på Min side og i aktivitetsplanen. I Deltakeroversikten
          på nav.no ser arrangøren påmeldingen, kontaktinformasjonen til bruker og tildelt veileder.
        </BodyLong>
        <BodyShort weight="semibold">
          {`${getDeltakerNavn(pamelding)} meldes på ${hentTiltakNavnHosArrangørTekst(pamelding.deltakerliste.tiltakstype, pamelding.deltakerliste.arrangorNavn)}`}
        </BodyShort>
      </Modal.Body>
      <ModalFooter
        confirmButtonText="Meld på og fatt vedtak"
        cancelButtonText="Avbryt"
        onConfirm={handleMeldPaDirekte}
        onCancel={onCancel}
      />
    </Modal>
  )
}
