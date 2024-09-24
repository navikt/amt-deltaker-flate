import { CaretRightCircleFillIcon } from '@navikt/aksel-icons'
import { BodyLong, Detail } from '@navikt/ds-react'
import { Tiltakstype } from '../../model/deltaker'
import { importertFraArena } from '../../model/deltakerHistorikk'
import {
  deltakerprosentText,
  getDeltakerStatusAarsakText,
  getDeltakerStatusDisplayText
} from '../../utils/displayText'
import {
  formatDate,
  formatDateWithMonthName,
  visDeltakelsesmengde
} from '../../utils/utils'
import { HistorikkElement } from './HistorikkElement'

interface Props {
  deltakelseVedImport: importertFraArena
  tiltakstype: Tiltakstype
}

export const HistorikkImportertFraArena = ({
  deltakelseVedImport,
  tiltakstype
}: Props) => {
  const datoText = `${formatDate(deltakelseVedImport.startdato)} ${
    deltakelseVedImport.sluttdato
      ? '- ' + formatDate(deltakelseVedImport.sluttdato)
      : '—'
  }`

  return (
    <HistorikkElement
      tittel={`Deltakelsen ble importert ${formatDateWithMonthName(deltakelseVedImport.importertDato)}`}
      icon={<CaretRightCircleFillIcon color="var(--a-limegreen-800)" />}
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

      {visDeltakelsesmengde(tiltakstype) && (
        <>
          <BodyLong size="small">
            {`Deltakelsesmengde: ${deltakerprosentText(
              deltakelseVedImport.deltakelsesprosent,
              deltakelseVedImport.dagerPerUke
            )}`}
          </BodyLong>
        </>
      )}

      <Detail className="mt-1" textColor="subtle">
        Deltakelsen ble opprettet i et annet datasystem og dette var
        informasjonen da den ble importert.
      </Detail>
    </HistorikkElement>
  )
}
