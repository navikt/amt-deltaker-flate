import { BodyLong, Detail } from '@navikt/ds-react'
import { Forslag, ForslagStatusType } from '../../model/forslag'
import { getForslagTittel } from '../../utils/displayText'
import { getEndreDeltakelsesType } from '../../utils/forslagUtils'
import { formatDate } from '../../utils/utils'
import { EndringTypeIkon } from '../EndringTypeIkon'
import { HistorikkElement } from './HistorikkElement'

interface Props {
  forslag: Forslag
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
      return '' // Vi viser ikke andre statuser i historikken.
  }
}

export const HistorikkForslag = ({ forslag }: Props) => {
  const endreDeltakelsesType = getEndreDeltakelsesType(forslag)
  const forslagStatusTekst = getForslagStatusTekst(forslag)
  return (
    <HistorikkElement
      tittel={`Forslag: ${getForslagTittel(forslag.endring.type)}`}
      icon={<EndringTypeIkon type={endreDeltakelsesType} size={'small'} />}
      forslag={forslag}
    >
      {forslag.status.type === ForslagStatusType.Avvist && (
        <BodyLong size="small">{forslag.status.begrunnelseFraNav}</BodyLong>
      )}

      {forslagStatusTekst && (
        <Detail textColor="subtle">{forslagStatusTekst}</Detail>
      )}
    </HistorikkElement>
  )
}
