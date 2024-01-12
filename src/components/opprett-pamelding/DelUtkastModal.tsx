import {BodyLong, Button, HStack, Modal} from '@navikt/ds-react'
import {Navn} from '../../api/data/pamelding.ts'

interface Props {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  navn: Navn
  gjennomforingTypeText: string
  arrangorNavn: string
}

export const DelUtkastModal = (
  {
    open,
    onConfirm,
    onCancel,
    navn,
    gjennomforingTypeText,
    arrangorNavn
  }: Props
) => {

  const getNavn = () => {
    if (navn.mellomnavn !== undefined) {
      return `${navn.fornavn} ${navn.mellomnavn} ${navn.etternavn}`
    } else {
      return `${navn.fornavn} ${navn.etternavn}`
    }
  }

  return (
    <Modal open={open} header={{ heading: 'Del utkast og gjør klar vedtak' }} onClose={onCancel}>
      <Modal.Body>
        <div className="flex flex-col space-y-4">
          <BodyLong weight="semibold">
            {getNavn()} meldes på {gjennomforingTypeText} hos {arrangorNavn}
          </BodyLong>

          <BodyLong>
            Når utkastet deles med bruker så kan de lese gjennom hva du foreslår å sende til
            arrangøren. Bruker blir varslet og kan finne lenke på innlogget nav.no og gjennom
            aktivitetsplanen.
          </BodyLong>

          <BodyLong>
            Når bruker godtar så meldes bruker på og vedtaket fattes. Arrangør mottar informasjon i
            verktøyet Deltakeroversikt på nav.no.
          </BodyLong>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <HStack gap="4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Avbryt
          </Button>
          <Button type="button" onClick={onConfirm}>
            Del utkast og gjør klar vedtak
          </Button>
        </HStack>
      </Modal.Footer>
    </Modal>
  )

}
