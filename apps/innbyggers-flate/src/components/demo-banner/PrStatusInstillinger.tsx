import { TextField, Button } from '@navikt/ds-react'
import { useState } from 'react'

interface Props {
  setDeltakerID?: (deltakerId: string) => void
}

export const PrStatusInstillinger = ({ setDeltakerID }: Props) => {
  const [nyDeltakerId, setNyDeltakerId] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setDeltakerID?.(nyDeltakerId)
      }}
    >
      <TextField
        size="small"
        label="Deltakerid"
        value={nyDeltakerId}
        onChange={(e) => setNyDeltakerId(e.target.value)}
      />
      <Button size="small" className="mt-4">
        Bruk deltakerid
      </Button>
    </form>
  )
}
