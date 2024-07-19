import { Modal } from '@navikt/ds-react'
import React from 'react'
import AvvisningsmodalBody from '../modal/Avvisningsmodal'
import { PameldingResponse } from '../../../api/data/pamelding'
import { AktivtForslag } from 'deltaker-flate-common'

interface Props {
  open: boolean
  forslag: AktivtForslag
  onSend: (deltaker: PameldingResponse | null) => void
  onClose: () => void
}

export function AvvisModal({ open, forslag, onSend, onClose }: Props) {
  return (
    <Modal open={open} header={{ heading: 'Avvis forslag' }} onClose={onClose}>
      <AvvisningsmodalBody onSend={onSend} forslag={forslag} />
    </Modal>
  )
}
