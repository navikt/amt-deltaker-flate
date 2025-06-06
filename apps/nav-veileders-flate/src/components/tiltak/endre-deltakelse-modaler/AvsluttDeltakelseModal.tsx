import { ConfirmationPanel, Radio, RadioGroup } from '@navikt/ds-react'
import {
  AarsakRadioGroup,
  AvsluttDeltakelseForslag,
  BegrunnelseInput,
  DeltakerStatusType,
  EndreDeltakelseType,
  Forslag,
  ForslagEndring,
  ForslagEndringType,
  getDateFromString,
  Oppstartstype,
  useAarsak,
  useBegrunnelse
} from 'deltaker-flate-common'
import { useMemo, useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { avsluttDeltakelse } from '../../../api/api.ts'
import { AvsluttDeltakelseRequest } from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { useSluttdatoInput } from '../../../utils/use-sluttdato.ts'
import {
  Avslutningstype,
  dateStrToNullableDate,
  formatDateToDtoStr,
  HarDeltattValg
} from '../../../utils/utils.ts'
import {
  getSisteGyldigeSluttDato,
  getSkalBekrefteVarighet,
  getSoftMaxVarighetBekreftelseText,
  VARIGHET_BEKREFTELSE_FEILMELDING
} from '../../../utils/varighet.tsx'
import { SimpleDatePicker } from '../SimpleDatePicker.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import dayjs from 'dayjs'
import { getFeilmeldingIngenEndring } from '../../../utils/displayText.ts'
import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'

interface AvsluttDeltakelseModalProps {
  pamelding: PameldingResponse
  forslag: Forslag | null
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const AvsluttDeltakelseModal = ({
  pamelding,
  forslag,
  open,
  onClose,
  onSuccess
}: AvsluttDeltakelseModalProps) => {
  const defaultSluttdato = getSluttdato(pamelding, forslag)
  const erFellesOppstart =
    pamelding.deltakerliste.oppstartstype === Oppstartstype.FELLES

  const [harDeltatt, setHarDeltatt] = useState<boolean | null>(
    getHarDeltatt(forslag)
  )
  const [avslutningstype, setAvslutningstype] =
    useState<Avslutningstype | null>(() => {
      const harFullfortValg = getHarFullfort(forslag)
      if (!erFellesOppstart) return null

      if (harFullfortValg === true) return Avslutningstype.FULLFORT
      else if (harDeltatt === false) return Avslutningstype.IKKE_DELTATT
      else if (harFullfortValg === false) return Avslutningstype.AVBRUTT
      else return null
    })
  const [harDeltattError, setHarDeltattError] = useState<string | undefined>()
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const aarsak = useAarsak(forslag)
  const begrunnelse = useBegrunnelse(true)
  const sluttdato = useSluttdatoInput({
    deltaker: pamelding,
    defaultDato: defaultSluttdato ?? undefined,
    startdato: useMemo(
      () => getDateFromString(pamelding.startdato),
      [pamelding.startdato]
    )
  })
  const { enhetId } = useAppContext()

  const skalViseAarsak = erFellesOppstart
    ? avslutningstype === Avslutningstype.AVBRUTT ||
      avslutningstype === Avslutningstype.IKKE_DELTATT
    : true

  // VI viser dette valget i 15 dager etter startdato. ellers så vil vi alltid sette sluttdato
  const skalViseHarDeltatt =
    showHarDeltatt(pamelding, forslag) && !erFellesOppstart
  const skalViseSluttDato =
    (!skalViseHarDeltatt || harDeltatt) &&
    avslutningstype !== Avslutningstype.IKKE_DELTATT
  const skalBekrefteVarighet =
    skalViseSluttDato && getSkalBekrefteVarighet(pamelding, sluttdato.sluttdato)

  const onSetAvslutningstype = (nyVerdi: Avslutningstype) => {
    setAvslutningstype(nyVerdi)
    if (nyVerdi === Avslutningstype.IKKE_DELTATT) setHarDeltatt(false)
    if (
      nyVerdi === Avslutningstype.FULLFORT ||
      nyVerdi === Avslutningstype.AVBRUTT
    ) {
      setHarDeltatt(true)
    }
  }
  const validertRequest = () => {
    let hasError = false

    if (!begrunnelse.valider()) {
      hasError = true
    }

    if (erFellesOppstart && avslutningstype === null) {
      hasError = true
    }

    if (avslutningstype !== Avslutningstype.FULLFORT && !aarsak.valider()) {
      hasError = true
    }

    if (skalViseSluttDato && sluttdato.error) {
      hasError = true
    }

    if (skalViseSluttDato && !sluttdato.sluttdato) {
      sluttdato.setError('Du må velge en sluttdato.')
      hasError = true
    }

    if (skalBekrefteVarighet && !varighetBekreftelse) {
      setErrorVarighetConfirmation(VARIGHET_BEKREFTELSE_FEILMELDING)
      hasError = true
    }

    if (skalViseHarDeltatt && harDeltatt === null) {
      hasError = true
      setHarDeltattError('Du må svare før du kan fortsette.')
    }

    if (!hasError) {
      const nyArsakBeskrivelse = aarsak.beskrivelse ?? null
      const endring: AvsluttDeltakelseRequest = {
        aarsak:
          skalViseAarsak && aarsak.aarsak
            ? {
                type: aarsak.aarsak,
                beskrivelse: nyArsakBeskrivelse
              }
            : null,
        sluttdato:
          skalViseSluttDato && sluttdato.sluttdato
            ? formatDateToDtoStr(sluttdato.sluttdato)
            : null,
        harDeltatt: harDeltatt,
        harFullfort: erFellesOppstart
          ? avslutningstype === Avslutningstype.FULLFORT
          : null,
        begrunnelse: begrunnelse.begrunnelse || null,
        forslagId: forslag ? forslag.id : null
      }

      validerDeltakerKanEndres(pamelding)
      if (!harStatusSomKanAvslutteDeltakelse(pamelding.status.type)) {
        throw new Error(
          'Kan ikke avslutte deltakelse for deltaker som ikke har status "Deltar", "Har sluttet", "Avbrutt" eller "Fullført".'
        )
      }

      if (
        !skalViseSluttDato &&
        pamelding.status.type !== DeltakerStatusType.DELTAR
      ) {
        throw new Error(
          'Deltakeren har allerede sluttet på tiltaket, og kan derfor ikke settes til “Ikke deltatt”.'
        )
      }

      const harDeltattErIkkeSpesifisertIForslag =
        getHarDeltatt(forslag) === null
      if (harDeltattErIkkeSpesifisertIForslag) {
        const femtenDagerSiden = dayjs().subtract(15, 'days')
        if (
          !skalViseSluttDato &&
          dayjs(pamelding.status.gyldigFra).isSameOrBefore(femtenDagerSiden)
        ) {
          throw new Error(
            'Deltakeren har hatt status “Deltar” i mer enn 15 dager, og kan derfor ikke settes til “Ikke deltatt”.'
          )
        }
      }

      const deltakerErEndret =
        pamelding.status.type !== DeltakerStatusType.HAR_SLUTTET ||
        !dayjs(sluttdato.sluttdato).isSame(pamelding.sluttdato, 'day') ||
        pamelding.status.aarsak?.type !== aarsak.aarsak ||
        pamelding.status.aarsak?.beskrivelse !== nyArsakBeskrivelse
      if (!deltakerErEndret) {
        throw new Error(getFeilmeldingIngenEndring(forslag !== null))
      }

      return {
        deltakerId: pamelding.deltakerId,
        enhetId: enhetId,
        body: endring
      }
    }
    return null
  }

  return (
    <Endringsmodal
      open={open}
      endringstype={EndreDeltakelseType.AVSLUTT_DELTAKELSE}
      deltaker={pamelding}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={avsluttDeltakelse}
      validertRequest={validertRequest}
      forslag={forslag}
    >
      {erFellesOppstart && (
        <section className="mt-4 mb-4">
          <RadioGroup
            legend="Har deltakeren fullført kurset?"
            size="small"
            disabled={false}
            defaultValue={avslutningstype}
            onChange={onSetAvslutningstype}
          >
            <Radio
              value={Avslutningstype.FULLFORT}
              description={avslutningsBeskrivelseTekstMapper(
                Avslutningstype.FULLFORT
              )}
            >
              Ja, kurset er fullført
            </Radio>
            <Radio
              value={Avslutningstype.AVBRUTT}
              description={avslutningsBeskrivelseTekstMapper(
                Avslutningstype.AVBRUTT
              )}
            >
              Nei, kurset er avbrutt
            </Radio>
            {showHarDeltatt(pamelding, forslag) && (
              <Radio
                value={Avslutningstype.IKKE_DELTATT}
                description={avslutningsBeskrivelseTekstMapper(
                  Avslutningstype.IKKE_DELTATT
                )}
              >
                Nei, personen har ikke deltatt
              </Radio>
            )}
          </RadioGroup>
        </section>
      )}
      {skalViseAarsak && (
        <AarsakRadioGroup
          legend="Hva er årsaken til avslutning?"
          aarsak={aarsak.aarsak}
          aarsakError={aarsak.aarsakError}
          beskrivelse={aarsak.beskrivelse}
          beskrivelseError={aarsak.beskrivelseError}
          onChange={aarsak.handleChange}
          onBeskrivelse={aarsak.handleBeskrivelse}
          disabled={false}
        />
      )}
      {skalViseHarDeltatt && (
        <section className="mt-4">
          <RadioGroup
            legend="Har personen deltatt på tiltaket?"
            size="small"
            description="Dersom personen ikke har deltatt på tiltaket, vil statusen på tiltaket endres til “Ikke aktuell”."
            error={harDeltattError}
            disabled={false}
            defaultValue={
              getHarDeltatt(forslag) === null
                ? undefined
                : getHarDeltatt(forslag)
                  ? HarDeltattValg.JA
                  : HarDeltattValg.NEI
            }
            onChange={(value: HarDeltattValg) => {
              if (value === HarDeltattValg.NEI) {
                setHarDeltatt(false)
              } else {
                setHarDeltatt(true)
              }
              setHarDeltattError(undefined)
            }}
          >
            <Radio value={HarDeltattValg.JA}>Ja</Radio>
            <Radio value={HarDeltattValg.NEI}>Nei</Radio>
          </RadioGroup>
        </section>
      )}

      {skalViseSluttDato && (
        <section className="mt-6">
          <SimpleDatePicker
            label="Hva er ny sluttdato?"
            disabled={false}
            error={sluttdato.error}
            fromDate={dateStrToNullableDate(pamelding.startdato) || undefined}
            toDate={getSisteGyldigeSluttDato(pamelding) || undefined}
            defaultDate={defaultSluttdato ?? undefined}
            onValidate={sluttdato.validate}
            onChange={sluttdato.onChange}
          />
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
      <BegrunnelseInput
        type="valgfri"
        onChange={begrunnelse.handleChange}
        error={begrunnelse.error}
        disabled={false}
      />
    </Endringsmodal>
  )
}

function isAvsluttDeltakelseForslag(
  endring: ForslagEndring
): endring is AvsluttDeltakelseForslag {
  return endring.type === ForslagEndringType.AvsluttDeltakelse
}

function getSluttdato(deltaker: PameldingResponse, forslag: Forslag | null) {
  if (forslag === null) {
    return getDateFromString(deltaker.sluttdato)
  }
  if (isAvsluttDeltakelseForslag(forslag.endring)) {
    return forslag.endring.sluttdato
  } else {
    throw new Error(
      `Kan ikke behandle forslag av type ${forslag.endring.type} som sluttdato`
    )
  }
}

const showHarDeltatt = (
  pamelding: PameldingResponse,
  forslag: Forslag | null
) => {
  if (getHarDeltatt(forslag) !== null) {
    return true
  }

  const statusdato = pamelding.status.gyldigFra
  const femtenDagerSiden = dayjs().subtract(15, 'days')
  return dayjs(statusdato).isAfter(femtenDagerSiden, 'day')
}

function getHarDeltatt(forslag: Forslag | null): boolean | null {
  if (forslag && isAvsluttDeltakelseForslag(forslag.endring)) {
    return forslag.endring.harDeltatt
  }
  return null
}

function getHarFullfort(forslag: Forslag | null): boolean | null | undefined {
  if (forslag && isAvsluttDeltakelseForslag(forslag.endring)) {
    return forslag.endring.harFullfort
  }
  return null
}

const harStatusSomKanAvslutteDeltakelse = (statusType: DeltakerStatusType) =>
  statusType === DeltakerStatusType.DELTAR ||
  statusType === DeltakerStatusType.HAR_SLUTTET ||
  statusType === DeltakerStatusType.FULLFORT ||
  statusType === DeltakerStatusType.AVBRUTT

export const avslutningsBeskrivelseTekstMapper = (
  kategoriType: Avslutningstype
) => {
  switch (kategoriType) {
    case Avslutningstype.FULLFORT:
      return 'Med fullført menes at kurset er gjennomført, og/eller at ønsket mål, sertifisering el. er oppnådd'
    case Avslutningstype.AVBRUTT:
      return 'Med avbrutt menes at deltakeren avslutter på kurset uten å ha gjennomført og/eller oppnådd ønsket mål, sertifisering el.'
    case Avslutningstype.IKKE_DELTATT:
      return 'Dersom personen ikke har deltatt på tiltaket, vil statusen på tiltaket endres til “Ikke aktuell”.'
    default:
      return 'Ukjent'
  }
}
