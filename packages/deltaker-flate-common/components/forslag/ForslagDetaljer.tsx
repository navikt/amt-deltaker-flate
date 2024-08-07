import {
  BodyLong,
  BodyShort,
  Detail,
  Heading,
  HGrid,
  HStack,
  Tag,
  VStack
} from '@navikt/ds-react'
import { util } from 'zod'
import { EndreDeltakelseType } from '../../model/endre-deltaker.ts'
import { Forslag, ForslagEndringType } from '../../model/forslag.ts'
import {
  deltakerprosentText,
  getEndreDeltakelseTypeText,
  getForslagEndringAarsakText,
  getForslagStatusTypeText
} from '../../utils/displayText.ts'
import { formatDate, formatDateFromString } from '../../utils/utils.ts'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import { AvsluttDeltakelseForslagDetaljer } from './AvsluttDeltakelseForslagDetaljer.tsx'
import { ForlengDeltakelseForslagDetaljer } from './ForlengDeltakelseForslagDetaljer.tsx'
import { IkkeAktuellForslagDetaljer } from './IkkeAktuellForslagDetaljer.tsx'
import assertNever = util.assertNever

interface Props {
  forslag: Forslag
}

export const getEndreDeltakelsesType = (forslag: Forslag) => {
  switch (forslag.endring.type) {
    case ForslagEndringType.IkkeAktuell:
      return EndreDeltakelseType.IKKE_AKTUELL
    case ForslagEndringType.AvsluttDeltakelse:
      return EndreDeltakelseType.AVSLUTT_DELTAKELSE
    case ForslagEndringType.ForlengDeltakelse:
      return EndreDeltakelseType.FORLENG_DELTAKELSE
    case ForslagEndringType.Deltakelsesmengde:
      return EndreDeltakelseType.ENDRE_DELTAKELSESMENGDE
    case ForslagEndringType.Sluttdato:
      return EndreDeltakelseType.ENDRE_SLUTTDATO
    case ForslagEndringType.Startdato:
      return EndreDeltakelseType.ENDRE_OPPSTARTSDATO
    case ForslagEndringType.Sluttarsak:
      return EndreDeltakelseType.ENDRE_SLUTTARSAK
    default:
      assertNever(forslag.endring)
  }
}

export const ForslagtypeDetaljer = ({ forslag }: { forslag: Forslag }) => {
  const detaljer = (forslag: Forslag) => {
    switch (forslag.endring.type) {
      case ForslagEndringType.IkkeAktuell:
        return (
          <IkkeAktuellForslagDetaljer ikkeAktuellForslag={forslag.endring} />
        )
      case ForslagEndringType.AvsluttDeltakelse:
        return (
          <AvsluttDeltakelseForslagDetaljer
            avsluttDeltakelseForslag={forslag.endring}
          />
        )
      case ForslagEndringType.ForlengDeltakelse:
        return (
          <ForlengDeltakelseForslagDetaljer
            forlengDeltakelseForslag={forslag.endring}
          />
        )
      case ForslagEndringType.Deltakelsesmengde:
        return (
          <BodyShort size="small">
            Ny deltakelsesmengde:{' '}
            {deltakerprosentText(
              forslag.endring.deltakelsesprosent,
              forslag.endring.dagerPerUke
            )}
          </BodyShort>
        )
      case ForslagEndringType.Sluttdato:
        return (
          <BodyLong size="small">
            Ny sluttdato: {formatDateFromString(forslag.endring.sluttdato)}
          </BodyLong>
        )
      case ForslagEndringType.Startdato:
        return (
          <>
            <BodyLong size="small">
              Ny oppstartsdato:{' '}
              {formatDateFromString(forslag.endring.startdato)}
            </BodyLong>
            <BodyLong size="small">
              Ny sluttdato: {formatDateFromString(forslag.endring.sluttdato)}
            </BodyLong>
          </>
        )
      case ForslagEndringType.Sluttarsak:
        return (
          <BodyLong size="small">
            Ny sluttårsak: {getForslagEndringAarsakText(forslag.endring.aarsak)}
          </BodyLong>
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
          Forslag sendt fra arrangør {formatDate(forslag.opprettet)}
        </Detail>
      </VStack>
    </HGrid>
  )
}
