import { Button } from '@navikt/ds-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { MeldPaDirekteModalEnkeltPlass as MeldPaDirekteModalEnkeltPlass } from './MeldPaDirekteModalEnkeltPlass.tsx'
import { usePameldingFormContext } from '../../PameldingFormContext.tsx'
import { usePameldingContext } from '../../../tiltak/PameldingContext.tsx'
import { MeldPaDirekteModal } from './MeldPaDirekteModal.tsx'
import { PameldingEnkeltplassFormValues } from '../../../../model/PameldingEnkeltplassFormValues.ts'
import { PameldingFormValues } from '../../../../model/PameldingFormValues.ts'
import { erEnkeltPlassUtenRammeavtale } from '../../../../utils/pamelding-ekeltplass.ts'

interface Props {
  name?: string
  variant: 'primary' | 'secondary'
}

export const MeldPaDirekteButton = ({ name, variant }: Props) => {
  const { disabled } = usePameldingFormContext()
  const { pamelding } = usePameldingContext()

  const [modalOpen, setModalOpen] = useState(false)

  const erEnkeltplass = erEnkeltPlassUtenRammeavtale(pamelding)

  const formContext = useFormContext<
    PameldingEnkeltplassFormValues | PameldingFormValues
  >()

  const handleMeldPa = formContext
    ? formContext.handleSubmit(() => setModalOpen(true))
    : () => setModalOpen(true)

  return (
    <>
      <Button
        onClick={handleMeldPa}
        size="small"
        disabled={disabled}
        type="button"
        variant={variant}
      >
        {name || 'Meld på uten å dele utkast'}
      </Button>

      {erEnkeltplass && (
        <MeldPaDirekteModalEnkeltPlass
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
      {!erEnkeltplass && (
        <MeldPaDirekteModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}
