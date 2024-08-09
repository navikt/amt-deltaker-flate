import { BodyLong } from '@navikt/ds-react'
import { ForlengDeltakelseForslag } from '../../model/forslag.ts'
import { formatDate } from '../../utils/utils.ts'

interface Props {
  forlengDeltakelseForslag: ForlengDeltakelseForslag
}

export const ForlengDeltakelseForslagDetaljer = ({
  forlengDeltakelseForslag
}: Props) => {
  return (
    <div>
      <BodyLong size="small">
        Ny sluttdato: {formatDate(forlengDeltakelseForslag.sluttdato)}
      </BodyLong>
    </div>
  )
}
