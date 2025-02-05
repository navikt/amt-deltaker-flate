import { BodyShort, HStack, Label, Table } from '@navikt/ds-react'
import { useDeltakerlisteContext } from '../DeltakerlisteContext'
import { DeltakerStatusTag } from 'deltaker-flate-common'
import { Deltaker } from '../api/data/deltakerliste'
import { BeskyttelsesmarkeringIkoner } from './BeskyttelsesmarkeringIkoner'

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
            <Table.Row key={`${deltaker.id}`}>
              <Table.DataCell className="pl-4 pr-4">
                <HStack gap="1" className="items-center">
                  <BodyShort size="small">{deltakerNavn(deltaker)}</BodyShort>
                  <BeskyttelsesmarkeringIkoner
                    beskyttelsesmarkering={deltaker.beskyttelsesmarkering}
                  />
                </HStack>
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

function deltakerNavn({ fornavn, mellomnavn, etternavn }: Deltaker): string {
  return [fornavn, mellomnavn, etternavn].filter(Boolean).join(' ')
}
