import { BodyLong, Modal } from '@navikt/ds-react'
import { ModalFooter } from '../ModalFooter'
import { Oppstartstype } from 'deltaker-flate-common'

interface Props {
  open: boolean
  oppstartstype: Oppstartstype | null
  onConfirm: () => void
  onCancel: () => void
}

export const SlettKladdModal = ({
  open,
  oppstartstype,
  onConfirm,
  onCancel
}: Props) => {
  return (
    <Modal
      open={open}
      header={{ heading: 'Vil du slette kladden?' }}
      onClose={onCancel}
    >
      <Modal.Body>
        <BodyLong>
          {oppstartstype === Oppstartstype.FELLES
            ? 'Kladden til søknaden vil bli borte.'
            : 'Påmeldingen og det du har skrevet vil bli borte.'}
        </BodyLong>
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
