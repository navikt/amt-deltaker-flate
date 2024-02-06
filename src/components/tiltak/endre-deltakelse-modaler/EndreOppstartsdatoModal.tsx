import {
  Alert,
  BodyLong,
  Button,
  DatePicker,
  Heading,
  Modal,
  useDatepicker
} from '@navikt/ds-react'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { useState } from 'react'
import { DeferredFetchState, useDeferredFetch } from '../../../hooks/useDeferredFetch.ts'
import { endreDeltakelseStartdato } from '../../../api/api.ts'
import { useAppContext } from '../../../AppContext.tsx'
import { dateStrToNullableDate } from '../../../utils/utils.ts'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import { EndreDeltakelseType } from '../../../api/data/endre-deltakelse-request.ts'

interface EndreOppstartsdatoModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const EndreOppstartsdatoModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: EndreOppstartsdatoModalProps) => {
  const { enhetId } = useAppContext()
  const [startdato, settNyStartDato] = useState<Date | null>()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { datepickerProps, inputProps } = useDatepicker({
    // TODO i arrangør flate er disse datoene maks 2 mnd tilbake/frem i tid
    fromDate: dateStrToNullableDate(pamelding.deltakerliste.startdato) || undefined,
    toDate: dateStrToNullableDate(pamelding.deltakerliste.sluttdato) || undefined,
    onValidate: (val) => {
      setErrorMessage(!val.isValidDate ? 'Du må velge en gyldig dato' : null)
    },
    onDateChange: (date) => {
      settNyStartDato(date)
    }
  })

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchEndreDeltakelseSTartdato
  } = useDeferredFetch(endreDeltakelseStartdato)

  const sendEndring = () => {
    if (!startdato) setErrorMessage('Du må velge startdato')
    else {
      doFetchEndreDeltakelseSTartdato(pamelding.deltakerId, enhetId, {
        startdato
      }).then((data) => {
        onSuccess(data)
      })
    }
  }

  return (
    <Modal
      open={open}
      header={{
        icon: <EndringTypeIkon type={EndreDeltakelseType.ENDRE_OPPSTARTSDATO} />,
        heading: 'Endre oppstartsdato'
      }}
      onClose={onClose}
    >
      <Modal.Body>
        {endreDeltakelseState === DeferredFetchState.ERROR && (
          <Alert variant="error" className="mt-4 mb-4">
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
          <DatePicker.Input {...inputProps} label="Ny oppstartsdato" error={errorMessage} />
        </DatePicker>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          size="small"
          loading={endreDeltakelseState === DeferredFetchState.LOADING}
          disabled={endreDeltakelseState === DeferredFetchState.LOADING}
          onClick={sendEndring}
        >
          Lagre
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
