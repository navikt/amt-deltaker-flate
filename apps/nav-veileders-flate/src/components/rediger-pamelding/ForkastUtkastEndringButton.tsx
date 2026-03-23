import { TrashIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'
import { useState } from 'react'
import { usePameldingFormContext } from '../pamelding/PameldingFormContext.tsx'
import { ForkastUtkastEndringModal } from './ForkastUtkastEndringModal.tsx'

export const ForkastUtkastEndringButton = () => {
  const { disabled } = usePameldingFormContext()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        size="small"
        disabled={disabled}
        type="button"
        variant="secondary"
        icon={<TrashIcon aria-hidden />}
      >
        Forkast endring
      </Button>

      <ForkastUtkastEndringModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}
