import {
  Alert,
  BodyShort,
  Checkbox,
  HStack,
  Label,
  Link,
  Table
} from '@navikt/ds-react'
import {
  DeltakerStatusTag,
  DeltakerStatusType,
  Tiltakskode
} from 'deltaker-flate-common'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Deltaker } from '../api/data/deltakerliste.ts'
import { useDeltakerlisteContext } from '../context-providers/DeltakerlisteContext.tsx'
import {
  HandlingValg,
  useHandlingContext
} from '../context-providers/HandlingContext.tsx'
import { getDeltakerUrl } from '../navigation.ts'
import { lagDeltakerNavn } from '../utils/utils.ts'
import { BeskyttelsesmarkeringIkoner } from './BeskyttelsesmarkeringIkoner'
import { Vurdering } from './Vurdering.tsx'

export const DeltakerlisteTabell = () => {
  const { deltakere, deltakerlisteDetaljer } = useDeltakerlisteContext()
  const { handlingValg, valgteDeltakere, setValgteDeltakere } =
    useHandlingContext()

  const toggleSelectedRow = (deltaker: Deltaker) =>
    setValgteDeltakere((list) =>
      list.find((it) => it.id === deltaker.id)
        ? list.filter((it) => it.id !== deltaker.id)
        : [...list, deltaker]
    )

  const valgbareDeltakere = deltakere.filter(
    (deltaker) =>
      deltaker.status.type === DeltakerStatusType.SOKT_INN &&
      !deltaker.erManueltDeltMedArrangor &&
      deltaker.vurdering === null
  )

  const skalViseVurderinger =
    deltakerlisteDetaljer.tiltakskode ==
    Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING

  if (deltakere.length === 0) {
    return (
      <Alert inline variant="info" size="small" className="h-fit">
        Innsøkte deltakere vises her. Det er foreløpig ingen innsøkte deltakere.
      </Alert>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {handlingValg !== null && (
        <Alert variant="info" size="small">
          {getHandlingInfoText(handlingValg)}
        </Alert>
      )}

      <Table className="w-fit h-fit">
        <Table.Header>
          <Table.Row>
            {handlingValg !== null && (
              <Table.DataCell>
                <Checkbox
                  checked={
                    valgteDeltakere.length === valgbareDeltakere.length &&
                    valgteDeltakere.length > 0
                  }
                  indeterminate={
                    valgteDeltakere.length > 0 &&
                    valgteDeltakere.length !== valgbareDeltakere.length
                  }
                  onChange={() => {
                    if (
                      (valgteDeltakere.length > 0 &&
                        valgteDeltakere.length !== valgbareDeltakere.length) ||
                      valgteDeltakere.length === valgbareDeltakere.length
                    ) {
                      setValgteDeltakere([])
                    } else {
                      setValgteDeltakere(valgbareDeltakere)
                    }
                  }}
                  hideLabel
                >
                  Velg alle rader
                </Checkbox>
              </Table.DataCell>
            )}
            <Table.HeaderCell scope="col" className="pl-4 pr-4">
              <Label size="medium">Navn</Label>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col" className="pl-4 pr-4">
              <Label size="medium">Nav-enhet</Label>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col" className="pl-4 pr-4">
              <Label size="medium">Status deltakelse</Label>
            </Table.HeaderCell>
            {skalViseVurderinger && (
              <Table.HeaderCell scope="col" className="pl-4 pr-4">
                <Label size="medium">Vurdering, arrangør</Label>
              </Table.HeaderCell>
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {deltakere.map((deltaker) => {
            return (
              <Table.Row key={`${deltaker.id}`}>
                {handlingValg !== null && (
                  <Table.DataCell>
                    <Checkbox
                      hideLabel
                      checked={
                        !!valgteDeltakere.find((it) => it.id === deltaker.id)
                      }
                      onChange={() => toggleSelectedRow(deltaker)}
                      disabled={
                        deltaker.status.type !== DeltakerStatusType.SOKT_INN ||
                        deltaker.erManueltDeltMedArrangor ||
                        deltaker.vurdering !== null
                      }
                      aria-labelledby={`id-${deltaker.id}`}
                    >
                      {' '}
                    </Checkbox>
                  </Table.DataCell>
                )}
                <Table.DataCell className="pl-4 pr-4 hover:text-green-500">
                  <HStack gap="1" className="items-center">
                    <BodyShort size="small" id={`id-${deltaker.id}`}>
                      <Link
                        as={ReactRouterLink}
                        to={getDeltakerUrl(
                          deltakerlisteDetaljer.id,
                          deltaker.id
                        )}
                      >
                        {lagDeltakerNavn(
                          deltaker.fornavn,
                          deltaker.mellomnavn,
                          deltaker.etternavn
                        )}
                      </Link>
                    </BodyShort>
                    <BeskyttelsesmarkeringIkoner
                      beskyttelsesmarkering={deltaker.beskyttelsesmarkering}
                    />
                  </HStack>
                </Table.DataCell>
                <Table.DataCell className="pl-4 pr-4">
                  <BodyShort size="small">{deltaker.navEnhet}</BodyShort>
                </Table.DataCell>
                <Table.DataCell className="pl-4 pr-4">
                  <DeltakerStatusTag statusType={deltaker.status.type} />
                </Table.DataCell>
                {skalViseVurderinger && (
                  <Table.DataCell className="pl-4 pr-4">
                    <Vurdering
                      vurdering={deltaker.vurdering}
                      erManueltDeltMedArrangor={
                        deltaker.erManueltDeltMedArrangor
                      }
                    />
                  </Table.DataCell>
                )}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </div>
  )
}

const getHandlingInfoText = (handlingValg: HandlingValg) => {
  switch (handlingValg) {
    case HandlingValg.DEL_DELTAKERE:
      return 'Velg deltakere som skal tilbys plass.'
  }
}
