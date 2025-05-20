import { PersonCrossIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'

interface Props {
  disabled: boolean
  deltakerNavn: string
  onClick: () => void
}

export function GiAvslagKnapp({ disabled, deltakerNavn, onClick }: Props) {
  return (
    <Button
      size="xsmall"
      className="p-0.5"
      onClick={onClick}
      disabled={disabled}
    >
      <PersonCrossIcon
        height="24px"
        width="24px"
        aria-label={`Gi avslag til ${deltakerNavn}`}
      />
    </Button>
  )
}
