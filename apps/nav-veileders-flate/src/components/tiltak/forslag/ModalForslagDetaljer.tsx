import { Forslag, ForslagtypeDetaljer } from 'deltaker-flate-common'
import { Box, Heading } from '@navikt/ds-react'

interface Props {
  forslag: Forslag
}

export const ModalForslagDetaljer = ({ forslag }: Props) => {
  return (
    <div className="mb-6">
      <Box
        background="neutral-moderate"
        padding={{ xs: 'space-8', md: 'space-16' }}
        borderRadius="4"
        className="mt-4 mb-4"
      >
        <Heading level="2" size="small" className="mb-2">
          Forslag fra arrangør:
        </Heading>

        <ForslagtypeDetaljer
          begrunnelse={forslag.begrunnelse}
          forslagEndring={forslag.endring}
        />
      </Box>
    </div>
  )
}
