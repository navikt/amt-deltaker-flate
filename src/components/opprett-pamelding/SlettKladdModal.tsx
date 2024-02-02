import { BodyLong, Button, HStack, Modal } from '@navikt/ds-react'

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
      <Modal.Footer>
        <HStack gap="4">
          <Button type="button" variant="secondary" size="small" onClick={onCancel}>
            Nei, ikke slett
          </Button>
          <Button type="button" onClick={onConfirm} size="small">
            Slett kladd
          </Button>
        </HStack>
      </Modal.Footer>
    </Modal>
  )
}
