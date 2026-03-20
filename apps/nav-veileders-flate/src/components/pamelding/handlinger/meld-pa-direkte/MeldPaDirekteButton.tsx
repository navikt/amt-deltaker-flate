import { Button } from '@navikt/ds-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { MeldPaDirekteModalEnkeltPlass as MeldPaDirekteModalEnkeltPlass } from './MeldPaDirekteModalEnkeltPlass.tsx'
import { usePameldingFormContext } from '../../PameldingFormContext.tsx'
import { erEnkeltPlassUtenRammeavtale } from '../../../../utils/pamelding-form-utils.ts'
import { usePameldingContext } from '../../../tiltak/PameldingContext.tsx'
import { MeldPaDirekteModal } from './MeldPaDirekteModal.tsx'
import { PameldingEnkeltplassFormValues } from '../../../../model/PameldingEnkeltplassFormValues.ts'
import { PameldingFormValues } from '../../../../model/PameldingFormValues.ts'

interface Props {
  name?: string
}

export const MeldPaDirekteButton = ({ name }: Props) => {
  const { disabled } = usePameldingFormContext()
  const { pamelding } = usePameldingContext()

  const [modalOpen, setModalOpen] = useState(false)

  const erEnkeltplass = erEnkeltPlassUtenRammeavtale(pamelding)
  const { handleSubmit } = erEnkeltplass
    ? useFormContext<PameldingEnkeltplassFormValues>()
    : useFormContext<PameldingFormValues>()

  return (
    <>
      <Button
        onClick={handleSubmit(() => setModalOpen(true))}
        size="small"
        disabled={disabled}
        type="button"
        variant="secondary"
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
