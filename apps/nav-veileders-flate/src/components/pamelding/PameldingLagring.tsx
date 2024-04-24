import { Detail, ErrorMessage, Loader } from '@navikt/ds-react'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useAppContext } from '../../AppContext.tsx'
import { oppdaterKladd } from '../../api/api.ts'
import { KladdRequest } from '../../api/data/kladd-request.ts'
import { PameldingResponse } from '../../api/data/pamelding.ts'
import { PameldingFormValues } from '../../model/PameldingFormValues.ts'
import { debounce } from '../../utils/debounce.ts'
import { generateInnholdFromResponse } from '../../utils/pamelding-form-utils.ts'
import { INNHOLD_TYPE_ANNET } from '../../utils/utils.ts'

interface Props {
  pamelding: PameldingResponse
}

export const PameldingLagring = ({ pamelding }: Props) => {
  const { enhetId } = useAppContext()
  const [storedKladd, setStoredKladd] = useState<KladdRequest>()
  const { watch, getValues } = useFormContext<PameldingFormValues>()

  const { state: saveKladdState, doFetch: fetchSaveKladd } =
    useDeferredFetch(oppdaterKladd)

  const watchedFields = watch()

  const formToKladdRequest = (data: PameldingFormValues): KladdRequest => {
    const innhold = generateInnholdFromResponse(
      pamelding,
      data.valgteInnhold,
      data.innholdAnnetBeskrivelse
    )

    const innholdAnnet = innhold.find(
      (i) => i.innholdskode === INNHOLD_TYPE_ANNET
    )
    const korrigertInnhold = [
      ...innhold.filter((i) => i.innholdskode !== INNHOLD_TYPE_ANNET)
    ]

    if (innholdAnnet) {
      korrigertInnhold.push({
        innholdskode: INNHOLD_TYPE_ANNET,
        beskrivelse: innholdAnnet.beskrivelse || ''
      })
    }

    return {
      innhold: korrigertInnhold,
      bakgrunnsinformasjon: data.bakgrunnsinformasjon,
      deltakelsesprosent: data.deltakelsesprosent,
      dagerPerUke: data.dagerPerUke
    }
  }

  const onFormChanged = (values: PameldingFormValues) => {
    const newKladd = formToKladdRequest(values)

    if (JSON.stringify(storedKladd) !== JSON.stringify(newKladd)) {
      setStoredKladd(newKladd)
      fetchSaveKladd(pamelding.deltakerId, enhetId, newKladd)
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
