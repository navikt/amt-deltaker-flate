import {
  BodyShort,
  DatePicker,
  Detail,
  Modal,
  useDatepicker
} from '@navikt/ds-react'
import { PameldingResponse, Tiltakstype } from '../../../api/data/pamelding.ts'
import { useState } from 'react'
import {
  DeferredFetchState,
  useDeferredFetch
} from '../../../hooks/useDeferredFetch.ts'
import { endreDeltakelseStartdato } from '../../../api/api.ts'
import { useAppContext } from '../../../AppContext.tsx'
import {
  dateStrToNullableDate,
  formatDateFromString,
  formatDateToDateInputStr,
  formatDateToString
} from '../../../utils/utils.ts'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import { EndreDeltakelseType } from '../../../api/data/endre-deltakelse-request.ts'
import { ModalFooter } from '../../ModalFooter.tsx'
import dayjs from 'dayjs'
import { getVarighet, VarighetValg } from '../../../utils/varighet.ts'
import { VargihetField } from '../VargihetField.tsx'
import { ErrorPage } from '../../../pages/ErrorPage.tsx'

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
  const [errorStartDato, setErrorStartDato] = useState<string | null>(null)
  const [errorVarighet, setErrorVarighet] = useState<string | null>(null)
  const [errorSluttDato, setErrorSluttDato] = useState<string | null>(null)

  const tiltakstype = pamelding.deltakerliste.tiltakstype
  const skalVelgeVarighet = tiltakstype !== Tiltakstype.VASV
  const feilmeldingSluttdato = `Du må sette en sluttdato som er før sluttdatoen for tiltaksgjennomføringen: ${formatDateFromString(
    pamelding.deltakerliste.sluttdato
  )}`

  const erValgtSluttdatoGyldig = (sluttDato: dayjs.Dayjs) => {
    return (
      sluttDato.isSameOrAfter(pamelding.deltakerliste.startdato, 'day') &&
      sluttDato.isSameOrBefore(pamelding.deltakerliste.sluttdato, 'day')
    )
  }

  const {
    datepickerProps,
    inputProps,
    selectedDay: nyStartdato
  } = useDatepicker({
    // TODO i arrangør flate er disse datoene maks 2 mnd tilbake/frem i tid
    fromDate:
      dateStrToNullableDate(pamelding.deltakerliste.startdato) || undefined,
    toDate:
      dateStrToNullableDate(pamelding.deltakerliste.sluttdato) || undefined,
    onDateChange: (date) => {
      const varighet = valgtVarighet && getVarighet(valgtVarighet)
      if (varighet && valgtVarighet !== VarighetValg.ANNET) {
        const varighetAntall = varighet.antall
        const varighetTidsEnhet = varighet.tidsenhet
        const sluttDato = dayjs(date).add(varighetAntall, varighetTidsEnhet)

        settNySluttDato(sluttDato.toDate())

        if (!erValgtSluttdatoGyldig(sluttDato)) {
          setErrorVarighet(feilmeldingSluttdato)
        } else setErrorVarighet(null)
      } else if (
        valgtVarighet === VarighetValg.ANNET &&
        dayjs(nySluttDato).isBefore(date)
      ) {
        setErrorVarighet(
          'Du må sette en sluttdato som er etter oppstartsdatoen.'
        )
      } else {
        setErrorVarighet(null)
      }

      setErrorStartDato(null)
    }
  })

  const onChangeVarighet = (valg: VarighetValg) => {
    const varighet = getVarighet(valg)

    if (valg === VarighetValg.ANNET) {
      settNySluttDato(undefined)
      setErrorVarighet(null)
    } else if (nyStartdato && varighet) {
      const varighetAntall = varighet.antall
      const varighetTidsEnhet = varighet.tidsenhet
      const valgtSluttdato = dayjs(nyStartdato).add(
        varighetAntall,
        varighetTidsEnhet
      )
      settNySluttDato(valgtSluttdato.toDate())

      if (!erValgtSluttdatoGyldig(valgtSluttdato)) {
        setErrorVarighet(feilmeldingSluttdato)
      } else setErrorVarighet(null)
    }

    setErrorSluttDato(null)
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
    if (skalVelgeVarighet && !nySluttDato) {
      setErrorSluttDato('Du må velge en sluttdato')
      hasError = true
    }

    if (skalVelgeVarighet && !valgtVarighet) {
      setErrorVarighet('Du må velge vargihet')
      hasError = true
    } else if (
      skalVelgeVarighet &&
      nySluttDato &&
      !erValgtSluttdatoGyldig(dayjs(nySluttDato))
    ) {
      setErrorVarighet(feilmeldingSluttdato)
      hasError = true
    } else if (
      skalVelgeVarighet &&
      valgtVarighet === VarighetValg.ANNET &&
      nySluttDato &&
      dayjs(nySluttDato).isBefore(nyStartdato)
    ) {
      setErrorVarighet('Du må sette en sluttdato som er etter oppstartsdatoen.')
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
            <VargihetField
              title="Hva er forventet varighet?"
              className="mt-8"
              tiltakstype={pamelding.deltakerliste.tiltakstype}
              startDato={
                nyStartdato ||
                dateStrToNullableDate(pamelding.deltakerliste.startdato) ||
                undefined
              }
              sluttdato={
                dateStrToNullableDate(pamelding.deltakerliste.sluttdato) ||
                undefined
              }
              valgtDato={nySluttDato || undefined}
              errorVarighet={errorVarighet}
              errorSluttDato={errorSluttDato}
              onChangeVarighet={onChangeVarighet}
              onChangeSluttDato={(date) => {
                setErrorSluttDato(null)
                if (date) settNySluttDato(date)
                else settNySluttDato(undefined)
              }}
            />
            <BodyShort className="mt-2" size="small">
              Forventet sluttdato: {formatDateToString(nySluttDato) || '—'}
            </BodyShort>
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
