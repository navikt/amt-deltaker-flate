import { Detail, ErrorMessage, Loader } from '@navikt/ds-react'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { useEffect, useRef, useState } from 'react'
import { FieldValues, useFormContext } from 'react-hook-form'
import { useAppContext } from '../../AppContext.tsx'
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
  const { watch, getValues } = useFormContext<TFormValues>()
  const [storedKladd, setStoredKladd] = useState<TKladdRequest>(() =>
    formToKladdRequest(getValues())
  )

  const { state: saveKladdState, doFetch: fetchSaveKladd } =
    useDeferredFetch(oppdaterKladd)

  const watchedFields = watch()
  const debounceRef = useRef<number | null>(null)

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current)
    }
    debounceRef.current = window.setTimeout(() => {
      const newKladd = formToKladdRequest(getValues())
      if (JSON.stringify(storedKladd) !== JSON.stringify(newKladd)) {
        setStoredKladd(newKladd)
        void fetchSaveKladd(deltaker.deltakerId, enhetId, newKladd)
      }
    }, 2000)

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current)
      }
    }
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
