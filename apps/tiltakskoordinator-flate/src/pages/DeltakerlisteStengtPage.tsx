import { BodyLong, Box, VStack } from '@navikt/ds-react'

export function DeltakerlisteStengtPage() {
  return (
    <Box className="flex justify-center pt-16">
      <VStack gap="4" className="max-w-screen-sm">
        <h2 className="text-xl font-semibold">
          Deltakerlisten for gjennomføringen er stengt
        </h2>
        <BodyLong>
          Deltakerlisten for prioritering av deltakere er stengt, fordi
          gjennomføringen er fullført eller avsluttet.
        </BodyLong>
      </VStack>
    </Box>
  )
}
