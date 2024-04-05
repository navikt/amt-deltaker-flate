import { ReadMore, TextField } from '@navikt/ds-react'
import { useAppContext } from '../../AppContext'

/**
 * TODO: Legg til funksjon for å velge deltaker / deltakerliste
 * @constructor
 */

const DemoDeltakerInstillinger = () => {
  const { enhetId, personident, setEnhetId, setPersonident } = useAppContext()

  return (
    <ReadMore
      className="mt-2"
      size="small"
      header="Velg instillinger for deltaker"
    >
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
