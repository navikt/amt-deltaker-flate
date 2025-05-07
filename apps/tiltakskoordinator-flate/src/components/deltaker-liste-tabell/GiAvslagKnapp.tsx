import { PersonCrossIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'

interface Props {
  onClick: () => void
}

export function GiAvslagKnapp({ onClick }: Props) {
  return (
    <Button size="xsmall" className="p-0.5" onClick={onClick}>
      <PersonCrossIcon height="24px" width="24px" />
    </Button>
  )
}
