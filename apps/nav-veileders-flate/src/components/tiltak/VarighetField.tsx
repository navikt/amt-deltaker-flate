import {
  DatePicker,
  DateValidationT,
  Radio,
  RadioGroup,
  useDatepicker
} from '@navikt/ds-react'
import dayjs from 'dayjs'
import { Tiltakskode } from 'deltaker-flate-common'
import { useRef, useState } from 'react'
import { formatDateToInputStr } from '../../utils/utils.ts'
import {
  VarighetValg,
  getVarighet,
  varighetValgForTiltakskode
} from '../../utils/varighet.tsx'

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
  onValidateSluttDato: (dateValidation: DateValidationT, newDate?: Date) => void
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

  const datePickerRef = useRef<HTMLInputElement>(null)
  const visDatovelger = valgtVarighet === VarighetValg.ANNET
  const [dateInput, setDateInput] = useState<string>(
    defaultAnnetDato ? formatDateToInputStr(defaultAnnetDato) : ''
  )

  const { datepickerProps } = useDatepicker({
    fromDate: startDato,
    toDate: sluttdato,
    defaultMonth: startDato,
    defaultSelected: defaultAnnetDato || undefined,
    onValidate: (dateValidation) => {
      // Treffer valg endret av musepeker
      onValidateSluttDato(dateValidation)
    },
    onDateChange: (date) => {
      // Denne treffer valg i date picker fra klikk
      // den vil alltid velge gyldige datoer definert av datepicker.
      if (date) {
        setDateInput(formatDateToInputStr(date))
      }
      onChangeSluttDato(date)
    }
  })

  const handleChangeVarighet = (valg: VarighetValg) => {
    setValgtVarighet(valg)
    onChangeVarighet(valg)
  }

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Denne treffers hvis vi endrer date-input med tastatur.
    setDateInput(e.target.value)

    const date = dayjs(e.target.value, 'DD.MM.YYYY', true)
    if (date.isValid()) {
      onChangeSluttDato(date.toDate())
      onValidateSluttDato(dateValidation({ isValidDate: true }), date.toDate())
    } else {
      onValidateSluttDato(dateValidation({ isInvalid: true }))
      onChangeSluttDato(undefined)
    }
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

        {visDatovelger && (
          <div className="mt-2 ml-7">
            <DatePicker {...datepickerProps}>
              <DatePicker.Input
                value={dateInput}
                ref={datePickerRef}
                label="Annet - velg dato"
                size="small"
                hideLabel={true}
                error={errorSluttDato}
                disabled={disabled}
                onChange={handleDateInputChange}
              />
            </DatePicker>
          </div>
        )}
      </>
    </RadioGroup>
  )
}

export function dateValidation(
  overrides: Partial<DateValidationT> = {}
): DateValidationT {
  return {
    isDisabled: false,
    isWeekend: false,
    isEmpty: false,
    isInvalid: false,
    isValidDate: false,
    isBefore: false,
    isAfter: false,
    ...overrides
  }
}
