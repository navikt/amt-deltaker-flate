import { BodyLong, Button, HStack, Modal } from '@navikt/ds-react'

interface Props {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ForkastUtkastEndringModal = ({ open, onConfirm, onCancel }: Props) => {
  return (
    <Modal
      open={open}
      header={{ heading: 'Vil du forkaste endringene til utkastet?' }}
      onClose={onCancel}
    >
      <Modal.Body>
        <BodyLong>Endringene dine vil bli borte.</BodyLong>
      </Modal.Body>
      <Modal.Footer>
        <HStack gap="4">
          <Button type="button" variant="secondary" size="small" onClick={onCancel}>
            Nei, ikke forkast
          </Button>
          <Button type="button" onClick={onConfirm} size="small">
            Forkast endringer
          </Button>
        </HStack>
      </Modal.Footer>
    </Modal>
  )
}
