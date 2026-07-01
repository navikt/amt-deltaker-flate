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
  getDeltakerStatusDisplayText,
  useBegrunnelse
} from 'deltaker-flate-common'
import { useMemo, useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseStartdato } from '../../../api/api.ts'
import { DeltakerResponse } from '../../../api/data/deltaker.ts'
import { getFeilmeldingIngenEndring } from '../../../utils/displayText.ts'
import {
  kanEndreOppstartsdato,
  validerDeltakerKanEndres
} from '../../../utils/endreDeltakelse.ts'
import { useSluttdato } from '../../../utils/use-sluttdato.ts'
import { formatDateToDtoStr, formatDateToString } from '../../../utils/utils.ts'
import {
  DATO_UTENFOR_TILTAKGJENNOMFORING,
  LEGG_TIL_STARTDATO_BEKREFTELSE_FEILMELDING,
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
  deltaker: DeltakerResponse
  open: boolean
  forslag: Forslag | null
  onClose: () => void
  onSuccess: (oppdatertDeltaker: DeltakerResponse | null) => void
}

export const EndreOppstartsdatoModal = ({
  deltaker,
  open,
  forslag,
  onClose,
  onSuccess
}: EndreOppstartsdatoModalProps) => {
  const { enhetId } = useAppContext()
  const defaultDatoer = getDatoer(deltaker, forslag)

  const [valgtVarighet, setValgtVarighet] = useState<VarighetValg | undefined>(
    finnValgtVarighetForTiltakskode(
      defaultDatoer.startdato,
      defaultDatoer.sluttdato,
      deltaker.deltakerliste.tiltakskode
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

  const tiltakskode = deltaker.deltakerliste.tiltakskode

  const skalVelgeVarighet =
    tiltakskode !== Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET &&
    tiltakskode !== Tiltakskode.TILRETTELAGT_ARBEID_ORDINAER

  const [startdato, setStartdato] = useState<Date | undefined>(
    defaultDatoer.startdato
  )

  const maxSluttdato = useMemo(() => {
    return getSisteGyldigeSluttDato(deltaker, startdato)
  }, [deltaker, startdato])

  const sluttdato = useSluttdato({
    deltaker: deltaker,
    valgtVarighet: valgtVarighet,
    defaultAnnetDato: defaultDatoer.sluttdato,
    startdato: startdato
  })

  const erLeggTilOppstartsdato = deltaker.startdato === null

  const skalHaBegrunnelse =
    (!forslag ||
      defaultDatoer.startdato?.getTime() !== startdato?.getTime() ||
      defaultDatoer.sluttdato?.getTime() !== sluttdato.sluttdato?.getTime()) &&
    !erLeggTilOppstartsdato

  const begrunnelse = useBegrunnelse(!skalHaBegrunnelse)

  const skalBekrefteVarighet =
    startdato &&
    getSkalBekrefteVarighet(deltaker, sluttdato.sluttdato, startdato)

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
      (dayjs(newDate).isBefore(deltaker.deltakerliste.startdato, 'date') ||
        dayjs(newDate).isAfter(deltaker.deltakerliste.sluttdato, 'date'))
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
        LEGG_TIL_STARTDATO_BEKREFTELSE_FEILMELDING
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
        dayjs(startdato).isSame(deltaker.startdato, 'day') &&
        dayjs(sluttdato.sluttdato).isSame(deltaker.sluttdato, 'day')
      ) {
        throw new Error(getFeilmeldingIngenEndring(forslag !== null))
      }
      validerDeltakerKanEndres(deltaker)
      if (!kanEndreOppstartsdato(deltaker)) {
        throw new Error(
          `Kan ikke endre oppstartsdato for deltaker med status ${getDeltakerStatusDisplayText(deltaker.status.type)}.`
        )
      }

      return {
        deltakerId: deltaker.deltakerId,
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
      deltaker={deltaker}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseStartdato}
      validertRequest={validertRequest}
      forslag={forslag}
    >
      <SimpleDatePicker
        label="Ny oppstartsdato"
        error={errorStartdato}
        fromDate={deltaker.deltakerliste.startdato || undefined}
        toDate={deltaker.deltakerliste.sluttdato || undefined}
        defaultMonth={dayjs().toDate()}
        defaultDate={defaultDatoer.startdato}
        onValidate={validateStartdato}
        onChange={(date) => setStartdato(date)}
        disabled={!deltaker.erUnderOppfolging}
      />
      {skalVelgeVarighet && (
        <>
          <VarighetField
            title="Hva er forventet varighet?"
            className="mt-6"
            tiltakskode={deltaker.deltakerliste.tiltakskode}
            startDato={startdato}
            sluttdato={maxSluttdato}
            errorVarighet={sluttdato.varighetError}
            errorSluttDato={sluttdato.annetError}
            defaultVarighet={valgtVarighet}
            defaultAnnetDato={defaultDatoer.sluttdato}
            onChangeVarighet={onChangeVarighet}
            onChangeSluttDato={sluttdato.handleChange}
            onValidateSluttDato={sluttdato.validerDato}
            disabled={!deltaker.erUnderOppfolging}
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
          disabled={!deltaker.erUnderOppfolging}
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

function getDatoer(deltaker: DeltakerResponse, forslag: Forslag | null) {
  if (forslag === null) {
    return {
      startdato: deltaker.startdato ?? undefined,
      sluttdato: deltaker.sluttdato ?? undefined
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
