import { Button } from '@navikt/ds-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { DelUtkastModalEnkeltPlass } from './DelUtkastModalEnkeltPlass.tsx'
import { usePameldingFormContext } from '../../PameldingFormContext.tsx'
import { usePameldingContext } from '../../../tiltak/PameldingContext.tsx'
import { erEnkeltPlassUtenRammeavtale } from '../../../../utils/pamelding-form-utils.ts'
import { PameldingEnkeltplassFormValues } from '../../../../model/PameldingEnkeltplassFormValues.ts'
import { DelUtkastModal } from './DelUtkastModal.tsx'
import { PameldingFormValues } from '../../../../model/PameldingFormValues.ts'

export const DelUtkastButton = () => {
  const { disabled } = usePameldingFormContext()
  const { pamelding } = usePameldingContext()
  const [modalOpen, setModalOpen] = useState(false)

  const erEnkeltplass = erEnkeltPlassUtenRammeavtale(pamelding)
  const { handleSubmit } = useFormContext<
    PameldingFormValues | PameldingEnkeltplassFormValues
  >()

  return (
    <>
      <Button
        onClick={handleSubmit(() => setModalOpen(true))}
        size="small"
        disabled={disabled}
        type="button"
      >
        Del utkast med bruker
      </Button>

      {erEnkeltplass && (
        <DelUtkastModalEnkeltPlass
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
      {!erEnkeltplass && (
        <DelUtkastModal open={modalOpen} onClose={() => setModalOpen(false)} />
      )}
    </>
  )
}
