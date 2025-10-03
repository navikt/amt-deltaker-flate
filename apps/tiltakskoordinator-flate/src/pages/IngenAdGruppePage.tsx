import { BodyLong, Box, Heading } from '@navikt/ds-react'
import DemoBanner from '../components/demo-banner/DemoBanner'
import { useFocusPageLoad } from '../hooks/useFocusPageLoad'

export function IngenAdGruppePage() {
  const { ref } = useFocusPageLoad('Deltakerliste - Ingen ad-gruppe')

  return (
    <>
      <DemoBanner />
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
            Deltakerlisten er kun tilgjengelig for deg som skal administrere
            eller prioritere deltakerene på listen.
          </BodyLong>
        </div>
      </Box>
    </>
  )
}
