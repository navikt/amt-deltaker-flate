import { TextField, Button } from '@navikt/ds-react'
import { useState } from 'react'

interface Props {
  setDeltakerlisteId?: (deltakerlisteId: string) => void
}

export const PrStatusInstillinger = ({ setDeltakerlisteId }: Props) => {
  const [nyDeltkerlisteId, setNyDeltakerlisteId] = useState(
    '6d71a9c5-c920-4d56-bc3b-2da07e4b6100'
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
