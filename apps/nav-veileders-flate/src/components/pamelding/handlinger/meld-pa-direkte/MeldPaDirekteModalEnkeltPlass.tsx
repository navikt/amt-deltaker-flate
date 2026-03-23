import { BodyLong, Button, Modal } from '@navikt/ds-react'
import {
  DeferredFetchState,
  DeltakerStatusType,
  hentTiltakNavnHosArrangorTekst,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { meldPaDirekteEnkeltplass } from '../../../../api/api-enkeltplass.ts'
import { useAppContext } from '../../../../AppContext.tsx'
import {
  DELTAKELSESOVERSIKT_LINK,
  useModiaLink
} from '../../../../hooks/useModiaLink.ts'
import { PameldingEnkeltplassFormValues } from '../../../../model/PameldingEnkeltplassFormValues.ts'
import { getDeltakerNavn } from '../../../../utils/displayText.ts'
import {
  formToEnkeltplassRequest,
  generateEnkeltplassPameldingRequest
} from '../../../../utils/pamelding-ekeltplass.ts'
import { ConfirmInfoCard } from '../../../ConfirmInfoCard.tsx'
import { usePameldingContext } from '../../../tiltak/PameldingContext.tsx'

interface Props {
  open: boolean
  onClose: () => void
}

export const MeldPaDirekteModalEnkeltPlass = ({ open, onClose }: Props) => {
  const { enhetId } = useAppContext()
  const { pamelding } = usePameldingContext()
  const formContext = useFormContext<PameldingEnkeltplassFormValues>()

  const deltakerNavn = getDeltakerNavn(pamelding)
  const { deltakerliste } = pamelding
  const erUtkast =
    pamelding.status.type === DeltakerStatusType.UTKAST_TIL_PAMELDING

  const [confirmed, setConfirmed] = useState(false)
  const [confirmError, setConfirmError] = useState<string | undefined>()

  const { doRedirect } = useModiaLink()
  const returnToFrontpageWithSuccessMessage = () => {
    doRedirect(DELTAKELSESOVERSIKT_LINK, {
      heading: 'Bruker er meldt på',
      body: `Påmeldt ${hentTiltakNavnHosArrangorTekst(pamelding.deltakerliste.tiltakskode, pamelding.deltakerliste.arrangorNavn)}.`
    })
  }

  const {
    state: fetchState,
    // error, // TODO vise feil
    doFetch: doFetchMeldPaDirekteEnkeltplass
  } = useDeferredFetch(
    meldPaDirekteEnkeltplass,
    erUtkast ? undefined : returnToFrontpageWithSuccessMessage
  )

  return (
    <Modal
      open={open}
      header={{
        heading: 'Meld på uten digital godkjenning av utkastet'
      }}
      onClose={onClose}
    >
      <Modal.Body>
        <ConfirmInfoCard
          title="Er personen informert?"
          checkboxLabel="Ja, personen er informert"
          isConfirmed={confirmed}
          error={confirmError}
          onConfirmedChange={(checked) => {
            setConfirmed(checked)
            setConfirmError(undefined)
          }}
        >
          <BodyLong size="small">
            Før du melder på, skal du ha avtalt med personen hva innholdet i
            tiltaket skal være. Er personen informert?
          </BodyLong>
        </ConfirmInfoCard>

        <BodyLong weight="semibold" className="mt-8">
          {`${deltakerNavn} meldes på ${hentTiltakNavnHosArrangorTekst(deltakerliste.tiltakskode, deltakerliste.arrangorNavn)}`}
        </BodyLong>
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="button"
          size="small"
          onClick={() => {
            if (!confirmed) {
              setConfirmError('Du må bekrefte før du kan fortsette')
            } else {
              doFetchMeldPaDirekteEnkeltplass(
                pamelding.deltakerId,
                enhetId,
                formContext
                  ? formToEnkeltplassRequest(formContext.getValues())
                  : generateEnkeltplassPameldingRequest(pamelding)
              ).then(() => onClose())
            }
          }}
          disabled={fetchState === DeferredFetchState.LOADING}
          loading={fetchState === DeferredFetchState.LOADING}
        >
          Del utkast og gjør klar påmelding
        </Button>
        <Button
          type="button"
          size="small"
          variant="secondary"
          onClick={onClose}
          disabled={fetchState === DeferredFetchState.LOADING}
        >
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
