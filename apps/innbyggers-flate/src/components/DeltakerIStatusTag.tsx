import { Tag } from '@navikt/ds-react'
import { DeltakerStatusType } from '../api/data/deltaker.ts'
import { getDeltakerStatusDisplayText } from '../utils/utils.ts'

const getTagType = (status: DeltakerStatusType) => {
  switch (status) {
    case DeltakerStatusType.FULLFORT:
    case DeltakerStatusType.VENTELISTE:
    case DeltakerStatusType.VENTER_PA_OPPSTART:
      return 'alt3'
    case DeltakerStatusType.KLADD:
      return 'warning'
    case DeltakerStatusType.HAR_SLUTTET:
      return 'alt1'
    case DeltakerStatusType.UTKAST_TIL_PAMELDING:
      return 'info'
    case DeltakerStatusType.VURDERES:
      return 'alt2'
    case DeltakerStatusType.DELTAR:
    case DeltakerStatusType.AVBRUTT:
    case DeltakerStatusType.AVBRUTT_UTKAST:
    case DeltakerStatusType.IKKE_AKTUELL:
    case DeltakerStatusType.FEILREGISTRERT:
    case DeltakerStatusType.PABEGYNT_REGISTRERING:
    case DeltakerStatusType.SOKT_INN:
      return 'neutral'
  }
}

interface DeltakerIStatusTagProps {
  statusType: DeltakerStatusType
}

export const DeltakerIStatusTag = ({ statusType }: DeltakerIStatusTagProps) => {
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
