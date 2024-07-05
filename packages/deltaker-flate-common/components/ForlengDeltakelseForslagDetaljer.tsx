import { BodyLong, Detail, Heading, HStack, Tag } from '@navikt/ds-react'
import { EndreDeltakelseType } from '../../../apps/nav-veileders-flate/src/api/data/endre-deltakelse-request.ts'
import { EndringTypeIkon } from '../../../apps/nav-veileders-flate/src/components/tiltak/EndringTypeIkon.tsx'
import { AktivtForslag, ForlengDeltakelseForslag } from '../model/forslag.ts'
import { getForslagStatusTypeText } from '../utils/displayText.ts'
import { formatDateFromString } from '../utils/utils.ts'

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
