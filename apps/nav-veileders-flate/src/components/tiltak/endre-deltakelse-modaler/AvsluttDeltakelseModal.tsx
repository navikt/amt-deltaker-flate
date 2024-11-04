import { ConfirmationPanel, Radio, RadioGroup } from '@navikt/ds-react'
import {
  AvsluttDeltakelseForslag,
  DeltakerStatusType,
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
  formatDateToDtoStr
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
import dayjs from 'dayjs'
import { deltakerHarSluttetEllerFullfort } from '../../../utils/statusutils.ts'

interface AvsluttDeltakelseModalProps {
  pamelding: PameldingResponse
  forslag: Forslag | null
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const AvsluttDeltakelseModal = ({
  pamelding,
  forslag,
  open,
  onClose,
  onSuccess
}: AvsluttDeltakelseModalProps) => {
  const defaultSluttdato = getSluttdato(pamelding, forslag)
  const [harDeltatt, setHarDeltatt] = useState<boolean | null>(
    getHarDeltatt(forslag)
  )
  const [harDeltattError, setHarDeltattError] = useState<string | undefined>()
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const aarsak = useAarsak(forslag)
  const begrunnelse = useBegrunnelse(true)
  const sluttdato = useSluttdatoInput({
    deltaker: pamelding,
    defaultDato: defaultSluttdato ?? undefined,
    startdato: useMemo(
      () => getDateFromString(pamelding.startdato),
      [pamelding.startdato]
    )
  })
  const { enhetId } = useAppContext()

  // VI viser dette valget i 15 dager etter startdato. ellers så vil vi alltid sette sluttdato
  const skalViseHarDeltatt = showHarDeltatt(pamelding, forslag)
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
    if (skalViseHarDeltatt && harDeltatt === null) {
      hasError = true
      setHarDeltattError('Du må svare før du kan fortsette.')
    }

    if (!hasError && aarsak.aarsak !== undefined) {
      const nyArsakBeskrivelse = aarsak.beskrivelse ?? null
      const endring: AvsluttDeltakelseRequest = {
        aarsak: {
          type: aarsak.aarsak,
          beskrivelse: nyArsakBeskrivelse
        },
        sluttdato:
          skalViseSluttDato && sluttdato.sluttdato
            ? formatDateToDtoStr(sluttdato.sluttdato)
            : null,
        harDeltatt: harDeltatt,
        begrunnelse: begrunnelse.begrunnelse || null,
        forslagId: forslag ? forslag.id : null
      }

      const harLikArsak = deltakerHarSluttetEllerFullfort(pamelding.status.type)
        ? pamelding.status.aarsak?.type === aarsak.aarsak &&
          pamelding.status.aarsak?.beskrivelse === nyArsakBeskrivelse
        : false

      const harEndring =
        !harLikArsak ||
        pamelding.status.type !== DeltakerStatusType.HAR_SLUTTET ||
        !(skalViseSluttDato
          ? dayjs(sluttdato.sluttdato).isSame(pamelding.sluttdato, 'day')
          : false)

      return {
        deltakerId: pamelding.deltakerId,
        enhetId: enhetId,
        body: endring,
        harEndring: harEndring
      }
    }
    return null
  }

  return (
    <Endringsmodal
      open={open}
      endringstype={EndreDeltakelseType.AVSLUTT_DELTAKELSE}
      digitalBruker={pamelding.digitalBruker}
      harAdresse={pamelding.harAdresse}
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
            error={harDeltattError}
            defaultValue={
              getHarDeltatt(forslag) === null
                ? undefined
                : getHarDeltatt(forslag)
                  ? HarDeltattValg.JA
                  : HarDeltattValg.NEI
            }
            onChange={(value: HarDeltattValg) => {
              if (value === HarDeltattValg.NEI) {
                setHarDeltatt(false)
              } else {
                setHarDeltatt(true)
              }
              setHarDeltattError(undefined)
            }}
          >
            <Radio value={HarDeltattValg.JA}>Ja</Radio>
            <Radio value={HarDeltattValg.NEI}>Nei</Radio>
          </RadioGroup>
        </section>
      )}
      {skalViseSluttDato && (
        <section className="mt-6">
          <SimpleDatePicker
            label="Hva er ny sluttdato?"
            error={sluttdato.error}
            fromDate={dateStrToNullableDate(pamelding.startdato) || undefined}
            toDate={getSisteGyldigeSluttDato(pamelding) || undefined}
            defaultDate={defaultSluttdato ?? undefined}
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

const showHarDeltatt = (
  pamelding: PameldingResponse,
  forslag: Forslag | null
) => {
  if (getHarDeltatt(forslag) !== null) {
    return true
  }

  const statusdato = pamelding.status.gyldigFra
  const femtenDagerSiden = dayjs().subtract(15, 'days')
  return dayjs(statusdato).isAfter(femtenDagerSiden)
}

function getHarDeltatt(forslag: Forslag | null): boolean | null {
  if (forslag && isAvsluttDeltakelseForslag(forslag.endring)) {
    return forslag.endring.harDeltatt
  }
  return null
}
