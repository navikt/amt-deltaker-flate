import {
  BodyLong,
  BodyShort,
  ConfirmationPanel,
  DateValidationT
} from '@navikt/ds-react'
import dayjs from 'dayjs'
import {
  BegrunnelseInput,
  EndreDeltakelseType,
  Forslag,
  ForslagEndring,
  ForslagEndringType,
  StartdatoForslag,
  Tiltakskode,
  getDateFromString,
  getDeltakerStatusDisplayText,
  useBegrunnelse
} from 'deltaker-flate-common'
import { useMemo, useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseStartdato } from '../../../api/api.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { getFeilmeldingIngenEndring } from '../../../utils/displayText.ts'
import {
  kanEndreOppstartsdato,
  validerDeltakerKanEndres
} from '../../../utils/endreDeltakelse.ts'
import { useSluttdato } from '../../../utils/use-sluttdato.ts'
import { formatDateToDtoStr, formatDateToString } from '../../../utils/utils.ts'
import {
  DATO_UTENFOR_TILTAKGJENNOMFORING,
  Legg_TIL_STARTDATO_BEKREFTELSE_FEILMELDING,
  UGYLDIG_DATO_FEILMELDING,
  VARIGHET_BEKREFTELSE_FEILMELDING,
  VarighetValg,
  finnValgtVarighetForTiltakskode,
  getSisteGyldigeSluttDato,
  getSkalBekrefteVarighet,
  getSoftMaxVarighetBekreftelseText
} from '../../../utils/varighet.tsx'
import { SimpleDatePicker } from '../SimpleDatePicker.tsx'
import { VarighetField } from '../VarighetField.tsx'
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
    finnValgtVarighetForTiltakskode(
      defaultDatoer.startdato,
      defaultDatoer.sluttdato,
      pamelding.deltakerliste.tiltakskode
    )
  )
  const [leggTilStartDatoBekreftelse, setLeggTilStartDatoBekreftelse] =
    useState(false)
  const [
    errorLeggTilStartDatoBekreftelse,
    setErrorLeggTilStartDatoBekreftelse
  ] = useState<string | null>(null)
  const [errorStartdato, setErrorStartDato] = useState<string | null>(null)
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const tiltakskode = pamelding.deltakerliste.tiltakskode

  const skalVelgeVarighet =
    tiltakskode !== Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET

  const [startdato, setStartdato] = useState<Date | undefined>(
    defaultDatoer.startdato
  )

  const maxSluttdato = useMemo(() => {
    return getSisteGyldigeSluttDato(pamelding, startdato)
  }, [pamelding, startdato])

  const sluttdato = useSluttdato({
    deltaker: pamelding,
    valgtVarighet: valgtVarighet,
    defaultAnnetDato: defaultDatoer.sluttdato,
    startdato: startdato
  })

  const erLeggTilOppstartsdato = pamelding.startdato === null

  const skalHaBegrunnelse =
    (!forslag ||
      defaultDatoer.startdato?.getTime() !== startdato?.getTime() ||
      defaultDatoer.sluttdato?.getTime() !== sluttdato.sluttdato?.getTime()) &&
    !erLeggTilOppstartsdato

  const begrunnelse = useBegrunnelse(!skalHaBegrunnelse)

  const skalBekrefteVarighet =
    startdato &&
    getSkalBekrefteVarighet(pamelding, sluttdato.sluttdato, startdato)

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

    if (erLeggTilOppstartsdato && !leggTilStartDatoBekreftelse) {
      setErrorLeggTilStartDatoBekreftelse(
        Legg_TIL_STARTDATO_BEKREFTELSE_FEILMELDING
      )
      hasError = true
    }

    if (skalVelgeVarighet && !sluttdato.valider()) {
      hasError = true
    }

    if (!begrunnelse.valider()) {
      hasError = true
    }

    if (!hasError && !errorStartdato && startdato) {
      if (
        dayjs(startdato).isSame(pamelding.startdato, 'day') &&
        dayjs(sluttdato.sluttdato).isSame(pamelding.sluttdato, 'day')
      ) {
        throw new Error(getFeilmeldingIngenEndring(forslag !== null))
      }
      validerDeltakerKanEndres(pamelding)
      if (!kanEndreOppstartsdato(pamelding)) {
        throw new Error(
          `Kan ikke endre oppstartsdato for deltaker med status ${getDeltakerStatusDisplayText(pamelding.status.type)}.`
        )
      }

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
      deltaker={pamelding}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseStartdato}
      validertRequest={validertRequest}
      forslag={forslag}
    >
      <SimpleDatePicker
        label="Ny oppstartsdato"
        error={errorStartdato}
        fromDate={pamelding.deltakerliste.startdato || undefined}
        toDate={pamelding.deltakerliste.sluttdato || undefined}
        defaultMonth={dayjs().toDate()}
        defaultDate={defaultDatoer.startdato}
        onValidate={validateStartdato}
        onChange={(date) => setStartdato(date)}
        disabled={!pamelding.erUnderOppfolging}
      />
      {skalVelgeVarighet && (
        <>
          <VarighetField
            title="Hva er forventet varighet?"
            className="mt-6"
            tiltakskode={pamelding.deltakerliste.tiltakskode}
            startDato={startdato}
            sluttdato={maxSluttdato}
            errorVarighet={sluttdato.error}
            errorSluttDato={null}
            defaultVarighet={valgtVarighet}
            defaultAnnetDato={defaultDatoer.sluttdato}
            onChangeVarighet={onChangeVarighet}
            onChangeSluttDato={sluttdato.handleChange}
            onValidateSluttDato={sluttdato.validerDato}
            disabled={!pamelding.erUnderOppfolging}
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
              {getSoftMaxVarighetBekreftelseText(tiltakskode)}
            </ConfirmationPanel>
          )}
        </>
      )}
      {erLeggTilOppstartsdato && (
        <ConfirmationPanel
          className="mt-6"
          checked={leggTilStartDatoBekreftelse}
          label="Ja, oppstartsdato er avtalt med arrangøren."
          onChange={() => {
            setLeggTilStartDatoBekreftelse((x) => !x)
            setErrorLeggTilStartDatoBekreftelse(null)
          }}
          size="small"
          error={errorLeggTilStartDatoBekreftelse}
        >
          <BodyLong>
            Startdato må være avtalt med arrangøren og deltakeren<br></br>
            <br></br>
            Som hovedregel er det arrangøren som legger til oppstartsdato i
            Deltakeroversikten. Før du endrer så må du ha avklart med arrangøren
            at deltaker skal starte på denne datoen. <br></br>
            <br></br>
            Er oppstartsdato avtalt med arrangøren?
          </BodyLong>
        </ConfirmationPanel>
      )}
      {!erLeggTilOppstartsdato && (
        <BegrunnelseInput
          type={skalHaBegrunnelse ? 'obligatorisk' : 'valgfri'}
          onChange={begrunnelse.handleChange}
          error={begrunnelse.error}
          disabled={!pamelding.erUnderOppfolging}
        />
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
