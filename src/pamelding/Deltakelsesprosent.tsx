import { Radio, RadioGroup, TextField } from '@navikt/ds-react'
import { useState } from 'react'
import {
  DELTAKELSESPROSENT_VALG_JA,
  DELTAKELSESPROSENT_VALG_NEI,
  erGyldigProsent,
  erGyldigDagerPerUke
} from '../utils'

export interface DeltakelsesprosentProps {
  deltakelsesprosent?: number
  dagerPerUke?: number
}

export const Deltakelsesprosent = ({
  deltakelsesprosent,
  dagerPerUke
}: DeltakelsesprosentProps) => {
  const [deltakelsesprosentValg, setDeltakelsesprosentValg] = useState<string>(
    deltakelsesprosent
      ? deltakelsesprosent === 100
        ? DELTAKELSESPROSENT_VALG_JA
        : DELTAKELSESPROSENT_VALG_NEI
      : ''
  )
  const [nyDeltakelsesprosent, setNyDeltakelsesprosent] = useState(deltakelsesprosent?.toString)
  const [deltakelsesprosentFeilmelding, setDeltakelsesprosentFeilmelding] = useState<string | null>(
    null
  )
  const [nyDagerPerUke, setNyDagerPerUke] = useState(dagerPerUke?.toString)
  const [dagerPerUkeFeilmelding, setDagerPerUkeFeilmelding] = useState<string | null>(null)

  const endreDeltakelsesProsent = (value: string) => {
    setNyDeltakelsesprosent(value)

    if (erGyldigProsent(value)) {
      setDeltakelsesprosentFeilmelding(null)
    } else {
      setDeltakelsesprosentFeilmelding(
        'Deltakelsesprosent må være et tall fra og med 0 til og med 100'
      )
    }
  }

  const endreDagerPerUke = (value: string) => {
    setNyDagerPerUke(value)
    if (erGyldigDagerPerUke(value)) {
      setDagerPerUkeFeilmelding(null)
    } else {
      setDagerPerUkeFeilmelding('Antall dager per uke må være et tall fra og med 0 til og med 7')
    }
  }

  return (
    <>
      <RadioGroup
        legend="Skal personen delta 100%?"
        onChange={setDeltakelsesprosentValg}
        value={deltakelsesprosentValg}
        size="small"
        aria-required
      >
        <Radio value={DELTAKELSESPROSENT_VALG_JA}>Ja</Radio>
        <Radio value={DELTAKELSESPROSENT_VALG_NEI}>Nei</Radio>
      </RadioGroup>

      {deltakelsesprosentValg === DELTAKELSESPROSENT_VALG_NEI && (
        <>
          <TextField
            label="Deltakelsesprosent:"
            size="small"
            type="text"
            value={nyDeltakelsesprosent}
            onChange={(e) => endreDeltakelsesProsent(e.target.value)}
            error={deltakelsesprosentFeilmelding}
            aria-required
            className="[&>input]:w-16"
          />
          <TextField
            label="Hvor mange dager i uka? (valgfritt)"
            size="small"
            type="text"
            value={nyDagerPerUke}
            onChange={(e) => endreDagerPerUke(e.target.value)}
            error={dagerPerUkeFeilmelding}
            className="[&>input]:w-16"
          />
        </>
      )}
    </>
  )
}
