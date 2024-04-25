import { Detail, HStack, Tag } from '@navikt/ds-react'
import {
  Vedtaksinformasjon,
  formatDateFromString,
  formatDateStrWithMonthName
} from 'deltaker-flate-common'

interface Props {
  vedtaksinformasjon: Vedtaksinformasjon | null
  visStatusVenterPaaBruker?: boolean
}

export const UtkastHeader = ({
  vedtaksinformasjon,
  visStatusVenterPaaBruker
}: Props) => {
  const erEndret =
    vedtaksinformasjon?.sistEndret !== vedtaksinformasjon?.opprettet ||
    vedtaksinformasjon?.sistEndretAv !== vedtaksinformasjon?.opprettetAv

  const erEndretSammeDag =
    erEndret &&
    formatDateFromString(vedtaksinformasjon?.sistEndret) ===
      formatDateFromString(vedtaksinformasjon?.opprettet)

  return (
    <div className="space-y-2 mt-2 mb-4">
      {visStatusVenterPaaBruker && (
        <Tag variant="info" size="small" className="mb-3 mt-4">
          Venter på godkjenning fra bruker
        </Tag>
      )}
      {vedtaksinformasjon &&
        (erEndret ? (
          <>
            <HStack className="mt-0" gap="2">
              <Detail weight="semibold">Utkast delt:</Detail>
              <Detail>
                {formatDateStrWithMonthName(vedtaksinformasjon.opprettet)}{' '}
                {vedtaksinformasjon.opprettetAv}
              </Detail>
            </HStack>
            {!erEndretSammeDag && (
              <HStack gap="2">
                <Detail weight="semibold">Sist endret:</Detail>
                <Detail>
                  {formatDateStrWithMonthName(vedtaksinformasjon.sistEndret)}{' '}
                  {vedtaksinformasjon.sistEndretAv}
                </Detail>
              </HStack>
            )}
          </>
        ) : (
          <HStack gap="2">
            <Detail weight="semibold">Delt:</Detail>
            <Detail>
              {formatDateStrWithMonthName(vedtaksinformasjon.opprettet)}{' '}
              {vedtaksinformasjon.opprettetAv}
            </Detail>
          </HStack>
        ))}
    </div>
  )
}
