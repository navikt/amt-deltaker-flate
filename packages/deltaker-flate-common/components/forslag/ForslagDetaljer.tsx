import React from 'react'
import { AktivtForslag, ForslagEndringType } from '../../model/forslag.ts'
import { ForlengDeltakelseForslagDetaljer } from './ForlengDeltakelseForslagDetaljer.tsx'
import { util } from 'zod'
import assertNever = util.assertNever
import { AvsluttDeltakelseForslagDetaljer } from './AvsluttDeltakelseForslagDetaljer.tsx'
import {
  BodyLong,
  Detail,
  Heading,
  HGrid,
  HStack,
  Tag,
  VStack
} from '@navikt/ds-react'
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
      assertNever(forslag.endring)
  }
}

export const ForslagtypeDetaljer = ({
  forslag
}: {
  forslag: AktivtForslag
}) => {
  const detaljer = (forslag: AktivtForslag) => {
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
        assertNever(forslag.endring)
    }
  }
  return (
    <>
      {detaljer(forslag)}
      {forslag.begrunnelse && (
        <BodyLong size="small">Begrunnelse: {forslag.begrunnelse}</BodyLong>
      )}
    </>
  )
}

export const ForslagDetaljer = ({ forslag }: Props) => {
  const endreDeltakelsesType = getEndreDeltakelsesType(forslag)
  return (
    <HGrid columns="2rem auto" className="p-4 items-start">
      <VStack>
        <EndringTypeIkon type={endreDeltakelsesType} size="large" />
      </VStack>
      <VStack className="items-start">
        <HStack gap="2" className="mb-2">
          <Heading level="3" size="small">
            {getEndreDeltakelseTypeText(endreDeltakelsesType)}
          </Heading>
          <Tag variant="info" size="small">
            {getForslagStatusTypeText(forslag.status.type)}
          </Tag>
        </HStack>
        <ForslagtypeDetaljer forslag={forslag} />
        <Detail>
          Forslag sendt fra arrangør {formatDateFromString(forslag.opprettet)}
        </Detail>
      </VStack>
    </HGrid>
  )
}
