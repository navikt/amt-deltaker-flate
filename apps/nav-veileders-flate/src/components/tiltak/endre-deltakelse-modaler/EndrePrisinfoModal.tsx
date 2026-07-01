import {
  BegrunnelseInput,
  EndreDeltakelseType,
  useBegrunnelse
} from 'deltaker-flate-common'
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
  pamelding: DeltakerResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: DeltakerResponse | null) => void
}

export const EndrePrisinfoModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: Props) => {
  const { enhetId } = useAppContext()
  const begrunnelse = useBegrunnelse(true)
  const defaultValues = generatePrisinformasjonDefaultValues(pamelding)
  const formSchema = createPrisinformasjonFormSchema()
  const formMethods = useForm<PrisinformasjonFormValues>({
    defaultValues,
    shouldFocusError: false
  })

  const validertRequest = () => {
    validerDeltakerKanEndres(pamelding)

    const parsed = formSchema.safeParse(formMethods.getValues())

    if (!parsed.success) {
      visValideringsfeil(formMethods, parsed.error.issues)
      return null
    }

    if (!begrunnelse.valider()) {
      return null
    }

    if (harIngenPrisinfoEndring(parsed.data, defaultValues)) {
      throw new Error(getFeilmeldingIngenEndring(false))
    }

    const endring: EndrePrisinfoRequest = {
      prisinformasjon: parsed.data.prisinformasjon,
      begrunnelse: begrunnelse.begrunnelse || null
    }

    return {
      deltakerId: pamelding.deltakerId,
      enhetId,
      body: endring
    }
  }

  return (
    <Endringsmodal
      open={open}
      endringstype={EndreDeltakelseType.ENDRE_PRISINFO}
      deltaker={pamelding}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endrePrisinfo}
      validertRequest={validertRequest}
      forslag={null}
    >
      <FormProvider {...formMethods}>
        <PameldingFormContextProvider>
          <PrisOgBetaling />
        </PameldingFormContextProvider>
      </FormProvider>

      <BegrunnelseInput
        type="obligatorisk"
        onChange={begrunnelse.handleChange}
        error={begrunnelse.error}
        disabled={!pamelding.erUnderOppfolging}
      />
    </Endringsmodal>
  )
}

const visValideringsfeil = (
  formMethods: ReturnType<typeof useForm<PrisinformasjonFormValues>>,
  issues: { path: PropertyKey[]; message: string }[]
) => {
  formMethods.clearErrors()
  issues.forEach((issue) => {
    const path = issue.path[0]
    if (typeof path === 'string') {
      formMethods.setError(path as never, {
        type: 'manual',
        message: issue.message
      })
    }
  })
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
