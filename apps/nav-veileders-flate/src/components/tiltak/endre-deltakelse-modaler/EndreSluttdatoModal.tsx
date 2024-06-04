import {
  ConfirmationPanel,
  DatePicker,
  Detail,
  Modal,
  useDatepicker
} from '@navikt/ds-react'
import {
  DeferredFetchState,
  getDateFromNorwegianStringFormat,
  getDateFromString,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useRef, useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseSluttdato } from '../../../api/api.ts'
import { EndreDeltakelseType } from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { ErrorPage } from '../../../pages/ErrorPage.tsx'
import {
  dateStrToNullableDate,
  formatDateToDateInputStr
} from '../../../utils/utils.ts'
import {
  SLUTTDATO_FØR_OPPSTARTSDATO_FEILMELDING,
  UGYLDIG_DATO_FEILMELDING,
  VARGIHET_VALG_FEILMELDING,
  VARIGHET_BEKREFTELSE_FEILMELDING,
  getSisteGyldigeSluttDato,
  getSkalBekrefteVarighet,
  getSluttDatoFeilmelding,
  getSoftMaxVarighetBekreftelseText
} from '../../../utils/varighet.tsx'
import { ModalFooter } from '../../ModalFooter.tsx'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import { getEndrePameldingTekst } from '../../../utils/displayText.ts'

interface EndreSluttdatoModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const EndreSluttdatoModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: EndreSluttdatoModalProps) => {
  const { enhetId } = useAppContext()
  const [nySluttDato, settNySluttDato] = useState<Date | null | undefined>(
    getDateFromString(pamelding.sluttdato)
  )
  const [errorSluttDato, setErrorSluttDato] = useState<string | null>(null)
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const datePickerRef = useRef<HTMLInputElement>(null)
  const skalBekrefteVarighet =
    nySluttDato && getSkalBekrefteVarighet(pamelding, nySluttDato)

  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: dateStrToNullableDate(pamelding.startdato) || undefined,
    toDate: getSisteGyldigeSluttDato(pamelding) || undefined,
    defaultSelected: getDateFromString(pamelding.sluttdato),
    onValidate: (dateValidation) => {
      if (dateValidation.isAfter) {
        const value = getDateFromNorwegianStringFormat(
          datePickerRef?.current?.value
        )
        if (value) setErrorSluttDato(getSluttDatoFeilmelding(pamelding, value))
        else setErrorSluttDato(VARGIHET_VALG_FEILMELDING)
      } else if (dateValidation.isInvalid) {
        setErrorSluttDato(UGYLDIG_DATO_FEILMELDING)
      } else if (dateValidation.isBefore) {
        setErrorSluttDato(SLUTTDATO_FØR_OPPSTARTSDATO_FEILMELDING)
      }
    },
    onDateChange: (date) => {
      settNySluttDato(date)
      if (date) setErrorSluttDato(null)
    }
  })

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchEndreDeltakelseSluttdato
  } = useDeferredFetch(endreDeltakelseSluttdato)

  const sendEndring = () => {
    if (!nySluttDato && !errorSluttDato)
      setErrorSluttDato('Du må velge sluttdato')
    else if (skalBekrefteVarighet && !varighetBekreftelse) {
      setErrorVarighetConfirmation(VARIGHET_BEKREFTELSE_FEILMELDING)
    } else if (nySluttDato && !errorSluttDato) {
      doFetchEndreDeltakelseSluttdato(pamelding.deltakerId, enhetId, {
        sluttdato: formatDateToDateInputStr(nySluttDato)
      }).then((data) => {
        onSuccess(data)
      })
    }
  }

  return (
    <Modal
      open={open}
      header={{
        icon: <EndringTypeIkon type={EndreDeltakelseType.ENDRE_SLUTTDATO} />,
        heading: 'Endre sluttdato'
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
            ref={datePickerRef}
            label="Ny sluttdato"
            error={errorSluttDato}
            size="small"
          />
        </DatePicker>
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
            {getSoftMaxVarighetBekreftelseText(
              pamelding.deltakerliste.tiltakstype
            )}
          </ConfirmationPanel>
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
