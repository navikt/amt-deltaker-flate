import { BodyLong, Button, LocalAlert, Modal } from '@navikt/ds-react'
import {
  ConfirmInfoCard,
  DeferredFetchState,
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
} from '../../../../utils/pamelding-enkeltplass.ts'
import { useDeltakerContext } from '../../../tiltak/DeltakerContext.tsx'

interface Props {
  open: boolean
  onClose: () => void
}

export const MeldPaDirekteModalEnkeltPlass = ({ open, onClose }: Props) => {
  const { enhetId } = useAppContext()
  const { deltaker } = useDeltakerContext()
  const formContext = useFormContext<PameldingEnkeltplassFormValues>()

  const deltakerNavn = getDeltakerNavn(deltaker)
  const { deltakerliste } = deltaker

  const [confirmed, setConfirmed] = useState(false)
  const [confirmError, setConfirmError] = useState<string | undefined>()

  const { doRedirect } = useModiaLink()
  const returnToFrontpageWithSuccessMessage = () => {
    doRedirect(DELTAKELSESOVERSIKT_LINK, {
      heading: 'Bruker er meldt på',
      body: `Påmeldt ${hentTiltakNavnHosArrangorTekst(deltaker.deltakerliste.tiltakskode, deltaker.deltakerliste.arrangorNavn)}.`
    })
  }

  const {
    state: fetchState,
    error,
    doFetch: doFetchMeldPaDirekteEnkeltplass
  } = useDeferredFetch(
    meldPaDirekteEnkeltplass,
    returnToFrontpageWithSuccessMessage
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
          size="small"
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

        <BodyLong weight="semibold" className="mt-4">
          {`${deltakerNavn} meldes på ${hentTiltakNavnHosArrangorTekst(deltakerliste.tiltakskode, deltakerliste.arrangorNavn)}`}
        </BodyLong>

        {error && (
          <LocalAlert className="mt-8 -mb-4" status="error" size="small">
            <LocalAlert.Header>
              <LocalAlert.Title>
                Vi fikk en feil og kunne ikke melde brukeren på, prøv igjen.
              </LocalAlert.Title>
            </LocalAlert.Header>
          </LocalAlert>
        )}
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
                deltaker.deltakerId,
                enhetId,
                formContext
                  ? formToEnkeltplassRequest(formContext.getValues())
                  : generateEnkeltplassPameldingRequest(deltaker)
              ).then(() => onClose())
            }
          }}
          disabled={fetchState === DeferredFetchState.LOADING}
          loading={fetchState === DeferredFetchState.LOADING}
        >
          Meld på uten å dele utkast
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
