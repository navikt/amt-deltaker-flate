import { Tag } from '@navikt/ds-react'
import { DeltakerStatusType } from '../model/deltaker'
import { getDeltakerStatusDisplayText } from '../utils/displayText'
import { ACTION_BLUE_TAG_STYLE } from '../utils/forslagUtils'

const getTagType = (status: DeltakerStatusType) => {
  switch (status) {
    case DeltakerStatusType.VENTER_PA_OPPSTART:
    case DeltakerStatusType.UTKAST_TIL_PAMELDING:
      return 'info'
    case DeltakerStatusType.KLADD:
      return 'warning'
    case DeltakerStatusType.FULLFORT:
    case DeltakerStatusType.HAR_SLUTTET:
    case DeltakerStatusType.VENTELISTE:
      return 'meta-purple'
    case DeltakerStatusType.VURDERES:
    case DeltakerStatusType.SOKT_INN:
      return 'meta-lime'
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
  name?: string
}

export const DeltakerStatusTag = ({
  statusType,
  name
}: DeltakerStatusTagProps) => {
  return (
    <Tag
      variant="outline"
      data-color={getTagType(statusType)}
      size="small"
      className={getSpesialTagTypeClass(statusType)}
    >
      {name ?? getDeltakerStatusDisplayText(statusType)}
    </Tag>
  )
}

const getSpesialTagTypeClass = (status: DeltakerStatusType) => {
  switch (status) {
    case DeltakerStatusType.DELTAR:
      return 'bg-(--ax-bg-raised)'
    case DeltakerStatusType.UTKAST_TIL_PAMELDING:
      return ACTION_BLUE_TAG_STYLE
    default:
      return ''
  }
}
