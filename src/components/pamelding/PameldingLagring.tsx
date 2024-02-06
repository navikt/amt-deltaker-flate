import { DeferredFetchState, useDeferredFetch } from '../../hooks/useDeferredFetch.ts'
import { useFormContext } from 'react-hook-form'
import { PameldingFormValues } from '../../model/PameldingFormValues.ts'
import { useEffect, useState } from 'react'
import { debounce } from '../../utils/debounce.ts'
import { useAppContext } from '../../AppContext.tsx'
import { KladdRequest } from '../../api/data/kladd-request.ts'
import { oppdaterKladd } from '../../api/api.ts'
import { generateMalFromResponse } from '../../utils/pamelding-form-utils.ts'
import { PameldingResponse } from '../../api/data/pamelding.ts'
import { Loader } from '@navikt/ds-react'

interface Props {
  pamelding: PameldingResponse
}

export const PameldingLagring = ({pamelding}: Props) => {

  const { enhetId } = useAppContext()
  const [storedKladd, setStoredKladd] = useState<KladdRequest>()
  const { watch, getValues } = useFormContext<PameldingFormValues>()

  const {
    state: saveKladdState,
    doFetch: fetchSaveKladd
  } = useDeferredFetch(oppdaterKladd)

  const watchedFields = watch()

  const formToKladdRequest = (data: PameldingFormValues): KladdRequest => {
    return {
      mal: generateMalFromResponse(pamelding, data.valgteMal, data.malAnnetBeskrivelse),
      bakgrunnsinformasjon: data.bakgrunnsinformasjon,
      deltakelsesprosent: data.deltakelsesprosent,
      dagerPerUke: data.dagerPerUke
    }
  }

  const onFormChanged = (values: PameldingFormValues) => {
    const newKladd = formToKladdRequest(values)

    if(JSON.stringify(storedKladd) !== JSON.stringify(newKladd)) {
      setStoredKladd(newKladd)
      fetchSaveKladd(
        pamelding.deltakerId,
        enhetId,
        formToKladdRequest(values)
      )
    }
  }

  useEffect(() => {
    debounce(() => {
      onFormChanged(getValues())
    }, 2000)
  }, [watchedFields])

  if(saveKladdState === DeferredFetchState.LOADING) {
    return <div>
      <Loader size="small" title="Saving" /> Lagrer kladd...
    </div>
  }
  if(saveKladdState === DeferredFetchState.RESOLVED) {
    return <div>Kladd lagret</div>
  }
  if (saveKladdState === DeferredFetchState.ERROR) {
    return <div>Kunne ikke autolagre kladd</div>
  }

  return <></>
}
