import { ReadMore, TextField } from '@navikt/ds-react'
import { useAppContext } from '../../AppContext'

const DemoDeltakerInstillinger = () => {
  const { enhetId, personident, deltakerlisteId, setEnhetId, setPersonident, setDeltakelisteId } =
    useAppContext()

  return (
    <ReadMore className="mt-2" size="small" header="Velg instillinger for deltaker">
      <>
        <TextField
          label="Personident (fødselsnummer etc)"
          type="number"
          size="small"
          className="mt-2"
          value={personident}
          onChange={(e) => setPersonident(e.target.value)}
        />

        <TextField
          label="Deltakerliste id (uuid)"
          size="small"
          className="mt-2"
          value={deltakerlisteId}
          onChange={(e) => setDeltakelisteId(e.target.value)}
        />

        <TextField
          label="Enhet id"
          size="small"
          className="mt-2"
          value={enhetId}
          onChange={(e) => setEnhetId(e.target.value)}
        />
      </>
    </ReadMore>
  )
}

export default DemoDeltakerInstillinger
