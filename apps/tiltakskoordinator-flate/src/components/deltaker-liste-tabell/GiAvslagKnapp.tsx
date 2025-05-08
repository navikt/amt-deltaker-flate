import { PersonCrossIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'

interface Props {
  disabled: boolean
  onClick: () => void
}

export function GiAvslagKnapp({ disabled, onClick }: Props) {
  return (
    <Button
      size="xsmall"
      className="p-0.5"
      onClick={onClick}
      disabled={disabled}
    >
      <PersonCrossIcon height="24px" width="24px" />
    </Button>
  )
}
