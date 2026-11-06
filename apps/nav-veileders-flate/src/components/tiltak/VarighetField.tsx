import { DateValidationT, Radio, RadioGroup } from '@navikt/ds-react'
import { Tiltakskode } from 'deltaker-flate-common'
import { useState } from 'react'
import {
  VarighetValg,
  getVarighet,
  varighetValgForTiltakskode
} from '../../utils/varighet.tsx'
import { SimpleDatePicker } from './SimpleDatePicker.tsx'

export { dateValidation } from '../../utils/utils.ts'

interface Props {
  className?: string
  title: string
  startDato?: Date
  sluttdato?: Date
  tiltakskode: Tiltakskode
  errorVarighet: string | null
  errorSluttDato: string | null
  defaultVarighet?: VarighetValg | null
  defaultAnnetDato?: Date | null
  disabled?: boolean
  onChangeVarighet: (valg: VarighetValg) => void
  onChangeSluttDato: (date: Date | undefined) => void
  onValidateSluttDato: (
    dateValidation: DateValidationT,
    newDate?: Date,
    errorMessage?: string
  ) => void
}

export const VarighetField = ({
  className,
  title,
  startDato,
  sluttdato,
  tiltakskode,
  errorVarighet,
  errorSluttDato,
  defaultVarighet,
  defaultAnnetDato,
  disabled,
  onChangeVarighet,
  onChangeSluttDato,
  onValidateSluttDato
}: Props) => {
  const varighetsvalg = varighetValgForTiltakskode(tiltakskode)
  const visRadioAnnet = varighetsvalg.length > 0

  const [valgtVarighet, setValgtVarighet] = useState<VarighetValg | null>(
    () => {
      if (defaultVarighet) return defaultVarighet
      if (varighetsvalg.length === 0) {
        return VarighetValg.ANNET
      }
      return null
    }
  )

  const visDatovelger = valgtVarighet === VarighetValg.ANNET

  const handleChangeVarighet = (valg: VarighetValg) => {
    setValgtVarighet(valg)
    onChangeVarighet(valg)
  }

  return (
    <RadioGroup
      legend={varighetsvalg.length > 0 ? title : 'Hva er forventet sluttdato?'}
      size="small"
      onChange={handleChangeVarighet}
      disabled={disabled}
      value={valgtVarighet}
      error={errorVarighet}
      className={className || ''}
    >
      <>
        {varighetsvalg.map((v) => (
          <Radio value={v} key={v}>
            {getVarighet(v).navn}
          </Radio>
        ))}

        {visRadioAnnet && (
          <Radio value={VarighetValg.ANNET}>Annet - velg dato</Radio>
        )}

        <div
          hidden={!visDatovelger}
          className={visRadioAnnet ? 'mt-2 ml-7' : ''}
        >
          <SimpleDatePicker
            label="Annet - velg dato"
            hideLabel
            error={errorSluttDato}
            fromDate={startDato}
            toDate={sluttdato}
            defaultMonth={startDato}
            defaultDate={defaultAnnetDato ?? undefined}
            disabled={disabled}
            onChange={onChangeSluttDato}
            onValidate={onValidateSluttDato}
          />
        </div>
      </>
    </RadioGroup>
  )
}
