import {
  Alert,
  Detail,
  BodyShort,
  DatePicker,
  Heading,
  Modal,
  useDatepicker
} from '@navikt/ds-react'
import { PameldingResponse, Tiltakstype } from '../../../api/data/pamelding.ts'
import { useState } from 'react'
import { DeferredFetchState, useDeferredFetch } from '../../../hooks/useDeferredFetch.ts'
import { endreDeltakelseStartdato } from '../../../api/api.ts'
import { useAppContext } from '../../../AppContext.tsx'
import {
  dateStrToNullableDate,
  formatDateFromString,
  formatDateToDateInputStr
} from '../../../utils/utils.ts'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import { EndreDeltakelseType } from '../../../api/data/endre-deltakelse-request.ts'
import { ModalFooter } from '../../ModalFooter.tsx'
import dayjs from 'dayjs'
import { VarighetValg, getVarighet } from '../../../utils/varighet.ts'
import { VargihetField } from '../VargihetField.tsx'

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
  const [nyStartdato, settNyStartDato] = useState<Date | null>(null)
  const [valgtVarighet, setValgtVarighet] = useState<VarighetValg | null>(null)
  const [nySluttDato, settNySluttDato] = useState<string | null>(null)
  const [errorStartDato, setErrorStartDato] = useState<string | null>(null)
  const [errorVarighet, setErrorVarighet] = useState<string | null>(null)
  const [errorSluttDato, setErrorSluttDato] = useState<string | null>(null)

  const tiltakstype = pamelding.deltakerliste.tiltakstype
  const skalVelgeVarighet = tiltakstype !== Tiltakstype.VASV
  const feilmeldingSluttdato = `Du må sette en sluttdato som er før sluttdatoen for tiltaksgjennomføringen: ${formatDateFromString(
    pamelding.deltakerliste.sluttdato
  )}`

  const { datepickerProps, inputProps } = useDatepicker({
    // TODO i arrangør flate er disse datoene maks 2 mnd tilbake/frem i tid
    fromDate: dateStrToNullableDate(pamelding.deltakerliste.startdato) || undefined,
    toDate: dateStrToNullableDate(pamelding.deltakerliste.sluttdato) || undefined,
    onDateChange: (date) => {
      if (valgtVarighet) {
        const varighetMnd = getVarighet(valgtVarighet)?.antall
        const sluttDato = dayjs(date).add(varighetMnd, 'month')
        varighetMnd && settNySluttDato(formatDateToDateInputStr(sluttDato.toDate()))

        const erNySluttdatoGyldig = sluttDato.isBefore(dayjs(pamelding.deltakerliste.sluttdato))
        if (!erNySluttdatoGyldig) {
          setErrorVarighet(feilmeldingSluttdato)
        }
      }

      setErrorStartDato(null)
      settNyStartDato(date || null)
    }
  })

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchEndreDeltakelseStartdato
  } = useDeferredFetch(endreDeltakelseStartdato)

  const sendEndring = () => {
    if (!nyStartdato) setErrorStartDato('Du må velge startdato')
    if (skalVelgeVarighet && !valgtVarighet) {
      setErrorVarighet('Du må velge vargihet')
    }
    if (skalVelgeVarighet && !nySluttDato) {
      setErrorSluttDato('Du må velge en sluttdato')
    }
    const erNySluttdatoGyldig = dayjs(nySluttDato).isBefore(pamelding.deltakerliste.sluttdato)
    if (skalVelgeVarighet && valgtVarighet && !erNySluttdatoGyldig) {
      setErrorVarighet(feilmeldingSluttdato)
    }

    if (nyStartdato && (skalVelgeVarighet ? nySluttDato && erNySluttdatoGyldig : true)) {
      doFetchEndreDeltakelseStartdato(pamelding.deltakerId, enhetId, {
        startdato: formatDateToDateInputStr(nyStartdato),
        sluttdato: nySluttDato
      }).then((data) => {
        onSuccess(data)
      })
    }
  }

  const onChangeVarighet = (valg: VarighetValg) => {
    const varighetMnd = getVarighet(valg)?.antall

    if (nyStartdato && varighetMnd) {
      const valgtSluttdato = dayjs(nyStartdato).add(varighetMnd, 'month')
      settNySluttDato(formatDateToDateInputStr(valgtSluttdato.toDate()))

      const erNySluttdatoGyldig = valgtSluttdato.isBefore(dayjs(pamelding.deltakerliste.sluttdato))
      if (!erNySluttdatoGyldig) {
        setErrorVarighet(feilmeldingSluttdato)
      } else setErrorVarighet(null)
    } else setErrorVarighet(null)
    if (valg === VarighetValg.ANNET) {
      settNySluttDato(null)
    }
    setErrorSluttDato(null)
    setValgtVarighet(valg)
  }

  return (
    <Modal
      open={open}
      header={{
        icon: <EndringTypeIkon type={EndreDeltakelseType.ENDRE_OPPSTARTSDATO} />,
        heading: 'Endre oppstartsdato'
      }}
      onClose={onClose}
    >
      <Modal.Body>
        {endreDeltakelseState === DeferredFetchState.ERROR && (
          <Alert variant="error" className="mb-4">
            <Heading size="small" spacing level="3">
              Det skjedde en feil.
            </Heading>
            {endreDeltakelseError}
          </Alert>
        )}
        <Detail size="small" className="mb-4">
          Når du lagrer så får bruker beskjed gjennom nav.no. Arrangør ser også endringen.
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
              startDato={dateStrToNullableDate(pamelding.deltakerliste.startdato) || undefined}
              sluttdato={dateStrToNullableDate(pamelding.deltakerliste.sluttdato) || undefined}
              errorVarighet={errorVarighet}
              errorSluttDato={errorSluttDato}
              onChangeVarighet={onChangeVarighet}
              onChangeSluttDato={(date) => {
                setErrorSluttDato(null)
                if (date) settNySluttDato(formatDateToDateInputStr(date))
                else settNySluttDato(null)
              }}
            />
            <BodyShort className="mt-2" size="small">
              Forventet sluttdato: {formatDateFromString(nySluttDato) || '—'}
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
