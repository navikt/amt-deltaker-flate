import { BodyLong, Button, Modal } from '@navikt/ds-react'
import { hentTiltakNavnHosArrangorTekst } from 'deltaker-flate-common'
import { getDeltakerNavn } from '../../../utils/displayText.ts'
import { usePameldingContext } from '../../tiltak/PameldingContext.tsx'

interface Props {
  open: boolean
  onClose: () => void
}

export const DelUtkastModal = ({ open, onClose }: Props) => {
  const { pamelding } = usePameldingContext()
  const deltakerNavn = getDeltakerNavn(pamelding)
  const { deltakerliste } = pamelding

  // const { getValues } = useFormContext<PameldingEnkeltplassFormValues>()

  return (
    <Modal
      open={open}
      header={{
        heading: 'Del utkast og gjør klar påmelding'
      }}
      onClose={onClose}
    >
      <Modal.Body>
        <BodyLong size="small">
          Brukeren blir varslet, og finner lenke på Min side og i
          aktivitetsplanen. Brukeren ser hva du foreslår i påmeldingen. Hvis
          brukeren har spørsmål så kan de ta kontakt gjennom dialogen.
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
          Del utkast og gjør klar påmelding
        </Button>
        <Button
          type="button"
          size="small"
          variant="secondary"
          onClick={onClose}
          // disabled={!!disabled}
          // loading={confirmLoading}
        >
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
