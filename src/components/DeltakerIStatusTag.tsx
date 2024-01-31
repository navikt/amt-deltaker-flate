import { Tag } from '@navikt/ds-react'
import { getDeltakerStatusDisplayText } from '../utils/displayText.ts'
import { DeltakerStatusType } from '../api/data/pamelding.ts'

const getTagType = (status: DeltakerStatusType) => {
  switch (status) {
    case DeltakerStatusType.FULLFORT:
    case DeltakerStatusType.AVBRUTT:
    case DeltakerStatusType.VURDERES:
    case DeltakerStatusType.VENTELISTE:
    case DeltakerStatusType.VENTER_PA_OPPSTART:
      return 'alt3'
    case DeltakerStatusType.KLADD:
      return 'warning'
    case DeltakerStatusType.DELTAR:
      return 'neutral' // TODO skal være hvit
    case DeltakerStatusType.HAR_SLUTTET:
      return 'alt1'
    case DeltakerStatusType.AVBRUTT_UTKAST:
    case DeltakerStatusType.IKKE_AKTUELL:
      return 'neutral'
    case DeltakerStatusType.UTKAST_TIL_PAMELDING:
      return 'info'
    case DeltakerStatusType.FEILREGISTRERT:
    case DeltakerStatusType.PABEGYNT_REGISTRERING:
    case DeltakerStatusType.SOKT_INN:
      return 'neutral' // TODO er ikke definert i designet
  }
}

interface DeltakerIStatusTagProps {
  statusType: DeltakerStatusType
  text?: string
}

export const DeltakerIStatusTag = ({ statusType, text }: DeltakerIStatusTagProps) => {
  return (
    <Tag
      variant={getTagType(statusType)}
      size="small"
      className={statusType === DeltakerStatusType.DELTAR ? 'bg-white' : ''}
    >
      {text || getDeltakerStatusDisplayText(statusType)}
    </Tag>
  )
}
