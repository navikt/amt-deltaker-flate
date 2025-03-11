import { FilesIcon } from '@navikt/aksel-icons'
import { BodyShort, Button, Tooltip } from '@navikt/ds-react'

interface FnrProps {
  fnr: string
}

export const Fodselsnummer = ({ fnr }: FnrProps): React.ReactElement => {
  return (
    <Tooltip content="Kopier fødselsnummer">
      <Button
        icon={<FilesIcon aria-hidden />}
        variant="tertiary-neutral"
        size="small"
        iconPosition="right"
        className="p-0"
        onClick={() => navigator.clipboard.writeText(fnr)}
      >
        <BodyShort size="small" weight="semibold">
          F.nr: {fnr}
        </BodyShort>
      </Button>
    </Tooltip>
  )
}
