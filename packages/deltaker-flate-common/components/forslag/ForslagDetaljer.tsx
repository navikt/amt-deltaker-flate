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
import { Forslag, ForslagEndringType } from '../../model/forslag.ts'
import {
  deltakerprosentText,
  getEndreDeltakelseTypeText,
  getForslagEndringAarsakText,
  getForslagStatusTypeText
} from '../../utils/displayText.ts'
import { getEndreDeltakelsesType } from '../../utils/forslagUtils.tsx'
import { formatDate } from '../../utils/utils.ts'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import assertNever = util.assertNever

interface Props {
  forslag: Forslag
}

export const ForslagtypeDetaljer = ({ forslag }: { forslag: Forslag }) => {
  const detaljer = (forslag: Forslag) => {
    switch (forslag.endring.type) {
      case ForslagEndringType.IkkeAktuell:
        return (
          <BodyLong size="small">
            Årsak: {getForslagEndringAarsakText(forslag.endring.aarsak)}
          </BodyLong>
        )
      case ForslagEndringType.AvsluttDeltakelse:
        return (
          <>
            {forslag.endring.harDeltatt && (
              <BodyLong size="small">
                Har personen deltatt?{' '}
                {forslag.endring.harDeltatt ? 'Ja' : 'Nei'}
              </BodyLong>
            )}
            {forslag.endring.sluttdato && (
              <BodyLong size="small">
                Ny sluttdato: {formatDate(forslag.endring.sluttdato)}
              </BodyLong>
            )}
            <BodyLong size="small">
              Årsak: {getForslagEndringAarsakText(forslag.endring.aarsak)}
            </BodyLong>
          </>
        )
      case ForslagEndringType.ForlengDeltakelse:
        return (
          <BodyLong size="small">
            Ny sluttdato: {formatDate(forslag.endring.sluttdato)}
          </BodyLong>
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
            Ny sluttdato: {formatDate(forslag.endring.sluttdato)}
          </BodyLong>
        )
      case ForslagEndringType.Startdato:
        return (
          <>
            <BodyLong size="small">
              Ny oppstartsdato: {formatDate(forslag.endring.startdato)}
            </BodyLong>
            <BodyLong size="small">
              Forventet sluttdato: {formatDate(forslag.endring.sluttdato)}
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
        <BodyLong size="small" className="whitespace-pre-wrap">
          Begrunnelse: {forslag.begrunnelse}
        </BodyLong>
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
