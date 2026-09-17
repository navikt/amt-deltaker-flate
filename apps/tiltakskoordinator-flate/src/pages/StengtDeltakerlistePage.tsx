import { BodyLong, Box, Heading } from '@navikt/ds-react'
import { useFocusPageLoad } from '../hooks/useFocusPageLoad'

export function StengtDeltakerlistePage() {
  const { ref } = useFocusPageLoad('Deltakerliste - stengt')

  return (
    <Box className="flex justify-center pt-16">
      <div className="flex flex-col gap-4 max-w-screen-ax-sm">
        <Heading
          size="small"
          level="2"
          tabIndex={-1}
          ref={ref}
          className="outline-none"
        >
          Deltakerlisten er stengt
        </Heading>
        <BodyLong>
          Tiltaket ble avsluttet for mer enn 6 måneder siden. Deltakerlisten
          vises derfor ikke lenger.
        </BodyLong>
      </div>
    </Box>
  )
}
