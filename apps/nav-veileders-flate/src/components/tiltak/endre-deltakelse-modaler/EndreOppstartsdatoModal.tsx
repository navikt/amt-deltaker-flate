import {
  BodyShort,
  ConfirmationPanel,
  DatePicker,
  DateValidationT,
  useDatepicker
} from '@navikt/ds-react'
import dayjs from 'dayjs'
import {
  Tiltakstype,
  getDateFromString,
  isValidDate,
  EndreDeltakelseType
} from 'deltaker-flate-common'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseStartdato } from '../../../api/api.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import {
  dateStrToNullableDate,
  formatDateToDateInputStr,
  formatDateToString
} from '../../../utils/utils.ts'
import {
  DATO_UTENFOR_TILTAKGJENNOMFORING,
  UGYLDIG_DATO_FEILMELDING,
  VARIGHET_BEKREFTELSE_FEILMELDING,
  SLUTTDATO_FØR_OPPSTARTSDATO_FEILMELDING,
  VarighetValg,
  getSluttDatoFeilmelding,
  getSisteGyldigeSluttDato,
  getSkalBekrefteVarighet,
  getSoftMaxVarighetBekreftelseText,
  getVarighet
} from '../../../utils/varighet.tsx'
import { VarighetField } from '../VarighetField.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'

interface EndreOppstartsdatoModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const EndreOppstartsdatoModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: EndreOppstartsdatoModalProps) => {
  const { enhetId } = useAppContext()
  const [valgtVarighet, setValgtVarighet] = useState<VarighetValg | undefined>(
    isValidDate(pamelding.sluttdato) ? VarighetValg.ANNET : undefined
  )

  const [errorStartDato, setErrorStartDato] = useState<string | null>(null)
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const tiltakstype = pamelding.deltakerliste.tiltakstype

  const skalVelgeVarighet = tiltakstype !== Tiltakstype.VASV

  const {
    datepickerProps,
    inputProps,
    selectedDay: nyStartdato
  } = useDatepicker({
    fromDate:
      dateStrToNullableDate(pamelding.deltakerliste.startdato) || undefined,
    toDate:
      dateStrToNullableDate(pamelding.deltakerliste.sluttdato) || undefined,
    defaultMonth: dayjs().toDate(),
    defaultSelected: getDateFromString(pamelding.startdato),
    onValidate: (dateValidation) => {
      if (dateValidation.isBefore || dateValidation.isAfter) {
        setErrorStartDato(DATO_UTENFOR_TILTAKGJENNOMFORING)
      } else if (dateValidation.isInvalid) {
        setErrorStartDato(UGYLDIG_DATO_FEILMELDING)
      } else {
        setErrorStartDato(null)
      }
    }
  })

  const sluttdato = useSluttdato(pamelding, nyStartdato, valgtVarighet)

  const skalBekrefteVarighet =
    nyStartdato &&
    getSkalBekrefteVarighet(pamelding, sluttdato.sluttdato, nyStartdato)

  const maxSluttDato = getSisteGyldigeSluttDato(pamelding, nyStartdato)

  const onChangeVarighet = (valg: VarighetValg) => {
    setValgtVarighet(valg)
  }

  const validertRequest = () => {
    let hasError = false
    if (!nyStartdato) {
      setErrorStartDato('Du må velge startdato')
      hasError = true
    }
    if (skalBekrefteVarighet && !varighetBekreftelse) {
      setErrorVarighetConfirmation(VARIGHET_BEKREFTELSE_FEILMELDING)
      hasError = true
    }

    if (sluttdato.error) {
      hasError = true
    }

    if (!hasError && nyStartdato) {
      return {
        deltakerId: pamelding.deltakerId,
        enhetId,
        body: {
          startdato: formatDateToDateInputStr(nyStartdato),
          sluttdato: sluttdato.sluttdato
            ? formatDateToDateInputStr(sluttdato.sluttdato)
            : null
        }
      }
    }
    return null
  }

