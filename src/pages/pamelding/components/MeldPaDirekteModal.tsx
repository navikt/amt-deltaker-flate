import { BodyLong, Button, HStack, Modal } from '@navikt/ds-react'

export interface MeldPaDirekteModalProps {
  open: boolean
  onClose: () => void
}

export const MeldPaDirekteModal = ({ open, onClose }: MeldPaDirekteModalProps) => {
  return (
    <Modal open={open} header={{ heading: 'Meld på uten å sende forslag' }} onClose={onClose}>
      <Modal.Body>
        <BodyLong>
          Bruker skal vite hvilket tiltak en blir meldt på og hvilken informasjon som deles til
          tiltaksarrangøren.
        </BodyLong>
      </Modal.Body>
      <Modal.Footer>
        <HStack gap="4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Avbryt
          </Button>
          <Button type="button" onClick={onClose}>
            Meld på og fatt vedtak
          </Button>
        </HStack>
      </Modal.Footer>
    </Modal>
  )
}
