import { Button } from '@navikt/ds-react'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { oppdaterUtkast as oppdaterUtkastEnkeltplass } from '../../api/api-enkeltplass.ts'
import { oppdaterUtkast } from '../../api/api.ts'
import { DeltakerResponse } from '../../api/data/pamelding.ts'
import { useAppContext } from '../../AppContext.tsx'
import { PameldingEnkeltplassFormValues } from '../../model/PameldingEnkeltplassFormValues.ts'
import { PameldingFormValues } from '../../model/PameldingFormValues.ts'
import { formToEnkeltplassRequest } from '../../utils/pamelding-ekeltplass.ts'
import { generatePameldingRequestFromForm } from '../../utils/pamelding-form-utils.ts'
import { usePameldingFormContext } from '../pamelding/PameldingFormContext.tsx'
import { usePameldingContext } from '../tiltak/PameldingContext.tsx'

export const LagreUtkastButton = () => {
  const { enhetId } = useAppContext()
  const { pamelding, setPamelding } = usePameldingContext()
  const { disabled, setRedigerUtkast, setDisabled, setError } =
    usePameldingFormContext()

  const { handleSubmit, getValues } = useFormContext<
    PameldingEnkeltplassFormValues | PameldingFormValues
  >()

  const doDelUtkast = async (
    deltakerId: string,
    enhetId: string
  ): Promise<DeltakerResponse> => {
    if (pamelding.deltakerliste.erEnkeltplass) {
      return oppdaterUtkastEnkeltplass(
        deltakerId,
        enhetId,
        formToEnkeltplassRequest(getValues() as PameldingEnkeltplassFormValues)
      )
    }
    return oppdaterUtkast(
      deltakerId,
      enhetId,
      generatePameldingRequestFromForm(
        pamelding,
        getValues() as PameldingFormValues
      )
    )
  }

  const { state: fetchState, doFetch: doFetchDelUtkast } =
    useDeferredFetch(doDelUtkast)

  useEffect(() => {
    if (fetchState === DeferredFetchState.LOADING) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }

    if (fetchState === DeferredFetchState.ERROR) {
      setError('En feil oppsto ved lagring av utkast. Prøv igjen senere.')
    }
  }, [fetchState])

  return (
    <Button
      onClick={handleSubmit(() => {
        doFetchDelUtkast(pamelding.deltakerId, enhetId).then((newPamelding) => {
          if (newPamelding) setPamelding(newPamelding)
          setRedigerUtkast(false)
          setError(null)
        })
      })}
      size="small"
      disabled={disabled}
      type="button"
      variant="primary"
      loading={fetchState === DeferredFetchState.LOADING}
    >
      Lagre og del endring
    </Button>
  )
}
