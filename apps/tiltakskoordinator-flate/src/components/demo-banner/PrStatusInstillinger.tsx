import { TextField, Button } from '@navikt/ds-react'
import { useState } from 'react'

interface Props {
  setDeltakerlisteId?: (deltakerlisteId: string) => void
}

export const PrStatusInstillinger = ({ setDeltakerlisteId }: Props) => {
  const [nyDeltkerlisteId, setNyDeltakerlisteId] = useState(
    '2830edc3-19e2-486e-8d5f-061173eeada2'
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
