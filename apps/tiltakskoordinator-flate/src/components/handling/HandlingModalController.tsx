import { HandlingValg } from '../../context-providers/HandlingContext'
import { DelMedArrangorModal } from './DelMedArrangorModal'
import { SettPaVentelisteModal } from './SettPaVentelisteModal'

interface HandlingModalControllerProps {
  handlingValg: HandlingValg
  modalOpen: boolean
  onClose: () => void
  onSend: () => void
}

export const HandlingModalController = ({
  handlingValg,
  modalOpen,
  onClose,
  onSend
}: HandlingModalControllerProps) => {
  switch (handlingValg) {
    case HandlingValg.DEL_DELTAKERE:
      return (
        <DelMedArrangorModal
          open={modalOpen}
          onClose={onClose}
          onSend={onSend}
        />
      )
    case HandlingValg.SETT_PA_VENTELISTE:
      return (
        <SettPaVentelisteModal
          open={modalOpen}
          onClose={onClose}
          onSend={onSend}
        />
      )
  }
}
