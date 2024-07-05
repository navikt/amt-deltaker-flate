import { PencilIcon } from '@navikt/aksel-icons'
import { Button, Dropdown } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { EndreDeltakelseType } from '../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../api/data/pamelding.ts'
import { getEndreDeltakelseTypeText } from '../../utils/displayText.ts'
import { getEndreDeltakelsesValg } from '../../utils/endreDeltakelse.ts'
import { EndringTypeIkon } from './EndringTypeIkon.tsx'
import { usePameldingContext } from './PameldingContext.tsx'
import { ModalController } from './endre-deltakelse-modaler/ModalController.tsx'

export const EndreDeltakelseKnapp = () => {
  const { pamelding, setPamelding } = usePameldingContext()
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

  const handleEndringUtført = (
    oppdatertPamelding: PameldingResponse | null
  ) => {
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
          className="w-fit"
          data-testid="endre_deltakelse_knapp"
          icon={<PencilIcon aria-hidden />}
        >
          Endre deltakelse
        </Button>
        <Dropdown.Menu>
          <Dropdown.Menu.List>
            {getEndreDeltakelsesValg(pamelding).map((valgType) => (
              <Dropdown.Menu.List.Item
                key={valgType}
                onClick={() => openModal(valgType)}
              >
                <EndringTypeIkon type={valgType} />
                {getEndreDeltakelseTypeText(valgType)}
              </Dropdown.Menu.List.Item>
            ))}
          </Dropdown.Menu.List>
        </Dropdown.Menu>
      </Dropdown>

      <ModalController
        endringsType={modalType}
        open={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleEndringUtført}
        pamelding={pamelding}
        forslag={null}
      />
    </>
  )
}
