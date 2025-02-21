import { BodyLong, Modal } from '@navikt/ds-react'
import {
  ArenaTiltakskode,
  hentTiltakNavnHosArrangorTekst
} from 'deltaker-flate-common'
import { ModalFooter } from '../ModalFooter'

interface Props {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  deltakerNavn: string
  tiltakstype: ArenaTiltakskode
  arrangorNavn: string
}

export const DelUtkastModal = ({
  open,
  onConfirm,
  onCancel,
  deltakerNavn,
  tiltakstype,
  arrangorNavn
}: Props) => {
  return (
    <Modal
      open={open}
      header={{ heading: 'Del utkast og gjør klar vedtak' }}
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
          Når brukeren godtar utkastet, så fattes vedtaket. I Deltakeroversikten
          på nav.no ser arrangøren påmeldingen, kontaktinformasjonen til bruker
          og tildelt veileder.
        </BodyLong>

        <BodyLong weight="semibold">
          {deltakerNavn} meldes på{' '}
          {hentTiltakNavnHosArrangorTekst(tiltakstype, arrangorNavn)}
        </BodyLong>
      </Modal.Body>
      <ModalFooter
        confirmButtonText="Del utkast og gjør klar vedtak"
        cancelButtonText="Avbryt"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </Modal>
  )
}
