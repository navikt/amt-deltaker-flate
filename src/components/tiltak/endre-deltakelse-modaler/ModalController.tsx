import { EndreDeltakelseType } from '../../../api/data/endre-deltakelse-request'
import { PameldingResponse } from '../../../api/data/pamelding'
import { IkkeAktuellModal } from './IkkeAktuellModal'

interface ModalControllerProps {
  open: boolean
  deltakerId: string
  endringsType: EndreDeltakelseType | null
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const ModalController = (props: ModalControllerProps) => {
  switch (props.endringsType) {
    case EndreDeltakelseType.IKKE_AKTUELL:
      return <IkkeAktuellModal {...props} />
    default:
      return null
  }
}
