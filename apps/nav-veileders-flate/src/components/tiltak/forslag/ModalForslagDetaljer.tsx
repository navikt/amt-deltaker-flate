import { Forslag, ForslagtypeDetaljer } from 'deltaker-flate-common'
import { Box, Button, Heading } from '@navikt/ds-react'
import { ArrowRightIcon } from '@navikt/aksel-icons'

interface Props {
  forslag: Forslag
  disabled: boolean
  onClick?: () => void
}

export const ModalForslagDetaljer = ({ forslag, disabled, onClick }: Props) => {
  return (
    <div className="mb-6">
      <Box
        background="bg-subtle"
        padding={{ xs: '2', md: '4' }}
        borderRadius="medium"
        className="mt-4 mb-4"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-2">
          <Heading level="2" size="small">
            Forslag fra arrangør:
          </Heading>
          {onClick && (
            <Button
              size="small"
              variant="secondary"
              className="sm:mt-0 mt-1"
              onClick={onClick}
              disabled={disabled}
            >
              <div className="flex flex-row items-center">
                Avvis forslag <ArrowRightIcon height={24} width={24} />
              </div>
            </Button>
          )}
        </div>
        <ForslagtypeDetaljer forslag={forslag} />
      </Box>
    </div>
  )
}
