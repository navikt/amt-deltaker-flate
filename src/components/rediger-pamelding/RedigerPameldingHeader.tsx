import {Tag} from '@navikt/ds-react'
import {getDeltakerStatusDisplayText} from '../../utils/displayText.ts'
import {DeltakerStatusType} from '../../api/data/pamelding.ts'
import {Todo} from '../Todo.tsx'

interface Props {
    status: DeltakerStatusType
    endretAv: string
}

export const RedigerPameldingHeader = ({ status, endretAv }: Props) => {
  return (
    <div>
      <p>Utkast til påmelding sendt til deltaker</p>
      <Tag variant="info">{getDeltakerStatusDisplayText(status)}</Tag>
      <p>Sist endret: <Todo/> {endretAv}</p>
    </div>
  )
}
