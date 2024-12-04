import { Modal } from '@navikt/ds-react'
import AvvisningsmodalBody from '../modal/Avvisningsmodal'
import { PameldingResponse } from '../../../api/data/pamelding'
import { Forslag } from 'deltaker-flate-common'

interface Props {
  open: boolean
  forslag: Forslag
  erUnderOppfolging: boolean
  onSend: (deltaker: PameldingResponse | null) => void
  onClose: () => void
}

export function AvvisForslagModal({ open, forslag, onSend, onClose }: Props) {
  return (
    <Modal open={open} header={{ heading: 'Avvis forslag' }} onClose={onClose}>
      <AvvisningsmodalBody onSend={onSend} forslag={forslag} />
    </Modal>
  )
}
