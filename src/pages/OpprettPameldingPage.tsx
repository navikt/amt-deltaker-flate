import { PameldingResponse } from '../api/data/pamelding.ts'

import { PameldingHeader } from '../components/pamelding/PameldingHeader.tsx'
import { PameldingForm } from '../components/pamelding/PameldingForm.tsx'
import { PameldingFormValues } from '../model/PameldingFormValues.ts'
import { DeferredFetchState, useDeferredFetch } from '../hooks/useDeferredFetch.ts'
import { oppdaterKladd } from '../api/api.ts'
import { useAppContext } from '../AppContext.tsx'
import { KladdRequest } from '../api/data/kladd-request.ts'
import { generateMalFromResponse } from '../utils/pamelding-form-utils.ts'
import { useState } from 'react'
import { Loader } from '@navikt/ds-react'

export interface OpprettPameldingPageProps {
  pamelding: PameldingResponse
}

export const OpprettPameldingPage = ({ pamelding }: OpprettPameldingPageProps) => {
  const { enhetId } = useAppContext()
  const [storedKladd, setStoredKladd] = useState<KladdRequest>()

  const {
    state: saveKladdState,
    // error: saveKladdError,
    doFetch: fetchSaveKladd
  } = useDeferredFetch(oppdaterKladd)

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

  const SistLagretKladdContainer = () => {
    if(saveKladdState === DeferredFetchState.LOADING) {
      return <div>
        Lagrer kladd... <Loader size="small" title="Saving" />
      </div>
    }
    if(saveKladdState === DeferredFetchState.RESOLVED || DeferredFetchState.NOT_STARTED) {
      return <div>Lagret</div>
    }
    if(saveKladdState === DeferredFetchState.ERROR) {
      return <div>Kunne ikke autolagre kladd</div>
    }
  }

  return (
    <div className="m-4">
      <PameldingHeader
        tiltakstype={pamelding.deltakerliste.tiltakstype}
        arrangorNavn={pamelding.deltakerliste.arrangorNavn}
      />

      <PameldingForm
        className="p-8 bg-white"
        pamelding={pamelding}
        onFormChanged={onFormChanged}/>

      <SistLagretKladdContainer/>
    </div>
  )
}
