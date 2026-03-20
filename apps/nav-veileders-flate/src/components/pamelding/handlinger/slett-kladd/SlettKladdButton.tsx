import { TrashIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'
import { useState } from 'react'
import { SlettKladdModal } from './SlettKladdModal.tsx'
import { usePameldingFormContext } from '../../PameldingFormContext.tsx'

export const SlettKladdButton = () => {
  const { disabled } = usePameldingFormContext()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <Button
        variant="tertiary"
        size="small"
        onClick={() => setModalOpen(true)}
        icon={<TrashIcon aria-hidden />}
        disabled={disabled}
        type="button"
      >
        Slett kladd
      </Button>

      <SlettKladdModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
