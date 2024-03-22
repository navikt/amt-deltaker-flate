import {
  Alert,
  DatePicker,
  Detail,
  Heading,
  Modal,
  Radio,
  RadioGroup,
  Textarea,
  useDatepicker
} from '@navikt/ds-react'
import { DeltakerStatusAarsakType, PameldingResponse } from '../../../api/data/pamelding.ts'
import { useState } from 'react'
import { DeferredFetchState, useDeferredFetch } from '../../../hooks/useDeferredFetch.ts'
import { avsluttDeltakelse } from '../../../api/api.ts'
import { useAppContext } from '../../../AppContext.tsx'
import { getDeltakerStatusAarsakTypeText } from '../../../utils/displayText.ts'
import {
  dateStrToNullableDate,
  formatDateToDateInputStr,
  getDeltakerStatusAarsakTyperAsList
} from '../../../utils/utils.ts'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import {
  BESKRIVELSE_ARSAK_ANNET_MAX_TEGN,
  EndreDeltakelseType
} from '../../../api/data/endre-deltakelse-request.ts'
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
  const [sluttdato, settNySluttDato] = useState<Date | null>()
  const [errorAarsak, setErrorAarsak] = useState<boolean>(false)
  const [errorAarsakAnnet, setErrorAarsakAnnet] = useState<boolean>(false)
  const [errorSluttDato, setErrorSluttDato] = useState<boolean>(false)

  const aarsakErAnnet = valgtArsak === DeltakerStatusAarsakType.ANNET
  const harAnnetBeskrivelse = beskrivelse && beskrivelse.length > 0
  const { enhetId } = useAppContext()

  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: dateStrToNullableDate(pamelding.startdato) || undefined,
    toDate: dateStrToNullableDate(pamelding.deltakerliste.sluttdato) || undefined,
    onDateChange: (date) => {
      settNySluttDato(date)
      setErrorSluttDato(false)
    }
  })

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchAvsluttDeltakelse
  } = useDeferredFetch(avsluttDeltakelse)

  const sendEndring = () => {
    let hasError = false
    if (!sluttdato) {
      setErrorSluttDato(true)
      hasError = true
    }
    if (!valgtArsak) {
      setErrorAarsak(true)
      hasError = true
    }

    if (aarsakErAnnet && !harAnnetBeskrivelse) {
      setErrorAarsakAnnet(true)
      hasError = true
    }

    if (!hasError && valgtArsak && sluttdato) {
      doFetchAvsluttDeltakelse(pamelding.deltakerId, enhetId, {
        aarsak: {
          type: valgtArsak,
          beskrivelse: beskrivelse
        },
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
        icon: <EndringTypeIkon type={EndreDeltakelseType.AVSLUTT_DELTAKELSE} />,
        heading: 'Avslutt deltakelse'
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
        <Detail size="small" className="mb-4">
          Når du lagrer så får bruker beskjed gjennom nav.no. Arrangør ser også endringen.
        </Detail>
        <RadioGroup
          legend="Hva er årsaken til avslutning?"
          size="small"
          error={errorAarsak && 'Du må velge en årsak før du kan fortsette.'}
          onChange={(value: DeltakerStatusAarsakType) => {
            setValgtArsak(value)
            setErrorAarsak(false)
            setErrorAarsakAnnet(false)
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
                  setErrorAarsakAnnet(false)
                }}
                value={beskrivelse ?? ''}
                minRows={1}
                rows={1}
                size="small"
                label={null}
                error={errorAarsakAnnet && 'Du må fylle ut for årsak "annet" før du kan fortsette.'}
                maxLength={BESKRIVELSE_ARSAK_ANNET_MAX_TEGN}
                aria-label={'Beskrivelse for Annet'}
              />
            )}
          </>
        </RadioGroup>
        <section className="mt-4">
          <DatePicker {...datepickerProps}>
            <DatePicker.Input
              {...inputProps}
              size="small"
              label="Hva er ny sluttdato?"
              error={errorSluttDato && 'Du må velge en sluttdato'}
            />
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
