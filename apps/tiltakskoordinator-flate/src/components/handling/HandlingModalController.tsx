import { HandlingValg } from '../../context-providers/HandlingContext'
import { DelMedArrangorModal } from './DelMedArrangorModal'

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
  }
}
