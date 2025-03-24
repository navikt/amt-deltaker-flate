import { Alert, Button, ExpansionCard, List, Modal } from '@navikt/ds-react'
import {
  HandlingValg,
  useHandlingContext
} from '../../context-providers/HandlingContext'
import { lagDeltakerNavn } from '../../utils/utils'

interface Props {
  open: boolean
  children: React.ReactNode
  error: string | null
  onClose: () => void
  onUtforHandling: () => void
}

export const HandlingModal = ({
  open,
  children,
  error,
  onClose,
  onUtforHandling
}: Props) => {
  const { valgteDeltakere, handlingValg } = useHandlingContext()

  if (!handlingValg) {
    return null
  }

  return (
    <Modal
      open={open}
      header={{ heading: getHandlingTittel(handlingValg) }}
      onClose={onClose}
    >
      <Modal.Body>
        {children}

        {valgteDeltakere.length === 0 ? (
          <Alert variant="info" size="small">
            {getIngenDeltakerValgtTekst(handlingValg)}
          </Alert>
        ) : (
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
        )}

        {error && (
          <Alert variant="error" size="small" role="alert" className="mt-4">
            {error}
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button form="skjema" onClick={onUtforHandling}>
          {getHandlingKnappSendTekst(handlingValg)}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const getIngenDeltakerValgtTekst = (handlingValg: HandlingValg) => {
  switch (handlingValg) {
    case HandlingValg.DEL_DELTAKERE:
      return 'Du må velge minst én deltaker for å dele med arrangør.'
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
