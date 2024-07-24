import { ConfirmationPanel, DatePicker, useDatepicker } from '@navikt/ds-react'
import {
  EndreDeltakelseType,
  getDateFromNorwegianStringFormat,
  getDateFromString
} from 'deltaker-flate-common'
import { useMemo, useRef, useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseSluttdato } from '../../../api/api.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import {
  dateStrToNullableDate,
  formatDateToDateInputStr
} from '../../../utils/utils.ts'
import {
  VARIGHET_BEKREFTELSE_FEILMELDING,
  getSisteGyldigeSluttDato,
  getSkalBekrefteVarighet,
  getSoftMaxVarighetBekreftelseText,
  useSluttdatoInput
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
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const sluttdato = useSluttdatoInput({
    deltaker: pamelding,
    defaultDato: getDateFromString(pamelding.sluttdato),
    startdato: useMemo(
      () => getDateFromString(pamelding.startdato),
      [pamelding.startdato]
    )
  })

  const datePickerRef = useRef<HTMLInputElement>(null)
  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: dateStrToNullableDate(pamelding.startdato) || undefined,
    toDate: getSisteGyldigeSluttDato(pamelding) || undefined,
    defaultSelected: getDateFromString(pamelding.sluttdato),
    onValidate: (dateValidation) => {
      sluttdato.validate(
        dateValidation,
        getDateFromNorwegianStringFormat(datePickerRef?.current?.value)
      )
    },
    onDateChange: sluttdato.onChange
  })

  const skalBekrefteVarighet =
    sluttdato.sluttdato &&
    getSkalBekrefteVarighet(pamelding, sluttdato.sluttdato)

  const validertRequest = () => {
    if (skalBekrefteVarighet && !varighetBekreftelse) {
      setErrorVarighetConfirmation(VARIGHET_BEKREFTELSE_FEILMELDING)
      return null
    }
    if (sluttdato.sluttdato) {
      const endring: EndreSluttdatoRequest = {
        sluttdato: formatDateToDateInputStr(sluttdato.sluttdato)
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
          error={sluttdato.error}
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
