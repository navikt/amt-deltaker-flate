import { Forslag, AktivtForslagBox, ForslagInfo } from 'deltaker-flate-common'
import { Box, Heading, HStack } from '@navikt/ds-react'
import { BehandleForslagKnapp } from './BehandleForslagKnapp.tsx'

interface Props {
  forslag: Forslag[]
}

export const AktiveForslag = ({ forslag }: Props) => {
  if (forslag.length === 0) return <></>
  return (
    <ForslagInfo>
      {forslag.map((f) => {
        return (
          <AktivtForslagBox forslag={f} key={f.id}>
            <Box
              background="surface-action-subtle"
              className="p-2"
              borderRadius="0 0 medium medium"
            >
              <HStack gap="2" className="items-center">
                <Heading level="3" size="xsmall">
                  For Nav-ansatt:
                </Heading>
                <BehandleForslagKnapp forslag={f} />
              </HStack>
            </Box>
          </AktivtForslagBox>
        )
      })}
    </ForslagInfo>
  )
}
