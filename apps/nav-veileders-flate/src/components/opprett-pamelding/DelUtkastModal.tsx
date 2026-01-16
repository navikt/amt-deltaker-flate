import { BodyLong, Modal } from '@navikt/ds-react'
import {
  hentTiltakNavnHosArrangorTekst,
  skalMeldePaaDirekte
} from 'deltaker-flate-common'
import { Deltakerliste } from '../../api/data/pamelding'
import { ModalFooter } from '../ModalFooter'

interface Props {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  deltakerNavn: string
  deltakerliste: Deltakerliste
}

export const DelUtkastModal = ({
  open,
  onConfirm,
  onCancel,
  deltakerNavn,
  deltakerliste
}: Props) => {
  const meldPaDirekte = skalMeldePaaDirekte(deltakerliste.pameldingstype)
  return (
    <Modal
      open={open}
      header={{
        heading: `Del utkast og gjør klar ${meldPaDirekte ? 'påmelding' : 'søknad'}`
      }}
      onClose={onCancel}
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
          {`${deltakerNavn} ${meldPaDirekte ? 'meldes' : 'søkes inn'} på ${hentTiltakNavnHosArrangorTekst(deltakerliste.tiltakskode, deltakerliste.arrangorNavn)}`}
        </BodyLong>
      </Modal.Body>
      <ModalFooter
        confirmButtonText={`Del utkast og gjør klar ${meldPaDirekte ? 'påmelding' : 'søknad'}`}
        cancelButtonText="Avbryt"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </Modal>
  )
}
