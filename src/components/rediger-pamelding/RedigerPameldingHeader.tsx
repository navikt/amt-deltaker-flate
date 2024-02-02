import { Tag, Detail, HStack } from '@navikt/ds-react'
import { formatDateStrWithMonthName } from '../../utils/utils'

interface Props {
  endretAv: string
  sistEndret: string
}

export const RedigerPameldingHeader = ({ endretAv, sistEndret }: Props) => {
  return (
    <div className="space-y-2">
      <Tag variant="info" size="small">
        Venter på godkjenning fra bruker
      </Tag>
      <HStack gap="2">
        <Detail weight="semibold">Sendt:</Detail>
        <Detail>
          {formatDateStrWithMonthName(sistEndret)} {endretAv}
        </Detail>
      </HStack>
    </div>
  )
}
