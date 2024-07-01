import {
  BodyShort,
  ConfirmationPanel,
  Detail,
  Modal,
  Textarea
} from '@navikt/ds-react'
import {
  DeferredFetchState,
  getDateFromString,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseForleng } from '../../../api/api.ts'
import { EndreDeltakelseType } from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { ErrorPage } from '../../../pages/ErrorPage.tsx'
import {
  dateStrToNullableDate,
  formatDateToDateInputStr,
  formatDateToString
} from '../../../utils/utils.ts'
import {
  UGYLDIG_DATO_FEILMELDING,
  VARIGHET_BEKREFTELSE_FEILMELDING,
  VarighetValg,
  getSisteGyldigeSluttDato,
  getSkalBekrefteVarighet,
  getSluttDatoFeilmelding,
  getSoftMaxVarighetBekreftelseText,
  getVarighet,
  kalkulerSluttdato
} from '../../../utils/varighet.tsx'
import { ModalFooter } from '../../ModalFooter.tsx'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import { VarighetField } from '../VarighetField.tsx'
import { getEndrePameldingTekst } from '../../../utils/displayText.ts'
import { BEGRUNNELSE_MAKS_TEGN } from '../../../model/PameldingFormValues.ts'

interface ForlengDeltakelseModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const ForlengDeltakelseModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: ForlengDeltakelseModalProps) => {
  const validDeltakerSluttDato = getDateFromString(pamelding.sluttdato)

  const [valgtVarighet, setValgtVarighet] = useState<VarighetValg | null>(null)
  const [nySluttDato, settNySluttDato] = useState<Date | undefined>(
    validDeltakerSluttDato
  )
  const [sluttDatoField, setSluttDatoField] = useState<Date | undefined>(
    validDeltakerSluttDato
  )
  const [begrunnelse, setBegrunnelse] = useState<string | null>()
  const [errorVarighet, setErrorVarighet] = useState<string | null>(null)
  const [errorSluttDato, setErrorSluttDato] = useState<string | null>(null)
  const [errorBegrunnelse, setErrorBegrunnelse] = useState<boolean>(false)
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const sluttdatoDeltaker = dateStrToNullableDate(pamelding.sluttdato)
  const tiltakstype = pamelding.deltakerliste.tiltakstype
  const { enhetId } = useAppContext()
  const harForLangBegrunnelse =
    begrunnelse && begrunnelse.length > BEGRUNNELSE_MAKS_TEGN

  const skalBekrefteVarighet =
    nySluttDato && getSkalBekrefteVarighet(pamelding, nySluttDato)

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchEndreDeltakelseForleng
  } = useDeferredFetch(endreDeltakelseForleng)

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

    if (!begrunnelse || harForLangBegrunnelse) {
      setErrorBegrunnelse(true)
      hasError = true
    }

    if (!hasError && nySluttDato && begrunnelse) {
      doFetchEndreDeltakelseForleng(pamelding.deltakerId, enhetId, {
        sluttdato: formatDateToDateInputStr(nySluttDato),
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

        <VarighetField
          title="Hvor lenge skal deltakelsen forlenges?"
          className="mt-4"
          tiltakstype={pamelding.deltakerliste.tiltakstype}
          startDato={sluttdatoDeltaker || undefined}
          sluttdato={getSisteGyldigeSluttDato(pamelding) || undefined}
          errorVarighet={errorVarighet}
          errorSluttDato={errorSluttDato}
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
            setErrorBegrunnelse(false)
          }}
          error={
            (errorBegrunnelse &&
              !begrunnelse &&
              'Du må begrunne forlengelsen') ||
            (harForLangBegrunnelse &&
              `Begrunnelsen kan ikke være mer enn ${BEGRUNNELSE_MAKS_TEGN} tegn`)
          }
          className="mt-6"
          label="Begrunnelse for forlengelsen"
          value={begrunnelse ?? ''}
          maxLength={BEGRUNNELSE_MAKS_TEGN}
          id="begrunnelse"
          size="small"
          aria-label={'Begrunnelse'}
        />
      </Modal.Body>
      <ModalFooter
        confirmButtonText="Lagre"
        onConfirm={sendEndring}
        confirmLoading={endreDeltakelseState === DeferredFetchState.LOADING}
        disabled={endreDeltakelseState === DeferredFetchState.LOADING}
      />
    </Modal>
  )
}
