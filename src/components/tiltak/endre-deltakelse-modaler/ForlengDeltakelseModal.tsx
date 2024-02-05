import {PameldingResponse} from '../../../api/data/pamelding.ts'
import {useAppContext} from '../../../AppContext.tsx'
import {DeferredFetchState, useDeferredFetch} from '../../../hooks/useDeferredFetch.ts'
import {endreDeltakelseForleng} from '../../../api/api.ts'
import {useState} from 'react'
import {Alert, BodyLong, Button, DatePicker, Heading, Modal, Radio, RadioGroup, useDatepicker} from '@navikt/ds-react'
import {Varighet, varigheter, VarighetValg, varighetValgForType} from '../../../utils/varighet.ts'
import dayjs from 'dayjs'
import {dateStrToNullableDate, formatDateToDateInputStr} from '../../../utils/utils.ts'
import {EndringTypeIkon} from '../EndringTypeIkon.tsx'
import {EndreDeltakelseType} from '../../../api/data/endre-deltakelse-request.ts'

interface ForlengDeltakelseModalProps {
    deltakerId: string
    pamelding: PameldingResponse
    open: boolean
    onClose: () => void
    onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const ForlengDeltakelseModal = ({
  deltakerId,
  pamelding,
  open,
  onClose,
  onSuccess
}: ForlengDeltakelseModalProps) => {
  const [ valgtVarighet, settValgtVarighet ] = useState(VarighetValg.IKKE_VALGT)
  const [ nySluttDato, settNySluttDato ] = useState<Date | null>()
  const visDatovelger = valgtVarighet === VarighetValg.ANNET
  const sluttdato = dateStrToNullableDate(pamelding.sluttdato)
  const { enhetId } = useAppContext()
    
  const kalkulerSluttdato = (sluttdato: Date | null, varighet: Varighet): Date => {
    return dayjs(sluttdato).add(varighet.antall, varighet.tidsenhet).toDate()
  }

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchEndreDeltakelseForleng
  } = useDeferredFetch(endreDeltakelseForleng)

  const sendEndring = () => {
    if (!nySluttDato) {
      return Promise.reject('Kan ikke sende forlenge deltakelse uten ny sluttdato')
    }
    doFetchEndreDeltakelseForleng(deltakerId, enhetId, {
      sluttdato: formatDateToDateInputStr(nySluttDato)
    }).then((data) => {
      onSuccess(data)
    })
  }

  const [hasError, setHasError] = useState(false)
  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: sluttdato || undefined,
    toDate: dateStrToNullableDate(pamelding.deltakerliste.sluttdato) || undefined,
    onValidate: (val) => {
      setHasError(!val.isValidDate)
    },
    onDateChange: (date) => {
      settNySluttDato(date)
    },
  })

  const handleChangeVarighet = (valgtVarighet: VarighetValg) => {
    settValgtVarighet(valgtVarighet)
    const varighet = varigheter[valgtVarighet]
    if (varighet) {
      settNySluttDato(kalkulerSluttdato(sluttdato, varighet))
    }
    else settNySluttDato(null)
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
          <Alert variant="error">
            <Heading size="small" spacing level="3">
                        Det skjedde en feil.
            </Heading>
            {endreDeltakelseError}
          </Alert>
        )}
        <BodyLong size="small">
              Når du lagrer så får bruker beskjed gjennom nav.no. Arrangør ser også endringen.
        </BodyLong>
            
        <RadioGroup
          legend="Hvor lenge skal deltakelsen forlenges?"
          size="small"
          onChange={handleChangeVarighet}
          value={valgtVarighet}
        >
          <>
            {varighetValgForType(pamelding.deltakerliste.tiltakstype).map(v => <Radio value={v} key={v}>{varigheter[v].navn}</Radio>)}
            <Radio value={VarighetValg.ANNET}>
                  Annet - velg dato
              {visDatovelger &&
                      <DatePicker {...datepickerProps}>
                        <DatePicker.Input
                          {...inputProps}
                          label="Annet - velg dato"
                          hideLabel={true}
                          error={hasError && 'Ny dato må være senere enn sluttdato'}
                        />
                      </DatePicker>
              }
            </Radio>
          </>
        </RadioGroup>
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
