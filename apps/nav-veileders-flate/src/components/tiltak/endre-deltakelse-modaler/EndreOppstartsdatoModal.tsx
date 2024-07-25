import {
  BodyShort,
  ConfirmationPanel,
  DatePicker,
  useDatepicker
} from '@navikt/ds-react'
import dayjs from 'dayjs'
import {
  Tiltakstype,
  getDateFromString,
  EndreDeltakelseType
} from 'deltaker-flate-common'
import { useState } from 'react'
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
  VarighetValg,
  getSisteGyldigeSluttDato,
  getSkalBekrefteVarighet,
  getSoftMaxVarighetBekreftelseText
} from '../../../utils/varighet.tsx'
import { VarighetField } from '../VarighetField.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { useSluttdato } from '../../../utils/use-sluttdato.ts'

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

  const defaultAnnetDato = pamelding.sluttdato
    ? dayjs(pamelding.sluttdato).toDate()
    : undefined

  const [valgtVarighet, setValgtVarighet] = useState<VarighetValg | undefined>(
    defaultAnnetDato ? VarighetValg.ANNET : undefined
  )

  const [errorStartdato, setErrorStartDato] = useState<string | null>(null)
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const tiltakstype = pamelding.deltakerliste.tiltakstype

  const skalVelgeVarighet = tiltakstype !== Tiltakstype.VASV

  const {
    datepickerProps,
    inputProps,
    selectedDay: startdato
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
  const sluttdato = useSluttdato({
    deltaker: pamelding,
    valgtVarighet: valgtVarighet,
    defaultAnnetDato: defaultAnnetDato,
    startdato: startdato
  })

  const skalBekrefteVarighet =
    startdato &&
    getSkalBekrefteVarighet(pamelding, sluttdato.sluttdato, startdato)

  const maxSluttdato = getSisteGyldigeSluttDato(pamelding, startdato)

  const onChangeVarighet = (valg: VarighetValg) => {
    setValgtVarighet(valg)
  }

  const validertRequest = () => {
    let hasError = false
    if (!startdato) {
      setErrorStartDato('Du må velge startdato')
      hasError = true
    }
    if (skalBekrefteVarighet && !varighetBekreftelse) {
      setErrorVarighetConfirmation(VARIGHET_BEKREFTELSE_FEILMELDING)
      hasError = true
    }

    if (skalVelgeVarighet && !sluttdato.valider()) {
      hasError = true
    }

    if (!hasError && startdato) {
      return {
        deltakerId: pamelding.deltakerId,
        enhetId,
        body: {
          startdato: formatDateToDateInputStr(startdato),
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
          error={errorStartdato}
          size="small"
        />
      </DatePicker>
      {skalVelgeVarighet && (
        <>
          <VarighetField
            title="Hva er forventet varighet?"
            className="mt-8"
            tiltakstype={pamelding.deltakerliste.tiltakstype}
            startDato={startdato}
            sluttdato={maxSluttdato}
            errorVarighet={sluttdato.error}
            errorSluttDato={null}
            defaultVarighet={valgtVarighet}
            defaultAnnetDato={defaultAnnetDato}
            onChangeVarighet={onChangeVarighet}
            onChangeSluttDato={sluttdato.handleChange}
            onValidateSluttDato={sluttdato.validerDato}
          />
          {sluttdato.sluttdato && valgtVarighet !== VarighetValg.ANNET && (
            <BodyShort className="mt-2" size="small">
              Forventet sluttdato:{' '}
              {formatDateToString(sluttdato.sluttdato) || '—'}
            </BodyShort>
          )}

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
