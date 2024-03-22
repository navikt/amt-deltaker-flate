import { Alert, BodyLong, DatePicker, Heading, Modal, useDatepicker } from '@navikt/ds-react'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { useState } from 'react'
import { DeferredFetchState, useDeferredFetch } from '../../../hooks/useDeferredFetch.ts'
import { endreDeltakelseSluttdato } from '../../../api/api.ts'
import { useAppContext } from '../../../AppContext.tsx'
import { dateStrToNullableDate, formatDateToDateInputStr } from '../../../utils/utils.ts'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import { EndreDeltakelseType } from '../../../api/data/endre-deltakelse-request.ts'
import { ModalFooter } from '../../ModalFooter.tsx'

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

  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: dateStrToNullableDate(pamelding.startdato) || undefined,
    toDate: dateStrToNullableDate(pamelding.deltakerliste.sluttdato) || undefined,
    onValidate: (val) => {
      setErrorMessage(!val.isValidDate ? 'Du må velge en gyldig dato' : null)
    },
    onDateChange: (date) => {
      settNySluttdato(date)
    }
  })

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchEndreDeltakelseSluttdato
  } = useDeferredFetch(endreDeltakelseSluttdato)

  const sendEndring = () => {
    if (!sluttdato) setErrorMessage('Du må velge sluttdato')
    else {
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
          <Alert variant="error" className="mb-4">
            <Heading size="small" spacing level="3">
              Det skjedde en feil.
            </Heading>
            {endreDeltakelseError}
          </Alert>
        )}
        <BodyLong size="small" className="mb-4">
          Når du lagrer så får bruker beskjed gjennom nav.no. Arrangør ser også endringen.
        </BodyLong>
        <DatePicker {...datepickerProps}>
          <DatePicker.Input
            {...inputProps}
            label="Ny sluttdato"
            error={errorMessage}
            size="small"
          />
        </DatePicker>
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
