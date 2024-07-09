import { AktivtForslag, ForslagEndringType } from '../../model/forslag.ts'
import { ForlengDeltakelseForslagDetaljer } from './ForlengDeltakelseForslagDetaljer.tsx'
import { util } from 'zod'
import assertNever = util.assertNever
import { AvsluttDeltakelseForslagDetaljer } from './AvsluttDeltakelseForslagDetaljer.tsx'
import { BodyLong, Detail, Heading, HStack, Tag } from '@navikt/ds-react'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import {
  getEndreDeltakelseTypeText,
  getForslagStatusTypeText
} from '../../utils/displayText.ts'
import { formatDateFromString } from '../../utils/utils.ts'
import { IkkeAktuellForslagDetaljer } from './IkkeAktuellForslagDetaljer.tsx'
import { EndreDeltakelseType } from '../../model/endre-deltaker.ts'

interface Props {
  forslag: AktivtForslag
}

const getEndreDeltakelsesType = (forslag: AktivtForslag) => {
  switch (forslag.endring.type) {
    case ForslagEndringType.IkkeAktuell:
      return EndreDeltakelseType.IKKE_AKTUELL
    case ForslagEndringType.AvsluttDeltakelse:
      return EndreDeltakelseType.AVSLUTT_DELTAKELSE
    case ForslagEndringType.ForlengDeltakelse:
      return EndreDeltakelseType.FORLENG_DELTAKELSE
    default:
      assertNever(forslag.endring.type)
  }
}

export const getForslagtypeDetaljer = (forslag: AktivtForslag) => {
  switch (forslag.endring.type) {
    case ForslagEndringType.IkkeAktuell:
      return (
        <IkkeAktuellForslagDetaljer
          forslag={forslag}
          ikkeAktuellForslag={forslag.endring}
        />
      )
    case ForslagEndringType.AvsluttDeltakelse:
      return (
        <AvsluttDeltakelseForslagDetaljer
          forslag={forslag}
          avsluttDeltakelseForslag={forslag.endring}
        />
      )
    case ForslagEndringType.ForlengDeltakelse:
      return (
        <ForlengDeltakelseForslagDetaljer
          forlengDeltakelseForslag={forslag.endring}
        />
      )
    default:
      assertNever(forslag.endring.type)
  }
}

export const ForslagDetaljer = ({ forslag }: Props) => {
  const endreDeltakelsesType = getEndreDeltakelsesType(forslag)
  return (
    <div>
      <HStack gap="2" className="mt-2">
        <EndringTypeIkon type={endreDeltakelsesType} />
        <Heading level="6" size="small">
          {getEndreDeltakelseTypeText(endreDeltakelsesType)}
        </Heading>
        <Tag variant="info">
          {getForslagStatusTypeText(forslag.status.type)}
        </Tag>
      </HStack>
      {getForslagtypeDetaljer(forslag)}
      <BodyLong size="small">Begrunnelse: {forslag.begrunnelse}</BodyLong>
      <Detail>
        Forslag sendt fra arrangør {formatDateFromString(forslag.opprettet)}
      </Detail>
    </div>
  )
}
