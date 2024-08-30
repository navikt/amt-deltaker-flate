import { Detail, HStack, Tag } from '@navikt/ds-react'
import {
  Vedtaksinformasjon,
  formatDateFromString,
  formatDateStrWithMonthName
} from 'deltaker-flate-common'

interface Props {
  vedtaksinformasjon: Vedtaksinformasjon | null
  visStatusVenterPaaBruker?: boolean
  erNAVVeileder?: boolean
}

export const UtkastHeader = ({
  vedtaksinformasjon,
  visStatusVenterPaaBruker,
  erNAVVeileder
}: Props) => {
  const erEndret =
    vedtaksinformasjon?.sistEndret !== vedtaksinformasjon?.opprettet ||
    vedtaksinformasjon?.sistEndretAv !== vedtaksinformasjon?.opprettetAv

  const erEndretSammeDag =
    erEndret &&
    formatDateFromString(vedtaksinformasjon?.sistEndret) ===
      formatDateFromString(vedtaksinformasjon?.opprettet)

  const detailTextColor = erNAVVeileder ? 'subtle' : 'default'

  return (
    <div className="mt-4 mb-4">
      {visStatusVenterPaaBruker && (
        <Tag variant="info" size="small" className="mb-4">
          Utkastet er delt og venter på godkjenning
        </Tag>
      )}
      {vedtaksinformasjon &&
        (erEndret ? (
          <>
            <HStack gap="2" aria-atomic>
              <Detail as="span" weight="semibold" textColor={detailTextColor}>
                Første utkast delt:
              </Detail>
              <Detail as="span">
                {formatDateStrWithMonthName(vedtaksinformasjon.opprettet)}{' '}
                {vedtaksinformasjon.opprettetAv}
              </Detail>
            </HStack>
            {!erEndretSammeDag && (
              <HStack gap="2" className="mt-2" aria-atomic>
                <Detail as="span" weight="semibold" textColor={detailTextColor}>
                  Sist endret:
                </Detail>
                <Detail as="span">
                  {formatDateStrWithMonthName(vedtaksinformasjon.sistEndret)}{' '}
                  {vedtaksinformasjon.sistEndretAv}
                </Detail>
              </HStack>
            )}
          </>
        ) : (
          <HStack gap="2" aria-atomic>
            <Detail as="span" weight="semibold" textColor={detailTextColor}>
              Delt:
            </Detail>
            <Detail as="span">
              {formatDateStrWithMonthName(vedtaksinformasjon.opprettet)}{' '}
              {vedtaksinformasjon.opprettetAv}
            </Detail>
          </HStack>
        ))}
    </div>
  )
}
