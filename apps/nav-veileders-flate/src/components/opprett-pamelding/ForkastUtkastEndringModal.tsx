import { BodyLong, Modal } from '@navikt/ds-react'
import { ModalFooter } from '../ModalFooter'

interface Props {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ForkastUtkastEndringModal = ({
  open,
  onConfirm,
  onCancel
}: Props) => {
  return (
    <Modal
      open={open}
      header={{ heading: 'Vil du forkaste endringene til utkastet?' }}
      onClose={onCancel}
    >
      <Modal.Body>
        <BodyLong>Endringene dine vil bli borte.</BodyLong>
      </Modal.Body>
      <ModalFooter
        confirmButtonText="Forkast endringer"
        cancelButtonText="Nei, ikke forkast"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </Modal>
  )
}
