import {
  BegrunnelseInput,
  DeltakerStatusType,
  EndreDeltakelseType,
  useBegrunnelse
} from 'deltaker-flate-common'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { endrePrisinfo } from '../../../api/api.ts'
import { DeltakerResponse } from '../../../api/data/deltaker.ts'
import { EndrePrisinfoRequest } from '../../../api/data/endre-deltakelse-request.ts'
import { useAppContext } from '../../../AppContext.tsx'
import {
  createPrisinformasjonFormSchema,
  generatePrisinformasjonDefaultValues,
  PrisinformasjonFormValues
} from '../../../model/PrisinformasjonFormValues.ts'
import { getFeilmeldingIngenEndring } from '../../../utils/displayText.ts'
import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'
import { PameldingFormContextProvider } from '../../pamelding/PameldingFormContext.tsx'
import { PrisOgBetaling } from '../../pamelding/enkeltplass/PrisOgBetaling.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'

interface Props {
  deltaker: DeltakerResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertDeltaker: DeltakerResponse | null) => void
}

// TODO må håndtere å åpne et eksisterende "forslag"
export const EndrePrisinfoModal = ({
  deltaker,
  open,
  onClose,
  onSuccess
}: Props) => {
  const { enhetId } = useAppContext()
  const begrunnelse = useBegrunnelse(false)
  const laasPristype = deltaker.status.type !== DeltakerStatusType.SOKT_INN

  const defaultValues = generatePrisinformasjonDefaultValues(deltaker)
  const formMethods = useForm<PrisinformasjonFormValues>({
    defaultValues,
    resolver: zodResolver(createPrisinformasjonFormSchema()),
    shouldFocusError: false
  })

  const validertRequest = async () => {
    validerDeltakerKanEndres(deltaker)

    let formData: PrisinformasjonFormValues | undefined
    await formMethods.handleSubmit(
      (data) => {
        formData = data
      },
      () => undefined
    )()

    if (!formData || !begrunnelse.valider()) {
      return null
    }

    if (harIngenPrisinfoEndring(formData, defaultValues)) {
      throw new Error(getFeilmeldingIngenEndring(false))
    }

    const endring: EndrePrisinfoRequest = {
      prisinformasjon: formData.prisinformasjon,
      begrunnelse: begrunnelse.begrunnelse
    }

    return {
      deltakerId: deltaker.deltakerId,
      enhetId,
      body: endring
    }
  }

  return (
    <Endringsmodal
      open={open}
      endringstype={EndreDeltakelseType.ENDRE_PRISINFO}
      deltaker={deltaker}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endrePrisinfo}
      validertRequest={validertRequest}
      forslag={null}
    >
      <FormProvider {...formMethods}>
        <PameldingFormContextProvider>
          <PrisOgBetaling laasPristype={laasPristype} />
        </PameldingFormContextProvider>
      </FormProvider>

      <BegrunnelseInput
        type="obligatorisk"
        onChange={begrunnelse.handleChange}
        error={begrunnelse.error}
        disabled={!deltaker.erUnderOppfolging}
      />
    </Endringsmodal>
  )
}

const harIngenPrisinfoEndring = (
  data: PrisinformasjonFormValues,
  defaultValues: PrisinformasjonFormValues
) => {
  return (
    data.pristype === defaultValues.pristype &&
    JSON.stringify(data.prisinformasjon) ===
      JSON.stringify(defaultValues.prisinformasjon)
  )
}
