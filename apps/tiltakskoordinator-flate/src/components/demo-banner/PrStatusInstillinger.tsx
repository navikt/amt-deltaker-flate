import { TextField, Button } from '@navikt/ds-react'
import { useState } from 'react'

interface Props {
  setDeltakerlisteId?: (deltkerlisteId: string) => void
}

export const PrStatusInstillinger = ({ setDeltakerlisteId }: Props) => {
  const [nyDeltkerlisteId, setNyDeltakerlisteId] = useState('')

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
