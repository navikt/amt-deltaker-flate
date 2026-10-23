import {
  DatePicker,
  DateValidationT,
  Radio,
  RadioGroup,
  useDatepicker
} from '@navikt/ds-react'
import { getDayjsFromString, Tiltakskode } from 'deltaker-flate-common'
import dayjs from 'dayjs'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import {
  VarighetValg,
  getVarighet,
  varighetValgForTiltakskode
} from '../../utils/varighet.ts'

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

  const visDatovelger = valgtVarighet === VarighetValg.ANNET

  const [inputDateCandidate, setInputDateCandidate] = useState<Date>()
  const inputDateCandidateRef = useRef<Date | undefined>(undefined)
  const [inputDateIsOutOfRange, setInputDateIsOutOfRange] = useState(false)
  const {
    datepickerProps,
    inputProps: { onChange: handleDatepickerInputChange, ...inputProps }
  } = useDatepicker({
    fromDate: startDato,
    toDate: sluttdato,
    defaultMonth: startDato,
    defaultSelected: defaultAnnetDato || undefined,
    onValidate: (dateValidation) => {
      const isOutOfRange = dateValidation.isAfter || dateValidation.isBefore
      setInputDateIsOutOfRange(isOutOfRange)
      const candidate = isOutOfRange ? inputDateCandidateRef.current : undefined
      if (candidate) {
        onValidateSluttDato(dateValidation, candidate)
      } else {
        onValidateSluttDato(dateValidation)
      }
    },
    onDateChange: (date) => {
      if (date) {
        setInputDateCandidate(undefined)
        inputDateCandidateRef.current = undefined
        setInputDateIsOutOfRange(false)
      }
      onChangeSluttDato(date)
    }
  })

  useEffect(() => {
    if (!inputDateCandidate || !inputDateIsOutOfRange) return

    const isBeforeStart =
      startDato && dayjs(inputDateCandidate).isBefore(startDato, 'date')
    const isAfterEnd =
      sluttdato && dayjs(inputDateCandidate).isAfter(sluttdato, 'date')

    if (isBeforeStart || isAfterEnd) {
      onValidateSluttDato(
        isBeforeStart
          ? dateValidation({ isBefore: true })
          : dateValidation({ isAfter: true }),
        inputDateCandidate
      )
      return
    }

    const validDateValidation = dateValidation({ isValidDate: true })
    onChangeSluttDato(inputDateCandidate)
    onValidateSluttDato(validDateValidation, inputDateCandidate)
    setInputDateIsOutOfRange(false)
    setInputDateCandidate(undefined)
    inputDateCandidateRef.current = undefined
  }, [
    inputDateIsOutOfRange,
    inputDateCandidate,
    onChangeSluttDato,
    onValidateSluttDato,
    startDato,
    sluttdato
  ])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value
    const parsedDate = getDayjsFromString(inputValue)?.toDate()
    setInputDateCandidate(parsedDate)
    inputDateCandidateRef.current = parsedDate
    handleDatepickerInputChange?.(event)
  }

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

        {visDatovelger && (
          <div className={visRadioAnnet ? 'mt-2 ml-7' : ''}>
            <DatePicker {...datepickerProps}>
              <DatePicker.Input
                {...inputProps}
                onChange={handleInputChange}
                label="Annet - velg dato"
                size="small"
                hideLabel={true}
                error={errorSluttDato}
                disabled={disabled}
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
