import {
  DeltakerStatusType,
  EndreDeltakelseType,
  Forslag
} from 'deltaker-flate-common'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseSluttarsak } from '../../../api/api.ts'
import { EndreSluttarsakRequest } from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { getFeilmeldingIngenEndring } from '../../../utils/displayText.ts'
import { AarsakRadioGroup, useAarsak } from '../modal/AarsakRadioGroup.tsx'
import { BegrunnelseInput, useBegrunnelse } from '../modal/BegrunnelseInput.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'

interface EndreSluttarsakModalProps {
  pamelding: PameldingResponse
  open: boolean
  forslag: Forslag | null
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

const sluttarsakSporsmalTekst = (statustype: DeltakerStatusType) => {
  if (statustype === DeltakerStatusType.IKKE_AKTUELL) {
    return 'Hva er årsaken til at deltakeren ikke er aktuell?'
  } else {
    return 'Hva er årsaken til avslutning?'
  }
}

export const EndreSluttarsakModal = ({
  pamelding,
  open,
  forslag,
  onClose,
  onSuccess
}: EndreSluttarsakModalProps) => {
  const aarsak = useAarsak(forslag)
  const begrunnelse = useBegrunnelse(true)
  const { enhetId } = useAppContext()

  const validertRequest = () => {
    if (
      begrunnelse.valider() &&
      aarsak.valider() &&
      aarsak.aarsak !== undefined
    ) {
      validerDeltakerKanEndres(pamelding)
      const nyArsakBeskrivelse = aarsak.beskrivelse ?? null
      if (
        aarsak.aarsak === pamelding.status.aarsak?.type &&
        nyArsakBeskrivelse === pamelding.status.aarsak.beskrivelse
      ) {
        throw new Error(getFeilmeldingIngenEndring(forslag !== null))
      }
      if (!harStatusSomKanEndreSluttarsak(pamelding.status.type)) {
        throw new Error(
          'Kan ikke endre sluttårsak for deltaker som ikke har sluttet eller er ikke aktuell.'
        )
      }

      const endring: EndreSluttarsakRequest = {
        aarsak: {
          type: aarsak.aarsak,
          beskrivelse: nyArsakBeskrivelse
        },
        begrunnelse: begrunnelse.begrunnelse,
        forslagId: forslag?.id
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
      endringstype={EndreDeltakelseType.ENDRE_SLUTTARSAK}
      digitalBruker={pamelding.digitalBruker}
      harAdresse={pamelding.harAdresse}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseSluttarsak}
      validertRequest={validertRequest}
      forslag={forslag}
      erUnderOppfolging={pamelding.erUnderOppfolging}
    >
      <AarsakRadioGroup
        legend={sluttarsakSporsmalTekst(pamelding.status.type)}
        aarsak={aarsak.aarsak}
        aarsakError={aarsak.aarsakError}
        beskrivelse={aarsak.beskrivelse}
        beskrivelseError={aarsak.beskrivelseError}
        onChange={aarsak.handleChange}
        onBeskrivelse={aarsak.handleBeskrivelse}
        disabled={!pamelding.erUnderOppfolging}
      />
      <BegrunnelseInput
        type="valgfri"
        onChange={begrunnelse.handleChange}
        error={begrunnelse.error}
        disabled={!pamelding.erUnderOppfolging}
      />
    </Endringsmodal>
  )
}

const harStatusSomKanEndreSluttarsak = (statusType: DeltakerStatusType) =>
  statusType === DeltakerStatusType.HAR_SLUTTET ||
  statusType === DeltakerStatusType.IKKE_AKTUELL
