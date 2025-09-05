import { Forslag, ForslagtypeDetaljer } from 'deltaker-flate-common'
import { Box, Heading } from '@navikt/ds-react'

interface Props {
  forslag: Forslag
}

export const ModalForslagDetaljer = ({ forslag }: Props) => {
  return (
    <div className="mb-6">
      <Box
        background="bg-subtle"
        padding={{ xs: '2', md: '4' }}
        borderRadius="medium"
        className="mt-4 mb-4"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-2">
          <Heading level="2" size="small">
            Forslag fra arrangør:
          </Heading>
        </div>
        <ForslagtypeDetaljer
          begrunnelse={forslag.begrunnelse}
          forslagEndring={forslag.endring}
        />
      </Box>
    </div>
  )
}
