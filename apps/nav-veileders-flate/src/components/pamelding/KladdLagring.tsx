import { Detail, ErrorMessage, Loader } from '@navikt/ds-react'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { useEffect, useState } from 'react'
import { FieldValues, useFormContext } from 'react-hook-form'
import { useAppContext } from '../../AppContext.tsx'
import { debounce } from '../../utils/debounce.ts'
import { useDeltakerContext } from '../tiltak/DeltakerContext.tsx'

interface Props<TFormValues extends FieldValues, TKladdRequest> {
  oppdaterKladd: (
    deltakerId: string,
    enhetId: string,
    request: TKladdRequest
  ) => Promise<number>
  formToKladdRequest: (data: TFormValues) => TKladdRequest
}

export const KladdLagring = <TFormValues extends FieldValues, TKladdRequest>({
  oppdaterKladd,
  formToKladdRequest
}: Props<TFormValues, TKladdRequest>) => {
  const { enhetId } = useAppContext()
  const { deltaker } = useDeltakerContext()
  const [storedKladd, setStoredKladd] = useState<TKladdRequest>()
  const { watch, getValues } = useFormContext<TFormValues>()

  const { state: saveKladdState, doFetch: fetchSaveKladd } =
    useDeferredFetch(oppdaterKladd)

  const watchedFields = watch()

  const onFormChanged = (values: TFormValues) => {
    const newKladd = formToKladdRequest(values)

    if (JSON.stringify(storedKladd) !== JSON.stringify(newKladd)) {
      setStoredKladd(newKladd)
      fetchSaveKladd(deltaker.deltakerId, enhetId, newKladd)
    }
  }

  useEffect(() => {
    debounce(() => {
      onFormChanged(getValues())
    }, 2000)
  }, [watchedFields])

  if (saveKladdState === DeferredFetchState.LOADING) {
    return (
      <Detail>
        <Loader size="small" title="Lagrer" /> Lagrer kladd...
      </Detail>
    )
  }
  if (saveKladdState === DeferredFetchState.RESOLVED) {
    return <Detail>Kladd lagret</Detail>
  }
  if (saveKladdState === DeferredFetchState.ERROR) {
    return <ErrorMessage size="small">Lagring feilet</ErrorMessage>
  }

  return <></>
}
