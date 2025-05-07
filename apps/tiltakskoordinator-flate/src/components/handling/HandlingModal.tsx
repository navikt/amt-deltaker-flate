import { Alert, Button, ExpansionCard, List, Modal } from '@navikt/ds-react'
import {
  HandlingValg,
  useHandlingContext
} from '../../context-providers/HandlingContext'
import { lagDeltakerNavn } from '../../utils/utils'
import { useState } from 'react'
import { ValgteDeltakereBox } from './ValgteDeltakereBox'

interface Props {
  open: boolean
  children: React.ReactNode
  error: string | null
  onClose: () => void
  onUtforHandling: () => Promise<void>
}
enum HandlingStatusType {
  NOT_STARTED,
  IN_PROGRESS,
  DONE
}
export const HandlingModal = ({
  open,
  children,
  error,
  onClose,
  onUtforHandling
}: Props) => {
  const { valgteDeltakere, handlingValg } = useHandlingContext()
  const [handlingStatus, setHandlingStatus] = useState<HandlingStatusType>(
    HandlingStatusType.NOT_STARTED
  )

  if (!handlingValg) {
    return null
  }

  return (
    <Modal
      open={open}
      header={{ heading: getHandlingTittel(handlingValg) }}
      onClose={onClose}
    >
      <Modal.Body>
        {children}

        {handlingValg !== HandlingValg.GI_AVSLAG && (
          <ValgteDeltakereBox
            valgteDeltakere={valgteDeltakere}
            handlingValg={handlingValg}
          />
        )}

        {error && (
          <Alert variant="error" size="small" role="alert" className="mt-4">
            {error}
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        {valgteDeltakere.length > 0 && (
          <Button
            form="skjema"
            onClick={() => {
              setHandlingStatus(HandlingStatusType.IN_PROGRESS)
              onUtforHandling().then(() =>
                setHandlingStatus(HandlingStatusType.DONE)
              )
            }}
            disabled={handlingStatus === HandlingStatusType.IN_PROGRESS}
          >
            {getHandlingKnappSendTekst(handlingValg)}
          </Button>
        )}
        <Button type="button" variant="secondary" onClick={onClose}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const getHandlingTittel = (handlingValg: HandlingValg) => {
  switch (handlingValg) {
    case HandlingValg.DEL_DELTAKERE:
      return 'Del med arrangør'
    case HandlingValg.SETT_PA_VENTELISTE:
      return 'Sett på venteliste'
    case HandlingValg.TILDEL_PLASS:
      return 'Tildel plass'
    case HandlingValg.GI_AVSLAG:
      return 'Gi avslag'
  }
}

const getHandlingKnappSendTekst = (handlingValg: HandlingValg) => {
  switch (handlingValg) {
    case HandlingValg.DEL_DELTAKERE:
      return 'Del med arrangør'
    case HandlingValg.SETT_PA_VENTELISTE:
      return 'Sett på venteliste'
    case HandlingValg.TILDEL_PLASS:
      return 'Tildel plass'
    case HandlingValg.GI_AVSLAG:
      return 'Gi avslag'
  }
}
