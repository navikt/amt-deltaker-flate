import { Tag } from '@navikt/ds-react'
import {
  DeltakerlisteStatus,
  getDeltakerlisteStatusText
} from 'deltaker-flate-common'

const getTagType = (status: DeltakerlisteStatus) => {
  if (status === DeltakerlisteStatus.AVSLUTTET) {
    return 'neutral'
  } else {
    return 'error'
  }
}

interface DeltakerlisteStatusTagProps {
  status: DeltakerlisteStatus
}

const visDeltakerlisteStatus = (status: DeltakerlisteStatus): boolean => {
  return (
    status === DeltakerlisteStatus.AVLYST ||
    status === DeltakerlisteStatus.AVBRUTT ||
    status === DeltakerlisteStatus.AVSLUTTET
  )
}

export const DeltakerlisteStatusTag = ({
  status
}: DeltakerlisteStatusTagProps) => {
  return (
    visDeltakerlisteStatus(status) && (
      <Tag variant={getTagType(status)} size="small" className="mt-2">
        {getDeltakerlisteStatusText(status)}
      </Tag>
    )
  )
}
