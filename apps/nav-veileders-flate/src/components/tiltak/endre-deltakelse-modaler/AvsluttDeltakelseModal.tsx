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
import { getFeilmeldingIngenEndring } from '../../../utils/displayText.ts'
import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'

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

      validerDeltakerKanEndres(pamelding)
      if (
        !(
          pamelding.status.type === DeltakerStatusType.DELTAR ||
          pamelding.status.type === DeltakerStatusType.HAR_SLUTTET
        )
      ) {
        throw new Error(
          'Kan ikke avslutte deltakelse for deltaker som ikke har status DELTAR eller HAR_SLUTTET'
        )
      }

      if (
        !skalViseSluttDato &&
        pamelding.status.type !== DeltakerStatusType.DELTAR
      ) {
        throw new Error('Deltaker som ikke har status DELTAR må ha deltatt.')
      }

      const femtenDagerSiden = dayjs().subtract(15, 'days')
      if (
        !skalViseSluttDato &&
        dayjs(pamelding.status.gyldigFra).isSameOrBefore(femtenDagerSiden)
      ) {
        throw new Error(
          'Deltaker med deltar-status mer enn 15 dager tilbake i tid må ha deltatt.'
        )
      }

      const deltakerErEndret =
        pamelding.status.type !== DeltakerStatusType.HAR_SLUTTET ||
        !dayjs(sluttdato.sluttdato).isSame(pamelding.sluttdato, 'day') ||
        pamelding.status.aarsak?.type !== aarsak.aarsak ||
        pamelding.status.aarsak?.beskrivelse !== nyArsakBeskrivelse
      if (!deltakerErEndret) {
        throw new Error(getFeilmeldingIngenEndring(forslag !== null))
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
      harAdresse={pamelding.harAdresse}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={avsluttDeltakelse}
      validertRequest={validertRequest}
      forslag={forslag}
      erUnderOppfolging={pamelding.erUnderOppfolging}
    >
      <AarsakRadioGroup
        legend="Hva er årsaken til avslutning?"
        aarsak={aarsak.aarsak}
        aarsakError={aarsak.aarsakError}
        beskrivelse={aarsak.beskrivelse}
        beskrivelseError={aarsak.beskrivelseError}
        onChange={aarsak.handleChange}
        onBeskrivelse={aarsak.handleBeskrivelse}
        disabled={!pamelding.erUnderOppfolging}
      />
      {skalViseHarDeltatt && (
        <section className="mt-4">
          <RadioGroup
            legend="Har personen deltatt på tiltaket?"
            size="small"
            description="Dersom personen ikke har deltatt på tiltaket, vil statusen på tiltaket endres til “Ikke aktuell”."
            error={harDeltattError}
            disabled={!pamelding.erUnderOppfolging}
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
            disabled={!pamelding.erUnderOppfolging}
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
        disabled={!pamelding.erUnderOppfolging}
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
  return dayjs(statusdato).isAfter(femtenDagerSiden, 'day')
}

function getHarDeltatt(forslag: Forslag | null): boolean | null {
  if (forslag && isAvsluttDeltakelseForslag(forslag.endring)) {
    return forslag.endring.harDeltatt
  }
  return null
}
