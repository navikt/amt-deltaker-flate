import {
  ConfirmationPanel,
  DatePicker,
  Detail,
  Modal,
  useDatepicker
} from '@navikt/ds-react'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseSluttdato } from '../../../api/api.ts'
import { EndreDeltakelseType } from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { ErrorPage } from '../../../pages/ErrorPage.tsx'
import {
  dateStrToNullableDate,
  formatDateToDateInputStr
} from '../../../utils/utils.ts'
import { ModalFooter } from '../../ModalFooter.tsx'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import {
  UGYLDIG_DATO_FEILMELDING,
  VARGIHET_VALG_FEILMELDING,
  VARIGHET_BEKREFTELSE_FEILMELDING,
  erSluttdatoEtterMaxVarighetsDato,
  getSisteGyldigeSluttDato,
  getSkalBekrefteVarighet,
  getSoftMaxVarighetBekreftelseText
} from '../../../utils/varighet.tsx'

interface EndreSluttdatoModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const EndreSluttdatoModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: EndreSluttdatoModalProps) => {
  const { enhetId } = useAppContext()
  const [sluttdato, settNySluttdato] = useState<Date | null>()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const skalBekrefteVarighet = getSkalBekrefteVarighet(pamelding, sluttdato)

  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: dateStrToNullableDate(pamelding.startdato) || undefined,
    toDate: getSisteGyldigeSluttDato(pamelding) || undefined,
    onValidate: (dateValidation) => {
      if (dateValidation.isAfter) {
        setErrorMessage(VARGIHET_VALG_FEILMELDING)
      } else if (dateValidation.isInvalid) {
        setErrorMessage(UGYLDIG_DATO_FEILMELDING)
      }
    },
    onDateChange: (date) => {
      settNySluttdato(date)
      if (!erSluttdatoEtterMaxVarighetsDato(pamelding, date)) {
        setErrorMessage(null)
      }
    }
  })

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchEndreDeltakelseSluttdato
  } = useDeferredFetch(endreDeltakelseSluttdato)

  const sendEndring = () => {
    if (!sluttdato && !errorMessage) setErrorMessage('Du må velge sluttdato')
    else if (skalBekrefteVarighet && !varighetBekreftelse) {
      setErrorVarighetConfirmation(VARIGHET_BEKREFTELSE_FEILMELDING)
    } else if (sluttdato && !errorMessage) {
      doFetchEndreDeltakelseSluttdato(pamelding.deltakerId, enhetId, {
        sluttdato: formatDateToDateInputStr(sluttdato)
      }).then((data) => {
        onSuccess(data)
      })
    }
  }

  return (
    <Modal
      open={open}
      header={{
        icon: <EndringTypeIkon type={EndreDeltakelseType.ENDRE_SLUTTDATO} />,
        heading: 'Endre sluttdato'
      }}
      onClose={onClose}
    >
      <Modal.Body>
        {endreDeltakelseState === DeferredFetchState.ERROR && (
          <ErrorPage message={endreDeltakelseError} />
        )}
        <Detail size="small" className="mb-4">
          Når du lagrer så får bruker beskjed gjennom nav.no. Arrangør ser også
          endringen.
        </Detail>
        <DatePicker {...datepickerProps}>
          <DatePicker.Input
            {...inputProps}
            label="Ny sluttdato"
            error={errorMessage}
            size="small"
          />
        </DatePicker>
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
