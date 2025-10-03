import { Alert, BodyLong, BodyShort, Select } from '@navikt/ds-react'
import {
  logError,
  Oppstartstype,
  useDeferredFetch
} from 'deltaker-flate-common'
import { API_URL, useMock } from '../../utils/environment-utils'
import {
  DeltakerlisteDetaljer,
  deltakerlisteDetaljerSchema
} from '../../api/data/deltakerliste'
import { useState } from 'react'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'

export const endreMockOppstartstype = (
  nyOppstartstype: Oppstartstype
): Promise<DeltakerlisteDetaljer> => {
  return fetch(`${API_URL}/setup/oppstartstype/${nyOppstartstype}`, {
    method: 'POST'
  })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(
          `Kunne ikke endre oppstartstype. Prøv igjen senere. (${response.status})`
        )
      }
      return response.json()
    })
    .then((json) => {
      try {
        return deltakerlisteDetaljerSchema.parse(json)
      } catch (error) {
        logError('Kunne ikke parse deltakerlisteDetaljerSchema:', error)
        throw error
      }
    })
}

const DemoBanner = () => {
  const { setDeltakerlisteDetaljer } = useDeltakerlisteContext()
  const [oppstartstype, setOppstartstype] = useState<Oppstartstype>(
    Oppstartstype.FELLES
  )

  const { doFetch } = useDeferredFetch(endreMockOppstartstype)

  const handleOppstartstypeChanged = (nyOppstartstype: Oppstartstype) => {
    setOppstartstype(nyOppstartstype)
    if (useMock) {
      doFetch(nyOppstartstype).then((data) => {
        if (data) {
          setDeltakerlisteDetaljer(data as DeltakerlisteDetaljer)
        }
      })
    }
  }

  if (!useMock) {
    return null
  }

  return (
    <Alert variant="warning" size="small" className="mb-6">
      <BodyShort weight="semibold" size="small">
        Dette er en demo-tjeneste
      </BodyShort>
      <BodyLong className="mt-1" size="small">
        Demoen inneholder ikke ekte data og kan til tider være ustabil.
      </BodyLong>
      <Select
        value={oppstartstype}
        label="Velg tiltakstype"
        size="small"
        className="w-64"
        data-testid="select_tiltakstype"
        onChange={(e) =>
          handleOppstartstypeChanged(e.target.value as Oppstartstype)
        }
      >
        <option value={Oppstartstype.FELLES}>Felles</option>
        <option value={Oppstartstype.LOPENDE}>Løpende</option>
      </Select>
    </Alert>
  )
}

export default DemoBanner
