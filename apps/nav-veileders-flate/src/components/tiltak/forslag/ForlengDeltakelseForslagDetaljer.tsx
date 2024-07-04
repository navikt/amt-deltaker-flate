import {
  AktivtForslag,
  ForlengDeltakelseForslag
} from '../../../api/data/forslag.ts'
import { BodyLong, Detail, Heading, HStack, Tag } from '@navikt/ds-react'
import { EndreDeltakelseType } from '../../../api/data/endre-deltakelse-request.ts'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import { formatDateFromString } from 'deltaker-flate-common'
import { getForslagStatusTypeText } from '../../../utils/displayText.ts'

interface Props {
  forslag: AktivtForslag
  forlengDeltakelseForslag: ForlengDeltakelseForslag
}

export const ForlengDeltakelseForslagDetaljer = ({
  forslag,
  forlengDeltakelseForslag
}: Props) => {
  return (
    <div>
      <HStack gap="2" className="mt-2">
        <EndringTypeIkon type={EndreDeltakelseType.FORLENG_DELTAKELSE} />
        <Heading level="6" size="small">
          Forleng deltakelse
        </Heading>
        <Tag variant="info">
          {getForslagStatusTypeText(forslag.status.type)}
        </Tag>
      </HStack>
      <BodyLong className="mt-2" size="small">
        Ny sluttdato: {formatDateFromString(forlengDeltakelseForslag.sluttdato)}
      </BodyLong>
      <BodyLong size="small">Begrunnelse: {forslag.begrunnelse}</BodyLong>
      <Detail>
        Forslag sendt fra arrangør {formatDateFromString(forslag.opprettet)}
      </Detail>
    </div>
  )
}
