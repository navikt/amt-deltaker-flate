import { AktivtForslag, ForslagtypeDetaljer } from 'deltaker-flate-common'
import { BodyLong, Box, Heading } from '@navikt/ds-react'

interface Props {
  forslag: AktivtForslag
}

export const ModalForslagDetaljer = ({ forslag }: Props) => {
  return (
    <div>
      <Box
        background="surface-neutral-moderate"
        padding={{ xs: '2', md: '6' }}
        borderRadius={{ md: 'large' }}
        className="mt-4"
      >
        <Heading level="6" size="small">
          Forslag fra arrangør:
        </Heading>
        <ForslagtypeDetaljer forslag={forslag} />
        <BodyLong size="small">Begrunnelse: {forslag.begrunnelse}</BodyLong>
      </Box>
    </div>
  )
}
