import {
  ConfirmationPanel,
  DatePicker,
  Radio,
  RadioGroup,
  useDatepicker
} from '@navikt/ds-react'
import {
  AktivtForslag,
  EndreDeltakelseType,
  ForslagEndringType,
  getDateFromNorwegianStringFormat,
  getDateFromString
} from 'deltaker-flate-common'
import { useRef, useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { avsluttDeltakelse } from '../../../api/api.ts'
import { AvsluttDeltakelseRequest } from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import {
  HarDeltattValg,
  dateStrToDate,
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
import { BegrunnelseInput, useBegrunnelse } from '../modal/BegrunnelseInput.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { AarsakRadioGroup, useAarsak } from '../modal/AarsakRadioGroup.tsx'

interface AvsluttDeltakelseModalProps {
  pamelding: PameldingResponse
  forslag: AktivtForslag | null
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

const showHarDeltatt = (pamelding: PameldingResponse) => {
  const statusdato = dateStrToDate(pamelding.status.gyldigFra)
  const femtenDagerSiden = new Date()
  femtenDagerSiden.setDate(femtenDagerSiden.getDate() - 15)
  return statusdato > femtenDagerSiden
}

const getSluttdatoFraForslag = (forslag: AktivtForslag | null) => {
  if (
    forslag &&
    forslag.endring.type === ForslagEndringType.AvsluttDeltakelse
  ) {
    return forslag.endring.sluttdato
  } else {
    return null
  }
}

export const AvsluttDeltakelseModal = ({
  pamelding,
  forslag,
  open,
  onClose,
  onSuccess
}: AvsluttDeltakelseModalProps) => {
  const sluttdatoFraForslag = getSluttdatoFraForslag(forslag)
  const [harDeltatt, setHarDeltatt] = useState<boolean | null>(null)
  const [nySluttDato, settNySluttDato] = useState<Date | null | undefined>(
    (sluttdatoFraForslag
      ? getDateFromString(sluttdatoFraForslag)
      : getDateFromString(pamelding.sluttdato)) ?? null
  )
  const [errorSluttDato, setErrorSluttDato] = useState<string | null>(null)
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const aarsak = useAarsak(forslag)
  const begrunnelse = useBegrunnelse(true)

  const datePickerRef = useRef<HTMLInputElement>(null)
  const { enhetId } = useAppContext()

  // VI viser dette valget i 15 dager etter startdato. ellers så vil vi alltid sette sluttdato
  const skalViseHarDeltatt = showHarDeltatt(pamelding)
  const skalViseSluttDato = !skalViseHarDeltatt || harDeltatt
  const skalBekrefteVarighet =
    skalViseSluttDato && getSkalBekrefteVarighet(pamelding, nySluttDato)

  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: dateStrToNullableDate(pamelding.startdato) || undefined,
    toDate: getSisteGyldigeSluttDato(pamelding) || undefined,
    defaultSelected: sluttdatoFraForslag
      ? getDateFromString(sluttdatoFraForslag)
      : getDateFromString(pamelding.sluttdato),
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
    let hasError = false
    if (skalViseSluttDato && !nySluttDato && !errorSluttDato) {
      setErrorSluttDato('Du må velge en sluttdato')
      hasError = true
    }
    if (skalViseSluttDato && !nySluttDato) {
      hasError = true
    }
    if (skalViseSluttDato && errorSluttDato) {
      hasError = true
    }
    if (skalBekrefteVarighet && !varighetBekreftelse) {
      setErrorVarighetConfirmation(VARIGHET_BEKREFTELSE_FEILMELDING)
      hasError = true
    }

    if (!aarsak.valider() || !begrunnelse.valider()) {
      hasError = true
    }

    if (!hasError && aarsak.aarsak !== undefined) {
      const endring: AvsluttDeltakelseRequest = {
        aarsak: {
          type: aarsak.aarsak,
          beskrivelse: aarsak.beskrivelse ?? null
        },
        sluttdato:
          skalViseSluttDato && nySluttDato
            ? formatDateToDateInputStr(nySluttDato)
            : null,
        harDeltatt: harDeltatt,
        begrunnelse: begrunnelse.begrunnelse || null,
        forslagId: forslag ? forslag.id : null
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
      endringstype={EndreDeltakelseType.AVSLUTT_DELTAKELSE}
      digitalBruker={pamelding.digitalBruker}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={avsluttDeltakelse}
      validertRequest={validertRequest}
      forslag={forslag}
    >
      <AarsakRadioGroup
        legend="Hva er årsaken til avslutning?"
        aarsak={aarsak.aarsak}
        aarsakError={aarsak.aarsakError}
        beskrivelse={aarsak.beskrivelse}
        beskrivelseError={aarsak.beskrivelseError}
        onChange={aarsak.handleChange}
        onBeskrivelse={aarsak.handleBeskrivelse}
      />
      {skalViseHarDeltatt && (
        <section className="mt-4">
          <RadioGroup
            legend="Har personen deltatt?"
            size="small"
            onChange={(value: HarDeltattValg) => {
              if (value === HarDeltattValg.NEI) {
                setHarDeltatt(false)
              } else {
                setHarDeltatt(true)
              }
            }}
          >
            <Radio value={HarDeltattValg.JA}>Ja</Radio>
            <Radio value={HarDeltattValg.NEI}>Nei</Radio>
          </RadioGroup>
        </section>
      )}
      {skalViseSluttDato && (
        <section className="mt-4">
          <DatePicker {...datepickerProps}>
            <DatePicker.Input
              {...inputProps}
              ref={datePickerRef}
              size="small"
              label="Hva er ny sluttdato?"
              error={errorSluttDato}
            />
          </DatePicker>
        </section>
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
          {getSoftMaxVarighetBekreftelseText(
            pamelding.deltakerliste.tiltakstype
          )}
        </ConfirmationPanel>
      )}
      <BegrunnelseInput
        type="valgfri"
        onChange={begrunnelse.handleChange}
        error={begrunnelse.error}
      />
    </Endringsmodal>
  )
}
