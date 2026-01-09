import { Alert, BodyShort, HStack, Label, Link, Table } from '@navikt/ds-react'
import {
  DeltakerStatusTag,
  DeltakerStatusType,
  formatDate,
  Oppstartstype,
  Pameldingstype
} from 'deltaker-flate-common'
import { useEffect, useRef, useState } from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Deltaker } from '../../api/data/deltakerliste.ts'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext.tsx'
import {
  HandlingValg,
  useHandlingContext
} from '../../context-providers/HandlingContext.tsx'
import { useSorteringContext } from '../../context-providers/SorteringContext.tsx'
import {
  ScopedSortState,
  SortKey,
  useDeltakerSortering
} from '../../hooks/useDeltakerSortering.tsx'
import { getDeltakerUrl } from '../../navigation.ts'
import {
  kanDeleDeltakerMedArrangorForVurdering,
  lagDeltakerNavnEtternavnForst
} from '../../utils/utils.ts'
import { kanVelges } from '../../utils/velgDeltakereUtils.ts'
import { BeskyttelsesmarkeringIkoner } from '../BeskyttelsesmarkeringIkoner.tsx'
import { HandlingerKnapp } from '../handling/HandlingerKnapp.tsx'
import { HandlingFullfortAlert } from '../handling/HandlingFullfortAlert.tsx'
import { HandlingFullfortMedFeilAlert } from '../handling/HandlingFullfortMedFeilAlert.tsx'
import { HandlingModalController } from '../handling/HandlingModalController.tsx'
import { Vurdering } from '../Vurdering.tsx'
import { GiAvslagKnapp } from './GiAvslagKnapp.tsx'
import { MarkerAlleCheckbox } from './MarkerAlleCheckbox.tsx'
import { VelgDeltakerCheckbox } from './VelgDeltakerCheckbox.tsx'

