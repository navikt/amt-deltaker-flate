import { BodyLong, Modal } from '@navikt/ds-react'
import {
  ArenaTiltakskode,
  harFellesOppstart,
  hentTiltakNavnHosArrangorTekst,
  Oppstartstype
} from 'deltaker-flate-common'
import { ModalFooter } from '../ModalFooter'

interface Props {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  deltakerNavn: string
  tiltakstype: ArenaTiltakskode
  arrangorNavn: string
  oppstartstype: Oppstartstype
}

export const DelUtkastModal = ({
  open,
  onConfirm,
  onCancel,
  deltakerNavn,
  tiltakstype,
  arrangorNavn,
  oppstartstype
}: Props) => {
  const erFellesOppstart = harFellesOppstart(oppstartstype)

  return (
    <Modal
      open={open}
      header={{
        heading: `Del utkast og gjør klar ${erFellesOppstart ? 'søknad' : 'vedtak'}`
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
          {erFellesOppstart
            ? 'Når brukeren godtar utkastet, søkes de inn. Når det nærmer seg oppstart av kurset, vil Nav gjøre en vurdering av om brukeren oppfyller kravene for å delta.'
            : 'Når brukeren godtar utkastet, så fattes vedtaket. I Deltakeroversikten på nav.no ser arrangøren påmeldingen, kontaktinformasjonen til bruker og tildelt veileder.'}
        </BodyLong>

        <BodyLong weight="semibold">
          {`${deltakerNavn} ${erFellesOppstart ? 'søkes inn' : 'meldes'} på ${hentTiltakNavnHosArrangorTekst(tiltakstype, arrangorNavn)}`}
        </BodyLong>
      </Modal.Body>
      <ModalFooter
        confirmButtonText={`Del utkast og gjør klar ${erFellesOppstart ? 'søknad' : 'vedtak'}`}
        cancelButtonText="Avbryt"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </Modal>
  )
}
