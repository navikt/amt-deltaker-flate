import { ConfirmationPanel, DatePicker, useDatepicker } from '@navikt/ds-react'
import {
  EndreDeltakelseType,
  getDateFromNorwegianStringFormat,
  getDateFromString
} from 'deltaker-flate-common'
import { useRef, useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseSluttdato } from '../../../api/api.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
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
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { EndreSluttdatoRequest } from '../../../api/data/endre-deltakelse-request.ts'

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

  const validertRequest = () => {
    if (!nySluttDato && !errorSluttDato) {
      setErrorSluttDato('Du må velge sluttdato')
      return null
    }
    if (skalBekrefteVarighet && !varighetBekreftelse) {
      setErrorVarighetConfirmation(VARIGHET_BEKREFTELSE_FEILMELDING)
      return null
    }
    if (nySluttDato && !errorSluttDato) {
      const endring: EndreSluttdatoRequest = {
        sluttdato: formatDateToDateInputStr(nySluttDato)
      }
      return {
        deltakerId: pamelding.deltakerId,
        enhetId: enhetId,
        body: endring
      }
    }
    return null
  }

  return (
    <Endringsmodal
      open={open}
      endringstype={EndreDeltakelseType.ENDRE_SLUTTDATO}
      digitalBruker={pamelding.digitalBruker}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseSluttdato}
      validertRequest={validertRequest}
      forslag={null}
    >
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
    </Endringsmodal>
  )
}
