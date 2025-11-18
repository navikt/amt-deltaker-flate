import { ConfirmationPanel, Radio, RadioGroup } from '@navikt/ds-react'
import dayjs from 'dayjs'
import {
  AarsakRadioGroup,
  BegrunnelseInput,
  DeltakerStatusType,
  EndreDeltakelseType,
  Forslag,
  getDateFromString,
  Oppstartstype,
  useAarsak,
  useBegrunnelse
} from 'deltaker-flate-common'
import { useMemo, useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { avsluttDeltakelse, endreAvslutning } from '../../../api/api.ts'
import { AvsluttDeltakelseRequest } from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import {
  avslutningsBeskrivelseTekstMapper,
  Avslutningstype,
  getAvslutningstype,
  getHarDeltatt,
  getSluttdato,
  harDeltattMindreEnn15Dager,
  HarDeltattValg,
  harStatusSomKanAvslutteDeltakelse
} from '../../../utils/avslutt-deltakelse-utils.ts'
import { getFeilmeldingIngenEndring } from '../../../utils/displayText.ts'
import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'
import { useSluttdatoInput } from '../../../utils/use-sluttdato.ts'
import {
  dateStrToNullableDate,
  formatDateToDtoStr
} from '../../../utils/utils.ts'
import {
  getSisteGyldigeSluttDato,
  getSkalBekrefteVarighet,
  getSoftMaxVarighetBekreftelseText,
  VARIGHET_BEKREFTELSE_FEILMELDING
} from '../../../utils/varighet.tsx'
import { SimpleDatePicker } from '../SimpleDatePicker.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'

interface Props {
  pamelding: PameldingResponse
  forslag: Forslag | null
  open: boolean
  endreDeltakelseType: EndreDeltakelseType
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const AvsluttDeltakelseModal = ({
  pamelding,
  forslag,
  open,
  endreDeltakelseType,
  onClose,
  onSuccess
}: Props) => {
  const defaultSluttdato = getSluttdato(pamelding, forslag)
  const erFellesOppstart =
    pamelding.deltakerliste.oppstartstype === Oppstartstype.FELLES
  const harDeltattMerEnnFjortenDager = !harDeltattMindreEnn15Dager(
    pamelding,
    forslag
  )

  const harDeltattFraForslag = getHarDeltatt(forslag)
  const [avslutningstype, setAvslutningstype] =
    useState<Avslutningstype | null>(
      getAvslutningstype(
        forslag,
        pamelding.status.type,
        harDeltattFraForslag,
        erFellesOppstart
      )
    )
  const [avslutningstypeError, setAvslutningstypeError] = useState<string>()
  const [harDeltatt, setHarDeltatt] = useState<boolean | null>(
    harDeltattFraForslag ??
      (erFellesOppstart
        ? avslutningstype === Avslutningstype.FULLFORT ||
          avslutningstype === Avslutningstype.AVBRUTT
        : harDeltattMerEnnFjortenDager
          ? pamelding.status.type !== DeltakerStatusType.IKKE_AKTUELL
          : null)
  )
  const [harDeltattError, setHarDeltattError] = useState<string | undefined>()
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const aarsak = useAarsak(
    forslag,
    pamelding.status.aarsak?.type,
    pamelding.status.aarsak?.beskrivelse
  )
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

  const skalViseSluttDato =
    harDeltatt && avslutningstype !== Avslutningstype.IKKE_DELTATT
  const skalBekrefteVarighet =
    skalViseSluttDato && getSkalBekrefteVarighet(pamelding, sluttdato.sluttdato)

  const onSetAvslutningstype = (nyVerdi: Avslutningstype) => {
    setAvslutningstype(nyVerdi)
    setAvslutningstypeError(undefined)
    aarsak.setAarsakError(undefined)
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
      setAvslutningstypeError('Du må velge om kurset er fullført.')
    }

    const skalValidereAarsak =
      (!erFellesOppstart &&
        (pamelding.status.type === DeltakerStatusType.DELTAR || !harDeltatt)) ||
      (erFellesOppstart && avslutningstype !== Avslutningstype.FULLFORT)

    if (skalValidereAarsak && !aarsak.valider()) {
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

    if (!harDeltattMerEnnFjortenDager && harDeltatt === null) {
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

      const deltakerErEndret =
        pamelding.status.type !== DeltakerStatusType.HAR_SLUTTET ||
        !dayjs(sluttdato.sluttdato).isSame(pamelding.sluttdato, 'day') ||
        pamelding.status.aarsak?.type !== aarsak.aarsak ||
        (pamelding.status.aarsak?.beskrivelse || null) !== nyArsakBeskrivelse
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
      endringstype={endreDeltakelseType}
      deltaker={pamelding}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={
        endreDeltakelseType === EndreDeltakelseType.AVSLUTT_DELTAKELSE
          ? avsluttDeltakelse
          : endreAvslutning
      }
      validertRequest={validertRequest}
      forslag={forslag}
    >
      {erFellesOppstart && (
        <section className="mt-4">
          <RadioGroup
            legend="Har deltakeren fullført kurset?"
            size="small"
            disabled={false}
            defaultValue={avslutningstype}
            onChange={onSetAvslutningstype}
            error={avslutningstypeError}
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
            <Radio
              value={Avslutningstype.IKKE_DELTATT}
              description={avslutningsBeskrivelseTekstMapper(
                Avslutningstype.IKKE_DELTATT
              )}
            >
              Nei, personen har ikke deltatt
            </Radio>
          </RadioGroup>
        </section>
      )}

      {!erFellesOppstart && (
        <section className="mt-4">
          <RadioGroup
            legend="Har personen deltatt på tiltaket?"
            size="small"
            description="Dersom personen ikke har deltatt på tiltaket, vil statusen på tiltaket endres til “Ikke aktuell”."
            error={harDeltattError}
            disabled={false}
            defaultValue={
              harDeltatt === null
                ? undefined
                : harDeltatt
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
              aarsak.setAarsakError(undefined)
            }}
          >
            <Radio value={HarDeltattValg.JA}>Ja</Radio>
            <Radio value={HarDeltattValg.NEI}>Nei</Radio>
          </RadioGroup>
        </section>
      )}

      {skalViseAarsak && (
        <AarsakRadioGroup
          className="mt-4"
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

      {skalViseSluttDato && (
        <section className="mt-4">
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
          className="mt-4"
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
