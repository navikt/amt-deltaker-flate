import { HStack } from '@navikt/ds-react'
import { DeltakerInfo } from '../components/tiltak/DeltakerInfo.tsx'
import { ForNAVAnsatt } from '../components/tiltak/ForNAVAnsatt.tsx'

export const TiltakPage = () => {
  return (
    <HStack gap="4" wrap={false}>
      {/* TODO må fikse width og wrap*/}
      <DeltakerInfo />
      <ForNAVAnsatt />
    </HStack>
  )
}
