import { Alert, BodyShort, HStack, Label, Link, Table } from '@navikt/ds-react'
import {
  DeltakerStatusTag,
  DeltakerStatusType,
  Tiltakskode
} from 'deltaker-flate-common'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Deltaker } from '../../api/data/deltakerliste.ts'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext.tsx'
import {
  HandlingValg,
  useHandlingContext
} from '../../context-providers/HandlingContext.tsx'
import { getDeltakerUrl } from '../../navigation.ts'
import { lagDeltakerNavn } from '../../utils/utils.ts'
import { BeskyttelsesmarkeringIkoner } from '../BeskyttelsesmarkeringIkoner.tsx'
import { Vurdering } from '../Vurdering.tsx'
import { MarkerAlleCheckbox } from './MarkerAlleCheckbox.tsx'
import { VelgDeltakerCheckbox } from './VelgDeltakerCheckbox.tsx'
import { HandlingerKnapp } from '../handling/HandlingerKnapp.tsx'
import { useEffect, useRef } from 'react'

export const DeltakerlisteTabell = () => {
  const { deltakere, deltakerlisteDetaljer } = useDeltakerlisteContext()
  const { handlingValg, valgteDeltakere } = useHandlingContext()

  const handlingValgRef = useRef<HandlingValg | null>(null)
  const handlingInfoAlertRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (handlingValg === handlingValgRef.current) {
      return
    } else {
      handlingValgRef.current = handlingValg
    }
    if (handlingInfoAlertRef.current) {
      handlingInfoAlertRef.current.focus()
    }
  }, [handlingValg])

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
      <HandlingerKnapp className="place-self-end mt-2 mb-2" />

      {handlingValg !== null && (
        <Alert
          variant="info"
          size="small"
          ref={handlingInfoAlertRef}
          className="outline-none"
          tabIndex={-1}
        >
          {getHandlingInfoText(handlingValg)}
        </Alert>
      )}

      <Table className="w-fit h-fit">
        <Table.Header>
          <Table.Row>
            {handlingValg !== null && (
              <Table.DataCell>
                <MarkerAlleCheckbox
                  valgbareDeltakere={getValgbareDeltakere(
                    handlingValg,
                    deltakere
                  )}
                />
              </Table.DataCell>
            )}
            <TableHeaderCell label="Navn" />
            <TableHeaderCell label="Nav-enhet" />
            <TableHeaderCell label="Status deltakelse" />
            {skalViseVurderinger && (
              <TableHeaderCell label="Vurdering, arrangør" />
            )}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {deltakere.map((deltaker) => (
            <Table.Row
              key={`${deltaker.id}`}
              selected={!!valgteDeltakere.find((it) => it.id === deltaker.id)}
            >
              {handlingValg !== null && (
                <Table.DataCell>
                  <VelgDeltakerCheckbox
                    deltaker={deltaker}
                    labelId={`id${deltaker.id}`}
                  />
                </Table.DataCell>
              )}
              <TableDataCell>
                <HStack
                  id={`id${deltaker.id}`}
                  gap="1"
                  className="items-center"
                >
                  <Link
                    as={ReactRouterLink}
                    to={getDeltakerUrl(deltakerlisteDetaljer.id, deltaker.id)}
                  >
                    {lagDeltakerNavn(
                      deltaker.fornavn,
                      deltaker.mellomnavn,
                      deltaker.etternavn
                    )}
                  </Link>
                  <BeskyttelsesmarkeringIkoner
                    beskyttelsesmarkering={deltaker.beskyttelsesmarkering}
                  />
                </HStack>
              </TableDataCell>
              <TableDataCell text={deltaker.navEnhet} />
              <TableDataCell>
                <DeltakerStatusTag statusType={deltaker.status.type} />
              </TableDataCell>
              {skalViseVurderinger && (
                <TableDataCell>
                  <Vurdering
                    vurdering={deltaker.vurdering}
                    erManueltDeltMedArrangor={deltaker.erManueltDeltMedArrangor}
                  />
                </TableDataCell>
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

interface TableHeaderCellProps {
  label: string
}

const TableHeaderCell = ({ label }: TableHeaderCellProps) => {
  return (
    <Table.HeaderCell scope="col" className="pl-4 pr-4">
      <Label size="medium">{label}</Label>
    </Table.HeaderCell>
  )
}

interface TableDataCellProps {
  text?: string | null
  children?: React.ReactNode
  className?: string
}

const TableDataCell = ({ text, children, className }: TableDataCellProps) => {
  return (
    <Table.DataCell className={`pl-4 pr-4 ${className}`}>
      {children ?? null}
      {text && <BodyShort size="small">{text}</BodyShort>}
    </Table.DataCell>
  )
}

const getHandlingInfoText = (handlingValg: HandlingValg) => {
  switch (handlingValg) {
    case HandlingValg.DEL_DELTAKERE:
      return 'Velg deltakere som skal tilbys plass.'
  }
}

const getValgbareDeltakere = (
  handlingValg: HandlingValg,
  deltakere: Deltaker[]
) => {
  switch (handlingValg) {
    case HandlingValg.DEL_DELTAKERE:
      return deltakere.filter(
        (deltaker) =>
          deltaker.status.type === DeltakerStatusType.SOKT_INN &&
          !deltaker.erManueltDeltMedArrangor &&
          deltaker.vurdering === null
      )
    default:
      return deltakere
  }
}
