import { BodyLong, Button, Modal } from '@navikt/ds-react'
import { hentTiltakNavnHosArrangorTekst } from 'deltaker-flate-common'
import { getDeltakerNavn } from '../../../utils/displayText.ts'
import { usePameldingContext } from '../../tiltak/PameldingContext.tsx'

interface Props {
  open: boolean
  onClose: () => void
}

export const SlettKlassModal = ({ open, onClose }: Props) => {
  const { pamelding } = usePameldingContext()
  const deltakerNavn = getDeltakerNavn(pamelding)
  const { deltakerliste } = pamelding

  return (
    <Modal
      open={open}
      header={{
        heading: 'Vil du slette kladden?'
      }}
      onClose={onClose}
    >
      <Modal.Body>
        <BodyLong size="small">
          Påmeldingen og det du har skrevet vil bli borte.
        </BodyLong>

        <BodyLong weight="semibold" className="mt-8">
          {`${deltakerNavn} meldes på ${hentTiltakNavnHosArrangorTekst(deltakerliste.tiltakskode, deltakerliste.arrangorNavn)}`}
        </BodyLong>
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="button"
          size="small"
          onClick={() => {
            // TODO kall api og håndter loading, error og success state
            onClose()
          }}
          // disabled={!!disabled}
          // loading={confirmLoading}
        >
          Slett kladd
        </Button>
        <Button
          type="button"
          size="small"
          variant="secondary"
          onClick={onClose}
          // disabled={!!disabled}
          // loading={confirmLoading}
        >
          Nei, ikke slett
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
