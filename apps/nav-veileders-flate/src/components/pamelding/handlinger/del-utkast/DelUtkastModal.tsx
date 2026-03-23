import { BodyLong, Button, Modal } from '@navikt/ds-react'
import {
  DeferredFetchState,
  DeltakerStatusType,
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
import { usePameldingContext } from '../../../tiltak/PameldingContext'

interface Props {
  open: boolean
  onClose: () => void
}

export const DelUtkastModal = ({ open, onClose }: Props) => {
  const { enhetId } = useAppContext()
  const { pamelding } = usePameldingContext()
  const { getValues } = useFormContext<PameldingFormValues>()

  const deltakerNavn = getDeltakerNavn(pamelding)
  const meldPaDirekte = skalMeldePaaDirekte(
    pamelding.deltakerliste.pameldingstype
  )
  const erUtkast =
    pamelding.status.type === DeltakerStatusType.UTKAST_TIL_PAMELDING

  const { doRedirect } = useModiaLink()
  const returnToFrontpageWithSuccessMessage = () => {
    doRedirect(DELTAKELSESOVERSIKT_LINK, {
      heading: 'Utkastet er delt med bruker',
      body: meldPaDirekte
        ? `Påmeldingen er gjort klart. Når brukeren godtar, blir de meldt på ${hentTiltakNavnHosArrangorTekst(pamelding.deltakerliste.tiltakskode, pamelding.deltakerliste.arrangorNavn)}.`
        : `Søknaden er gjort klart. Når brukeren godtar, blir de søkt inn på ${hentTiltakNavnHosArrangorTekst(pamelding.deltakerliste.tiltakskode, pamelding.deltakerliste.arrangorNavn)}.`
    })
  }

  const {
    state: fetchState,
    // error, // TODO vise feil
    doFetch: doFetchSendSomForslag
  } = useDeferredFetch(
    oppdaterUtkast,
    erUtkast ? undefined : returnToFrontpageWithSuccessMessage
  )

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

        <BodyLong size="small" className="mt-6 mb-6">
          {meldPaDirekte
            ? 'Når brukeren godtar utkastet, så fattes vedtaket. I Deltakeroversikten på nav.no ser arrangøren påmeldingen, kontaktinformasjonen til bruker og tildelt veileder.'
            : 'Når brukeren godtar utkastet, søkes de inn. Når det nærmer seg oppstart av kurset, vil Nav gjøre en vurdering av om brukeren oppfyller kravene for å delta.'}
        </BodyLong>

        <BodyLong weight="semibold">
          {`${deltakerNavn} ${meldPaDirekte ? 'meldes' : 'søkes inn'} på ${hentTiltakNavnHosArrangorTekst(pamelding.deltakerliste.tiltakskode, pamelding.deltakerliste.arrangorNavn)}`}
        </BodyLong>
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="button"
          size="small"
          onClick={() => {
            doFetchSendSomForslag(
              pamelding.deltakerId,
              enhetId,
              generatePameldingRequestFromForm(pamelding, getValues())
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
