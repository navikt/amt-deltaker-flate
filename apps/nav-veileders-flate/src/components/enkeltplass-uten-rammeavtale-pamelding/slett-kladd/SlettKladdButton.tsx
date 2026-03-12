import { TrashIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'
import { useState } from 'react'
import { SlettKlassModal } from './SlettKlassModal.tsx'

interface Props {
  disabled?: boolean
}

export const SlettKladdButton = ({ disabled }: Props) => {
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

      <SlettKlassModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
