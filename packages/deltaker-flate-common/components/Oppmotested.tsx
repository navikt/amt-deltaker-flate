import { BodyShort, Label } from '@navikt/ds-react'
import { DeltakerStatusType } from '../model/deltaker'

interface Props {
  statusType: DeltakerStatusType
  oppmoteSted?: string | null
  className?: string
}

export const Oppmotested = ({ oppmoteSted, statusType, className }: Props) => {
  if (
    !oppmoteSted ||
    ![
      DeltakerStatusType.UTKAST_TIL_PAMELDING,
      DeltakerStatusType.SOKT_INN,
      DeltakerStatusType.VENTER_PA_OPPSTART,
      DeltakerStatusType.DELTAR,
      DeltakerStatusType.VENTELISTE,
      DeltakerStatusType.VURDERES
    ].includes(statusType)
  ) {
    return null
  }

  return (
    <div className={className ?? ''}>
      <Label>Oppmøtested: </Label>
      <BodyShort className="mt-2">{oppmoteSted}</BodyShort>
    </div>
  )
}
