import {
  ConfirmationPanel,
  DatePicker,
  Radio,
  RadioGroup,
  useDatepicker
} from '@navikt/ds-react'
import {
  AktivtForslag,
  AvsluttDeltakelseForslag,
  EndreDeltakelseType,
  ForslagEndring,
  ForslagEndringType,
  getDateFromNorwegianStringFormat,
  getDateFromString
} from 'deltaker-flate-common'
import { useMemo, useRef, useState } from 'react'
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
  VARIGHET_BEKREFTELSE_FEILMELDING,
  getSisteGyldigeSluttDato,
  getSkalBekrefteVarighet,
  getSoftMaxVarighetBekreftelseText,
  useSluttdatoInput
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

export const AvsluttDeltakelseModal = ({
  pamelding,
  forslag,
  open,
  onClose,
  onSuccess
}: AvsluttDeltakelseModalProps) => {
  const defaultSluttdato = getSluttdato(pamelding, forslag)
  const [harDeltatt, setHarDeltatt] = useState<boolean | null>(null)
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const aarsak = useAarsak(forslag)
  const begrunnelse = useBegrunnelse(true)

  const sluttdato = useSluttdatoInput({
    deltaker: pamelding,
    defaultDato: defaultSluttdato,
    startdato: useMemo(
      () => getDateFromString(pamelding.startdato),
      [pamelding.startdato]
    )
  })

  const datePickerRef = useRef<HTMLInputElement>(null)
  const { enhetId } = useAppContext()

  // VI viser dette valget i 15 dager etter startdato. ellers så vil vi alltid sette sluttdato
  const skalViseHarDeltatt = showHarDeltatt(pamelding)
  const skalViseSluttDato = !skalViseHarDeltatt || harDeltatt
  const skalBekrefteVarighet =
    skalViseSluttDato && getSkalBekrefteVarighet(pamelding, sluttdato.sluttdato)

  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: dateStrToNullableDate(pamelding.startdato) || undefined,
    toDate: getSisteGyldigeSluttDato(pamelding) || undefined,
    defaultSelected: defaultSluttdato,
    onValidate: (dateValidation) => {
      sluttdato.validate(
        dateValidation,
        getDateFromNorwegianStringFormat(datePickerRef?.current?.value)
      )
    },
    onDateChange: sluttdato.onChange
  })

  const validertRequest = () => {
    let hasError = false
    if (skalViseSluttDato && !sluttdato.sluttdato) {
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
          skalViseSluttDato && sluttdato.sluttdato
            ? formatDateToDateInputStr(sluttdato.sluttdato)
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
              error={sluttdato.error}
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

function isAvsluttDeltakelseForslag(
  endring: ForslagEndring
): endring is AvsluttDeltakelseForslag {
  return endring.type === ForslagEndringType.AvsluttDeltakelse
}

function getSluttdato(
  deltaker: PameldingResponse,
  forslag: AktivtForslag | null
) {
  if (forslag === null) {
    return getDateFromString(deltaker.sluttdato)
  }
  if (isAvsluttDeltakelseForslag(forslag.endring)) {
    return getDateFromString(forslag.endring.sluttdato)
  } else {
    throw new Error(
      `Kan ikke behandle forslag av type ${forslag.endring.type} som sluttdato`
    )
  }
}
