import { Alert, Label, Table } from '@navikt/ds-react'
import {
  harLopendeOppstart,
  kanDeleDeltakerMedArrangorForVurdering,
  Pameldingstype
} from 'deltaker-flate-common'
import { useEffect, useRef, useState } from 'react'
import { Deltaker } from '../../api/data/deltakerliste.ts'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext.tsx'
import { useFilterContext } from '../../context-providers/FilterContext.tsx'
import {
  HandlingValg,
  useHandlingContext
} from '../../context-providers/HandlingContext.tsx'
import { useSorteringContext } from '../../context-providers/SorteringContext.tsx'
import {
  ScopedSortState,
  SortKey,
  useDeltakerSortering
} from '../../hooks/useDeltakerSortering.ts'
import { kanVelges } from '../../utils/velgDeltakereUtils.ts'
import { HandlingerKnapp } from '../handling/HandlingerKnapp.tsx'
import { HandlingFullfortAlert } from '../handling/HandlingFullfortAlert.tsx'
import { HandlingFullfortMedFeilAlert } from '../handling/HandlingFullfortMedFeilAlert.tsx'
import { HandlingModalController } from '../handling/HandlingModalController.tsx'
import { DeltakerRad } from './DeltakerRad.tsx'
import { MarkerAlleCheckbox } from './MarkerAlleCheckbox.tsx'

export const DeltakerlisteTabell = ({
  deltakere
}: {
  deltakere: Deltaker[]
}) => {
  const { deltakerlisteDetaljer, statusCounts } = useDeltakerlisteContext()
  const { valgteHendelseFilter } = useFilterContext()
  const { handlingValg, valgteDeltakere, setValgteDeltakere, setHandlingValg } =
    useHandlingContext()

  const [modalOpen, setModalOpen] = useState(false)

  const handlingValgRef = useRef<HandlingValg | null>(null)
  const handlingInfoAlertRef = useRef<HTMLDivElement>(null)
  const erLopendeOppstart = harLopendeOppstart(
    deltakerlisteDetaljer.oppstartstype
  )

  const { lagretSorteringsValg, setLagretSorteringsValg } =
    useSorteringContext()
  const { sort, handleSort, sorterteDeltagere } = useDeltakerSortering(
    deltakere,
    lagretSorteringsValg
  )

  // Flytt fokus til info-alert når handlingValg endres (skjermleser-støtte)
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

  // Vis vurderingskolonne kun for tiltak som støtter det, og bare
  // hvis minst én deltaker har vurdering eller er manuelt delt
  const skalViseVurderinger =
    kanDeleDeltakerMedArrangorForVurdering(
      deltakerlisteDetaljer.pameldingstype,
      deltakerlisteDetaljer.tiltakskode,
      deltakerlisteDetaljer.erEnkeltplass
    ) &&
    !!deltakere.find(
      (deltaker) =>
        deltaker.vurdering !== null || deltaker.erManueltDeltMedArrangor
    )

  if (deltakere.length === 0) {
    const harDeltakere = Object.values(statusCounts).some((count) => count! > 0)
    const filterErAktiv = harDeltakere || valgteHendelseFilter.length > 0

    return (
      <Alert inline variant="info" size="small" className="h-fit mt-8">
        {`Innsøkte deltakere vises her. Det er foreløpig ingen innsøkte deltakere${filterErAktiv ? ' som samsvarer med dine filtervalg' : ''}.`}
      </Alert>
    )
  }

  // Batch-handling = checkboxer i tabellen. GI_AVSLAG er per-deltaker med egen knapp.
  const erBatchHandling =
    handlingValg !== null && handlingValg !== HandlingValg.GI_AVSLAG

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

      <div
        className="w-full overflow-x-auto focus-visible:outline focus-visible:outline-offset-2"
        // tabIndex for keyboard-scrolling; region role for screen readers
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        role="region"
        aria-label="Deltakerliste, skrollbar tabell"
      >
        <Table
          className="w-full h-fit"
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
                <Table.ColumnHeader scope="col">
                  <MarkerAlleCheckbox
                    valgbareDeltakere={getValgbareDeltakere(
                      handlingValg,
                      deltakere
                    )}
                  />
                </Table.ColumnHeader>
              )}
              {handlingValg === HandlingValg.GI_AVSLAG && (
                <Table.ColumnHeader scope="col">
                  <span className="sr-only">Gi avslag</span>
                </Table.ColumnHeader>
              )}
              <Table.ColumnHeader
                scope="col"
                className="px-2"
                sortKey={SortKey.NAVN}
                sortable
              >
                <Label size="medium">Navn</Label>
              </Table.ColumnHeader>
              <Table.ColumnHeader
                scope="col"
                className="px-2"
                sortKey={SortKey.NAV_ENHET}
                sortable
              >
                <Label size="medium">Nav-enhet</Label>
              </Table.ColumnHeader>
              <Table.ColumnHeader
                scope="col"
                className="px-2"
                sortKey={SortKey.SOKT_INN_DATO}
                sortable
              >
                <Label size="medium">Søkt inn</Label>
              </Table.ColumnHeader>
              {erLopendeOppstart && (
                <>
                  <Table.ColumnHeader
                    scope="col"
                    className="px-2"
                    sortKey={SortKey.START_DATO}
                    sortable
                  >
                    <Label size="medium">Start</Label>
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    scope="col"
                    className="px-2"
                    sortKey={SortKey.SLUTT_DATO}
                    sortable
                  >
                    <Label size="medium">Slutt</Label>
                  </Table.ColumnHeader>
                </>
              )}
              <Table.ColumnHeader
                scope="col"
                className="px-2"
                sortKey={SortKey.STATUS}
                sortable
              >
                <Label size="medium">Status</Label>
              </Table.ColumnHeader>
              {skalViseVurderinger && (
                <Table.ColumnHeader
                  scope="col"
                  className="px-2"
                  sortKey={SortKey.VURDERING}
                  sortable
                >
                  <Label size="medium">Vurdering, arrangør</Label>
                </Table.ColumnHeader>
              )}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {sorterteDeltagere.map((deltaker) => (
              <DeltakerRad
                key={deltaker.id}
                deltaker={deltaker}
                deltakerlisteId={deltakerlisteDetaljer.id}
                handlingValg={handlingValg}
                erBatchHandling={erBatchHandling}
                erLopendeOppstart={erLopendeOppstart}
                skalViseVurderinger={skalViseVurderinger}
                disabled={!kanVelges(handlingValg, deltaker)}
                selected={valgteDeltakere.some((it) => it.id === deltaker.id)}
                onGiAvslag={(d) => {
                  setValgteDeltakere([d])
                  setModalOpen(true)
                }}
              />
            ))}
          </Table.Body>
        </Table>
      </div>

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
