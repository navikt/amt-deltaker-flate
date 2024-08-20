import { ConfirmationPanel, Radio, RadioGroup } from '@navikt/ds-react'
import {
  AvsluttDeltakelseForslag,
  EndreDeltakelseType,
  Forslag,
  ForslagEndring,
  ForslagEndringType,
  getDateFromString
} from 'deltaker-flate-common'
import { useMemo, useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { avsluttDeltakelse } from '../../../api/api.ts'
import { AvsluttDeltakelseRequest } from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { useSluttdatoInput } from '../../../utils/use-sluttdato.ts'
import {
  HarDeltattValg,
  dateStrToNullableDate,
  formatDateToDateInputStr
} from '../../../utils/utils.ts'
import {
  VARIGHET_BEKREFTELSE_FEILMELDING,
  getSisteGyldigeSluttDato,
  getSkalBekrefteVarighet,
  getSoftMaxVarighetBekreftelseText
} from '../../../utils/varighet.tsx'
import { SimpleDatePicker } from '../SimpleDatePicker.tsx'
import { AarsakRadioGroup, useAarsak } from '../modal/AarsakRadioGroup.tsx'
import { BegrunnelseInput, useBegrunnelse } from '../modal/BegrunnelseInput.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'

interface AvsluttDeltakelseModalProps {
  pamelding: PameldingResponse
  forslag: Forslag | null
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

const showHarDeltatt = (pamelding: PameldingResponse) => {
  const statusdato = pamelding.status.gyldigFra
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
  const { enhetId } = useAppContext()

  // VI viser dette valget i 15 dager etter startdato. ellers så vil vi alltid sette sluttdato
  const skalViseHarDeltatt = showHarDeltatt(pamelding)
  const skalViseSluttDato = !skalViseHarDeltatt || harDeltatt
  const skalBekrefteVarighet =
    skalViseSluttDato && getSkalBekrefteVarighet(pamelding, sluttdato.sluttdato)

  const validertRequest = () => {
    let hasError = false

    if (sluttdato.error || !aarsak.valider() || !begrunnelse.valider()) {
      hasError = true
    }
    if (skalViseSluttDato && !sluttdato.sluttdato) {
      hasError = true
    }
    if (skalBekrefteVarighet && !varighetBekreftelse) {
      setErrorVarighetConfirmation(VARIGHET_BEKREFTELSE_FEILMELDING)
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
          <SimpleDatePicker
            label="Hva er ny sluttdato?"
            error={sluttdato.error}
            fromDate={dateStrToNullableDate(pamelding.startdato) || undefined}
            toDate={getSisteGyldigeSluttDato(pamelding) || undefined}
            defaultDate={defaultSluttdato}
            onValidate={sluttdato.validate}
            onChange={sluttdato.onChange}
          />
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

function getSluttdato(deltaker: PameldingResponse, forslag: Forslag | null) {
  if (forslag === null) {
    return getDateFromString(deltaker.sluttdato)
  }
  if (isAvsluttDeltakelseForslag(forslag.endring)) {
    return forslag.endring.sluttdato
  } else {
    throw new Error(
      `Kan ikke behandle forslag av type ${forslag.endring.type} som sluttdato`
    )
  }
}
