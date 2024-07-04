import { AktivtForslag, ForslagEndringType } from '../../../api/data/forslag.ts'
import { Box, Heading, VStack } from '@navikt/ds-react'
import { ForlengDeltakelseForslagDetaljer } from './ForlengDeltakelseForslagDetaljer.tsx'
import { util } from 'zod'
import assertNever = util.assertNever

interface Props {
  forslag: AktivtForslag
}

const getForslagDetaljer = (forslag: AktivtForslag) => {
  switch (forslag.endring.type) {
    case ForslagEndringType.ForlengDeltakelse:
      return (
        <ForlengDeltakelseForslagDetaljer
          forslag={forslag}
          forlengDeltakelseForslag={forslag.endring}
        />
      )
    default:
      assertNever(forslag.endring.type)
  }
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
          {getForslagDetaljer(forslag)}
        </Box>
      </VStack>
    </Box>
  )
}
