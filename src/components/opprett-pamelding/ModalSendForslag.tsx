import {BodyLong, Button, HStack, Modal} from '@navikt/ds-react'

interface Props {
    open: boolean,
    onDel: () => void,
    onAvbryt: () => void
}

export const ModalSendForslag = (
  {open, onDel, onAvbryt}: Props
) => {
  return (
    <Modal open={open} header={{heading: 'Del utkast med bruker og gjør klar vedtak'}} onClose={onAvbryt}>
      <Modal.Body>
        <Modal.Body>
          <BodyLong className="font-bold">
                        Navn Navnersen meldes på Oppfølging hos Mulighetes AS
          </BodyLong>
          <BodyLong>
                        Når utkastet deles med personen så kan de lese gjennom hva du foreslår å sende til arrangøren.
                        Personen blir varslet og kan finne lenke på innlogget nav.no og gjennom aktivitetsplanen.
          </BodyLong>
          <BodyLong>
                        Når personen godtar så meldes personen på og vedtaket fattes. Arrangør mottar informasjon i
                        verktøyet Deltakeroversikt på nav.no.
          </BodyLong>
        </Modal.Body>
      </Modal.Body>
      <Modal.Footer>
        <HStack gap="4">
          <Button type="button" variant="secondary" onClick={onAvbryt}>
                        Avbryt
          </Button>
          <Button type="button" onClick={onDel}>
                        Del utkast og gjør klar vedtak
          </Button>
        </HStack>
      </Modal.Footer>
    </Modal>
  )
}
