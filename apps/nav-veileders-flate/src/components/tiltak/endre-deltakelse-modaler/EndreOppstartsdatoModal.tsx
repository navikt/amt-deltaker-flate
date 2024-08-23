import { BodyShort, ConfirmationPanel, DateValidationT } from '@navikt/ds-react'
import dayjs from 'dayjs'
import {
  EndreDeltakelseType,
  Forslag,
  ForslagEndring,
  ForslagEndringType,
  StartdatoForslag,
  Tiltakstype,
  getDateFromString
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseStartdato } from '../../../api/api.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { useSluttdato } from '../../../utils/use-sluttdato.ts'
import {
  dateStrToNullableDate,
  formatDateToDtoStr,
  formatDateToString
} from '../../../utils/utils.ts'
import {
  DATO_UTENFOR_TILTAKGJENNOMFORING,
  UGYLDIG_DATO_FEILMELDING,
  VARIGHET_BEKREFTELSE_FEILMELDING,
  VarighetValg,
  finnValgtVarighet,
  getSisteGyldigeSluttDato,
  getSkalBekrefteVarighet,
  getSoftMaxVarighetBekreftelseText
} from '../../../utils/varighet.tsx'
import { SimpleDatePicker } from '../SimpleDatePicker.tsx'
import { VarighetField } from '../VarighetField.tsx'
import { BegrunnelseInput, useBegrunnelse } from '../modal/BegrunnelseInput.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'

interface EndreOppstartsdatoModalProps {
  pamelding: PameldingResponse
  open: boolean
  forslag: Forslag | null
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const EndreOppstartsdatoModal = ({
  pamelding,
  open,
  forslag,
  onClose,
  onSuccess
}: EndreOppstartsdatoModalProps) => {
  const { enhetId } = useAppContext()
  const defaultDatoer = getDatoer(pamelding, forslag)

  const [valgtVarighet, setValgtVarighet] = useState<VarighetValg | undefined>(
    finnValgtVarighet(
      defaultDatoer.startdato,
      defaultDatoer.sluttdato,
      pamelding.deltakerliste.tiltakstype
    )
  )
  const [errorStartdato, setErrorStartDato] = useState<string | null>(null)
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const tiltakstype = pamelding.deltakerliste.tiltakstype

  const skalVelgeVarighet = tiltakstype !== Tiltakstype.VASV

  const [startdato, setStartdato] = useState<Date | undefined>(
    defaultDatoer.startdato
  )

  const sluttdato = useSluttdato({
    deltaker: pamelding,
    valgtVarighet: valgtVarighet,
    defaultAnnetDato: defaultDatoer.sluttdato,
    startdato: startdato
  })

  const skalHaBegrunnelse =
    !forslag ||
    defaultDatoer.startdato?.getTime() !== startdato?.getTime() ||
    defaultDatoer.sluttdato?.getTime() !== sluttdato.sluttdato?.getTime()

  const begrunnelse = useBegrunnelse(!skalHaBegrunnelse)

  const skalBekrefteVarighet =
    startdato &&
    getSkalBekrefteVarighet(pamelding, sluttdato.sluttdato, startdato)

  const maxSluttdato = getSisteGyldigeSluttDato(pamelding, startdato)

  const validateStartdato = (
    dateValidation: DateValidationT,
    newDate?: Date
  ) => {
    if (dateValidation.isBefore || dateValidation.isAfter) {
      setErrorStartDato(DATO_UTENFOR_TILTAKGJENNOMFORING)
    } else if (dateValidation.isInvalid) {
      setErrorStartDato(UGYLDIG_DATO_FEILMELDING)
    } else if (
      // dateValidation kan ikke vite datoen hvis det er tastaturendringer
      newDate &&
      (dayjs(newDate).isBefore(pamelding.deltakerliste.startdato, 'date') ||
        dayjs(newDate).isAfter(pamelding.deltakerliste.sluttdato, 'date'))
    ) {
      setErrorStartDato(DATO_UTENFOR_TILTAKGJENNOMFORING)
    } else {
      setErrorStartDato(null)
    }
  }

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

    if (!begrunnelse.valider()) {
      hasError = true
    }

    if (!hasError && !errorStartdato && startdato) {
      return {
        deltakerId: pamelding.deltakerId,
        enhetId,
        body: {
          startdato: formatDateToDtoStr(startdato),
          sluttdato: sluttdato.sluttdato
            ? formatDateToDtoStr(sluttdato.sluttdato)
            : null,
          begrunnelse: begrunnelse.begrunnelse,
          forslagId: forslag?.id
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
      forslag={forslag}
    >
      <SimpleDatePicker
        label="Ny oppstartsdato"
        error={errorStartdato}
        fromDate={
          dateStrToNullableDate(pamelding.deltakerliste.startdato) || undefined
        }
        toDate={
          dateStrToNullableDate(pamelding.deltakerliste.sluttdato) || undefined
        }
        defaultMonth={dayjs().toDate()}
        defaultDate={defaultDatoer.startdato}
        onValidate={validateStartdato}
        onChange={(date) => setStartdato(date)}
      />
      {skalVelgeVarighet && (
        <>
          <VarighetField
            title="Hva er forventet varighet?"
            className="mt-6"
            tiltakstype={pamelding.deltakerliste.tiltakstype}
            startDato={startdato}
            sluttdato={maxSluttdato}
            errorVarighet={sluttdato.error}
            errorSluttDato={null}
            defaultVarighet={valgtVarighet}
            defaultAnnetDato={defaultDatoer.sluttdato}
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
          <BegrunnelseInput
            type={skalHaBegrunnelse ? 'obligatorisk' : 'valgfri'}
            onChange={begrunnelse.handleChange}
            error={begrunnelse.error}
          />
        </>
      )}
    </Endringsmodal>
  )
}

function isStartdatoForslag(
  endring: ForslagEndring
): endring is StartdatoForslag {
  return endring.type === ForslagEndringType.Startdato
}

function getDatoer(deltaker: PameldingResponse, forslag: Forslag | null) {
  if (forslag === null) {
    return {
      startdato: getDateFromString(deltaker.startdato),
      sluttdato: getDateFromString(deltaker.sluttdato)
    }
  }
  if (isStartdatoForslag(forslag.endring)) {
    return {
      startdato: forslag.endring.startdato,
      sluttdato: forslag.endring.sluttdato ?? undefined
    }
  } else {
    throw new Error(
      `Kan ikke behandle forslag av type ${forslag.endring.type} som startdato`
    )
  }
}
