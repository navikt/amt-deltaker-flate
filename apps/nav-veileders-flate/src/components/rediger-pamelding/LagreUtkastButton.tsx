import { Button, ErrorMessage } from '@navikt/ds-react'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { oppdaterUtkast as oppdaterUtkastEnkeltplass } from '../../api/api-enkeltplass.ts'
import { useAppContext } from '../../AppContext.tsx'
import { DeltakerResponse } from '../../api/data/pamelding.ts'
import { PameldingEnkeltplassFormValues } from '../../model/PameldingEnkeltplassFormValues.ts'
import { PameldingFormValues } from '../../model/PameldingFormValues.ts'
import { formToEnkeltplassRequest } from '../../utils/kladd.ts'
import { usePameldingContext } from '../tiltak/PameldingContext.tsx'
import { usePameldingFormContext } from '../pamelding/PameldingFormContext.tsx'
import { oppdaterUtkast } from '../../api/api.ts'
import { generatePameldingRequestFromForm } from '../../utils/pamelding-form-utils.ts'

export const LagreUtkastButton = () => {
  const { enhetId } = useAppContext()
  const { pamelding, setPamelding } = usePameldingContext()
  const { disabled, setRedigerUtkast, setDisabled } = usePameldingFormContext()

  const { handleSubmit, getValues } = useFormContext<
    PameldingEnkeltplassFormValues | PameldingFormValues
  >()

  const doDelUtkast = async (
    deltakerId: string,
    enhetId: string
  ): Promise<DeltakerResponse> => {
    if (pamelding.deltakerliste.erEnkeltplassUtenRammeavtale) {
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
  }, [fetchState])

  return (
    <>
      <Button
        onClick={handleSubmit(() => {
          doFetchDelUtkast(pamelding.deltakerId, enhetId).then(
            (newPamelding) => {
              if (newPamelding) setPamelding(newPamelding)
              setRedigerUtkast(false)
            }
          )
        })}
        size="small"
        disabled={disabled}
        type="button"
        variant="primary"
        loading={fetchState === DeferredFetchState.LOADING}
      >
        Lagre og del endring
      </Button>

      <ErrorMessage size="small">Lagring feilet. Prøv igjen</ErrorMessage>
    </>
  )
}
