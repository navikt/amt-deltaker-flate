import { Textarea } from '@navikt/ds-react'
import { EndreDeltakelseType } from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseBakgrunnsinfo } from '../../../api/api.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { BAKGRUNNSINFORMASJON_MAKS_TEGN } from '../../../model/PameldingFormValues.ts'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'

interface EndreBakgrunnsinfoModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const EndreBakgrunnsinfoModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: EndreBakgrunnsinfoModalProps) => {
  const { enhetId } = useAppContext()
  const [bakgrunnsinformasjon, setBakgrunnsinformasjon] = useState<
    string | null
  >(pamelding.bakgrunnsinformasjon)

  const validertRequest = () => {
    return {
      deltakerId: pamelding.deltakerId,
      enhetId,
      body: {
        bakgrunnsinformasjon
      }
    }
  }

  return (
    <Endringsmodal
      open={open}
      endringstype={EndreDeltakelseType.ENDRE_BAKGRUNNSINFO}
      digitalBruker={pamelding.digitalBruker}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseBakgrunnsinfo}
      validertRequest={validertRequest}
      forslag={null}
    >
      <Textarea
        onChange={(e) => {
          setBakgrunnsinformasjon(e.target.value)
        }}
        label="Er det noe mer dere ønsker å informere arrangøren om?"
        description="Er det noe rundt personens behov eller situasjon som kan påvirke deltakelsen på tiltaket?"
        value={bakgrunnsinformasjon ?? ''}
        maxLength={BAKGRUNNSINFORMASJON_MAKS_TEGN}
        id="bakgrunnsinformasjon"
        size="small"
        aria-label={'Bagrunnsinfo'}
      />
    </Endringsmodal>
  )
}
