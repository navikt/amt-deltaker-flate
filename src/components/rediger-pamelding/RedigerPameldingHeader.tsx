import { Heading, Tag, Detail, HStack } from '@navikt/ds-react'
import { getDeltakerStatusDisplayText } from '../../utils/displayText.ts'
import { DeltakerStatusType } from '../../api/data/pamelding.ts'
import { Todo } from '../Todo.tsx'

interface Props {
  status: DeltakerStatusType
  endretAv: string
}

export const RedigerPameldingHeader = ({ status, endretAv }: Props) => {
  return (
    <div className="space-y-2">
      <Heading size="small" level="3">
        Utkast til påmelding sendt
      </Heading>
      <Tag variant="info" size="small">
        {getDeltakerStatusDisplayText(status)}
      </Tag>
      <HStack gap="2">
        <Detail weight="semibold">Sist endret:</Detail>
        <Detail>
          <Todo /> {endretAv}
        </Detail>
      </HStack>
    </div>
  )
}
