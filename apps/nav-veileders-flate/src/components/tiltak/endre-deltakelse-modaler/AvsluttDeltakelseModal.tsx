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
  AktivtForslag,
  DeferredFetchState,
  DeltakerStatusAarsakType,
  EndreDeltakelseType,
  ForslagEndringType,
  getDateFromNorwegianStringFormat,
  getDateFromString,
  getDeltakerStatusAarsak,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useRef, useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { avsluttDeltakelse, avvisForslag } from '../../../api/api.ts'
import { BESKRIVELSE_ARSAK_ANNET_MAX_TEGN } from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { ErrorPage } from '../../../pages/ErrorPage.tsx'
import {
  getDeltakerStatusAarsakTypeText,
  getEndrePameldingTekst
} from '../../../utils/displayText.ts'
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
import { EndringTypeIkon } from 'deltaker-flate-common'
import { BEGRUNNELSE_MAKS_TEGN } from '../../../model/PameldingFormValues.ts'
import { ModalForslagDetaljer } from '../forslag/ModalForslagDetaljer.tsx'

interface AvsluttDeltakelseModalProps {
  pamelding: PameldingResponse
  forslag: AktivtForslag | null
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

const getSluttdatoFraForslag = (forslag: AktivtForslag | null) => {
  if (
    forslag &&
    forslag.endring.type === ForslagEndringType.AvsluttDeltakelse
  ) {
    return forslag.endring.sluttdato
  } else {
    return null
  }
}

const getSluttaarsakFraForslag = (forslag: AktivtForslag | null) => {
  if (
    forslag &&
    forslag.endring.type === ForslagEndringType.AvsluttDeltakelse
  ) {
    return forslag.endring.aarsak
  } else {
    return null
  }
}

export const AvsluttDeltakelseModal = ({
  pamelding,
  forslag,
  open,
  onClose,
  onSuccess
}: AvsluttDeltakelseModalProps) => {
  const sluttdatoFraForslag = getSluttdatoFraForslag(forslag)
  const sluttaarsakFraForslag = getSluttaarsakFraForslag(forslag)
  const initValgtArsak = sluttaarsakFraForslag
    ? getDeltakerStatusAarsak(sluttaarsakFraForslag)
    : null
  const [valgtArsak, setValgtArsak] = useState<DeltakerStatusAarsakType | null>(
    initValgtArsak ?? null
  )
  const [beskrivelse, setBeskrivelse] = useState<string | null>(null)
  const [harDeltatt, setHarDeltatt] = useState<boolean | null>(null)
  const [nySluttDato, settNySluttDato] = useState<Date | null | undefined>(
    (sluttdatoFraForslag
      ? getDateFromString(sluttdatoFraForslag)
      : getDateFromString(pamelding.sluttdato)) ?? null
  )
  const [begrunnelse, setBegrunnelse] = useState<string | null>()
  const [errorBegrunnelse, setErrorBegrunnelse] = useState<string | null>(null)

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

  // VI viser dette valget i 15 dager etter startdato. ellers så vil vi alltid sette sluttdato
  const skalViseHarDeltatt = showHarDeltatt(pamelding)
  const skalViseSluttDato = !skalViseHarDeltatt || harDeltatt
  const skalBekrefteVarighet =
    skalViseSluttDato && getSkalBekrefteVarighet(pamelding, nySluttDato)
  const harForLangBegrunnelse =
    begrunnelse && begrunnelse.length > BEGRUNNELSE_MAKS_TEGN

  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: dateStrToNullableDate(pamelding.startdato) || undefined,
    toDate: getSisteGyldigeSluttDato(pamelding) || undefined,
    defaultSelected: sluttdatoFraForslag
      ? getDateFromString(sluttdatoFraForslag)
      : getDateFromString(pamelding.sluttdato),
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

  const { doFetch: doFetchAvvisForslag } = useDeferredFetch(avvisForslag)

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

    if (harForLangBegrunnelse) {
      setErrorBegrunnelse(
        `Begrunnelsen kan ikke være mer enn ${BEGRUNNELSE_MAKS_TEGN} tegn`
      )
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
        harDeltatt: harDeltatt,
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
          {getEndrePameldingTekst(pamelding.digitalBruker)}
        </Detail>

        {forslag && sluttdatoFraForslag && sluttaarsakFraForslag && (
          <ModalForslagDetaljer forslag={forslag} />
        )}

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
          className="mt-4"
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
        <Textarea
          onChange={(e) => {
            setBegrunnelse(e.target.value)
            setErrorBegrunnelse(null)
          }}
          error={errorBegrunnelse}
          className="mt-6"
          label="Begrunnelse for avslutningen (valgfri)"
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
