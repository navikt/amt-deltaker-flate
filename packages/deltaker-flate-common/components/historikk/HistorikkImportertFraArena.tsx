import { CaretRightCircleFillIcon } from '@navikt/aksel-icons'
import { BodyLong, Detail } from '@navikt/ds-react'
import { Tiltakskode } from '../../model/deltaker'
import { importertFraArena } from '../../model/deltakerHistorikk'
import {
  getDeltakerStatusAarsakText,
  getDeltakerStatusDisplayText
} from '../../utils/displayText'
import { formatDate, formatDateWithMonthName } from '../../utils/utils'
import { DeltakelsesmengdeVisning } from '../DeltakelsesmengdeVisning'
import { HistorikkElement } from './HistorikkElement'

interface Props {
  deltakelseVedImport: importertFraArena
  tiltakskode: Tiltakskode
  erEnkeltplass: boolean
}

export const HistorikkImportertFraArena = ({
  deltakelseVedImport,
  tiltakskode,
  erEnkeltplass
}: Props) => {
  const datoText = `${formatDate(deltakelseVedImport.startdato)} ${
    deltakelseVedImport.sluttdato
      ? '- ' + formatDate(deltakelseVedImport.sluttdato)
      : '—'
  }`

  return (
    <HistorikkElement
      tittel={`Deltakelsen ble importert ${formatDateWithMonthName(deltakelseVedImport.importertDato)}`}
      icon={
        <CaretRightCircleFillIcon color="var(--ax-text-meta-lime-decoration)" />
      }
    >
      <BodyLong size="small">
        {`Status: ${getDeltakerStatusDisplayText(deltakelseVedImport.status.type)}`}
      </BodyLong>
      {deltakelseVedImport.status.aarsak && (
        <BodyLong size="small">
          {`Årsak: ${getDeltakerStatusAarsakText(deltakelseVedImport.status.aarsak)}`}
        </BodyLong>
      )}

      {deltakelseVedImport.startdato && (
        <BodyLong size="small">{`Dato: ${datoText}`}</BodyLong>
      )}

      <DeltakelsesmengdeVisning
        tiltakskode={tiltakskode}
        erEnkeltplass={erEnkeltplass}
        deltakelsesprosent={deltakelseVedImport.deltakelsesprosent}
        dagerPerUke={deltakelseVedImport.dagerPerUke}
      >
        {(text) => (
          <BodyLong size="small">{`Deltakelsesmengde: ${text}`}</BodyLong>
        )}
      </DeltakelsesmengdeVisning>

      <Detail className="mt-1" textColor="subtle">
        Deltakelsen ble opprettet i et annet datasystem og dette var
        informasjonen da den ble importert.
      </Detail>
    </HistorikkElement>
  )
}
