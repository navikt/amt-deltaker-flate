import { BodyLong, Button, Modal } from '@navikt/ds-react'
import { hentTiltakNavnHosArrangorTekst } from 'deltaker-flate-common'
import { useState } from 'react'
import { getDeltakerNavn } from '../../../utils/displayText.ts'
import { ConfirmInfoCard } from '../../ConfirmInfoCard.tsx'
import { usePameldingContext } from '../../tiltak/PameldingContext.tsx'

interface Props {
  open: boolean
  onClose: () => void
}

export const MeldPaDirekteModal = ({ open, onClose }: Props) => {
  const { pamelding } = usePameldingContext()
  const deltakerNavn = getDeltakerNavn(pamelding)
  const { deltakerliste } = pamelding

  const [confirmed, setConfirmed] = useState(false)
  const [confirmError, setConfirmError] = useState<string | undefined>()

  return (
    <Modal
      open={open}
      header={{
        heading: 'Meld på uten digital godkjenning av utkastet'
      }}
      onClose={onClose}
    >
      <Modal.Body>
        <ConfirmInfoCard
          title="Er personen informert?"
          checkboxLabel="Ja, personen er informert"
          error={confirmError}
          onConfirmedChange={(checked) => {
            setConfirmed(checked)
            setConfirmError(undefined)
          }}
        >
          <BodyLong size="small">
            Før du melder på, skal du ha avtalt med personen hva innholdet i
            tiltaket skal være. Er personen informert?
          </BodyLong>
        </ConfirmInfoCard>

        <BodyLong weight="semibold" className="mt-8">
          {`${deltakerNavn} meldes på ${hentTiltakNavnHosArrangorTekst(deltakerliste.tiltakskode, deltakerliste.arrangorNavn)}`}
        </BodyLong>
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="button"
          size="small"
          onClick={() => {
            if (!confirmed) {
              setConfirmError('Du må bekrefte før du kan fortsette')
              return
            }
            // TODO kall api og håndter loading, error og success state
            onClose()
          }}
          // disabled={!!disabled}
          // loading={confirmLoading}
        >
          Del utkast og gjør klar påmelding
        </Button>
        <Button
          type="button"
          size="small"
          variant="secondary"
          onClick={onClose}
          // disabled={!!disabled}
          // loading={confirmLoading}
        >
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
