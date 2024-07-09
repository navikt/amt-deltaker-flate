import { BodyLong } from '@navikt/ds-react'
import { AktivtForslag, AvsluttDeltakelseForslag } from '../../model/forslag.ts'
import { getForslagEndringAarsakText } from '../../utils/displayText.ts'
import { formatDateFromString } from '../../utils/utils.ts'

interface Props {
  forslag: AktivtForslag
  avsluttDeltakelseForslag: AvsluttDeltakelseForslag
}

export const AvsluttDeltakelseForslagDetaljer = ({
  avsluttDeltakelseForslag
}: Props) => {
  return (
    <div>
      <BodyLong className="mt-2" size="small">
        Ny sluttdato: {formatDateFromString(avsluttDeltakelseForslag.sluttdato)}
      </BodyLong>
      <BodyLong className="mt-2" size="small">
        Årsak til avslutning:{' '}
        {getForslagEndringAarsakText(avsluttDeltakelseForslag.aarsak)}
      </BodyLong>
    </div>
  )
}
