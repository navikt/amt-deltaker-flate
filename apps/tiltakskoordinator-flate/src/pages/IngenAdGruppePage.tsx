import { BodyLong, Box, Heading } from '@navikt/ds-react'
import { useEffect, useRef } from 'react'

export function IngenAdGruppePage() {
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
          Du har ikke tilgang til deltakerlisten for denne gjennomføringen
        </Heading>
        <BodyLong>
          Deltakerlisten er kun tilgjengelig for deg som skal administrere eller
          prioritere deltakerene på listen.
        </BodyLong>
      </div>
    </Box>
  )
}
