import { BodyLong, Modal } from '@navikt/ds-react'
import { hentTiltakNavnHosArrangørTekst } from '../../utils/displayText'
import { Tiltakstype } from '../../api/data/pamelding'
import { ModalFooter } from '../ModalFooter'

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
    <Modal open={open} header={{ heading: 'Del utkast og gjør klar vedtak' }} onClose={onCancel}>
      <Modal.Body>
        <BodyLong size="small">
          Bruker blir varslet og kan finne lenke til utkastet på innlogget nav.no og i
          aktivitetsplanen. Bruker får lest gjennom hva du foreslår å sende til arrangøren.
        </BodyLong>

        <BodyLong size="small" className="mt-6 mb-6">
          Når brukeren godtar utkastet så fattes vedtaket. Da mottar arrangør påmeldingen,
          kontaktinformasjonen til brukeren og til tildelt veileder. Dette ser arrangøren i
          verktøyet Deltakeroversikt på nav.no.
        </BodyLong>

        <BodyLong weight="semibold">
          {deltakerNavn} meldes på {hentTiltakNavnHosArrangørTekst(tiltakstype, arrangorNavn)}
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
