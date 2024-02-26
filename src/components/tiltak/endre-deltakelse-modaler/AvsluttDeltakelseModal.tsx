import {Alert, BodyLong, DatePicker, Heading, Modal, Radio, RadioGroup, Textarea, useDatepicker} from '@navikt/ds-react'
import { DeltakerStatusAarsakType, PameldingResponse } from '../../../api/data/pamelding'
import { useState } from 'react'
import { DeferredFetchState, useDeferredFetch } from '../../../hooks/useDeferredFetch'
import {avsluttDeltakelse} from '../../../api/api'
import { useAppContext } from '../../../AppContext'
import { getDeltakerStatusAarsakTypeText } from '../../../utils/displayText'
import {dateStrToNullableDate, formatDateToDateInputStr, getDeltakerStatusAarsakTyperAsList} from '../../../utils/utils'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import {BESKRIVELSE_ARSAK_ANNET_MAX_TEGN, EndreDeltakelseType} from '../../../api/data/endre-deltakelse-request.ts'
import { ModalFooter } from '../../ModalFooter.tsx'

interface AvsluttDeltakelseModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const AvsluttDeltakelseModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: AvsluttDeltakelseModalProps) => {
  const [valgtArsak, setValgtArsak] = useState<DeltakerStatusAarsakType | null>(null)
  const [beskrivelse, setBeskrivelse] = useState<string | null>(null)
  const [hasError, setHasError] = useState<boolean>(false)
  const [sluttdato, settNySluttDato] = useState<Date | null>()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const aarsakErAnnet = valgtArsak === DeltakerStatusAarsakType.ANNET
  const harAnnetBeskrivelse = beskrivelse && beskrivelse.length > 0
  const { enhetId } = useAppContext()

  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: dateStrToNullableDate(pamelding.startdato) || undefined,
    toDate: dateStrToNullableDate(pamelding.deltakerliste.sluttdato) || undefined,
    onValidate: (val) => {
      setErrorMessage(!val.isValidDate ? 'Du må velge en gyldig dato' : null)
    },
    onDateChange: (date) => {
      settNySluttDato(date)
    }
  })

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchAvsluttDeltakelse
  } = useDeferredFetch(avsluttDeltakelse)

  const sendEndring = () => {
    if (!sluttdato) {
      setErrorMessage('Du må velge en sluttdato')
    } else if (valgtArsak) {
      if (!aarsakErAnnet || (aarsakErAnnet && harAnnetBeskrivelse)) {
        doFetchAvsluttDeltakelse(pamelding.deltakerId, enhetId, {
          aarsak: {
            type: valgtArsak,
            beskrivelse: beskrivelse
          },
          sluttdato: formatDateToDateInputStr(sluttdato)
        }).then((data) => {
          onSuccess(data)
        })
      } else setHasError(true)
    } else setHasError(true)
  }

  return (
    <Modal
      open={open}
      header={{
        icon: <EndringTypeIkon type={EndreDeltakelseType.AVSLUTT_DELTAKELSE} />,
        heading: 'Avslutt deltakelse'
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
        <RadioGroup
          legend="Hva er årsaken til avslutning?"
          size="small"
          error={hasError && !aarsakErAnnet && 'Du må velge en årsak før du kan fortsette.'}
          onChange={(value: DeltakerStatusAarsakType) => {
            setValgtArsak(value)
            setHasError(false)
          }}
          value={valgtArsak}
        >
          <>
            {getDeltakerStatusAarsakTyperAsList().map((arsakType) => (
              <Radio value={arsakType} key={arsakType}>
                {getDeltakerStatusAarsakTypeText(arsakType)}
              </Radio>
            ))}
            {valgtArsak === DeltakerStatusAarsakType.ANNET && (
              <Textarea
                onChange={(e) => {
                  setBeskrivelse(e.target.value)
                  setHasError(false)
                }}
                value={beskrivelse ?? ''}
                minRows={1}
                rows={1}
                size="small"
                label={null}
                error={
                  hasError &&
                        aarsakErAnnet &&
                        'Du må fylle ut for årsak "annet" før du kan fortsette.'
                }
                maxLength={BESKRIVELSE_ARSAK_ANNET_MAX_TEGN}
                aria-label={'Beskrivelse for Annet'}
              />
            )}
          </>
        </RadioGroup>
        <section className="mt-4">
          <DatePicker {...datepickerProps}>
            <DatePicker.Input {...inputProps} label="Hva er ny sluttdato?" error={errorMessage}/>
          </DatePicker>
        </section>
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
