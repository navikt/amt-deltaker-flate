import { BodyShort, Link, Table } from '@navikt/ds-react'
import {
  DeltakerStatusTag,
  DeltakerStatusType,
  formatDate
} from 'deltaker-flate-common'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Deltaker } from '../../api/data/deltakerliste.ts'
import { HandlingValg } from '../../context-providers/HandlingContext.tsx'
import { getDeltakerUrl } from '../../navigation.ts'
import { lagDeltakerNavnEtternavnForst } from '../../utils/utils.ts'
import { BeskyttelsesmarkeringIkoner } from '../BeskyttelsesmarkeringIkoner.tsx'
import { Vurdering } from '../Vurdering.tsx'
import { GiAvslagKnapp } from './GiAvslagKnapp.tsx'
import { VelgDeltakerCheckbox } from './VelgDeltakerCheckbox.tsx'

// Statuser der deltaker kan gis avslag
const AVSLAG_STATUSER = [
  DeltakerStatusType.SOKT_INN,
  DeltakerStatusType.VURDERES,
  DeltakerStatusType.VENTELISTE,
  DeltakerStatusType.VENTER_PA_OPPSTART
]

interface DeltakerRadProps {
  deltaker: Deltaker
  deltakerlisteId: string
  handlingValg: HandlingValg | null
  erBatchHandling: boolean
  erLopendeOppstart: boolean
  skalViseVurderinger: boolean
  disabled: boolean
  selected: boolean
  onGiAvslag: (deltaker: Deltaker) => void
}

export const DeltakerRad = ({
  deltaker,
  deltakerlisteId,
  handlingValg,
  erBatchHandling,
  erLopendeOppstart,
  skalViseVurderinger,
  disabled,
  selected,
  onGiAvslag
}: DeltakerRadProps) => {
  const navn = lagDeltakerNavnEtternavnForst(deltaker)

  return (
    <Table.Row
      selected={selected}
      className={disabled ? 'text-(--ax-border-neutral)' : ''}
    >
      {erBatchHandling && (
        <Table.DataCell>
          <VelgDeltakerCheckbox deltaker={deltaker} deltakerNavn={navn} />
        </Table.DataCell>
      )}

      {handlingValg === HandlingValg.GI_AVSLAG && (
        <Table.DataCell>
          <GiAvslagKnapp
            disabled={!AVSLAG_STATUSER.includes(deltaker.status.type)}
            deltakerNavn={navn}
            onClick={() => onGiAvslag(deltaker)}
          />
        </Table.DataCell>
      )}

      <Table.DataCell className="px-2 min-w-48">
        <div id={`id${deltaker.id}`} className="flex gap-4 items-center">
          {disabled ? (
            <BodyShort size="small">{navn}</BodyShort>
          ) : (
            <Link
              as={ReactRouterLink}
              to={getDeltakerUrl(deltakerlisteId, deltaker.id)}
            >
              {navn}
            </Link>
          )}

          <BeskyttelsesmarkeringIkoner
            beskyttelsesmarkering={deltaker.beskyttelsesmarkering}
          />
        </div>
      </Table.DataCell>

      <Table.DataCell className="px-2 min-w-32">
        <BodyShort size="small">{deltaker.navEnhet}</BodyShort>
      </Table.DataCell>

      <Table.DataCell className="px-2">
        <BodyShort size="small">{formatDate(deltaker.soktInnDato)}</BodyShort>
      </Table.DataCell>

      {erLopendeOppstart && (
        <>
          <Table.DataCell className="px-2">
            <BodyShort size="small">{formatDate(deltaker.startdato)}</BodyShort>
          </Table.DataCell>
          <Table.DataCell className="px-2">
            <BodyShort size="small">{formatDate(deltaker.sluttdato)}</BodyShort>
          </Table.DataCell>
        </>
      )}

      <Table.DataCell className="px-2 min-w-32">
        <DeltakerStatusTag statusType={deltaker.status.type} />
      </Table.DataCell>

      {skalViseVurderinger && (
        <Table.DataCell className="px-2">
          <Vurdering
            vurdering={deltaker.vurdering}
            erManueltDeltMedArrangor={deltaker.erManueltDeltMedArrangor}
            disabled={disabled}
          />
        </Table.DataCell>
      )}
    </Table.Row>
  )
}
