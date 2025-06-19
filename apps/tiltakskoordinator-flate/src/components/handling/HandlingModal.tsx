import { Alert, Button, Modal } from '@navikt/ds-react'
import { useState } from 'react'
import {
  HandlingValg,
  useHandlingContext
} from '../../context-providers/HandlingContext'
import { listDeltakerNavn } from '../../utils/utils'
import { ValgteDeltakereBox } from './ValgteDeltakereBox'

interface Props {
  open: boolean
  children: React.ReactNode
  error: string | null
  onClose: () => void
  onUtforHandling: () => Promise<void> | undefined
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

  const ikkeDigitaleDeltakereUtenAdresse = valgteDeltakere.filter(
    (deltaker) => {
      return deltaker.ikkeDigitalOgManglerAdresse
    }
  )

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

        {ikkeDigitaleDeltakereUtenAdresse.length > 0 && (
          <Alert variant="warning" size="small" className="mt-4">
            {listDeltakerNavn(ikkeDigitaleDeltakereUtenAdresse)} er reservert
            mot digital kommunikasjon, og har heller ingen registrert
            kontaktadresse. De vil derfor ikke motta et varsel om vedtaket.
            Vedtaket som journalføres i Gosys må skrives ut og leveres til
            deltaker på annen måte.
          </Alert>
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
              const h = onUtforHandling()
              if (h === undefined) {
                setHandlingStatus(HandlingStatusType.NOT_STARTED)
              } else {
                h.then(() => setHandlingStatus(HandlingStatusType.DONE))
              }
            }}
            loading={handlingStatus === HandlingStatusType.IN_PROGRESS}
            disabled={handlingStatus === HandlingStatusType.IN_PROGRESS}
          >
            {getHandlingKnappSendTekst(handlingValg)}
          </Button>
        )}
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={handlingStatus === HandlingStatusType.IN_PROGRESS}
        >
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
