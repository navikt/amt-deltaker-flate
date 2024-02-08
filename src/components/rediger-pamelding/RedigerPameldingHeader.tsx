import { Tag, Detail, HStack } from '@navikt/ds-react'
import { formatDateStrWithMonthName } from '../../utils/utils'

interface Props {
  opprettet: string
  opprettetAv: string
  sistEndret: string
  sistEndretAv: string
}

export const RedigerPameldingHeader = ({
  opprettet,
  opprettetAv,
  sistEndret,
  sistEndretAv
}: Props) => {
  const erEndret = sistEndret !== opprettet || sistEndretAv !== opprettetAv

  return (
    <div className="space-y-2">
      <Tag variant="info" size="small" className="mb-3 mt-4">
        Venter på godkjenning fra bruker
      </Tag>
      {erEndret ? (
        <>
          <HStack className="mt-0" gap="2">
            <Detail weight="semibold">Første utkast delt:</Detail>
            <Detail>
              {formatDateStrWithMonthName(opprettet)} {opprettetAv}
            </Detail>
          </HStack>
          <HStack gap="2">
            <Detail weight="semibold">Sist endret:</Detail>
            <Detail>
              {formatDateStrWithMonthName(sistEndret)} {sistEndretAv}
            </Detail>
          </HStack>
        </>
      ) : (
        <HStack gap="2">
          <Detail weight="semibold">Delt:</Detail>
          <Detail>
            {formatDateStrWithMonthName(opprettet)} {opprettetAv}
          </Detail>
        </HStack>
      )}
    </div>
  )
}
