import { ConfirmationPanel, DatePicker, useDatepicker } from '@navikt/ds-react'
import {
  AktivtForslag,
  EndreDeltakelseType,
  ForslagEndring,
  ForslagEndringType,
  SluttdatoForslag,
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
import { BegrunnelseInput, useBegrunnelse } from '../modal/BegrunnelseInput.tsx'

interface EndreSluttdatoModalProps {
  pamelding: PameldingResponse
  forslag: AktivtForslag | null
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const EndreSluttdatoModal = ({
  pamelding,
  forslag,
  open,
  onClose,
  onSuccess
}: EndreSluttdatoModalProps) => {
  const defaultSluttdato = getSluttdato(pamelding, forslag)
  const { enhetId } = useAppContext()
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const sluttdato = useSluttdatoInput({
    deltaker: pamelding,
    defaultDato: defaultSluttdato,
    startdato: useMemo(
      () => getDateFromString(pamelding.startdato),
      [pamelding.startdato]
    )
  })

  const valgfriBegrunnelse =
    forslag !== null &&
    defaultSluttdato?.getTime() === sluttdato.sluttdato?.getTime()

  const begrunnelse = useBegrunnelse(valgfriBegrunnelse)

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
    if (sluttdato.sluttdato && begrunnelse.valider()) {
      const endring: EndreSluttdatoRequest = {
        sluttdato: formatDateToDateInputStr(sluttdato.sluttdato),
        forslagId: forslag?.id
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
      forslag={forslag}
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
      <BegrunnelseInput
        type={valgfriBegrunnelse ? 'valgfri' : 'obligatorisk'}
        onChange={begrunnelse.handleChange}
        error={begrunnelse.error}
      />
    </Endringsmodal>
  )
}

function isSluttdatoForslag(
  endring: ForslagEndring
): endring is SluttdatoForslag {
  return endring.type === ForslagEndringType.Sluttdato
}

function getSluttdato(
  deltaker: PameldingResponse,
  forslag: AktivtForslag | null
) {
  if (forslag === null) {
    return getDateFromString(deltaker.sluttdato)
  }
  if (isSluttdatoForslag(forslag.endring)) {
    return getDateFromString(forslag.endring.sluttdato)
  } else {
    throw new Error(
      `Kan ikke behandle forslag av type ${forslag.endring.type} som sluttdato`
    )
  }
}
