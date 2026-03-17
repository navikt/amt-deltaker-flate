import { LocalAlert } from '@navikt/ds-react'
import { DeltakerStatusType } from 'deltaker-flate-common'
import { oppdaterKladd } from '../../api/api-enkeltplass.ts'
import { EnkeltplassKladdRequest } from '../../api/data/kladd-request.ts'
import { PameldingEnkeltplassFormValues } from '../../model/PameldingEnkeltplassFormValues.ts'
import { formToEnkeltplassKladdRequest } from '../../utils/kladd.ts'
import { KladdLagring } from '../KladdLagring.tsx'
import { usePameldingContext } from '../tiltak/PameldingContext.tsx'
import { DelUtkastButton } from './del-utkast/DelUtkastButton.tsx'
import { MeldPaDirekteButton } from './meld-pa-direkte/MeldPaDirekteButton.tsx'
import { SlettKladdButton } from './slett-kladd/SlettKladdButton.tsx'

interface Props {
  className?: string
}

export const PameldingFormButtons = ({ className }: Props) => {
  const { pamelding } = usePameldingContext()
  const kanDeleUtkast = pamelding.digitalBruker
  const harAdresse = pamelding.harAdresse

  return (
    <div className={`flex flex-col gap-8 ${className ?? ''}`}>
      {!kanDeleUtkast && harAdresse && (
        <LocalAlert status="warning" size="small">
          <LocalAlert.Header>
            <LocalAlert.Title>Kan ikke kontaktes digitalt</LocalAlert.Title>
          </LocalAlert.Header>
        </LocalAlert>
      )}

      {!kanDeleUtkast && !harAdresse && (
        <LocalAlert status="warning" size="small">
          <LocalAlert.Header>
            <LocalAlert.Title>
              Personen har ingen registrert kontaktadresse og er reservert mot
              digital kommunikasjon
            </LocalAlert.Title>
          </LocalAlert.Header>
          <LocalAlert.Content>
            Personen vil derfor ikke motta et varsel, og brevet som journalføres
            i Gosys må skrives ut og leveres på en annen måte.
          </LocalAlert.Content>
        </LocalAlert>
      )}

      {pamelding.status.type === DeltakerStatusType.KLADD && (
        <div>
          <KladdLagring<PameldingEnkeltplassFormValues, EnkeltplassKladdRequest>
            pamelding={pamelding}
            oppdaterKladd={oppdaterKladd}
            formToKladdRequest={formToEnkeltplassKladdRequest}
          />
        </div>
      )}

      <div className="flex gap-4">
        {kanDeleUtkast && <DelUtkastButton />}
        <MeldPaDirekteButton />
        <SlettKladdButton />
      </div>
    </div>
  )
}
