import { BodyLong, Box, Heading } from '@navikt/ds-react'
import { useFocusPageLoad } from '../hooks/useFocusPageLoad'

export function StengtDeltakerlistePage() {
  const { ref } = useFocusPageLoad('Deltakerliste - stengt')

  return (
    <Box className="flex justify-center pt-16">
      <div className="flex flex-col gap-4 max-w-screen-sm">
        <Heading
          size="small"
          level="2"
          tabIndex={-1}
          ref={ref}
          className="outline-none"
        >
          Deltakerlisten for gjennomføringen er stengt
        </Heading>
        <BodyLong>
          Deltakerlisten for prioritering av deltakere er stengt, fordi
          gjennomføringen er fullført eller avsluttet.
        </BodyLong>
      </div>
    </Box>
  )
}
