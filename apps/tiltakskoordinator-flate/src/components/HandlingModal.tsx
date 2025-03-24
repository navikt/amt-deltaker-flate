import {
  Alert,
  BodyShort,
  Button,
  ExpansionCard,
  List,
  Modal
} from '@navikt/ds-react'
import { useState } from 'react'
import { delDeltakereMedArrangor } from '../api/api'
import { Deltaker } from '../api/data/deltakerliste'
import { useDeltakerlisteContext } from '../context-providers/DeltakerlisteContext'
import {
  HandlingValg,
  useHandlingContext
} from '../context-providers/HandlingContext'
import { lagDeltakerNavn } from '../utils/utils'

interface Props {
  open: boolean
  onClose: () => void
  onSend: () => void
}

export const HandlingModal = ({ open, onClose, onSend }: Props) => {
  const { deltakerlisteDetaljer, setDelakere } = useDeltakerlisteContext()
  const { valgteDeltakere, handlingValg } = useHandlingContext()
  const [harFeil, setHarFeil] = useState(false)

  if (!handlingValg) {
    return null
  }

  const utforHandling = () => {
    switch (handlingValg) {
      case HandlingValg.DEL_DELTAKERE: {
        delDeltakereMedArrangor(
          deltakerlisteDetaljer.id,
          valgteDeltakere.map((it) => it.id)
        )
          .then((deltakere) => {
            setDelakere(deltakere ?? [])
            setHarFeil(false)
            onSend()
          })
          .catch(() => {
            setHarFeil(true)
            onClose()
          })
      }
    }
  }

  return (
    <Modal
      open={open}
      header={{ heading: getHandlingTittel(handlingValg) }}
      onClose={onClose}
    >
      <Modal.Body>
        {getHandlingBody(handlingValg, valgteDeltakere)}

        <ExpansionCard className="mt-6" size="small">
          <ExpansionCard.Header>
            <ExpansionCard.Title as="h2" size="small">
              {getHandlingDeltakereTittel(handlingValg)}
            </ExpansionCard.Title>
          </ExpansionCard.Header>
          <ExpansionCard.Content>
            <List>
              {valgteDeltakere.map((deltaker) => (
                <List.Item key={deltaker.id}>
                  {lagDeltakerNavn(
                    deltaker.fornavn,
                    deltaker.mellomnavn,
                    deltaker.etternavn
                  )}
                </List.Item>
              ))}
            </List>
          </ExpansionCard.Content>
        </ExpansionCard>
      </Modal.Body>

      <Modal.Footer>
        <Button form="skjema" onClick={utforHandling}>
          {getHandlingKnappSendTekst(handlingValg)}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Avbryt
        </Button>
        {harFeil && (
          <Alert variant="error" size="samll">
            Det oppsto en feil.
          </Alert>
        )}
      </Modal.Footer>
    </Modal>
  )
}

const getHandlingBody = (
  handlingValg: HandlingValg,
  valgteDeltakere: Deltaker[]
) => {
  switch (handlingValg) {
    case HandlingValg.DEL_DELTAKERE:
      return (
        <>
          <BodyShort>
            {`${valgteDeltakere.length} person${valgteDeltakere.length > 1 ? 'er' : ''} deles med arrangør for vurdering. Disse blir synlige i Deltakeroversikten til arrangør.`}
          </BodyShort>
          <BodyShort className="mb-4 mt-4">
            Informasjon om at personinformasjon er delt med arrangør, er synlig
            for deltakerne på nav.no, og for deres Nav-veiledere i Modia.
          </BodyShort>
        </>
      )
  }
}

const getHandlingTittel = (handlingValg: HandlingValg) => {
  switch (handlingValg) {
    case HandlingValg.DEL_DELTAKERE:
      return 'Del med arrangør'
  }
}

const getHandlingDeltakereTittel = (handlingValg: HandlingValg) => {
  switch (handlingValg) {
    case HandlingValg.DEL_DELTAKERE:
      return 'Følgende deltakere deles med arrangør'
  }
}

const getHandlingKnappSendTekst = (handlingValg: HandlingValg) => {
  switch (handlingValg) {
    case HandlingValg.DEL_DELTAKERE:
      return 'Del med arrangør'
  }
}
