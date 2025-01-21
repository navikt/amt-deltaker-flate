import { Table } from '@navikt/ds-react'
import { useDeltakerlisteContext } from '../DeltakerlisteContext'
import { DeltakerStatusTag } from 'deltaker-flate-common'

export const DeltakerlisteTabell = () => {
  const { deltakere } = useDeltakerlisteContext()

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
          <Table.HeaderCell scope="col">Status deltakelse</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {deltakere.map((deltaker) => {
          return (
            <Table.Row key={deltaker.deltakerId}>
              <Table.DataCell>{deltaker.navn}</Table.DataCell>
              <Table.DataCell>
                <DeltakerStatusTag statusType={deltaker.status.type} />
              </Table.DataCell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}
