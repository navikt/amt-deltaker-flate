import { AktivtForslag, ForslagtypeDetaljer } from 'deltaker-flate-common'
import { Box, Heading } from '@navikt/ds-react'

interface Props {
  forslag: AktivtForslag
}

export const ModalForslagDetaljer = ({ forslag }: Props) => {
  return (
    <div>
      <Box
        background="bg-subtle"
        padding={{ xs: '2', md: '6' }}
        borderRadius="medium"
        className="mt-4"
      >
        <Heading level="2" size="small">
          Forslag fra arrangør:
        </Heading>
        <ForslagtypeDetaljer forslag={forslag} />
      </Box>
    </div>
  )
}
