import { BodyLong, Button, HStack, Modal } from '@navikt/ds-react'
import { getTiltakstypeDisplayText } from '../../utils/displayText'
import { Tiltakstype } from '../../api/data/pamelding'

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
          {deltakerNavn} meldes på {getTiltakstypeDisplayText(tiltakstype)} hos {arrangorNavn}
        </BodyLong>
      </Modal.Body>
      <Modal.Footer>
        <HStack gap="4">
          <Button type="button" variant="secondary" size="small" onClick={onCancel}>
            Avbryt
          </Button>
          <Button type="button" size="small" onClick={onConfirm}>
            Del utkast og gjør klar vedtak
          </Button>
        </HStack>
      </Modal.Footer>
    </Modal>
  )
}
