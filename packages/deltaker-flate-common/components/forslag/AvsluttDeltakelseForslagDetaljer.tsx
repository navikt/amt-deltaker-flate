import React from 'react'
import { BodyLong } from '@navikt/ds-react'
import { AvsluttDeltakelseForslag } from '../../model/forslag.ts'
import { getForslagEndringAarsakText } from '../../utils/displayText.ts'
import { formatDateFromString } from '../../utils/utils.ts'

interface Props {
  avsluttDeltakelseForslag: AvsluttDeltakelseForslag
}

export const AvsluttDeltakelseForslagDetaljer = ({
  avsluttDeltakelseForslag
}: Props) => {
  return (
    <div>
      <BodyLong size="small">
        Ny sluttdato: {formatDateFromString(avsluttDeltakelseForslag.sluttdato)}
      </BodyLong>
      <BodyLong size="small">
        Årsak til avslutning:{' '}
        {getForslagEndringAarsakText(avsluttDeltakelseForslag.aarsak)}
      </BodyLong>
    </div>
  )
}
