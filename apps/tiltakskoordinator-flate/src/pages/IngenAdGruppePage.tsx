import { BodyLong, Box, Heading } from '@navikt/ds-react'
import { useFocusPageLoad } from '../hooks/useFocusPageLoad'

export function IngenAdGruppePage() {
  const { ref } = useFocusPageLoad('Deltakerliste - Ingen ad-gruppe')

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
          Du har ikke tilgang til deltakerlisten for denne gjennomføringen
        </Heading>
        <BodyLong>
          Deltakerlisten er kun tilgjengelig for personer som har ansvar for
          oppfølging av tiltaket og som har et tjenstlig behov for innsyn i
          opplysninger om deltakerne.
        </BodyLong>
        <BodyLong>
          Dersom du har tjenstlig behov for slik tilgang, må du først få tilgang
          via din identitetsadministrator.
        </BodyLong>
      </div>
    </Box>
  )
}
