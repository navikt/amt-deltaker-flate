import {Tag} from '@navikt/ds-react'
import {getDeltakerStatusDisplayText} from '../../utils/displayText.ts'
import {DeltakerStatusType} from '../../api/data/pamelding.ts'

interface Props {
    status: DeltakerStatusType
    endretAv: string
}

export const RedigerPameldingHeader = ({ status, endretAv }: Props) => {
  return (
    <>
      <p>Utkast til påmelding sendt til deltaker</p>
      <Tag variant="info">{getDeltakerStatusDisplayText(status)}</Tag>
      <p>Sist endret: <span className="text-red-600 font-bold">TODO</span> {endretAv}</p>
    </>
  )
}
