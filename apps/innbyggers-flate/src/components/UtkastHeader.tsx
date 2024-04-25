import { Detail, HStack } from '@navikt/ds-react'
import { formatDateStrWithMonthName } from 'deltaker-flate-common'
import { Vedtaksinformasjon } from '../api/data/deltaker.ts'
interface Props {
  vedtaksinformasjon: Vedtaksinformasjon | null
}

export const UtkastHeader = ({ vedtaksinformasjon }: Props) => {
  const erEndret =
    vedtaksinformasjon?.sistEndret !== vedtaksinformasjon?.opprettet ||
    vedtaksinformasjon?.sistEndretAv !== vedtaksinformasjon?.opprettetAv

  return (
    <div className="space-y-2 mt-2 mb-4">
      {vedtaksinformasjon &&
        (erEndret ? (
          <>
            <HStack className="mt-0" gap="2">
              <Detail weight="semibold">Første utkast delt:</Detail>
              <Detail>
                {formatDateStrWithMonthName(vedtaksinformasjon.opprettet)}{' '}
                {vedtaksinformasjon.opprettetAv}
              </Detail>
            </HStack>
            <HStack gap="2">
              <Detail weight="semibold">Sist endret:</Detail>
              <Detail>
                {formatDateStrWithMonthName(vedtaksinformasjon.sistEndret)}{' '}
                {vedtaksinformasjon.sistEndretAv}
              </Detail>
            </HStack>
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
