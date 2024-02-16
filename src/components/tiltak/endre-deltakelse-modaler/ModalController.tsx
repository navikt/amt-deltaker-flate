import {EndreDeltakelseType} from '../../../api/data/endre-deltakelse-request'
import {PameldingResponse} from '../../../api/data/pamelding'
import {IkkeAktuellModal} from './IkkeAktuellModal'
import {ForlengDeltakelseModal} from './ForlengDeltakelseModal.tsx'
import { EndreOppstartsdatoModal } from './EndreOppstartsdatoModal.tsx'
import {EndreBakgrunnsinfoModal} from './EndreBakgrunnsinfoModal'

interface ModalControllerProps {
  open: boolean
  pamelding: PameldingResponse
  endringsType: EndreDeltakelseType | null
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const ModalController = (props: ModalControllerProps) => {
  switch (props.endringsType) {
    case EndreDeltakelseType.IKKE_AKTUELL:
      return <IkkeAktuellModal {...props} />
    case EndreDeltakelseType.FORLENG_DELTAKELSE:
      return <ForlengDeltakelseModal {...props} />
    case EndreDeltakelseType.ENDRE_OPPSTARTSDATO:
      return <EndreOppstartsdatoModal {...props} />
    case EndreDeltakelseType.ENDRE_BAKGRUNNSINFO:
      return <EndreBakgrunnsinfoModal {...props} />
    default:
      return null
  }
}
