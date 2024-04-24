import { BodyLong, Modal } from '@navikt/ds-react'
import { hentTiltakNavnHosArrangorTekst } from 'deltaker-flate-utils/displayText'
import { ModalFooter } from '../ModalFooter'
import { Tiltakstype } from 'deltaker-flate-model'

interface Props {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  deltakerNavn: string
  tiltakstype: Tiltakstype
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
          aktivitetsplanen. Bruker får lest gjennom hva du foreslår å sende til
          arrangøren. Bruker ser innhold, bakgrunnsinformasjon og navnet ditt.
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
