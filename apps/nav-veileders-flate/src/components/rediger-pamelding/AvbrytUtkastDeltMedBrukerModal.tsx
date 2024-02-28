import { BodyLong, Modal } from '@navikt/ds-react'
import { ModalFooter } from '../ModalFooter.tsx'

interface Props {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const AvbrytUtkastDeltMedBrukerModal = ({ open, onConfirm, onCancel }: Props) => {
  return (
    <Modal open={open} header={{ heading: 'Vil du avbryte utkastet?' }} onClose={onCancel}>
      <Modal.Body>
        <BodyLong className="mb-4" size="small">
          Når du avbryter utkastet så får personen beskjed. Aktiviteten i aktivitetsplanen blir
          flyttet til avbrutt.
        </BodyLong>
      </Modal.Body>
      <ModalFooter
        confirmButtonText="Avbryt utkast"
        cancelButtonText="Nei, ikke avbryt utkastet"
        onConfirm={() => onConfirm()}
        onCancel={onCancel}
      />
    </Modal>
  )
}
