import { Tag } from '@navikt/ds-react'
import { DeltakerStatusType } from '../model/deltaker'
import { getDeltakerStatusDisplayText } from '../utils/displayText'

const getTagType = (status: DeltakerStatusType) => {
  switch (status) {
    case DeltakerStatusType.VENTER_PA_OPPSTART:
      return 'alt3'
    case DeltakerStatusType.KLADD:
      return 'warning'
    case DeltakerStatusType.FULLFORT:
    case DeltakerStatusType.HAR_SLUTTET:
    case DeltakerStatusType.VENTELISTE:
      return 'alt1'
    case DeltakerStatusType.UTKAST_TIL_PAMELDING:
      return 'info'
    case DeltakerStatusType.VURDERES:
      return 'alt2'
    case DeltakerStatusType.SOKT_INN:
      return 'alt2'
    case DeltakerStatusType.DELTAR:
    case DeltakerStatusType.AVBRUTT:
    case DeltakerStatusType.AVBRUTT_UTKAST:
    case DeltakerStatusType.IKKE_AKTUELL:
    case DeltakerStatusType.FEILREGISTRERT:
    case DeltakerStatusType.PABEGYNT_REGISTRERING:
      return 'neutral'
  }
}

interface DeltakerStatusTagProps {
  statusType: DeltakerStatusType
}

export const DeltakerStatusTag = ({ statusType }: DeltakerStatusTagProps) => {
  return (
    <Tag
      variant={getTagType(statusType)}
      size="small"
      className={statusType === DeltakerStatusType.DELTAR ? 'bg-white' : ''}
    >
      {getDeltakerStatusDisplayText(statusType)}
    </Tag>
  )
}
