import {
  BodyLong,
  BodyShort,
  Detail,
  Heading,
  HGrid,
  Tag,
  VStack
} from '@navikt/ds-react'
import {
  Forslag,
  ForslagEndring,
  ForslagEndringType
} from '../../model/forslag.ts'
import {
  deltakerprosentText,
  getEndreDeltakelseTypeText,
  getForslagEndringAarsakText,
  getForslagStatusTypeText
} from '../../utils/displayText.ts'
import {
  ACTION_BLUE_TAG_STYLE,
  assertNever,
  getEndreDeltakelsesType
} from '../../utils/forslagUtils.tsx'
import { formatDate } from '../../utils/utils.ts'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'

interface Props {
  begrunnelse?: string | null
  forslagEndring: ForslagEndring
}

export const ForslagtypeDetaljer = ({ forslagEndring, begrunnelse }: Props) => {
  const detaljer = (endring: ForslagEndring) => {
    switch (endring.type) {
      case ForslagEndringType.IkkeAktuell:
        return (
          <BodyLong size="small">
            Årsak: {getForslagEndringAarsakText(endring.aarsak)}
          </BodyLong>
        )
      case ForslagEndringType.AvsluttDeltakelse:
      case ForslagEndringType.EndreAvslutning:
        return (
          <>
            {endring.aarsak && (
              <BodyLong size="small">
                Årsak: {getForslagEndringAarsakText(endring.aarsak)}
              </BodyLong>
            )}
            {endring.harDeltatt !== null && (
              <BodyLong size="small">
                Har personen deltatt? {endring.harDeltatt ? 'Ja' : 'Nei'}
              </BodyLong>
            )}
            {endring.harDeltatt && endring.harFullfort !== null && (
              <BodyLong size="small">
                Er kurset fullført? {endring.harFullfort ? 'Ja' : 'Nei'}
              </BodyLong>
            )}

            {endring.type == ForslagEndringType.EndreAvslutning &&
              endring.sluttdato !== null && (
                <BodyLong size="small">
                  Sluttdato: {formatDate(endring.sluttdato)}
                </BodyLong>
              )}
            {endring.type == ForslagEndringType.AvsluttDeltakelse &&
              endring.sluttdato && (
                <BodyLong size="small">
                  Ny sluttdato: {formatDate(endring.sluttdato)}
                </BodyLong>
              )}
          </>
        )
      case ForslagEndringType.ForlengDeltakelse:
        return (
          <BodyLong size="small">
            Ny sluttdato: {formatDate(endring.sluttdato)}
          </BodyLong>
        )
      case ForslagEndringType.Deltakelsesmengde:
        return (
          <>
            <BodyShort size="small">
              Ny deltakelsesmengde:{' '}
              {deltakerprosentText(
                endring.deltakelsesprosent,
                endring.dagerPerUke
              )}
            </BodyShort>
            {endring.gyldigFra && (
              <BodyShort size="small">
                Gjelder fra: {formatDate(endring.gyldigFra)}
              </BodyShort>
            )}
          </>
        )
      case ForslagEndringType.Sluttdato:
        return (
          <BodyLong size="small">
            Ny sluttdato: {formatDate(endring.sluttdato)}
          </BodyLong>
        )
      case ForslagEndringType.Startdato:
        return (
          <>
            <BodyLong size="small">
              Ny oppstartsdato: {formatDate(endring.startdato)}
            </BodyLong>
            {endring.sluttdato && (
              <BodyLong size="small">
                Forventet sluttdato: {formatDate(endring.sluttdato)}
              </BodyLong>
            )}
          </>
        )
      case ForslagEndringType.Sluttarsak:
        return (
          <BodyLong size="small">
            Ny sluttårsak: {getForslagEndringAarsakText(endring.aarsak)}
          </BodyLong>
        )
      case ForslagEndringType.FjernOppstartsdato:
        return null
      default:
        assertNever(endring)
    }
  }
  return (
    <>
      {detaljer(forslagEndring)}
      {begrunnelse && (
        <BodyLong size="small" className="whitespace-pre-wrap">
          Begrunnelse: {begrunnelse}
        </BodyLong>
      )}
    </>
  )
}

interface ForslagDetaljerProps {
  forslag: Forslag
}

export const ForslagDetaljer = ({ forslag }: ForslagDetaljerProps) => {
  const endreDeltakelsesType = getEndreDeltakelsesType(forslag.endring)
  return (
    <HGrid columns="2rem auto" className="p-4 items-start">
      <EndringTypeIkon type={endreDeltakelsesType} size="large" />

      <VStack className="items-start">
        <div className="flex gap-8 mb-2">
          <Heading level="3" size="small">
            {getEndreDeltakelseTypeText(endreDeltakelsesType)}
          </Heading>
          {forslag.status.type && (
            <Tag
              variant="outline"
              className={ACTION_BLUE_TAG_STYLE}
              size="small"
            >
              {getForslagStatusTypeText(forslag.status.type)}
            </Tag>
          )}
        </div>
        <ForslagtypeDetaljer
          forslagEndring={forslag.endring}
          begrunnelse={forslag.begrunnelse}
        />
        <Detail>
          Forslag sendt fra arrangør {formatDate(forslag.opprettet)}
        </Detail>
      </VStack>
    </HGrid>
  )
}
