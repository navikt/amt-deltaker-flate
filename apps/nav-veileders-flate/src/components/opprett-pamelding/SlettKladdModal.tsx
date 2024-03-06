import { BodyLong, Modal } from '@navikt/ds-react'
import { ModalFooter } from '../ModalFooter'

interface Props {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const SlettKladdModal = ({ open, onConfirm, onCancel }: Props) => {
  return (
    <Modal open={open} header={{ heading: 'Vil du slette kladden?' }} onClose={onCancel}>
      <Modal.Body>
        <BodyLong>Påmeldingen og det du har skrevet vil bli borte.</BodyLong>
      </Modal.Body>
      <ModalFooter
        confirmButtonText="Slett kladd"
        cancelButtonText="Nei, ikke slett"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </Modal>
  )
}
