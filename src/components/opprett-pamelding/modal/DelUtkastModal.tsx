import {BodyLong, Button, HStack, Modal} from '@navikt/ds-react'
import {Navn} from '../../../api/data/pamelding.ts'

interface Props {
    open: boolean
    onConfirm: () => void
    onCancel: () => void
    navn: Navn
    gjennomforingTypeText: string
    arrangorNavn: string

}

export const DelUtkastModal = (
  {
    open,
    onConfirm,
    onCancel,
    navn,
    gjennomforingTypeText,
    arrangorNavn
  }: Props
) => {
  return (
    <Modal
      open={open}
      header={{heading: 'Del utkast og gjør klar vedtak'}}
      onClose={onCancel}
    >
      <Modal.Body>
        <BodyLong>TODO</BodyLong>
        {navn.fornavn}
        {gjennomforingTypeText}
        {arrangorNavn}
      </Modal.Body>
      <Modal.Footer>
        <HStack gap="4">
          <Button type="button" variant="secondary" onClick={onCancel}>
                        Del utkast og gjør klar vedtak
          </Button>
          <Button type="button" onClick={onConfirm}>
                        Avbryt
          </Button>
        </HStack>
      </Modal.Footer>
    </Modal>
  )

}
