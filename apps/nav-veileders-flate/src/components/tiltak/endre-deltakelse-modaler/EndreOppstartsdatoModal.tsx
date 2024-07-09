import {
  BodyShort,
  ConfirmationPanel,
  DatePicker,
  DateValidationT,
  Detail,
  Modal,
  useDatepicker
} from '@navikt/ds-react'
import dayjs from 'dayjs'
import {
  DeferredFetchState,
  Tiltakstype,
  getDateFromString,
  isValidDate,
  useDeferredFetch,
  EndreDeltakelseType
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseStartdato } from '../../../api/api.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { ErrorPage } from '../../../pages/ErrorPage.tsx'
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
import { ModalFooter } from '../../ModalFooter.tsx'
import { EndringTypeIkon } from 'deltaker-flate-common'
import { VarighetField } from '../VarighetField.tsx'
import { getEndrePameldingTekst } from '../../../utils/displayText.ts'

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
  const [sluttDatoField, setSluttDatoField] = useState<Date | undefined>(
    validDeltakerSluttDato
  )
  const [errorStartDato, setErrorStartDato] = useState<string | null>(null)
  const [errorVarighet, setErrorVarighet] = useState<string | null>(null)
  const [errorSluttDato, setErrorSluttDato] = useState<string | null>(null)
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
    },
    onDateChange: (date) => {
      const varighet = valgtVarighet && getVarighet(valgtVarighet)
      if (!date) {
        settNySluttDato(undefined)
        setErrorVarighet(null)
      }
      if (varighet && valgtVarighet !== VarighetValg.ANNET) {
        const sluttDato = dayjs(date)
          .add(varighet.antall, varighet.tidsenhet)
          .toDate()
        settNySluttDato(sluttDato)
        setErrorVarighet(getSluttDatoFeilmelding(pamelding, sluttDato, date))
      } else if (valgtVarighet === VarighetValg.ANNET && nySluttDato) {
        setErrorSluttDato(getSluttDatoFeilmelding(pamelding, nySluttDato, date))
      }
    }
  })

  const skalBekrefteVarighet =
    nyStartdato && getSkalBekrefteVarighet(pamelding, nySluttDato, nyStartdato)

  const maxSluttDato = getSisteGyldigeSluttDato(pamelding, nyStartdato)

  const onChangeVarighet = (valg: VarighetValg) => {
    setValgtVarighet(valg)
    const varighet = getVarighet(valg)

    if (valg === VarighetValg.ANNET) {
      settNySluttDato(sluttDatoField)
      setErrorVarighet(null)
    } else if (nyStartdato) {
      const beregnetSluttdato = dayjs(nyStartdato).add(
        varighet.antall,
        varighet.tidsenhet
      )
      settNySluttDato(beregnetSluttdato.toDate())
      setErrorVarighet(
        getSluttDatoFeilmelding(
          pamelding,
          beregnetSluttdato.toDate(),
          nyStartdato
        )
      )
    } else {
      settNySluttDato(undefined)
      setErrorVarighet(null)
    }
  }

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchEndreDeltakelseStartdato
  } = useDeferredFetch(endreDeltakelseStartdato)

  const sendEndring = () => {
    let hasError = false
    if (!nyStartdato) {
      setErrorStartDato('Du må velge startdato')
      hasError = true
    }
    if (skalVelgeVarighet && !nySluttDato && !errorSluttDato) {
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
      errorSluttDato
    ) {
      hasError = true
    } else if (
      skalVelgeVarighet &&
      valgtVarighet !== VarighetValg.ANNET &&
      errorVarighet
    ) {
      hasError = true
    }

    if (skalVelgeVarighet && !valgtVarighet) {
      setErrorVarighet('Du må velge varighet')
      hasError = true
    }

    if (!hasError && nyStartdato) {
      doFetchEndreDeltakelseStartdato(pamelding.deltakerId, enhetId, {
        startdato: formatDateToDateInputStr(nyStartdato),
        sluttdato: nySluttDato ? formatDateToDateInputStr(nySluttDato) : null
      }).then((data) => {
        onSuccess(data)
      })
    }
  }

  const onValidateSluttDato = (
    dateValidation: DateValidationT,
    currentValue?: Date
  ) => {
    if (dateValidation.isBefore) {
      setSluttDatoField(currentValue)
      setErrorSluttDato(VARIGHET_VALG_FØR_FEILMELDING)
    } else if (dateValidation.isInvalid) {
      setErrorSluttDato(UGYLDIG_DATO_FEILMELDING)
      setSluttDatoField(currentValue)
    } else if (dateValidation.isAfter && currentValue) {
      /* currentValue er bare gyldig hvis vi skriver inn dato med tastaturet.
       Bruker man datovelgeren er dette forrige dato, ikek valgte.
       Det er bare tastatur som gjør at man kan få en dato som er etter grensen,
       det er ikke mulig å velge en dato som er etter grensen med datovelger
      */
      setSluttDatoField(currentValue)
      setErrorSluttDato(
        getSluttDatoFeilmelding(pamelding, currentValue, nyStartdato)
      )
    }
  }

  return (
    <Modal
      open={open}
      header={{
        icon: (
          <EndringTypeIkon type={EndreDeltakelseType.ENDRE_OPPSTARTSDATO} />
        ),
        heading: 'Endre oppstartsdato'
      }}
      onClose={onClose}
    >
      <Modal.Body>
        {endreDeltakelseState === DeferredFetchState.ERROR && (
          <ErrorPage message={endreDeltakelseError} />
        )}
        <Detail size="small" className="mb-4">
          {getEndrePameldingTekst(pamelding.digitalBruker)}
        </Detail>
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
              errorVarighet={errorVarighet}
              errorSluttDato={errorSluttDato}
              defaultVarighet={valgtVarighet}
              defaultSelectedDate={nySluttDato}
              onChangeVarighet={onChangeVarighet}
              onChangeSluttDato={(date) => {
                if (date) {
                  setSluttDatoField(date)
                  setErrorSluttDato(null)
                }
                settNySluttDato(date)
              }}
              onValidateSluttDato={onValidateSluttDato}
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
      </Modal.Body>
      <ModalFooter
        confirmButtonText="Lagre"
        onConfirm={sendEndring}
        confirmLoading={endreDeltakelseState === DeferredFetchState.LOADING}
        disabled={endreDeltakelseState === DeferredFetchState.LOADING}
      />
    </Modal>
  )
}
