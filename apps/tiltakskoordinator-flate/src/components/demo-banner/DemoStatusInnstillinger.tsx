import { Box, Select } from '@navikt/ds-react'
import {
  getPameldingstypeDisplayText,
  logError,
  Oppstartstype,
  Pameldingstype,
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

export const endreMockPameldingstype = (
  nyPameldingstype: Pameldingstype
): Promise<DeltakerlisteDetaljer> => {
  return fetch(`${API_URL}/setup/pameldingstype/${nyPameldingstype}`, {
    method: 'POST'
  })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(
          `Kunne ikke endre påmeldingstype. Prøv igjen senere. (${response.status})`
        )
      }
      return response.json()
    })
    .then((json) => {
      try {
        return deltakerlisteDetaljerSchema.parse(json)
      } catch (error) {
        logError('Kunne ikke parse deltakerSchema:', error)
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
  const [pameldingsType, setPameldingsType] = useState<Pameldingstype>(
    Pameldingstype.TRENGER_GODKJENNING
  )

  const { doFetch } = useDeferredFetch(endreMockOppstartstype)
  const { doFetch: doFetchEndreMockPameldingstype } = useDeferredFetch(
    endreMockPameldingstype
  )

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

  const handlePameldingstypeChange = (nyPameldingstype: Pameldingstype) => {
    setPameldingsType(nyPameldingstype)
    if (useMock) {
      doFetchEndreMockPameldingstype(nyPameldingstype).then((data) => {
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
      className="mt-[-1.6rem] mb-6 flex gap-4"
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
      <Select
        value={pameldingsType}
        label="Velg påmeldingstype"
        data-testid="select_pameldingstype"
        size="small"
        className="w-64"
        onChange={(e) =>
          handlePameldingstypeChange(e.target.value as Pameldingstype)
        }
      >
        <option value={Pameldingstype.DIREKTE_VEDTAK}>
          {getPameldingstypeDisplayText(Pameldingstype.DIREKTE_VEDTAK)}
        </option>
        <option value={Pameldingstype.TRENGER_GODKJENNING}>
          {getPameldingstypeDisplayText(Pameldingstype.TRENGER_GODKJENNING)}
        </option>
      </Select>
    </Box>
  )
}
