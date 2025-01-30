import { BodyLong, Box, VStack } from '@navikt/ds-react'
import React from 'react'

export function IngenAdGruppePage() {
  return (
    <Box className="flex justify-center pt-16">
      <VStack gap="2" className="max-w-screen-sm">
        <h2 className="text-xl font-semibold">
          Du har ikke tilgang til deltakerlisten for denne gjennomføringen
        </h2>
        <BodyLong>
          Deltakerlisten er kun tilgjengelig for deg som skal administrere eller
          prioritere deltakerene på listen.
        </BodyLong>
        <BodyLong>Info om AD-gruppen?</BodyLong>
      </VStack>
    </Box>
  )
}
