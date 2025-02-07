import { TextField, Button } from '@navikt/ds-react'
import { useState } from 'react'

interface Props {
  setDeltakerlisteId?: (deltkerlisteId: string) => void
}

export const PrStatusInstillinger = ({ setDeltakerlisteId }: Props) => {
  const [nyDeltkerlisteId, setNyDeltakerlisteId] = useState(
    '2d027fa0-2333-4005-8d66-b257f4aabc3a'
  )

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setDeltakerlisteId?.(nyDeltkerlisteId)
      }}
    >
      <TextField
        size="small"
        label="Deltakerliste-id"
        value={nyDeltkerlisteId}
        onChange={(e) => setNyDeltakerlisteId(e.target.value)}
      />
      <Button size="small" className="mt-4">
        Bruk deltkerliste-id
      </Button>
    </form>
  )
}
