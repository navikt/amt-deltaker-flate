import { BodyLong, BodyShort, Button, ConfirmationPanel, HStack, Modal } from '@navikt/ds-react'
import { useState } from 'react'
import { PameldingResponse } from '../../api/data/pamelding'
import { getDeltakerNavn, getTiltakstypeDisplayText } from '../../utils/displayText'

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
          Bruker blir varslet og kan finne lenke på innlogget nav.no og i aktivitetsplanen. Arrangør
          mottar påmeldingen, kontaktinformasjonen til bruker og til tildelt veileder. Dette ser
          arrangøren i verktøyet Deltakeroversikt på nav.no.
        </BodyLong>
        <BodyShort weight="semibold">
          {`${getDeltakerNavn(pamelding)} meldes på ${getTiltakstypeDisplayText(pamelding.deltakerliste.tiltakstype)} hos ${pamelding.deltakerliste.arrangorNavn}`}
        </BodyShort>
      </Modal.Body>
      <Modal.Footer>
        <HStack gap="4">
          <Button type="button" variant="secondary" size="small" onClick={onCancel}>
            Avbryt
          </Button>
          <Button type="button" size="small" onClick={handleMeldPaDirekte}>
            Meld på og fatt vedtak
          </Button>
        </HStack>
      </Modal.Footer>
    </Modal>
  )
}
