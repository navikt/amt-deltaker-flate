import { Tiltakstype } from 'deltaker-flate-model'
import { useState } from 'react'
import { DatePicker, Radio, RadioGroup, useDatepicker } from '@navikt/ds-react'
import {
  getVarighet,
  VarighetValg,
  varighetValgForType
} from '../../utils/varighet.ts'
import { formatDateToString } from '../../utils/utils.ts'

interface Props {
  className?: string
  title: string
  startDato?: Date
  sluttdato?: Date
  valgtDato?: Date
  tiltakstype: Tiltakstype
  errorVarighet: string | null
  errorSluttDato: string | null
  onChangeVarighet: (valg: VarighetValg) => void
  onChangeSluttDato: (date: Date | undefined) => void
}

export const VargihetField = ({
  className,
  title,
  startDato,
  sluttdato,
  valgtDato,
  tiltakstype,
  errorVarighet,
  errorSluttDato,
  onChangeVarighet,
  onChangeSluttDato
}: Props) => {
  const [valgtVarighet, settValgtVarighet] = useState<VarighetValg | null>(null)
  const visDatovelger = valgtVarighet === VarighetValg.ANNET

  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: startDato,
    toDate: sluttdato,
    onDateChange: (date) => {
      onChangeSluttDato(date)
    }
  })

  const handleChangeVarighet = (valg: VarighetValg) => {
    settValgtVarighet(valg)
    onChangeVarighet(valg)
  }

  return (
    <RadioGroup
      legend={title}
      size="small"
      onChange={handleChangeVarighet}
      value={valgtVarighet}
      error={errorVarighet}
      className={className || ''}
    >
      <>
        {varighetValgForType(tiltakstype).map((v) => (
          <Radio value={v} key={v}>
            {getVarighet(v).navn}
          </Radio>
        ))}
        <Radio value={VarighetValg.ANNET}>
          Annet - velg dato
          {visDatovelger && (
            <div className="mt-2">
              <DatePicker {...datepickerProps}>
                <DatePicker.Input
                  {...inputProps}
                  value={valgtDato ? formatDateToString(valgtDato) : ''}
                  label="Annet - velg dato"
                  size="small"
                  hideLabel={true}
                  error={errorSluttDato}
                />
              </DatePicker>
            </div>
          )}
        </Radio>
      </>
    </RadioGroup>
  )
}
