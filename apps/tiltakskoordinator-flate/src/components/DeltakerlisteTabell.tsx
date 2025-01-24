import { BodyShort, Label, Table } from '@navikt/ds-react'
import { useDeltakerlisteContext } from '../DeltakerlisteContext'
import { DeltakerStatusTag } from 'deltaker-flate-common'

export const DeltakerlisteTabell = () => {
  const { deltakere } = useDeltakerlisteContext()

  return (
    <Table className="w-fit">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col" className="pl-4 pr-4">
            <Label size="medium">Navn</Label>
          </Table.HeaderCell>
          <Table.HeaderCell scope="col" className="pl-4 pr-4">
            <Label size="medium">Status deltakelse</Label>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {deltakere.map((deltaker) => {
          return (
            <Table.Row key={deltaker.deltakerId}>
              <Table.DataCell className="pl-4 pr-4">
                <BodyShort size="small">{deltaker.navn}</BodyShort>
              </Table.DataCell>
              <Table.DataCell className="pl-4 pr-4">
                <DeltakerStatusTag statusType={deltaker.status.type} />
              </Table.DataCell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}
