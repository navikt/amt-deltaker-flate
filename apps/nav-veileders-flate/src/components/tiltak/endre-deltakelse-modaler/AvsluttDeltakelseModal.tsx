import {
  ConfirmationPanel,
  DatePicker,
  Detail,
  Modal,
  Radio,
  RadioGroup,
  Textarea,
  useDatepicker
} from '@navikt/ds-react'
import {
  DeferredFetchState,
  DeltakerStatusAarsakType,
  getDateFromNorwegianStringFormat,
  getDateFromString,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useRef, useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { avsluttDeltakelse } from '../../../api/api.ts'
import {
  BESKRIVELSE_ARSAK_ANNET_MAX_TEGN,
  EndreDeltakelseType
} from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { ErrorPage } from '../../../pages/ErrorPage.tsx'
import { getDeltakerStatusAarsakTypeText } from '../../../utils/displayText.ts'
import {
  HarDeltattValg,
  dateStrToDate,
  dateStrToNullableDate,
  formatDateToDateInputStr,
  getDeltakerStatusAarsakTyperAsList
} from '../../../utils/utils.ts'
import {
  SLUTTDATO_FØR_OPPSTARTSDATO_FEILMELDING,
  UGYLDIG_DATO_FEILMELDING,
  VARGIHET_VALG_FEILMELDING,
  VARIGHET_BEKREFTELSE_FEILMELDING,
  getSisteGyldigeSluttDato,
  getSkalBekrefteVarighet,
  getSluttDatoFeilmelding,
  getSoftMaxVarighetBekreftelseText
} from '../../../utils/varighet.tsx'
import { ModalFooter } from '../../ModalFooter.tsx'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'

interface AvsluttDeltakelseModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

const showHarDeltatt = (pamelding: PameldingResponse) => {
  const statusdato = dateStrToDate(pamelding.status.gyldigFra)
  const femtenDagerSiden = new Date()
  femtenDagerSiden.setDate(femtenDagerSiden.getDate() - 15)
  return statusdato > femtenDagerSiden
}

export const AvsluttDeltakelseModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: AvsluttDeltakelseModalProps) => {
  const [valgtArsak, setValgtArsak] = useState<DeltakerStatusAarsakType | null>(
    null
  )
  const [beskrivelse, setBeskrivelse] = useState<string | null>(null)
  const [harDeltatt, setHarDeltatt] = useState<boolean | null>(null)
  const [nySluttDato, settNySluttDato] = useState<Date | null | undefined>(
    getDateFromString(pamelding.sluttdato) ?? null
  )
  const [errorAarsak, setErrorAarsak] = useState<boolean>(false)
  const [errorAarsakAnnet, setErrorAarsakAnnet] = useState<boolean>(false)
  const [errorSluttDato, setErrorSluttDato] = useState<string | null>(null)
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const datePickerRef = useRef<HTMLInputElement>(null)
  const aarsakErAnnet = valgtArsak === DeltakerStatusAarsakType.ANNET
  const harAnnetBeskrivelse = beskrivelse && beskrivelse.length > 0
  const harForLangAnnetBeskrivelse =
    harAnnetBeskrivelse && beskrivelse.length > BESKRIVELSE_ARSAK_ANNET_MAX_TEGN
  const { enhetId } = useAppContext()

  const skalViseHarDeltatt = showHarDeltatt(pamelding)
  const skalViseSluttDato = !skalViseHarDeltatt || harDeltatt
  const skalBekrefteVarighet =
    harDeltatt && getSkalBekrefteVarighet(pamelding, nySluttDato)

  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: dateStrToNullableDate(pamelding.startdato) || undefined,
    toDate: getSisteGyldigeSluttDato(pamelding) || undefined,
    defaultSelected: getDateFromString(pamelding.sluttdato),
    onValidate: (dateValidation) => {
      if (dateValidation.isAfter) {
        const value = getDateFromNorwegianStringFormat(
          datePickerRef?.current?.value
        )
        if (value) setErrorSluttDato(getSluttDatoFeilmelding(pamelding, value))
        else setErrorSluttDato(VARGIHET_VALG_FEILMELDING)
      } else if (dateValidation.isInvalid) {
        setErrorSluttDato(UGYLDIG_DATO_FEILMELDING)
      } else if (dateValidation.isBefore) {
        setErrorSluttDato(SLUTTDATO_FØR_OPPSTARTSDATO_FEILMELDING)
      }
    },
    onDateChange: (date) => {
      settNySluttDato(date)
      if (date) setErrorSluttDato(null)
    }
  })

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchAvsluttDeltakelse
  } = useDeferredFetch(avsluttDeltakelse)

  const sendEndring = () => {
    let hasError = false
    if (skalViseSluttDato && !nySluttDato && !errorSluttDato) {
      setErrorSluttDato('Du må velge en sluttdato')
      hasError = true
    }
    if (skalViseSluttDato && !nySluttDato) {
      hasError = true
    }
    if (skalViseSluttDato && errorSluttDato) {
      hasError = true
    }
    if (skalBekrefteVarighet && !varighetBekreftelse) {
      setErrorVarighetConfirmation(VARIGHET_BEKREFTELSE_FEILMELDING)
      hasError = true
    }

    if (!valgtArsak) {
      setErrorAarsak(true)
      hasError = true
    }

    if (aarsakErAnnet && (!harAnnetBeskrivelse || harForLangAnnetBeskrivelse)) {
      setErrorAarsakAnnet(true)
      hasError = true
    }

    if (!hasError && valgtArsak) {
      doFetchAvsluttDeltakelse(pamelding.deltakerId, enhetId, {
        aarsak: {
          type: valgtArsak,
          beskrivelse: aarsakErAnnet ? beskrivelse : null
        },
        sluttdato:
          skalViseSluttDato && nySluttDato
            ? formatDateToDateInputStr(nySluttDato)
            : null,
        harDeltatt: harDeltatt
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
          <ErrorPage message={endreDeltakelseError} />
        )}
        <Detail size="small" className="mb-4">
          Når du lagrer så får bruker beskjed gjennom nav.no. Arrangør ser også
          endringen.
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
                error={
                  (errorAarsakAnnet &&
                    !harForLangAnnetBeskrivelse &&
                    'Du må fylle ut for årsak "annet" før du kan fortsette.') ||
                  (harForLangAnnetBeskrivelse &&
                    `Beskrivelsen kan ikke være mer enn ${BESKRIVELSE_ARSAK_ANNET_MAX_TEGN} tegn`)
                }
                maxLength={BESKRIVELSE_ARSAK_ANNET_MAX_TEGN}
                aria-label={'Beskrivelse for Annet'}
              />
            )}
          </>
        </RadioGroup>
        {skalViseHarDeltatt && (
          <section className="mt-4">
            <RadioGroup
              legend="Har personen deltatt?"
              size="small"
              onChange={(value: HarDeltattValg) => {
                if (value === HarDeltattValg.NEI) {
                  setHarDeltatt(false)
                } else {
                  setHarDeltatt(true)
                }
              }}
            >
              <Radio value={HarDeltattValg.JA}>Ja</Radio>
              <Radio value={HarDeltattValg.NEI}>Nei</Radio>
            </RadioGroup>
          </section>
        )}
        {skalViseSluttDato && (
          <section className="mt-4">
            <DatePicker {...datepickerProps}>
              <DatePicker.Input
                {...inputProps}
                ref={datePickerRef}
                size="small"
                label="Hva er ny sluttdato?"
                error={errorSluttDato}
              />
            </DatePicker>
          </section>
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
