import { BodyShort, ConfirmationPanel } from '@navikt/ds-react'
import { EndreDeltakelseType, getDateFromString } from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseForleng } from '../../../api/api.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import {
  dateStrToNullableDate,
  formatDateToDateInputStr,
  formatDateToString
} from '../../../utils/utils.ts'
import {
  getSisteGyldigeSluttDato,
  getSkalBekrefteVarighet,
  getSluttDatoFeilmelding,
  getSoftMaxVarighetBekreftelseText,
  getVarighet,
  kalkulerSluttdato,
  UGYLDIG_DATO_FEILMELDING,
  VARIGHET_BEKREFTELSE_FEILMELDING,
  VarighetValg
} from '../../../utils/varighet.tsx'
import { VarighetField } from '../VarighetField.tsx'
import { AktivtForslag, ForslagEndringType } from 'deltaker-flate-common'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { BegrunnelseInput, useBegrunnelse } from '../modal/BegrunnelseInput.tsx'

interface ForlengDeltakelseModalProps {
  pamelding: PameldingResponse
  forslag: AktivtForslag | null
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

const getSluttdatoFraForslag = (forslag: AktivtForslag | null) => {
  if (
    forslag &&
    forslag.endring.type === ForslagEndringType.ForlengDeltakelse
  ) {
    return forslag.endring.sluttdato
  } else {
    return null
  }
}

export const ForlengDeltakelseModal = ({
  pamelding,
  forslag,
  open,
  onClose,
  onSuccess
}: ForlengDeltakelseModalProps) => {
  const sluttdatoFraForslag = getSluttdatoFraForslag(forslag)
  const validDeltakerSluttDato = sluttdatoFraForslag
    ? getDateFromString(sluttdatoFraForslag)
    : getDateFromString(pamelding.sluttdato)

  const [valgtVarighet, setValgtVarighet] = useState<VarighetValg | null>(
    forslag ? VarighetValg.ANNET : null
  )
  const [nySluttDato, settNySluttDato] = useState<Date | undefined>(
    validDeltakerSluttDato
  )
  const [sluttDatoField, setSluttDatoField] = useState<Date | undefined>(
    validDeltakerSluttDato
  )
  const [errorVarighet, setErrorVarighet] = useState<string | null>(null)
  const [errorSluttDato, setErrorSluttDato] = useState<string | null>(null)
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const skalHaBegrunnelse =
    !sluttdatoFraForslag ||
    getDateFromString(sluttdatoFraForslag)?.getDate() !== nySluttDato?.getDate()

  const begrunnelse = useBegrunnelse(!skalHaBegrunnelse)

  const sluttdatoDeltaker = dateStrToNullableDate(pamelding.sluttdato)
  const tiltakstype = pamelding.deltakerliste.tiltakstype
  const { enhetId } = useAppContext()

  const skalBekrefteVarighet =
    nySluttDato && getSkalBekrefteVarighet(pamelding, nySluttDato)

  const validertRequest = () => {
    let hasError = false
    if (!valgtVarighet) {
      setErrorVarighet('Du må velge varighet')
      hasError = true
    }
    if (!nySluttDato && !errorSluttDato) {
      setErrorSluttDato('Du må velge en sluttdato')
      hasError = true
    }
    if (skalBekrefteVarighet && !varighetBekreftelse) {
      setErrorVarighetConfirmation(VARIGHET_BEKREFTELSE_FEILMELDING)
      hasError = true
    }

    if (valgtVarighet === VarighetValg.ANNET && errorSluttDato) {
      hasError = true
    } else if (valgtVarighet !== VarighetValg.ANNET && errorVarighet) {
      hasError = true
    }

    if (!begrunnelse.valider()) {
      hasError = true
    }

    if (!hasError && nySluttDato) {
      return {
        deltakerId: pamelding.deltakerId,
        enhetId,
        body: {
          sluttdato: formatDateToDateInputStr(nySluttDato),
          begrunnelse: begrunnelse.begrunnelse || null,
          forslagId: forslag ? forslag.id : null
        }
      }
    }
    return null
  }

  const handleChangeVarighet = (valg: VarighetValg) => {
    setValgtVarighet(valg)
    const varighet = getVarighet(valg)

    if (valg === VarighetValg.ANNET) {
      settNySluttDato(sluttDatoField)
      setErrorVarighet(null)
    } else if (sluttdatoDeltaker) {
      const nySluttDato = kalkulerSluttdato(sluttdatoDeltaker, varighet)
      settNySluttDato(nySluttDato)
      setErrorVarighet(getSluttDatoFeilmelding(pamelding, nySluttDato))
    } else {
      settNySluttDato(undefined)
      setErrorVarighet(null)
    }
  }

  return (
    <Endringsmodal
      open={open}
      endringstype={EndreDeltakelseType.FORLENG_DELTAKELSE}
      digitalBruker={pamelding.digitalBruker}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseForleng}
      validertRequest={validertRequest}
      forslag={forslag}
    >
      <VarighetField
        title="Hvor lenge skal deltakelsen forlenges?"
        tiltakstype={pamelding.deltakerliste.tiltakstype}
        startDato={sluttdatoDeltaker || undefined}
        sluttdato={getSisteGyldigeSluttDato(pamelding) || undefined}
        errorVarighet={errorVarighet}
        errorSluttDato={errorSluttDato}
        defaultVarighet={forslag ? VarighetValg.ANNET : null}
        defaultSelectedDate={nySluttDato}
        onChangeVarighet={handleChangeVarighet}
        onChangeSluttDato={(date) => {
          settNySluttDato(date)
          if (date) {
            setSluttDatoField(date)
            setErrorSluttDato(null)
          }
        }}
        onValidateSluttDato={(dateValidation, currentValue) => {
          if (dateValidation.isAfter && currentValue) {
            setSluttDatoField(currentValue)
            setErrorSluttDato(getSluttDatoFeilmelding(pamelding, currentValue))
          } else if (dateValidation.isBefore && currentValue) {
            setSluttDatoField(currentValue)
            setErrorSluttDato(
              'Datoen kan ikke velges fordi den er før nåværende sluttdato.'
            )
          } else if (dateValidation.isInvalid) {
            setSluttDatoField(currentValue)
            setErrorSluttDato(UGYLDIG_DATO_FEILMELDING)
          }
        }}
      />
      {nySluttDato && (
        <BodyShort className="mt-2" size="small">
          Ny sluttdato: {formatDateToString(nySluttDato)}
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
    </Endringsmodal>
  )
}
