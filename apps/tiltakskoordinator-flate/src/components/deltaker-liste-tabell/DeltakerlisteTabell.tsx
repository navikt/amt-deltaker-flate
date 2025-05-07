import { Alert, BodyShort, HStack, Label, Link, Table } from '@navikt/ds-react'
import { DeltakerStatusTag, Tiltakskode } from 'deltaker-flate-common'
import { useEffect, useRef, useState } from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Deltaker } from '../../api/data/deltakerliste.ts'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext.tsx'
import {
  HandlingValg,
  useHandlingContext
} from '../../context-providers/HandlingContext.tsx'
import { getDeltakerUrl } from '../../navigation.ts'
import { lagDeltakerNavn } from '../../utils/utils.ts'
import { kanVelges } from '../../utils/velgDeltakereUtils.ts'
import { BeskyttelsesmarkeringIkoner } from '../BeskyttelsesmarkeringIkoner.tsx'
import { HandlingerKnapp } from '../handling/HandlingerKnapp.tsx'
import { HandlingFullfortAlert } from '../handling/HandlingFullfortAlert.tsx'
import { Vurdering } from '../Vurdering.tsx'
import { MarkerAlleCheckbox } from './MarkerAlleCheckbox.tsx'
import { VelgDeltakerCheckbox } from './VelgDeltakerCheckbox.tsx'
import { GiAvslagKnapp } from './GiAvslagKnapp.tsx'
import { HandlingModalController } from '../handling/HandlingModalController.tsx'

export const DeltakerlisteTabell = () => {
  const { deltakere, deltakerlisteDetaljer } = useDeltakerlisteContext()
  const { handlingValg, valgteDeltakere, setValgteDeltakere, setHandlingValg } =
    useHandlingContext()

  const [modalOpen, setModalOpen] = useState(false)

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
      Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING ||
    deltakerlisteDetaljer.tiltakskode ==
      Tiltakskode.GRUPPE_FAG_OG_YRKESOPPLAERING

  if (deltakere.length === 0) {
    return (
      <Alert inline variant="info" size="small" className="h-fit">
        Innsøkte deltakere vises her. Det er foreløpig ingen innsøkte deltakere.
      </Alert>
    )
  }

  const erBatchHandling =
    handlingValg !== null && handlingValg !== HandlingValg.GI_AVSLAG

  return (
    <div className="flex flex-col gap-3">
      <HandlingerKnapp
        onModalOpen={() => setModalOpen(true)}
        className="place-self-end mt-2 mb-2"
      />

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
            {erBatchHandling && (
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

        <Table.Body className="">
          {deltakere.map((deltaker) => {
            const disabled = !kanVelges(handlingValg, deltaker)
            const navn = lagDeltakerNavn(
              deltaker.fornavn,
              deltaker.mellomnavn,
              deltaker.etternavn
            )
            return (
              <Table.Row
                key={`${deltaker.id}`}
                selected={!!valgteDeltakere.find((it) => it.id === deltaker.id)}
                className={
                  disabled ? 'text-[var(--a-border-subtle-hover)]' : ''
                }
              >
                {erBatchHandling && (
                  <Table.DataCell>
                    <VelgDeltakerCheckbox
                      deltaker={deltaker}
                      labelId={`id${deltaker.id}`}
                    />
                  </Table.DataCell>
                )}
                {handlingValg === HandlingValg.GI_AVSLAG && (
                  <Table.DataCell>
                    <GiAvslagKnapp
                      onClick={() => {
                        setValgteDeltakere([deltaker])
                        setModalOpen(true)
                      }}
                    />
                  </Table.DataCell>
                )}

                <TableDataCell>
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

                <TableDataCell text={deltaker.navEnhet} />

                <TableDataCell>
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
