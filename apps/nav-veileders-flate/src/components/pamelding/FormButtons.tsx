import { LocalAlert } from '@navikt/ds-react'
import { DeltakerStatusType } from 'deltaker-flate-common'
import { oppdaterKladd as oppdaterEnkeltplassKladd } from '../../api/api-enkeltplass.ts'
import { oppdaterKladd } from '../../api/api.ts'
import { DeltakerResponse } from '../../api/data/deltaker.ts'
import {
  EnkeltplassKladdRequest,
  KladdRequest
} from '../../api/data/kladd-request.ts'
import { PameldingEnkeltplassFormValues } from '../../model/PameldingEnkeltplassFormValues.ts'
import { PameldingFormValues } from '../../model/PameldingFormValues.ts'
import {
  erEnkeltPlass,
  formToEnkeltplassKladdRequest
} from '../../utils/pamelding-enkeltplass.ts'
import { formToKladdRequest } from '../../utils/pamelding-form-utils.ts'
import { ForkastUtkastEndringButton } from '../rediger-pamelding/ForkastUtkastEndringButton.tsx'
import { LagreUtkastButton } from '../rediger-pamelding/LagreUtkastButton.tsx'
import { useDeltakerContext } from '../tiltak/DeltakerContext.tsx'
import { DelUtkastButton } from './handlinger/del-utkast/DelUtkastButton.tsx'
import { MeldPaDirekteButton } from './handlinger/meld-pa-direkte/MeldPaDirekteButton.tsx'
import { SlettKladdButton } from './handlinger/slett-kladd/SlettKladdButton.tsx'
import { KladdLagring } from './KladdLagring.tsx'
import { usePameldingFormContext } from './PameldingFormContext.tsx'

interface Props {
  className?: string
}

export const PameldingFormButtons = ({ className }: Props) => {
  const { deltaker } = useDeltakerContext()
  const { error } = usePameldingFormContext()
  const kanDeleUtkast = deltaker.digitalBruker
  const harAdresse = deltaker.harAdresse
  const status = deltaker.status.type

  return (
    <div className={`flex flex-col gap-8 ${className ?? ''}`}>
      {!kanDeleUtkast && harAdresse && (
        <LocalAlert status="warning" size="small">
          <LocalAlert.Header>
            <LocalAlert.Title>Kan ikke kontaktes digitalt</LocalAlert.Title>
          </LocalAlert.Header>
        </LocalAlert>
      )}

      <div className="flex flex-col gap-4">
        {!kanDeleUtkast && !harAdresse && (
          <LocalAlert status="warning" size="small">
            <LocalAlert.Header>
              <LocalAlert.Title>
                Personen har ingen registrert kontaktadresse og er reservert mot
                digital kommunikasjon
              </LocalAlert.Title>
            </LocalAlert.Header>
            <LocalAlert.Content>
              Personen vil derfor ikke motta et varsel, og brevet som
              journalføres i Gosys må skrives ut og leveres på en annen måte.
            </LocalAlert.Content>
          </LocalAlert>
        )}

        {status === DeltakerStatusType.KLADD && (
          <LagreKladd pamelding={deltaker} />
        )}

        {error && (
          <LocalAlert size="small" status="error">
            <LocalAlert.Header>
              <LocalAlert.Title>{error}</LocalAlert.Title>
            </LocalAlert.Header>
          </LocalAlert>
        )}

        {status === DeltakerStatusType.UTKAST_TIL_PAMELDING && (
          <div className="flex gap-4 items-end">
            <LagreUtkastButton />
            <ForkastUtkastEndringButton />
          </div>
        )}

        {status === DeltakerStatusType.KLADD && (
          <div className="flex gap-4">
            {kanDeleUtkast && <DelUtkastButton />}
            <MeldPaDirekteButton variant="secondary" />
            <SlettKladdButton />
          </div>
        )}
      </div>
    </div>
  )
}

interface LagreKladdProps {
  pamelding: DeltakerResponse
}

const LagreKladd = ({ pamelding }: LagreKladdProps) => {
  if (erEnkeltPlass(pamelding)) {
    return (
      <KladdLagring<PameldingEnkeltplassFormValues, EnkeltplassKladdRequest>
        oppdaterKladd={oppdaterEnkeltplassKladd}
        formToKladdRequest={formToEnkeltplassKladdRequest}
      />
    )
  }
  return (
    <KladdLagring<PameldingFormValues, KladdRequest>
      oppdaterKladd={oppdaterKladd}
      formToKladdRequest={(data) => formToKladdRequest(pamelding, data)}
    />
  )
}
