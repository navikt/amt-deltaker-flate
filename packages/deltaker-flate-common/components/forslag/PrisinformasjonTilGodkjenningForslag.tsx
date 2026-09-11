import { Heading, HGrid, Tag, VStack } from '@navikt/ds-react'
import { EndreDeltakelseType } from '../../model/endre-deltaker'
import { Prisinformasjon } from '../../model/prisinformasjon'
import { getEndreDeltakelseTypeText } from '../../utils/displayText'
import { ACTION_BLUE_TAG_STYLE } from '../../utils/forslagUtils'
import { EndringTypeIkon } from '../EndringTypeIkon'
import { PrisOgBetaling } from '../PrisOgBetaling'
import { EndringerBox, EndringerWrapper } from './ForslagInfo'
import { ReactNode } from 'react'

export const PrisinformasjonTilGodkjenningForslag = ({
  prisinformasjonTilGodkjenning,
  className,
  children
}: {
  prisinformasjonTilGodkjenning: Prisinformasjon
  className?: string
  children?: ReactNode
}) => {
  return (
    <EndringerWrapper className={className ?? ''}>
      <VStack gap="space-16">
        <Heading level="2" size="medium">
          Endring sendt til godkjenning:
        </Heading>
        <EndringerBox>
          <HGrid columns="2rem auto" className="p-4 items-start">
            <EndringTypeIkon
              type={EndreDeltakelseType.ENDRE_PRISINFO}
              size="large"
            />
            <VStack className="items-start">
              <div className="flex justify-between w-full mb-2">
                <Heading level="3" size="small">
                  {getEndreDeltakelseTypeText(
                    EndreDeltakelseType.ENDRE_PRISINFO
                  )}
                </Heading>
                <Tag
                  variant="outline"
                  className={ACTION_BLUE_TAG_STYLE}
                  size="small"
                >
                  Venter på godkjenning
                </Tag>
              </div>
              <PrisOgBetaling
                prisinformasjon={prisinformasjonTilGodkjenning}
                headinglevel="3"
                showHeading={false}
                compact
                showTilleggsstonaderInfo={false}
              />
            </VStack>
          </HGrid>

          {children || null}
        </EndringerBox>
      </VStack>
    </EndringerWrapper>
  )
}
