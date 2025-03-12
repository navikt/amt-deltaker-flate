import { BodyLong, Box, Heading } from '@navikt/ds-react'
import { useEffect, useRef } from 'react'

export function DeltakerlisteStengtPage() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus()
    }
  }, [])

  return (
    <Box className="flex justify-center pt-16">
      <div className="flex flex-col gap-4 max-w-screen-sm">
        <Heading
          size="small"
          level="2"
          tabIndex={-1}
          ref={headingRef}
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
