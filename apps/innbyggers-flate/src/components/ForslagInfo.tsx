import { AktivtForslag, ForslagDetaljer } from 'deltaker-flate-common'
import { Box, Heading, VStack } from '@navikt/ds-react'

interface Props {
  forslag: AktivtForslag
}

export const ForslagInfo = ({ forslag }: Props) => {
  return (
    <Box
      background="surface-neutral-moderate"
      padding={{ xs: '2', md: '6' }}
      borderRadius={{ md: 'large' }}
      className="mt-4"
    >
      <VStack gap="1">
        <Heading level="6" size="small">
          Arrangør foreslår en endring:
        </Heading>
        <Box
          background="surface-default"
          padding="2"
          borderColor="border-default"
          borderWidth="1"
          borderRadius={{ md: 'large' }}
        >
          <ForslagDetaljer forslag={forslag} />
        </Box>
      </VStack>
    </Box>
  )
}
