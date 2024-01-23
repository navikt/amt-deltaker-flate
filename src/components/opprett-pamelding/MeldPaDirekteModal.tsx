import { BodyLong, Button, HStack, Modal, Radio, RadioGroup } from '@navikt/ds-react'
import { useState } from 'react'

export interface MeldPaDirekteModalProps {
  open: boolean
  onConfirm: (type: string) => void
  onCancel: () => void
}

export enum DokumentertValg {
  SAMTALEREFERAT = 'SAMTALEREFERAT',
  DIALOGMELDING = 'DIALOGMELDING'
}

export const MeldPaDirekteModal = ({ open, onConfirm, onCancel }: MeldPaDirekteModalProps) => {
  const [stedDokumetert, setStedDokumentert] = useState<DokumentertValg | null>(null)
  const [hasError, setHasError] = useState<boolean>(false)

  const handleMeldPaDirekte = () => {
    if (stedDokumetert) onConfirm(stedDokumetert)
    else setHasError(true)
  }

  return (
    <Modal open={open} header={{ heading: 'Meld på uten å dele utkast' }} onClose={onCancel}>
      <Modal.Body>
        <BodyLong size="small" className="mb-6">
          Du skal allerede ha avtalt med bruker at det er ok at denne informasjonen nå deles med
          arrangøren, og dette skal være dokumentert. Det du svarer her vises til personen.
        </BodyLong>
        <RadioGroup
          legend="Hvor er dette dokumentert?"
          error={
            hasError &&
            'Velge hvor du har dokumentert at du har avtalt med bruker at det er ok å dele informasjonen med tiltaksarrangøren'
          }
          size="small"
          aria-required
          onChange={(value: DokumentertValg) => setStedDokumentert(value)}
        >
          <Radio value={DokumentertValg.SAMTALEREFERAT}>Samtalereferat</Radio>
          <Radio value={DokumentertValg.DIALOGMELDING}>I dialogmelding</Radio>
        </RadioGroup>
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
