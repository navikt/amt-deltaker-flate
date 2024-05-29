import {
  BodyShort,
  ConfirmationPanel,
  DatePicker,
  Detail,
  Modal,
  useDatepicker
} from '@navikt/ds-react'
import dayjs from 'dayjs'
import {
  DeferredFetchState,
  Tiltakstype,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseStartdato } from '../../../api/api.ts'
import { EndreDeltakelseType } from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { ErrorPage } from '../../../pages/ErrorPage.tsx'
import {
  dateStrToNullableDate,
  formatDateToDateInputStr,
  formatDateToString
} from '../../../utils/utils.ts'
import {
  UGYLDIG_DATO_FEILMELDING,
  VARGIHET_VALG_FEILMELDING,
  VARIGHET_VALG_FØR_FEILMELDING,
  VARIGHET_BEKREFTELSE_FEILMELDING,
  VarighetValg,
  getMaxVarighetDato,
  getSisteGyldigeSluttDato,
  getSkalBekrefteVarighet,
  getSoftMaxVarighetBekreftelseText,
  getVarighet
} from '../../../utils/varighet.tsx'
import { ModalFooter } from '../../ModalFooter.tsx'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import { VarighetField } from '../VarighetField.tsx'

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
  const [valgtVarighet, setValgtVarighet] = useState<VarighetValg | null>()
  const [nySluttDato, settNySluttDato] = useState<Date>()
  const [sluttDatoField, setSluttDatoField] = useState<Date>()
  const [errorStartDato, setErrorStartDato] = useState<string | null>(null)
  const [errorVarighet, setErrorVarighet] = useState<string | null>(null)
  const [errorSluttDato, setErrorSluttDato] = useState<string | null>(null)
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const tiltakstype = pamelding.deltakerliste.tiltakstype
  const skalVelgeVarighet = tiltakstype !== Tiltakstype.VASV

  const erValgtSluttdatoGyldig = (startDato: Date, sluttDato: Date) => {
    const maxVarighetDato = getMaxVarighetDato(pamelding, startDato)
    return (
      dayjs(sluttDato).isSameOrAfter(
        pamelding.deltakerliste.startdato,
        'day'
      ) && dayjs(sluttDato).isSameOrBefore(maxVarighetDato, 'day')
    )
  }

  const {
    datepickerProps,
    inputProps,
    selectedDay: nyStartdato
  } = useDatepicker({
    fromDate:
      dateStrToNullableDate(pamelding.deltakerliste.startdato) || undefined,
    toDate: getSisteGyldigeSluttDato(pamelding) || undefined,
    onValidate: (dateValidation) => {
      if (dateValidation.isBefore) {
        setErrorStartDato(
          'Datoen kan ikke velges fordi den er før deltakerlistens startdato.'
        )
      } else if (dateValidation.isAfter) {
        setErrorStartDato(VARGIHET_VALG_FEILMELDING)
      } else if (dateValidation.isInvalid) {
        setErrorStartDato(UGYLDIG_DATO_FEILMELDING)
      } else {
        setErrorStartDato(null)
      }
    },
    onDateChange: (date) => {
      const varighet = valgtVarighet && getVarighet(valgtVarighet)
      if (varighet && valgtVarighet !== VarighetValg.ANNET) {
        const varighetAntall = varighet.antall
        const varighetTidsEnhet = varighet.tidsenhet
        const sluttDato = date
          ? dayjs(date).add(varighetAntall, varighetTidsEnhet)
          : undefined

        settNySluttDato(sluttDato?.toDate())
        if (
          sluttDato &&
          date &&
          !erValgtSluttdatoGyldig(date, sluttDato.toDate())
        ) {
          setErrorVarighet(VARGIHET_VALG_FEILMELDING)
        } else setErrorVarighet(null)
      } else if (
        valgtVarighet === VarighetValg.ANNET &&
        nySluttDato &&
        dayjs(nySluttDato).isBefore(date)
      ) {
        setErrorSluttDato(
          'Du må sette en sluttdato som er etter oppstartsdatoen.'
        )
      } else if (
        valgtVarighet === VarighetValg.ANNET &&
        nySluttDato &&
        date &&
        !erValgtSluttdatoGyldig(date, nySluttDato)
      ) {
        setErrorSluttDato(VARGIHET_VALG_FEILMELDING)
      } else {
        setErrorVarighet(null)
        setErrorSluttDato(null)
      }
    }
  })

  const skalBekrefteVarighet =
    nyStartdato && getSkalBekrefteVarighet(pamelding, nySluttDato, nyStartdato)

  const maxSluttDato = getSisteGyldigeSluttDato(pamelding, nyStartdato)

  const onChangeVarighet = (valg: VarighetValg) => {
    const varighet = getVarighet(valg)

    if (valg === VarighetValg.ANNET) {
      settNySluttDato(sluttDatoField)
      setErrorVarighet(null)
    } else if (nyStartdato && varighet) {
      const valgtSluttdato = dayjs(nyStartdato).add(
        varighet.antall,
        varighet.tidsenhet
      )
      settNySluttDato(valgtSluttdato.toDate())

      if (!erValgtSluttdatoGyldig(nyStartdato, valgtSluttdato.toDate())) {
        setErrorVarighet(VARGIHET_VALG_FEILMELDING)
      } else setErrorVarighet(null)
    } else {
      settNySluttDato(undefined)
    }

    setValgtVarighet(valg)
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
    }

    if (skalVelgeVarighet && !valgtVarighet) {
      setErrorVarighet('Du må velge varighet')
      hasError = true
    } else if (
      skalVelgeVarighet &&
      valgtVarighet === VarighetValg.ANNET &&
      nySluttDato &&
      dayjs(nySluttDato).isBefore(nyStartdato)
    ) {
      setErrorVarighet('Du må sette en sluttdato som er etter oppstartsdatoen.')
      hasError = true
    } else if (
      skalVelgeVarighet &&
      valgtVarighet &&
      nyStartdato &&
      nySluttDato &&
      !erValgtSluttdatoGyldig(nyStartdato, nySluttDato)
    ) {
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
          Når du lagrer så får bruker beskjed gjennom nav.no. Arrangør ser også
          endringen.
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
              startDato={nyStartdato || undefined}
              sluttdato={maxSluttDato || undefined}
              errorVarighet={errorVarighet}
              errorSluttDato={errorSluttDato}
              onChangeVarighet={onChangeVarighet}
              onChangeSluttDato={(date) => {
                setErrorSluttDato(null)
                setSluttDatoField(date)
                settNySluttDato(date)
              }}
              onValidateSluttDato={(dateValidation) => {
                if (dateValidation.isAfter) {
                  setErrorSluttDato(VARGIHET_VALG_FEILMELDING)
                } else if (dateValidation.isBefore) {
                  setErrorSluttDato(VARIGHET_VALG_FØR_FEILMELDING)
                } else if (dateValidation.isInvalid) {
                  setErrorSluttDato(UGYLDIG_DATO_FEILMELDING)
                }
              }}
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
