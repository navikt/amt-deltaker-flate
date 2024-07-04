import { Forslag, ForslagEndringType } from '../../../api/data/forslag.ts'
import { Box, Heading } from '@navikt/ds-react'
import { ForlengDeltakelseForslagDetaljer } from './ForlengDeltakelseForslagDetaljer.tsx'

interface Props {
  forslag: Forslag
}

const getForslagDetaljer = (forslag: Forslag) => {
  switch (forslag.endring.type) {
    case ForslagEndringType.ForlengDeltakelse:
      return (
        <ForlengDeltakelseForslagDetaljer
          forslag={forslag}
          forlengDeltakelseForslag={forslag.endring}
        />
      )
    default:
      return <div />
  }
}

export const ForslagInfo = ({ forslag }: Props) => {
  return (
    <Box
      background="surface-neutral-moderate"
      padding={{ xs: '2', md: '6' }}
      className="mt-4"
    >
      <Heading level="6" size="small">
        Arrangør foreslår en endring:
      </Heading>
      <Box background="surface-default" padding="2">
        {getForslagDetaljer(forslag)}
      </Box>
    </Box>
  )
}
