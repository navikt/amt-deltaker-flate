import { CheckmarkIcon, FilesIcon } from '@navikt/aksel-icons'
import { BodyShort, Button, Tooltip } from '@navikt/ds-react'
import { useState } from 'react'

interface FnrProps {
  fnr: string
}

export const Fodselsnummer = ({ fnr }: FnrProps): React.ReactElement => {
  const [copyDone, setCopyDone] = useState(false)

  return (
    <Tooltip content={copyDone ? 'Kopiert' : 'Kopier fødselsnummer'}>
      <Button
        icon={
          copyDone ? <CheckmarkIcon aria-hidden /> : <FilesIcon aria-hidden />
        }
        variant="tertiary-neutral"
        size="small"
        iconPosition="right"
        className="p-0"
        onClick={() => {
          navigator.clipboard.writeText(fnr)
          setCopyDone(true)
          setTimeout(() => {
            setCopyDone(false)
          }, 2000)
        }}
      >
        <BodyShort size="small" weight="semibold">
          F.nr: {fnr}
        </BodyShort>
      </Button>
    </Tooltip>
  )
}
