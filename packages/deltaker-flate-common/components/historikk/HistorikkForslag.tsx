import { BodyLong, Detail } from '@navikt/ds-react'
import {
  Forslag,
  ForslagEndringType,
  ForslagStatusType
} from '../../model/forslag'
import {
  getForslagEndringAarsakText,
  getForslagTittel
} from '../../utils/displayText'
import { formatDate } from '../../utils/utils'
import { EndringTypeIkon } from '../EndringTypeIkon'
import { HistorikkElement } from './HistorikkElement'
import { getEndreDeltakelsesType } from '../../utils/forslagUtils'

interface Props {
  forslag: Forslag
}

export const getForslagsDetaljer = (forslag: Forslag) => {
  switch (forslag.endring.type) {
    case ForslagEndringType.IkkeAktuell: {
      return (
        <>
          <BodyLong size="small" weight="semibold">
            Er ikke aktuell
          </BodyLong>
          <BodyLong size="small">
            {getForslagEndringAarsakText(forslag.endring.aarsak)}
          </BodyLong>
          <Detail>
            {`Sendt ${formatDate(forslag.opprettet)} fra ${forslag.arrangorNavn}`}
          </Detail>
        </>
      )
    }
    case ForslagEndringType.ForlengDeltakelse: {
      return <div></div>
    }
    case ForslagEndringType.AvsluttDeltakelse: {
      return <div></div>
    }
    case ForslagEndringType.Deltakelsesmengde: {
      return <div></div>
    }
    case ForslagEndringType.Sluttarsak: {
      return <div></div>
    }
    case ForslagEndringType.Sluttdato: {
      return <div></div>
    }
    case ForslagEndringType.Startdato: {
      return <div></div>
    }
  }
}

const getForslagStatusTekst = (forslag: Forslag) => {
  const forslagStatus = forslag.status
  switch (forslagStatus.type) {
    case ForslagStatusType.Avvist:
      return `Avvist ${formatDate(forslagStatus.avvist)} av ${forslagStatus.avvistAv} ${forslagStatus.avvistAvEnhet}.`
    case ForslagStatusType.Tilbakekalt:
      return `Tilbakekalt ${formatDate(forslagStatus.tilbakekalt)} av ${forslag.arrangorNavn}.`
    case ForslagStatusType.Erstattet:
      return `Erstattet av et nyere forslag ${formatDate(forslagStatus.erstattet)} av ${forslag.arrangorNavn}.`
    default:
      return ''
  }
}

export const HistorikkForslag = ({ forslag }: Props) => {
  const endreDeltakelsesType = getEndreDeltakelsesType(forslag)

  return (
    <HistorikkElement
      tittel={`Forslag: ${getForslagTittel(forslag.endring.type)}`}
      icon={<EndringTypeIkon type={endreDeltakelsesType} size={'small'} />}
      forslag={getForslagsDetaljer(forslag)}
    >
      {forslag.status.type === ForslagStatusType.Avvist && (
        <BodyLong size="small">{forslag.status.begrunnelseFraNav}</BodyLong>
      )}
      <Detail size="small">{getForslagStatusTekst(forslag)}</Detail>
    </HistorikkElement>
  )
}
