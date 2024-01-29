import { PencilIcon } from '@navikt/aksel-icons'
import { Button, Dropdown } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { DeltakerStatusType, PameldingResponse } from '../../api/data/pamelding'
import { EndringTypeIkon } from './EndringTypeIkon'
import { EndreDeltakelseType } from '../../api/data/endre-deltakelse-request'
import { usePameldingCOntext } from './PameldingContext'
import { ModalController } from './endre-deltakelse-modaler/ModalController'
import { getEndreDeltakelseTypeText } from '../../utils/displayText'

const hentEndreDeltakelseKnappValg = (
  endringsType: EndreDeltakelseType,
  onClick: (type: EndreDeltakelseType) => void
) => (
  <Dropdown.Menu.List.Item onClick={() => onClick(endringsType)}>
    <EndringTypeIkon type={endringsType} />
    {getEndreDeltakelseTypeText(endringsType)}
  </Dropdown.Menu.List.Item>
)

export const EndreDeltakelseKnapp = () => {
  const { pamelding, setPamelding } = usePameldingCOntext()
  const endreDeltakelseRef = useRef<HTMLButtonElement>(null)
  const [modalType, setModalType] = useState<EndreDeltakelseType | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const openModal = (type: EndreDeltakelseType) => {
    setModalType(type)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalType(null)
    setModalOpen(false)
    endreDeltakelseRef?.current?.focus()
  }

  const handleEndringUtført = (oppdatertPamelding: PameldingResponse | null) => {
    handleCloseModal()
    if (oppdatertPamelding) {
      setPamelding(oppdatertPamelding)
    }
  }

  return (
    <>
      <Dropdown>
        <Button
          ref={endreDeltakelseRef}
          as={Dropdown.Toggle}
          variant="secondary"
          size="small"
          icon={<PencilIcon aria-hidden />}
        >
          Endre deltakelse
        </Button>
        <Dropdown.Menu>
          <Dropdown.Menu.List>
            {pamelding.status.type === DeltakerStatusType.VENTER_PA_OPPSTART &&
              hentEndreDeltakelseKnappValg(EndreDeltakelseType.IKKE_AKTUELL, openModal)}
          </Dropdown.Menu.List>
        </Dropdown.Menu>
      </Dropdown>

      <ModalController
        endringsType={modalType}
        open={modalOpen}
        deltakerId={pamelding.deltakerId}
        onClose={handleCloseModal}
        onSuccess={handleEndringUtført}
      />
    </>
  )
}
