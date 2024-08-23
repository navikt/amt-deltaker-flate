import { Forslag, ForslagtypeDetaljer } from 'deltaker-flate-common'
import { Box, Button, HStack, Heading } from '@navikt/ds-react'
import { ArrowRightIcon } from '@navikt/aksel-icons'

interface Props {
  forslag: Forslag
  onClick?: () => void
}

export const ModalForslagDetaljer = ({ forslag, onClick }: Props) => {
  return (
    <div className="mb-6">
      <Box
        background="bg-subtle"
        padding={{ xs: '2', md: '4' }}
        borderRadius="medium"
        className="mt-4 mb-4"
      >
        <HStack className="items-end mb-2">
          <Heading level="2" size="small">
            Forslag fra arrangør:
          </Heading>
          {onClick && (
            <Button
              size="small"
              variant="secondary"
              className="ml-auto"
              onClick={onClick}
            >
              <div className="flex flex-row items-center">
                Avvis forslag <ArrowRightIcon height={24} width={24} />
              </div>
            </Button>
          )}
        </HStack>
        <ForslagtypeDetaljer forslag={forslag} />
      </Box>
    </div>
  )
}
