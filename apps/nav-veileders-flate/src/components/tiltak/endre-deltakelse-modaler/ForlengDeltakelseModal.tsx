import {
  BodyShort,
  ConfirmationPanel,
  Detail,
  Modal,
  Textarea
} from '@navikt/ds-react'
import {
  DeferredFetchState,
  EndreDeltakelseType,
  getDateFromString,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { avvisForslag, endreDeltakelseForleng } from '../../../api/api.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { ErrorPage } from '../../../pages/ErrorPage.tsx'
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
import { ModalFooter } from '../../ModalFooter.tsx'
import { EndringTypeIkon } from 'deltaker-flate-common'
import { VarighetField } from '../VarighetField.tsx'
import { getEndrePameldingTekst } from '../../../utils/displayText.ts'
import { BEGRUNNELSE_MAKS_TEGN } from '../../../model/PameldingFormValues.ts'
import { AktivtForslag, ForslagEndringType } from 'deltaker-flate-common'
import { ModalForslagDetaljer } from '../forslag/ModalForslagDetaljer.tsx'

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
  const [begrunnelse, setBegrunnelse] = useState<string | null>()
  const [errorVarighet, setErrorVarighet] = useState<string | null>(null)
  const [errorSluttDato, setErrorSluttDato] = useState<string | null>(null)
  const [errorBegrunnelse, setErrorBegrunnelse] = useState<string | null>(null)
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const sluttdatoDeltaker = dateStrToNullableDate(pamelding.sluttdato)
  const tiltakstype = pamelding.deltakerliste.tiltakstype
  const { enhetId } = useAppContext()
  const skalHaBegrunnelse =
    !sluttdatoFraForslag ||
    getDateFromString(sluttdatoFraForslag)?.getDate() !== nySluttDato?.getDate()
  const harForLangBegrunnelse =
    begrunnelse && begrunnelse.length > BEGRUNNELSE_MAKS_TEGN

  const skalBekrefteVarighet =
    nySluttDato && getSkalBekrefteVarighet(pamelding, nySluttDato)

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchEndreDeltakelseForleng
  } = useDeferredFetch(endreDeltakelseForleng)

  const { doFetch: doFetchAvvisForslag } = useDeferredFetch(avvisForslag)

  const sendEndring = () => {
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

    if (skalHaBegrunnelse && !begrunnelse) {
      setErrorBegrunnelse('Du må begrunne forlengelsen')
      hasError = true
    }

    if (harForLangBegrunnelse) {
      setErrorBegrunnelse(
        `Begrunnelsen kan ikke være mer enn ${BEGRUNNELSE_MAKS_TEGN} tegn`
      )
      hasError = true
    }

    if (!hasError && nySluttDato && (begrunnelse || !skalHaBegrunnelse)) {
      doFetchEndreDeltakelseForleng(pamelding.deltakerId, enhetId, {
        sluttdato: formatDateToDateInputStr(nySluttDato),
        begrunnelse: begrunnelse || null,
        forslagId: forslag ? forslag.id : null
      }).then((data) => {
        onSuccess(data)
      })
    }
  }

  const sendAvvisForslag = () => {
    let hasError = false
    if (!begrunnelse) {
      setErrorBegrunnelse('Du må begrunne avvisningen')
      hasError = true
    }
    if (harForLangBegrunnelse) {
      setErrorBegrunnelse(
        `Begrunnelsen kan ikke være mer enn ${BEGRUNNELSE_MAKS_TEGN} tegn`
      )
      hasError = true
    }

    if (!hasError && forslag && begrunnelse) {
      doFetchAvvisForslag(forslag.id, enhetId, {
        begrunnelse: begrunnelse
      }).then((data) => {
        onSuccess(data)
      })
    }
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
    <Modal
      open={open}
      header={{
        icon: <EndringTypeIkon type={EndreDeltakelseType.FORLENG_DELTAKELSE} />,
        heading: 'Forleng deltakelse'
      }}
      onClose={onClose}
    >
      <Modal.Body>
        {endreDeltakelseState === DeferredFetchState.ERROR && (
          <ErrorPage message={endreDeltakelseError} />
        )}
        <Detail size="small">
          {getEndrePameldingTekst(pamelding.digitalBruker)}
        </Detail>

        {forslag && sluttdatoFraForslag && (
          <ModalForslagDetaljer forslag={forslag} />
        )}

        <VarighetField
          title="Hvor lenge skal deltakelsen forlenges?"
          className="mt-4"
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
              setErrorBegrunnelse(null)
            }
          }}
          onValidateSluttDato={(dateValidation, currentValue) => {
            if (dateValidation.isAfter && currentValue) {
              setSluttDatoField(currentValue)
              setErrorSluttDato(
                getSluttDatoFeilmelding(pamelding, currentValue)
              )
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
        <Textarea
          onChange={(e) => {
            setBegrunnelse(e.target.value)
            setErrorBegrunnelse(null)
          }}
          error={errorBegrunnelse}
          className="mt-6"
          label="Begrunnelse for forlengelsen"
          description="Beskriv kort hvorfor endringen er riktig for personen."
          value={begrunnelse ?? ''}
          maxLength={BEGRUNNELSE_MAKS_TEGN}
          id="begrunnelse"
          size="small"
          aria-label={'Begrunnelse'}
        />
      </Modal.Body>
      {!forslag && (
        <ModalFooter
          confirmButtonText="Lagre"
          onConfirm={sendEndring}
          confirmLoading={endreDeltakelseState === DeferredFetchState.LOADING}
          disabled={endreDeltakelseState === DeferredFetchState.LOADING}
        />
      )}
      {forslag && (
        <ModalFooter
          confirmButtonText="Lagre"
          onConfirm={sendEndring}
          cancelButtonText="Avvis forslag"
          onCancel={sendAvvisForslag}
          confirmLoading={endreDeltakelseState === DeferredFetchState.LOADING}
          disabled={endreDeltakelseState === DeferredFetchState.LOADING}
        />
      )}
    </Modal>
  )
}
