import {
  AarsakRadioGroup,
  BegrunnelseInput,
  DeltakerStatusType,
  EndreDeltakelseType,
  Forslag,
  getDeltakerStatusDisplayText,
  useAarsak,
  useBegrunnelse
} from 'deltaker-flate-common'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseSluttarsak } from '../../../api/api.ts'
import { EndreSluttarsakRequest } from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { getFeilmeldingIngenEndring } from '../../../utils/displayText.ts'
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
        nyArsakBeskrivelse === pamelding.status.aarsak?.beskrivelse
      ) {
        throw new Error(getFeilmeldingIngenEndring(forslag !== null))
      }
      if (!harStatusSomKanEndreSluttarsak(pamelding.status.type)) {
        throw new Error(
          `Kunne ikke lagre\nKan ikke endre sluttårsak for en deltaker som står som ${getDeltakerStatusDisplayText(pamelding.status.type)}.\nDu kan avvise forslaget eller vente med å lagre til deltakeren har sluttet.`
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
      deltaker={pamelding}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseSluttarsak}
      validertRequest={validertRequest}
      forslag={forslag}
    >
      <AarsakRadioGroup
        legend={sluttarsakSporsmalTekst(pamelding.status.type)}
        aarsak={aarsak.aarsak}
        aarsakError={aarsak.aarsakError}
        beskrivelse={aarsak.beskrivelse}
        beskrivelseError={aarsak.beskrivelseError}
        onChange={aarsak.handleChange}
        onBeskrivelse={aarsak.handleBeskrivelse}
        disabled={false}
      />
      <BegrunnelseInput
        type="valgfri"
        onChange={begrunnelse.handleChange}
        error={begrunnelse.error}
        disabled={false}
      />
    </Endringsmodal>
  )
}

const harStatusSomKanEndreSluttarsak = (statusType: DeltakerStatusType) =>
  statusType === DeltakerStatusType.HAR_SLUTTET ||
  statusType === DeltakerStatusType.IKKE_AKTUELL
