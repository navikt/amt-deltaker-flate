import { BodyLong, Detail, Heading, HStack, Tag } from '@navikt/ds-react'
import { EndreDeltakelseType } from '../../../../apps/nav-veileders-flate/src/api/data/endre-deltakelse-request.ts'
import { EndringTypeIkon } from '../../../../apps/nav-veileders-flate/src/components/tiltak/EndringTypeIkon.tsx'
import { AktivtForslag, AvsluttDeltakelseForslag } from '../../model/forslag.ts'
import {
  getForslagEndringAarsakText,
  getForslagStatusTypeText
} from '../../utils/displayText.ts'
import { formatDateFromString } from '../../utils/utils.ts'

interface Props {
  forslag: AktivtForslag
  avsluttDeltakelseForslag: AvsluttDeltakelseForslag
}

export const AvsluttDeltakelseForslagDetaljer = ({
  forslag,
  avsluttDeltakelseForslag
}: Props) => {
  return (
    <div>
      <HStack gap="2" className="mt-2">
        <EndringTypeIkon type={EndreDeltakelseType.AVSLUTT_DELTAKELSE} />
        <Heading level="6" size="small">
          Avslutt deltakelse
        </Heading>
        <Tag variant="info">
          {getForslagStatusTypeText(forslag.status.type)}
        </Tag>
      </HStack>
      <BodyLong className="mt-2" size="small">
        Ny sluttdato: {formatDateFromString(avsluttDeltakelseForslag.sluttdato)}
      </BodyLong>
      <BodyLong className="mt-2" size="small">
        Årsak til avslutning:{' '}
        {getForslagEndringAarsakText(avsluttDeltakelseForslag.aarsak)}
      </BodyLong>
      <BodyLong size="small">Begrunnelse: {forslag.begrunnelse}</BodyLong>
      <Detail>
        Forslag sendt fra arrangør {formatDateFromString(forslag.opprettet)}
      </Detail>
    </div>
  )
}
