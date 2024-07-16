import { AktivtForslag, ForslagtypeDetaljer } from 'deltaker-flate-common'
import { Box, Button, HStack, Heading } from '@navikt/ds-react'
import { ArrowRightIcon } from '@navikt/aksel-icons'

interface Props {
  forslag: AktivtForslag
  onClick?: () => void
}

export const ModalForslagDetaljer = ({ forslag, onClick }: Props) => {
  return (
    <div>
      <Box
        background="bg-subtle"
        padding={{ xs: '2', md: '6' }}
        borderRadius="medium"
        className="mt-4"
      >
        <HStack>
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
