import { TextField, Button } from '@navikt/ds-react'
import { useState } from 'react'

interface Props {
  setDeltakerlisteId?: (deltakerlisteId: string) => void
}

export const PrStatusInstillinger = ({ setDeltakerlisteId }: Props) => {
  const [nyDeltkerlisteId, setNyDeltakerlisteId] = useState(
    'b4e30b5f-81d4-4110-a663-1826dc2f06fe'
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
        Bruk deltakerliste-id
      </Button>
    </form>
  )
}