export const DeltakerlisteTabell = () => {
  const { deltakere, filtrerteDeltakere, deltakerlisteDetaljer } =
    useDeltakerlisteContext()
  const { handlingValg, valgteDeltakere, setValgteDeltakere, setHandlingValg } =
    useHandlingContext()

  const [modalOpen, setModalOpen] = useState(false)

  const handlingValgRef = useRef<HandlingValg | null>(null)
  const handlingInfoAlertRef = useRef<HTMLDivElement>(null)
  const erFellesOppstart =
    deltakerlisteDetaljer.oppstartstype === Oppstartstype.FELLES

  const { lagretSorteringsValg, setLagretSorteringsValg } =
    useSorteringContext()
  const { sort, handleSort, sorterteDeltagere } = useDeltakerSortering(
    filtrerteDeltakere,
    lagretSorteringsValg
  )

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
    kanDeleDeltakerMedArrangorForVurdering(
      deltakerlisteDetaljer.oppstartstype,
      deltakerlisteDetaljer.tiltakskode
    ) &&
    !!deltakere.find(
      (deltaker) =>
        deltaker.vurdering !== null || deltaker.erManueltDeltMedArrangor
    )

  if (filtrerteDeltakere.length === 0) {
    return (
      <Alert inline variant="info" size="small" className="h-fit mt-8">
        {`Innsøkte deltakere vises her. Det er foreløpig ingen innsøkte deltakere${deltakere.length === 0 ? '' : ' som samsvarer med dine filtervalg'}.`}
      </Alert>
    )
  }

  const erBatchHandling =
    handlingValg !== null && handlingValg !== HandlingValg.GI_AVSLAG

  const kanGisAvslag = (deltaker: Deltaker) =>
    [
      DeltakerStatusType.SOKT_INN,
      DeltakerStatusType.VURDERES,
      DeltakerStatusType.VENTELISTE,
      DeltakerStatusType.VENTER_PA_OPPSTART
    ].includes(deltaker.status.type)

  return (
    <div className="flex flex-col gap-3">
      {deltakerlisteDetaljer.pameldingstype ===
        Pameldingstype.TRENGER_GODKJENNING && (
        <HandlingerKnapp
          onModalOpen={() => setModalOpen(true)}
          className="place-self-end mt-2 mb-2"
        />
      )}

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

      <Table
        className="w-fit h-fit"
        zebraStripes
        sort={sort}
        onSortChange={(sortKey) => {
          handleSort(
            sortKey as ScopedSortState['orderBy'],
            setLagretSorteringsValg
          )
        }}
      >
        <Table.Header>
          <Table.Row>
            {erBatchHandling && (
              <Table.DataCell>
                <MarkerAlleCheckbox
                  valgbareDeltakere={getValgbareDeltakere(
                    handlingValg,
                    filtrerteDeltakere
                  )}
                />
              </Table.DataCell>
            )}
            {handlingValg === HandlingValg.GI_AVSLAG && (
              <Table.DataCell></Table.DataCell>
            )}
            <TableHeaderCell label="Navn" sortKey={SortKey.NAVN} />
            <TableHeaderCell label="Nav-enhet" sortKey={SortKey.NAV_ENHET} />
            {!erFellesOppstart && (
              <>
                <TableHeaderCell label="Start" sortKey={SortKey.START_DATO} />
                <TableHeaderCell label="Slutt" sortKey={SortKey.SLUTT_DATO} />
              </>
            )}
            <TableHeaderCell label="Status" sortKey={SortKey.STATUS} />
            {skalViseVurderinger && (
              <TableHeaderCell
                label="Vurdering, arrangør"
                sortKey={SortKey.VURDERING}
              />
            )}
          </Table.Row>
        </Table.Header>

        <Table.Body className="">
          {sorterteDeltagere.map((deltaker) => {
            const disabled = !kanVelges(handlingValg, deltaker)
            const navn = lagDeltakerNavnEtternavnForst(deltaker)
            return (
              <Table.Row
                key={`${deltaker.id}`}
                selected={!!valgteDeltakere.find((it) => it.id === deltaker.id)}
                className={disabled ? 'text-(--a-border-subtle-hover)' : ''}
              >
                {erBatchHandling && (
                  <Table.DataCell>
                    <VelgDeltakerCheckbox
                      deltaker={deltaker}
                      deltakerNavn={navn}
                    />
                  </Table.DataCell>
                )}
                {handlingValg === HandlingValg.GI_AVSLAG && (
                  <Table.DataCell>
                    <GiAvslagKnapp
                      disabled={!kanGisAvslag(deltaker)}
                      deltakerNavn={navn}
                      onClick={() => {
                        setValgteDeltakere([deltaker])
                        setModalOpen(true)
                      }}
                    />
                  </Table.DataCell>
                )}

                <TableDataCell className="min-w-[16rem]">
                  <HStack
                    id={`id${deltaker.id}`}
                    gap="1"
                    className="items-center"
                  >
                    {disabled ? (
                      <BodyShort size="small">{navn}</BodyShort>
                    ) : (
                      <Link
                        as={ReactRouterLink}
                        to={getDeltakerUrl(
                          deltakerlisteDetaljer.id,
                          deltaker.id
                        )}
                      >
                        {navn}
                      </Link>
                    )}

                    <BeskyttelsesmarkeringIkoner
                      beskyttelsesmarkering={deltaker.beskyttelsesmarkering}
                    />
                  </HStack>
                </TableDataCell>

                <TableDataCell text={deltaker.navEnhet} className="min-w-40" />

                {!erFellesOppstart && (
                  <>
                    <TableDataCell text={formatDate(deltaker.startdato)} />
                    <TableDataCell text={formatDate(deltaker.sluttdato)} />
                  </>
                )}

                <TableDataCell className="min-w-40">
                  <DeltakerStatusTag statusType={deltaker.status.type} />
                </TableDataCell>

                {skalViseVurderinger && (
                  <TableDataCell>
                    <Vurdering
                      vurdering={deltaker.vurdering}
                      erManueltDeltMedArrangor={
                        deltaker.erManueltDeltMedArrangor
                      }
                      disabled={disabled}
                    />
                  </TableDataCell>
                )}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>

      <HandlingFullfortMedFeilAlert />
      <HandlingFullfortAlert />

      {handlingValg && (
        <HandlingModalController
          handlingValg={handlingValg}
          modalOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSend={() => {
            setModalOpen(false)
            setValgteDeltakere([])
            setHandlingValg(null)
          }}
        />
      )}
    </div>
  )
}

interface TableHeaderCellProps {
  label: string
  sortKey: SortKey
}

const TableHeaderCell = ({ label, sortKey }: TableHeaderCellProps) => {
  return (
    <Table.ColumnHeader
      scope="col"
      className="pl-4 pr-4"
      sortKey={sortKey}
      sortable
    >
      <Label size="medium">{label}</Label>
    </Table.ColumnHeader>
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
      return 'Velg deltakere som skal deles med arrangør for vurdering.'
    case HandlingValg.SETT_PA_VENTELISTE:
      return 'Velg deltakere som skal settes på venteliste.'
    case HandlingValg.TILDEL_PLASS:
      return 'Velg deltakere som skal tilbys plass.'
    case HandlingValg.GI_AVSLAG:
      return 'Velg deltaker som skal få avslag.'
  }
}

const getValgbareDeltakere = (
  handlingValg: HandlingValg,
  deltakere: Deltaker[]
) => deltakere.filter((deltaker) => kanVelges(handlingValg, deltaker))
