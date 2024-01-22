import { PameldingResponse } from '../api/data/pamelding.ts'
import { HStack } from '@navikt/ds-react'
import { DeltakerInfo } from '../components/tiltak/DeltakerInfo.tsx'
import { ForNAVAnsatt } from '../components/tiltak/ForNAVAnsatt.tsx'

export interface TiltakPageProps {
  pamelding: PameldingResponse
}

export const TiltakPage = ({ pamelding }: TiltakPageProps) => {
  return (
    <HStack gap="4" wrap={false}>
      {/* TODO må fikse width og wrap*/}
      <DeltakerInfo pamelding={pamelding} />
      <ForNAVAnsatt />
    </HStack>
  )
}