  return (
    <Endringsmodal
      open={open}
      endringstype={EndreDeltakelseType.ENDRE_OPPSTARTSDATO}
      digitalBruker={pamelding.digitalBruker}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseStartdato}
      validertRequest={validertRequest}
      forslag={null}
    >
      <DatePicker {...datepickerProps}>
        <DatePicker.Input
          {...inputProps}
          label="Ny oppstartsdato"
          error={errorStartDato}
          size="small"
        />
      </DatePicker>
      {skalVelgeVarighet && (
        <>
          <VarighetField
            title="Hva er forventet varighet?"
            className="mt-8"
            tiltakstype={pamelding.deltakerliste.tiltakstype}
            startDato={nyStartdato}
            sluttdato={maxSluttDato}
            errorVarighet={sluttdato.error}
            errorSluttDato={null}
            defaultVarighet={valgtVarighet}
            defaultSelectedDate={sluttdato.sluttdato}
            onChangeVarighet={onChangeVarighet}
            onChangeSluttDato={sluttdato.handleChange}
            onValidateSluttDato={sluttdato.validate}
          />
          <BodyShort className="mt-2" size="small">
            Forventet sluttdato:{' '}
            {formatDateToString(sluttdato.sluttdato) || '—'}
          </BodyShort>

          {skalBekrefteVarighet && (
            <ConfirmationPanel
              className="mt-6"
              checked={varighetBekreftelse}
              label="Ja, deltakeren oppfyller kravene."
              onChange={() => {
                setVarighetConfirmation((x) => !x)
                setErrorVarighetConfirmation(null)
              }}
              size="small"
              error={errorVarighetConfirmation}
            >
              {getSoftMaxVarighetBekreftelseText(tiltakstype)}
            </ConfirmationPanel>
          )}
        </>
      )}
    </Endringsmodal>
  )
}

function useSluttdato(
  deltaker: PameldingResponse,
  startdato?: Date,
  valgtVarighet?: VarighetValg
): {
  sluttdato: Date | undefined
  error: string | null
  validate: (dateValidation: DateValidationT, date?: Date) => void
  handleChange: (date: Date | undefined) => void
} {
  const opprinneligSluttdato = getDateFromString(deltaker.sluttdato)

  const [sluttdato, setSluttdato] = useState<Date | undefined>(
    opprinneligSluttdato
  )
  const [error, setError] = useState<string | null>(null)

  const onAnnetChange = (d: Date | undefined) => {
    setSluttdato(d)
  }

  const annet = useAnnetSluttdato(
    deltaker,
    onAnnetChange,
    startdato,
    valgtVarighet
  )

  useEffect(() => {
    if (valgtVarighet === VarighetValg.ANNET) {
      setSluttdato(annet.sluttdato)
    } else if (valgtVarighet && startdato) {
      const varighet = getVarighet(valgtVarighet)
      const nySluttdato = dayjs(startdato)
        .add(varighet.antall, varighet.tidsenhet)
        .toDate()
      setSluttdato(nySluttdato)
    }
  }, [startdato, valgtVarighet])

  useEffect(() => {
    if (sluttdato && valgtVarighet !== VarighetValg.ANNET) {
      setError(getSluttDatoFeilmelding(deltaker, sluttdato, startdato))
    } else if (valgtVarighet === VarighetValg.ANNET || !startdato) {
      setError(null)
    }
  }, [valgtVarighet, sluttdato])

  const validate = (dateValidation: DateValidationT, date?: Date) => {
    annet.validate(dateValidation, date)
  }

  const handleChange = (date: Date | undefined) => {
    annet.onChange(date)
  }

  const hasError = error !== null && annet.error !== null

  return {
    sluttdato: hasError ? undefined : sluttdato,
    error: error || annet.error,
    validate,
    handleChange
  }
}

function useAnnetSluttdato(
  deltaker: PameldingResponse,
  onChange: (date: Date | undefined) => void,
  startdato?: Date,
  valgtVarighet?: VarighetValg
) {
  const opprinneligSluttdato = getDateFromString(deltaker.sluttdato)

  const [sluttdato, setSluttdato] = useState<Date | undefined>(
    opprinneligSluttdato
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (valgtVarighet !== VarighetValg.ANNET) {
      setError(null)
    } else if (sluttdato) {
      setError(getSluttDatoFeilmelding(deltaker, sluttdato, startdato))
    }
  }, [valgtVarighet, sluttdato, startdato])

  const validate = (dateValidation: DateValidationT, date?: Date) => {
    setSluttdato(date)
    if (dateValidation.isInvalid) {
      setError(UGYLDIG_DATO_FEILMELDING)
    } else if (dateValidation.isBefore) {
      setError(
        startdato
          ? SLUTTDATO_FØR_OPPSTARTSDATO_FEILMELDING
          : 'Datoen kan ikke velges fordi den er før nåværende sluttdato.'
      )
    } else if (dateValidation.isAfter && date) {
      setError(getSluttDatoFeilmelding(deltaker, date, startdato))
    } else {
      setError(null)
    }
  }

  const handleChange = (date: Date | undefined) => {
    if (date) setSluttdato(date)
    onChange(date)
  }

  return { sluttdato, error, validate, onChange: handleChange }
}
