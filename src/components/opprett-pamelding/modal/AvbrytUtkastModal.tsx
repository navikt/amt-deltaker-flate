import {BodyLong, Button, HStack, Modal} from '@navikt/ds-react'

interface Props {
    open: boolean
    onConfirm: () => void
    onCancel: () => void
}

export const AvbrytUtkastModal = (
  {open, onConfirm, onCancel}: Props
) => {

  return (
    <Modal
      open={open}
      header={{ heading: 'Vil du avbryte uten å lagre utkastet?'}}
      onClose={onCancel}
    >
      <Modal.Body>
        <BodyLong>
                    Påmeldingen og det du har skrevet vil bli borte.
        </BodyLong>
      </Modal.Body>
      <Modal.Footer>
        <HStack gap="4">
          <Button type="button" variant="secondary" onClick={onCancel}>
                  Nei, ikke avbryt utkastet
          </Button>
          <Button type="button" onClick={onConfirm}>
                  Avbryt utkast
          </Button>
        </HStack>
      </Modal.Footer>
    </Modal>
  )

}
