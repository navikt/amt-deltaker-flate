import {
  DatePicker,
  DateValidationT,
  Radio,
  RadioGroup,
  useDatepicker
} from '@navikt/ds-react'
import { Tiltakstype } from 'deltaker-flate-common'
import { useState } from 'react'
import {
  VarighetValg,
  getVarighet,
  varighetValgForType
} from '../../utils/varighet.tsx'

interface Props {
  className?: string
  title: string
  startDato?: Date
  sluttdato?: Date
  tiltakstype: Tiltakstype
  errorVarighet: string | null
  errorSluttDato: string | null
  defaultVarighet?: VarighetValg | null
  defaultSelectedDate?: Date | null
  onChangeVarighet: (valg: VarighetValg) => void
  onChangeSluttDato: (date: Date | undefined) => void
  onValidateSluttDato: (dateValidation: DateValidationT) => void
}

export const VarighetField = ({
  className,
  title,
  startDato,
  sluttdato,
  tiltakstype,
  errorVarighet,
  errorSluttDato,
  defaultVarighet,
  defaultSelectedDate,
  onChangeVarighet,
  onChangeSluttDato,
  onValidateSluttDato
}: Props) => {
  const [valgtVarighet, settValgtVarighet] = useState<VarighetValg | null>(
    defaultVarighet || null
  )
  const visDatovelger = valgtVarighet === VarighetValg.ANNET

  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: startDato,
    toDate: sluttdato,
    defaultMonth: startDato,
    defaultSelected: defaultSelectedDate || undefined,
    onValidate: onValidateSluttDato,
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
