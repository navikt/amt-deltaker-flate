import { Alert, ExpansionCard, List } from '@navikt/ds-react'
import { Deltaker } from '../../api/data/deltakerliste'
import { HandlingValg } from '../../context-providers/HandlingContext'
import { lagDeltakerNavnEtternavnForst } from '../../utils/utils'

interface Props {
  valgteDeltakere: Deltaker[]
  handlingValg: HandlingValg
}

export function ValgteDeltakereBox(props: Props) {
  if (props.valgteDeltakere.length === 0) {
    return (
      <Alert variant="info" size="small">
        {getIngenDeltakerValgtTekst(props.handlingValg)}
      </Alert>
    )
  }

  return (
    <ExpansionCard
      className="mt-6"
      size="small"
      aria-label={getHandlingDeltakereTittel(props.handlingValg)}
    >
      <ExpansionCard.Header>
        <ExpansionCard.Title as="h2" size="small">
          {getHandlingDeltakereTittel(props.handlingValg)}
        </ExpansionCard.Title>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <List className="-mt-4 -mb-4">
          {props.valgteDeltakere.map((deltaker) => (
            <List.Item key={deltaker.id}>
              {lagDeltakerNavnEtternavnForst(
                deltaker.fornavn,
                deltaker.mellomnavn,
                deltaker.etternavn
              )}
            </List.Item>
          ))}
        </List>
      </ExpansionCard.Content>
    </ExpansionCard>
  )
}

const getIngenDeltakerValgtTekst = (handlingValg: HandlingValg) => {
  switch (handlingValg) {
    case HandlingValg.DEL_DELTAKERE:
      return 'Du må velge minst én deltaker for å dele med arrangør.'
    case HandlingValg.SETT_PA_VENTELISTE:
      return 'Du må velge minst én deltaker for å sette på venteliste.'
    case HandlingValg.TILDEL_PLASS:
      return 'Du må velge minst én deltaker for å tildele plass.'
  }
}

const getHandlingDeltakereTittel = (handlingValg: HandlingValg) => {
  switch (handlingValg) {
    case HandlingValg.DEL_DELTAKERE:
      return 'Følgende deltakere deles med arrangør'
    case HandlingValg.SETT_PA_VENTELISTE:
      return 'Følgende deltakere settes på venteliste'
    case HandlingValg.TILDEL_PLASS:
      return 'Følgende deltakere tildeles plass'
    case HandlingValg.GI_AVSLAG:
      return 'Foo bar'
  }
}
