import {
  DatePicker,
  DateValidationT,
  Radio,
  RadioGroup,
  useDatepicker
} from '@navikt/ds-react'
import {
  Tiltakstype,
  getDateFromNorwegianStringFormat
} from 'deltaker-flate-common'
import { useRef, useState } from 'react'
import {
  VarighetValg,
  getVarighet,
  varighetValgForType
} from '../../utils/varighet.tsx'
import { formatDateToInputStr } from '../../utils/utils.ts'
import dayjs from 'dayjs'

interface Props {
  className?: string
  title: string
  startDato?: Date
  sluttdato?: Date
  tiltakstype: Tiltakstype
  errorVarighet: string | null
  errorSluttDato: string | null
  defaultVarighet?: VarighetValg | null
  defaultAnnetDato?: Date | null
  onChangeVarighet: (valg: VarighetValg) => void
  onChangeSluttDato: (date: Date | undefined) => void
  onValidateSluttDato: (
    dateValidation: DateValidationT,
    currentValue?: Date
  ) => void
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
  defaultAnnetDato,
  onChangeVarighet,
  onChangeSluttDato,
  onValidateSluttDato
}: Props) => {
  const [valgtVarighet, settValgtVarighet] = useState<VarighetValg | null>(
    defaultVarighet || null
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
      onValidateSluttDato(
        dateValidation,
        getDateFromNorwegianStringFormat(datePickerRef?.current?.value)
      )
    },
    onDateChange: (date) => {
      if (date) {
        setDateInput(formatDateToInputStr(date))
      }
      onChangeSluttDato(date)
    }
  })

  const handleChangeVarighet = (valg: VarighetValg) => {
    settValgtVarighet(valg)
    onChangeVarighet(valg)
  }

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateInput(e.target.value)

    const date = dayjs(e.target.value, 'DD.MM.YYYY')
    if (date.isValid()) {
      onChangeSluttDato(date.toDate())
    } else {
      onValidateSluttDato(dateValidation({ isInvalid: true }))
      onChangeSluttDato(undefined)
    }
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
                  value={dateInput}
                  ref={datePickerRef}
                  label="Annet - velg dato"
                  size="small"
                  hideLabel={true}
                  error={errorSluttDato}
                  onChange={handleDateInputChange}
                />
              </DatePicker>
            </div>
          )}
        </Radio>
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
