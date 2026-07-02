import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Loader } from '@navikt/ds-react'
import { useQuery } from '@tanstack/react-query'
import { EndreDeltakelseType } from 'deltaker-flate-common'
import { FormProvider, useForm } from 'react-hook-form'
import { getKodeverk } from '../../../api/api-enkeltplass.ts'
import { endreInnholdKodeverk } from '../../../api/api.ts'
import { DeltakerResponse } from '../../../api/data/deltaker.ts'
import { EndreInnholdKodeverkRequest } from '../../../api/data/endre-deltakelse-request.ts'
import { useAppContext } from '../../../AppContext.tsx'
import {
  createOpplaringKategoriseringFormSchema,
  generateKodeverkDefaultValues,
  OpplaringKategoriseringFormValues
} from '../../../model/OpplaringKategoriseringFormValues.ts'
import { getFeilmeldingIngenEndring } from '../../../utils/displayText.ts'
import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'
import { OpplaringKategoriseringValg } from '../../pamelding/enkeltplass/OpplaringKategoriseringValg.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { InnholdBeskrivelse } from '../../pamelding/enkeltplass/InnholdBeskrivelse.tsx'
import { PameldingFormContextProvider } from '../../pamelding/PameldingFormContext.tsx'

interface Props {
  deltaker: DeltakerResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertDeltaker: DeltakerResponse | null) => void
}

export const EndreInnholdOpplaringKategoriseringModal = ({
  deltaker,
  open,
  onClose,
  onSuccess
}: Props) => {
  const { enhetId } = useAppContext()
  const { data: kodeverk, isLoading } = useQuery({
    queryKey: ['kodeverk-endring', deltaker.deltakerId, enhetId],
    queryFn: () => getKodeverk(deltaker.deltakerId, enhetId),
    throwOnError: false
  })

  const defaultValues = generateKodeverkDefaultValues(deltaker)
  const formMethods = useForm<OpplaringKategoriseringFormValues>({
    defaultValues,
    resolver: zodResolver(createOpplaringKategoriseringFormSchema(kodeverk)),
    shouldFocusError: false
  })

  const validertRequest = async () => {
    validerDeltakerKanEndres(deltaker)

    if (!kodeverk) {
      return null
    }

    let formData: OpplaringKategoriseringFormValues | undefined
    await formMethods.handleSubmit(
      (data) => {
        formData = data
      },
      () => undefined
    )()

    if (!formData) {
      return null
    }

    if (harIngenKodeverkEndring(formData, defaultValues)) {
      throw new Error(getFeilmeldingIngenEndring(false))
    }

    const endring: EndreInnholdKodeverkRequest = {
      opplaringKategoriseringValg: formData.kategoriseringValg,
      sertifiseringValg: formData.sertifiseringValg,
      beskrivelse: formData.innhold
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
      endringstype={EndreDeltakelseType.ENDRE_INNHOLD_KODEVERK}
      deltaker={deltaker}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreInnholdKodeverk}
      validertRequest={validertRequest}
      forslag={null}
    >
      <FormProvider {...formMethods}>
        <PameldingFormContextProvider>
          {isLoading && (
            <div className="mt-2 mb-2">
              <Loader size="xlarge" title="Henter kodeverk..." />
            </div>
          )}

          {!isLoading && !kodeverk && (
            <Alert variant="error" size="small" className="mb-2">
              Kunne ikke hente kodeverk.
            </Alert>
          )}

          {!isLoading && kodeverk && (
            <OpplaringKategoriseringValg kodeverk={kodeverk} />
          )}

          {!isLoading && kodeverk && <InnholdBeskrivelse className="mt-8" />}
        </PameldingFormContextProvider>
      </FormProvider>
    </Endringsmodal>
  )
}

const harIngenKodeverkEndring = (
  data: OpplaringKategoriseringFormValues,
  defaultValues: OpplaringKategoriseringFormValues
) => {
  return (
    JSON.stringify(data.kategoriseringValg) ===
      JSON.stringify(defaultValues.kategoriseringValg) &&
    JSON.stringify(data.sertifiseringValg) ===
      JSON.stringify(defaultValues.sertifiseringValg) &&
    data.innhold === defaultValues.innhold
  )
}
