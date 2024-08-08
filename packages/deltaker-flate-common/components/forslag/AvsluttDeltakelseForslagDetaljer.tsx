import { BodyLong } from '@navikt/ds-react'
import { AvsluttDeltakelseForslag } from '../../model/forslag.ts'
import { getForslagEndringAarsakText } from '../../utils/displayText.ts'
import { formatDate } from '../../utils/utils.ts'

interface Props {
  avsluttDeltakelseForslag: AvsluttDeltakelseForslag
}

export const AvsluttDeltakelseForslagDetaljer = ({
  avsluttDeltakelseForslag
}: Props) => {
  return (
    <div>
      <BodyLong size="small">
        Ny sluttdato: {formatDate(avsluttDeltakelseForslag.sluttdato)}
      </BodyLong>
      <BodyLong size="small">
        Årsak til avslutning:{' '}
        {getForslagEndringAarsakText(avsluttDeltakelseForslag.aarsak)}
      </BodyLong>
    </div>
  )
}
