import { BodyShort, Heading } from '@navikt/ds-react'
import { DeltakerStatusType } from '../model/deltaker'

interface Props {
  statusType: DeltakerStatusType
  oppmoteSted?: string | null
  headingLevel?: 3 | 4
  className?: string
}

export const Oppmotested = ({
  oppmoteSted,
  headingLevel,
  statusType,
  className
}: Props) => {
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
      <Heading
        size={headingLevel === 3 ? 'small' : 'xsmall'}
        level={`${headingLevel ?? 4}`}
      >
        Oppmøtested
      </Heading>
      <BodyShort className="mt-2">{oppmoteSted}</BodyShort>
    </div>
  )
}
