import { BodyLong } from '@navikt/ds-react'
import { ForlengDeltakelseForslag } from '../../model/forslag.ts'
import { formatDateFromString } from '../../utils/utils.ts'

interface Props {
  forlengDeltakelseForslag: ForlengDeltakelseForslag
}

export const ForlengDeltakelseForslagDetaljer = ({
  forlengDeltakelseForslag
}: Props) => {
  return (
    <div>
      <BodyLong size="small">
        Ny sluttdato: {formatDateFromString(forlengDeltakelseForslag.sluttdato)}
      </BodyLong>
    </div>
  )
}
