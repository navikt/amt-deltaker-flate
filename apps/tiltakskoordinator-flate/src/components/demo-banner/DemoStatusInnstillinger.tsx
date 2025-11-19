import { Box, Select } from '@navikt/ds-react'
import {
  logError,
  Oppstartstype,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useState } from 'react'
import {
  DeltakerlisteDetaljer,
  deltakerlisteDetaljerSchema
} from '../../api/data/deltakerliste'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'
import { API_URL, useMock } from '../../utils/environment-utils'
import { useFilterContext } from '../../context-providers/FilterContext'

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

export const DemoStatusInnstillinger = () => {
  const { setDeltakerlisteDetaljer } = useDeltakerlisteContext()
  const { nullstillFilter } = useFilterContext()
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
          if (nullstillFilter) {
            nullstillFilter()
          }
        }
      })
    }
  }

  if (!useMock) {
    return null
  }

  return (
    <Box
      className="mt-[-1.6rem] mb-6"
      padding="space-16"
      background="surface-warning-subtle"
      borderColor="border-warning"
      borderWidth="1"
    >
      <Select
        value={oppstartstype}
        label="Velg oppstartstype"
        size="small"
        className="w-64"
        data-testid="select_oppstartstype"
        onChange={(e) =>
          handleOppstartstypeChanged(e.target.value as Oppstartstype)
        }
      >
        <option value={Oppstartstype.FELLES}>Felles</option>
        <option value={Oppstartstype.LOPENDE}>Løpende</option>
      </Select>
    </Box>
  )
}
