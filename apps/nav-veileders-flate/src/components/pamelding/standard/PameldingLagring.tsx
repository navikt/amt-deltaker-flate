import { INNHOLD_TYPE_ANNET } from 'deltaker-flate-common'
import { useCallback } from 'react'
import { oppdaterKladd } from '../../../api/api.ts'
import { KladdRequest } from '../../../api/data/kladd-request.ts'
import { DeltakerResponse } from '../../../api/data/pamelding.ts'
import { PameldingFormValues } from '../../../model/PameldingFormValues.ts'
import { generateInnholdFromResponse } from '../../../utils/pamelding-form-utils.ts'
import { KladdLagring } from '../KladdLagring.tsx'

interface Props {
  pamelding: DeltakerResponse
}

export const PameldingLagring = ({ pamelding }: Props) => {
  const formToKladdRequest = useCallback(
    (data: PameldingFormValues): KladdRequest => {
      const innhold = generateInnholdFromResponse(
        pamelding,
        data.valgteInnhold,
        data.innholdAnnetBeskrivelse,
        data.innholdsTekst
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
    },
    [pamelding]
  )

  return (
    <KladdLagring<PameldingFormValues, KladdRequest>
      oppdaterKladd={oppdaterKladd}
      formToKladdRequest={formToKladdRequest}
    />
  )
}
