import { BodyLong, Button, Modal } from '@navikt/ds-react'
import { usePameldingFormContext } from '../pamelding/PameldingFormContext'

interface Props {
  open: boolean
  onClose: () => void
}

export const ForkastUtkastEndringModal = ({ open, onClose }: Props) => {
  const { setRedigerUtkast } = usePameldingFormContext()

  return (
    <Modal
      open={open}
      header={{ heading: 'Vil du forkaste endringene til utkastet?' }}
      onClose={onClose}
    >
      <Modal.Body>
        <BodyLong>Endringene dine vil bli borte.</BodyLong>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          size="small"
          onClick={() => {
            setRedigerUtkast(false)
            onClose()
          }}
        >
          Forkast endringer
        </Button>
        <Button
          type="button"
          size="small"
          variant="secondary"
          onClick={onClose}
        >
          Nei, ikke forkast
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
