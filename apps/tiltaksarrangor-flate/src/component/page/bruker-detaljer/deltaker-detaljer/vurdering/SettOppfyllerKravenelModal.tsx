import React from 'react'
import { BodyShort, Modal } from '@navikt/ds-react'
import styles from './SettVurderingModal.module.scss'
import { SendTilNavKnapp } from '../endre-deltaker-modal/SendTilNavKnapp'
import { postDeltakerVurderingOppfyllerKravene } from '../../../../../api/tiltak-api'

export interface OppfyllerKravenelModalProps {
  isOpen: boolean
  deltakerId: string
  onClose: () => void
  onVurderingSendt: () => void
}

export const SettOppfyllerKravenelModal = ({
  isOpen,
  deltakerId,
  onClose,
  onVurderingSendt
}: OppfyllerKravenelModalProps) => {
  const sendVurdering = () =>
    postDeltakerVurderingOppfyllerKravene(deltakerId).then(() => undefined)

  const onSendt = () => {
    onClose()
    onVurderingSendt()
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-heading"
      header={{ heading: 'Oppfyller kravene' }}
    >
      <Modal.Body className={styles.content}>
        <BodyShort size="small">
          Personen oppfyller kravene for å delta på dette
          arbeidsmarkedstiltaket.
        </BodyShort>
        <SendTilNavKnapp
          sendEndring={sendVurdering}
          onEndringSendt={onSendt}
          className={styles.modalKnapp}
        />
      </Modal.Body>
    </Modal>
  )
}
