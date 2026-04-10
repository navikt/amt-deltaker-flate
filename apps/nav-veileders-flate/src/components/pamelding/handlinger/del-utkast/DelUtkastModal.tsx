import { BodyLong, Button, LocalAlert, Modal } from '@navikt/ds-react'
import {
  DeferredFetchState,
  hentTiltakNavnHosArrangorTekst,
  skalMeldePaaDirekte,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useFormContext } from 'react-hook-form'
import { oppdaterUtkast } from '../../../../api/api'
import { useAppContext } from '../../../../AppContext'
import {
  DELTAKELSESOVERSIKT_LINK,
  useModiaLink
} from '../../../../hooks/useModiaLink'
import { PameldingFormValues } from '../../../../model/PameldingFormValues'
import { getDeltakerNavn } from '../../../../utils/displayText'
import { generatePameldingRequestFromForm } from '../../../../utils/pamelding-form-utils'
import { useDeltakerContext } from '../../../tiltak/DeltakerContext'

interface Props {
  open: boolean
  onClose: () => void
}

export const DelUtkastModal = ({ open, onClose }: Props) => {
  const { enhetId } = useAppContext()
  const { deltaker } = useDeltakerContext()
  const { getValues } = useFormContext<PameldingFormValues>()

  const deltakerNavn = getDeltakerNavn(deltaker)
  const meldPaDirekte = skalMeldePaaDirekte(
    deltaker.deltakerliste.pameldingstype
  )

  const { doRedirect } = useModiaLink()
  const returnToFrontpageWithSuccessMessage = () => {
    doRedirect(DELTAKELSESOVERSIKT_LINK, {
      heading: 'Utkastet er delt med bruker',
      body: meldPaDirekte
        ? `Påmeldingen er gjort klart. Når brukeren godtar, blir de meldt på ${hentTiltakNavnHosArrangorTekst(deltaker.deltakerliste.tiltakskode, deltaker.deltakerliste.arrangorNavn)}.`
        : `Søknaden er gjort klart. Når brukeren godtar, blir de søkt inn på ${hentTiltakNavnHosArrangorTekst(deltaker.deltakerliste.tiltakskode, deltaker.deltakerliste.arrangorNavn)}.`
    })
  }

  const {
    state: fetchState,
    error,
    doFetch: doFetchSendSomForslag
  } = useDeferredFetch(oppdaterUtkast, returnToFrontpageWithSuccessMessage)

  return (
    <Modal
      open={open}
      header={{
        heading: `Del utkast og gjør klar ${meldPaDirekte ? 'påmelding' : 'søknad'}`
      }}
      onClose={onClose}
    >
      <Modal.Body>
        <BodyLong size="small">
          Brukeren blir varslet, og finner lenke på Min side og i
          aktivitetsplanen. Brukeren ser hva som foreslås å sende til arrangøren
          og navnet ditt. Hvis brukeren har spørsmål så kan de ta kontakt
          gjennom dialogen.
        </BodyLong>

        <BodyLong size="small" className="mt-4 mb-4">
          {meldPaDirekte
            ? 'Når brukeren godtar utkastet, så fattes vedtaket. I Deltakeroversikten på nav.no ser arrangøren påmeldingen, kontaktinformasjonen til bruker og tildelt veileder.'
            : 'Når brukeren godtar utkastet, søkes de inn. Når det nærmer seg oppstart av kurset, vil Nav gjøre en vurdering av om brukeren oppfyller kravene for å delta.'}
        </BodyLong>

        <BodyLong weight="semibold" size="small">
          {`${deltakerNavn} ${meldPaDirekte ? 'meldes' : 'søkes inn'} på ${hentTiltakNavnHosArrangorTekst(deltaker.deltakerliste.tiltakskode, deltaker.deltakerliste.arrangorNavn)}`}
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
            doFetchSendSomForslag(
              deltaker.deltakerId,
              enhetId,
              generatePameldingRequestFromForm(deltaker, getValues())
            ).then(() => onClose())
          }}
          disabled={fetchState === DeferredFetchState.LOADING}
          loading={fetchState === DeferredFetchState.LOADING}
        >
          {`Del utkast og gjør klar ${meldPaDirekte ? 'påmelding' : 'søknad'}`}
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
