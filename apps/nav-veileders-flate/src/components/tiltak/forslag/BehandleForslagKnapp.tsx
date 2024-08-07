import { Alert, Button } from '@navikt/ds-react'
import { usePameldingContext } from '../PameldingContext.tsx'
import { useRef, useState } from 'react'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { ModalController } from '../endre-deltakelse-modaler/ModalController.tsx'
import {
  Forslag,
  EndreDeltakelseType,
  getEndreDeltakelsesType
} from 'deltaker-flate-common'
import { AvvisModal } from './AvvisForslagModal.tsx'

interface Props {
  forslag: Forslag
}

export const BehandleForslagKnapp = ({ forslag }: Props) => {
  const { pamelding: deltaker, setPamelding } = usePameldingContext()
  const endreDeltakelseRef = useRef<HTMLButtonElement>(null)
  const [modalType, setModalType] = useState<EndreDeltakelseType | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const openModal = () => {
    if (deltaker.kanEndres) {
      const type = getEndreDeltakelsesType(forslag)
      setModalType(type)
      setModalOpen(true)
    }
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalType(null)
    setModalOpen(false)
    endreDeltakelseRef?.current?.focus()
  }

  const handleEndringUtfort = (
    oppdatertPamelding: PameldingResponse | null
  ) => {
    handleCloseModal()
    if (oppdatertPamelding) {
      setPamelding(oppdatertPamelding)
    }
  }

  return (
    <>
      <Button size="small" variant="primary" onClick={openModal}>
        {deltaker.kanEndres ? 'Behandle' : 'Avvis forslag'}
      </Button>
      {deltaker.kanEndres ? (
        <ModalController
          endringsType={modalType}
          open={modalOpen}
          onClose={handleCloseModal}
          onSuccess={handleEndringUtfort}
          pamelding={deltaker}
          forslag={forslag}
        />
      ) : (
        <>
          <AvvisModal
            forslag={forslag}
            open={modalOpen}
            onSend={handleEndringUtfort}
            onClose={handleCloseModal}
          />
          <Alert size="small" inline variant="info" className="w-fit">
            Deltakelsen kan ikke endres
          </Alert>
        </>
      )}
    </>
  )
}
