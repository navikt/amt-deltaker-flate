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
  VARIGHET_VALG_FØR_FEILMELDING,
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
  const validDeltakerSluttDato = getDateFromString(pamelding.sluttdato)

  const { enhetId } = useAppContext()
  const [valgtVarighet, setValgtVarighet] = useState<VarighetValg | undefined>(
    isValidDate(pamelding.sluttdato) ? VarighetValg.ANNET : undefined
  )

  const [nySluttDato, settNySluttDato] = useState<Date | undefined>(
    validDeltakerSluttDato
  )
  const [errorStartDato, setErrorStartDato] = useState<string | null>(null)
  const [errorSluttDato, setErrorSluttDato] = useState<string | null>(null)
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const tiltakstype = pamelding.deltakerliste.tiltakstype
  //TODO: THIS NEEDS TO GO!
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
    },
    onDateChange: (date) => {
      const varighet = valgtVarighet && getVarighet(valgtVarighet)
      if (varighet && valgtVarighet !== VarighetValg.ANNET) {
        const sluttDato = dayjs(date)
          .add(varighet.antall, varighet.tidsenhet)
          .toDate()
        settNySluttDato(sluttDato)
      }
    }
  })

  const annet = useAnnetSluttdato(pamelding, nyStartdato)

  useEffect(() => {
    if (
      nyStartdato &&
      valgtVarighet === VarighetValg.ANNET &&
      nySluttDato === undefined
    ) {
      settNySluttDato(annet.sluttdato)
    }
  }, [nyStartdato])

  const skalBekrefteVarighet =
    nyStartdato && getSkalBekrefteVarighet(pamelding, nySluttDato, nyStartdato)

  const maxSluttDato = getSisteGyldigeSluttDato(pamelding, nyStartdato)

  const onChangeVarighet = (valg: VarighetValg) => {
    setValgtVarighet(valg)
    const varighet = getVarighet(valg)

    if (valg === VarighetValg.ANNET) {
      settNySluttDato(annet.sluttdato)
    } else if (nyStartdato) {
      const beregnetSluttdato = dayjs(nyStartdato).add(
        varighet.antall,
        varighet.tidsenhet
      )
      settNySluttDato(beregnetSluttdato.toDate())
    } else {
      settNySluttDato(undefined)
    }
  }

  const validertRequest = () => {
    let hasError = false
    if (!nyStartdato) {
      setErrorStartDato('Du må velge startdato')
      hasError = true
    }
    if (skalVelgeVarighet && !nySluttDato && !annet.error) {
      setErrorSluttDato('Du må velge en sluttdato')
      hasError = true
    }

    if (skalBekrefteVarighet && !varighetBekreftelse) {
      setErrorVarighetConfirmation(VARIGHET_BEKREFTELSE_FEILMELDING)
      hasError = true
    }

    if (
      skalVelgeVarighet &&
      valgtVarighet === VarighetValg.ANNET &&
      annet.error
    ) {
      hasError = true
    } else if (
      skalVelgeVarighet &&
      valgtVarighet !== VarighetValg.ANNET &&
      annet.error
    ) {
      hasError = true
    }

    if (skalVelgeVarighet && !valgtVarighet) {
      setErrorSluttDato('Du må velge varighet')
      hasError = true
    }

    if (!hasError && nyStartdato) {
      return {
        deltakerId: pamelding.deltakerId,
        enhetId,
        body: {
          startdato: formatDateToDateInputStr(nyStartdato),
          sluttdato: nySluttDato ? formatDateToDateInputStr(nySluttDato) : null
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
            errorVarighet={errorSluttDato}
            errorSluttDato={annet.error}
            defaultVarighet={valgtVarighet}
            defaultSelectedDate={nySluttDato}
            onChangeVarighet={onChangeVarighet}
            onChangeSluttDato={(date) => {
              if (date) {
                setErrorSluttDato(null)
              }
              settNySluttDato(date)
            }}
            onValidateSluttDato={annet.onValidateAnnet}
          />
          <BodyShort className="mt-2" size="small">
            Forventet sluttdato: {formatDateToString(nySluttDato) || '—'}
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

function useAnnetSluttdato(deltaker: PameldingResponse, startdato?: Date) {
  const opprinneligSluttdato = getDateFromString(deltaker.sluttdato)

  const [sluttdato, setSluttdato] = useState<Date | undefined>(
    opprinneligSluttdato
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (sluttdato) {
      setError(getSluttDatoFeilmelding(deltaker, sluttdato, startdato))
    }
  }, [startdato])

  const onValidateAnnet = (
    dateValidation: DateValidationT,
    currentValue?: Date
  ) => {
    setSluttdato(currentValue)
    if (dateValidation.isInvalid) {
      setError(UGYLDIG_DATO_FEILMELDING)
    } else if (dateValidation.isBefore) {
      setError(
        startdato
          ? VARIGHET_VALG_FØR_FEILMELDING
          : 'Datoen kan ikke velges fordi den er før nåværende sluttdato.'
      )
    } else if (dateValidation.isAfter && currentValue) {
      setError(getSluttDatoFeilmelding(deltaker, currentValue, startdato))
    } else {
      setError(null)
    }
  }

  return { sluttdato, setSluttdato, error, onValidateAnnet }
}
