import { LocalAlert } from '@navikt/ds-react'
import { DeltakerStatusType } from 'deltaker-flate-common'
import { oppdaterKladd as oppdaterEnkeltplassKladd } from '../../api/api-enkeltplass.ts'
import { oppdaterKladd } from '../../api/api.ts'
import {
  EnkeltplassKladdRequest,
  KladdRequest
} from '../../api/data/kladd-request.ts'
import { DeltakerResponse } from '../../api/data/deltaker.ts'
import { PameldingEnkeltplassFormValues } from '../../model/PameldingEnkeltplassFormValues.ts'
import { PameldingFormValues } from '../../model/PameldingFormValues.ts'
import {
  erEnkeltPlass,
  formToEnkeltplassRequest
} from '../../utils/pamelding-ekeltplass.ts'
import { formToKladdRequest } from '../../utils/pamelding-form-utils.ts'
import { ForkastUtkastEndringButton } from '../rediger-pamelding/ForkastUtkastEndringButton.tsx'
import { LagreUtkastButton } from '../rediger-pamelding/LagreUtkastButton.tsx'
import { usePameldingContext } from '../tiltak/PameldingContext.tsx'
import { DelUtkastButton } from './handlinger/del-utkast/DelUtkastButton.tsx'
import { MeldPaDirekteButton } from './handlinger/meld-pa-direkte/MeldPaDirekteButton.tsx'
import { SlettKladdButton } from './handlinger/slett-kladd/SlettKladdButton.tsx'
import { KladdLagring } from './KladdLagring.tsx'
import { usePameldingFormContext } from './PameldingFormContext.tsx'

interface Props {
  className?: string
}

export const PameldingFormButtons = ({ className }: Props) => {
  const { pamelding } = usePameldingContext()
  const { error } = usePameldingFormContext()
  const kanDeleUtkast = pamelding.digitalBruker
  const harAdresse = pamelding.harAdresse
  const status = pamelding.status.type

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
          <LagreKladd pamelding={pamelding} />
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
        formToKladdRequest={formToEnkeltplassRequest}
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
