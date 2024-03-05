import { Tag, Detail, HStack } from '@navikt/ds-react'
import { formatDateStrWithMonthName } from '../../utils/utils'
import { Vedtaksinformasjon } from '../../api/data/pamelding'

interface Props {
  vedtaksinformasjon: Vedtaksinformasjon | null
}

export const RedigerPameldingHeader = ({ vedtaksinformasjon }: Props) => {
  const erEndret =
    vedtaksinformasjon?.sistEndret !== vedtaksinformasjon?.opprettet ||
    vedtaksinformasjon?.sistEndretAv !== vedtaksinformasjon?.opprettetAv

  return (
    <div className="space-y-2">
      <Tag variant="info" size="small" className="mb-3 mt-4">
        Venter på godkjenning fra bruker
      </Tag>
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
