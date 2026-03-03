import { Forslag, AktivtForslagBox, ForslagInfo } from 'deltaker-flate-common'
import { Box, Heading } from '@navikt/ds-react'
import { BehandleForslagKnapper } from './BehandleForslagKnapper.tsx'

interface Props {
  forslag: Forslag[]
  className?: string
}

export const AktiveForslag = ({ forslag, className }: Props) => {
  if (forslag.length === 0) return <></>
  return (
    <ForslagInfo className={className}>
      {forslag.map((f) => {
        return (
          <AktivtForslagBox forslag={f} key={f.id}>
            <Box
              background="accent-moderate"
              className="p-2"
              borderRadius="0 0 4 4"
            >
              <div className="flex items-center">
                <Heading level="3" size="xsmall">
                  For Nav-ansatt:
                </Heading>
                <BehandleForslagKnapper forslag={f} />
              </div>
            </Box>
          </AktivtForslagBox>
        )
      })}
    </ForslagInfo>
  )
}
