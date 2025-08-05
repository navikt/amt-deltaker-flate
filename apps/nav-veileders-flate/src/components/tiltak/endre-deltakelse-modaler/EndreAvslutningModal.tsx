import { Radio, RadioGroup } from '@navikt/ds-react'
import dayjs from 'dayjs'
import {
  AarsakRadioGroup,
  BegrunnelseInput,
  DeltakerStatusType,
  EndreAvslutningForslag,
  EndreDeltakelseType,
  Forslag,
  ForslagEndring,
  ForslagEndringType,
  useAarsak,
  useBegrunnelse
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreAvslutning } from '../../../api/api.ts'
import { EndreAvslutningRequest } from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { getFeilmeldingIngenEndring } from '../../../utils/displayText.ts'
import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'
import { Avslutningstype } from '../../../utils/utils.ts'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'

interface Props {
  pamelding: PameldingResponse
  forslag: Forslag | null
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const EndreAvslutningModal = ({
  pamelding,
  forslag,
  open,
  onClose,
  onSuccess
}: Props) => {
  const [harDeltatt, setHarDeltatt] = useState<boolean | null>(
    getHarDeltatt(forslag)
  )
  const [avslutningstype, setAvslutningstype] =
    useState<Avslutningstype | null>(() => {
      const harFullfortValg = getHarFullfort(forslag)
      if (harFullfortValg === true) return Avslutningstype.FULLFORT
      else if (harDeltatt === false) return Avslutningstype.IKKE_DELTATT
      else if (harFullfortValg === false) return Avslutningstype.AVBRUTT
      else return null
    })

  const aarsak = useAarsak(forslag)
  const begrunnelse = useBegrunnelse(true)

  const { enhetId } = useAppContext()

  const skalViseAarsak =
    avslutningstype === Avslutningstype.AVBRUTT ||
    avslutningstype === Avslutningstype.IKKE_DELTATT

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

    if (avslutningstype === null) {
      hasError = true
    }

    if (avslutningstype !== Avslutningstype.FULLFORT && !aarsak.valider()) {
      hasError = true
    }

    if (!hasError) {
      const nyArsakBeskrivelse = aarsak.beskrivelse ?? null
      const endring: EndreAvslutningRequest = {
        aarsak:
          skalViseAarsak && aarsak.aarsak
            ? {
                type: aarsak.aarsak,
                beskrivelse: nyArsakBeskrivelse
              }
            : null,
        harDeltatt: harDeltatt,
        harFullfort: avslutningstype === Avslutningstype.FULLFORT,
        begrunnelse: begrunnelse.begrunnelse || null,
        forslagId: forslag ? forslag.id : null
      }

      validerDeltakerKanEndres(pamelding)
      if (!harStatusSomKanEndreAvslutning(pamelding.status.type)) {
        throw new Error(
          'Kan ikke endre avslutning for deltaker som ikke har status "Avbrutt" eller "Fullført".'
        )
      }

      const deltakerErEndret =
        (pamelding.status.type === DeltakerStatusType.FULLFORT &&
          avslutningstype !== Avslutningstype.FULLFORT) ||
        (pamelding.status.type === DeltakerStatusType.AVBRUTT &&
          avslutningstype !== Avslutningstype.AVBRUTT) ||
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
      endringstype={EndreDeltakelseType.ENDRE_AVSLUTNING}
      deltaker={pamelding}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreAvslutning}
      validertRequest={validertRequest}
      forslag={forslag}
    >
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
          {harDeltattMindreEnn15Dager(pamelding, forslag) && (
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

      <BegrunnelseInput
        type="valgfri"
        onChange={begrunnelse.handleChange}
        error={begrunnelse.error}
        disabled={false}
      />
    </Endringsmodal>
  )
}

function isEndreAvslutningForslag(
  endring: ForslagEndring
): endring is EndreAvslutningForslag {
  return endring.type === ForslagEndringType.EndreAvslutning
}

const harDeltattMindreEnn15Dager = (
  pamelding: PameldingResponse,
  forslag: Forslag | null
) => {
  if (getHarDeltatt(forslag) !== null) {
    return true
  }

  if (!pamelding.startdato || !pamelding.sluttdato) {
    return false
  }

  return dayjs(pamelding.startdato)
    .add(15, 'days')
    .isAfter(pamelding.sluttdato, 'day')
}

function getHarDeltatt(forslag: Forslag | null): boolean | null {
  if (forslag && isEndreAvslutningForslag(forslag.endring)) {
    return forslag.endring.harDeltatt
  }
  return null
}

function getHarFullfort(forslag: Forslag | null): boolean | null | undefined {
  if (forslag && isEndreAvslutningForslag(forslag.endring)) {
    return forslag.endring.harFullfort
  }
  return null
}

const harStatusSomKanEndreAvslutning = (statusType: DeltakerStatusType) =>
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
  }
}
