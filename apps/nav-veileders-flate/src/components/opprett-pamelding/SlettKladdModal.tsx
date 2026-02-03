import { BodyLong, Modal } from '@navikt/ds-react'
import {
  kreverGodkjenningForPamelding,
  Pameldingstype
} from 'deltaker-flate-common'
import { ModalFooter } from '../ModalFooter'

interface Props {
  open: boolean
  pameldingstype: Pameldingstype
  onConfirm: () => void
  onCancel: () => void
}

export const SlettKladdModal = ({
  open,
  pameldingstype,
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
          {kreverGodkjenningForPamelding(pameldingstype)
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
