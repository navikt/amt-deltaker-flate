import { Modal } from '@navikt/ds-react'

interface Props {
  open: boolean
  onClose: () => void
}

export const HistorikkModal = ({ open, onClose }: Props) => {
  return (
    <Modal open={open} header={{ heading: 'Endringer' }} onClose={onClose}>
      <Modal.Body>test</Modal.Body>
    </Modal>
  )
}
