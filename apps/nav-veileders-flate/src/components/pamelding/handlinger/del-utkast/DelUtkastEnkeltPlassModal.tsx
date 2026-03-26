import { BodyLong, Button, LocalAlert, Modal } from '@navikt/ds-react'
import {
  DeferredFetchState,
  hentTiltakNavnHosArrangorTekst,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useFormContext } from 'react-hook-form'
import { oppdaterUtkast } from '../../../../api/api-enkeltplass'
import { useAppContext } from '../../../../AppContext'
import {
  DELTAKELSESOVERSIKT_LINK,
  useModiaLink
} from '../../../../hooks/useModiaLink'
import { PameldingEnkeltplassFormValues } from '../../../../model/PameldingEnkeltplassFormValues'
import { getDeltakerNavn } from '../../../../utils/displayText'
import { formToEnkeltplassRequest } from '../../../../utils/pamelding-ekeltplass'
import { usePameldingContext } from '../../../tiltak/PameldingContext'

interface Props {
  open: boolean
  onClose: () => void
}

export const DelUtkastEnkeltPlassModal = ({ open, onClose }: Props) => {
  const { enhetId } = useAppContext()
  const { pamelding } = usePameldingContext()
  const { getValues } = useFormContext<PameldingEnkeltplassFormValues>()

  const deltakerNavn = getDeltakerNavn(pamelding)
  const { deltakerliste } = pamelding

  const { doRedirect } = useModiaLink()
  const returnToFrontpageWithSuccessMessage = () => {
    doRedirect(DELTAKELSESOVERSIKT_LINK, {
      heading: 'Utkastet er delt med bruker',
      body: `Påmeldingen er gjort klart. Når brukeren godtar, blir de meldt på ${hentTiltakNavnHosArrangorTekst(pamelding.deltakerliste.tiltakskode, pamelding.deltakerliste.arrangorNavn)}.`
    })
  }

  const {
    state: fetchState,
    error,
    doFetch: doFetchDelUtkastEnkeltplass
  } = useDeferredFetch(oppdaterUtkast, returnToFrontpageWithSuccessMessage)

  return (
    <Modal
      open={open}
      header={{
        heading: 'Del utkast og gjør klar påmelding'
      }}
      onClose={onClose}
    >
      <Modal.Body>
        <BodyLong size="small">
          Brukeren blir varslet, og finner lenke på Min side og i
          aktivitetsplanen. Brukeren ser hva du foreslår i påmeldingen. Hvis
          brukeren har spørsmål så kan de ta kontakt gjennom dialogen.
        </BodyLong>

        <BodyLong weight="semibold" className="mt-4" size="small">
          {`${deltakerNavn} meldes på ${hentTiltakNavnHosArrangorTekst(deltakerliste.tiltakskode, deltakerliste.arrangorNavn)}`}
        </BodyLong>

        {error && (
          <LocalAlert className="mt-8 -mb-4" status="error" size="small">
            <LocalAlert.Header>
              <LocalAlert.Title>
                Vi fikk en feil og kunne ikke dele utkastet, prøv igjen.
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
            doFetchDelUtkastEnkeltplass(
              pamelding.deltakerId,
              enhetId,
              formToEnkeltplassRequest(getValues())
            ).then(() => onClose())
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
