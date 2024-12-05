import { Alert, Button } from '@navikt/ds-react'
import { usePameldingContext } from '../PameldingContext.tsx'
import { useState } from 'react'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { ModalController } from '../endre-deltakelse-modaler/ModalController.tsx'
import {
  Forslag,
  EndreDeltakelseType,
  getEndreDeltakelsesType
} from 'deltaker-flate-common'
import { AvvisForslagModal } from '../modal/AvvisForslagModal.tsx'

interface Props {
  forslag: Forslag
}

export const BehandleForslagKnapper = ({ forslag }: Props) => {
  const { pamelding: deltaker, setPamelding } = usePameldingContext()
  const [modalType, setModalType] = useState<EndreDeltakelseType | null>(null)
  const [behandleModalOpen, setBehandleModalOpen] = useState(false)
  const [avvisModalOpen, setAvvisModalOpen] = useState(false)

  const handleCloseBehandleModal = () => {
    setModalType(null)
    setBehandleModalOpen(false)
  }

  const handleEndringUtfort = (
    oppdatertPamelding: PameldingResponse | null
  ) => {
    handleCloseBehandleModal()
    setAvvisModalOpen(false)
    if (oppdatertPamelding) {
      setPamelding(oppdatertPamelding)
    }
  }

  return (
    <>
      {deltaker.kanEndres && (
        <Button
          size="small"
          variant="primary"
          className="ml-4"
          onClick={() => {
            const type = getEndreDeltakelsesType(forslag)
            setModalType(type)
            setBehandleModalOpen(true)
          }}
        >
          Godkjenn/endre
        </Button>
      )}
      <Button
        size="small"
        variant="secondary"
        className="ml-4"
        onClick={() => setAvvisModalOpen(true)}
      >
        Avvis forslag
      </Button>
      {!deltaker.kanEndres && (
        <Alert size="small" inline variant="info" className="w-fit ml-2">
          Deltakelsen kan ikke endres
        </Alert>
      )}

      <ModalController
        endringsType={modalType}
        open={behandleModalOpen}
        onClose={handleCloseBehandleModal}
        onSuccess={handleEndringUtfort}
        pamelding={deltaker}
        forslag={forslag}
      />
      <AvvisForslagModal
        forslag={forslag}
        open={avvisModalOpen}
        erUnderOppfolging={deltaker.erUnderOppfolging}
        onSend={handleEndringUtfort}
        onClose={() => setAvvisModalOpen(false)}
      />
    </>
  )
}
