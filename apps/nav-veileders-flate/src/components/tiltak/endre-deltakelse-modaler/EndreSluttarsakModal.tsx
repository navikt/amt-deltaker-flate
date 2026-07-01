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
import { DeltakerResponse } from '../../../api/data/deltaker.ts'
import { getFeilmeldingIngenEndring } from '../../../utils/displayText.ts'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'

interface EndreSluttarsakModalProps {
  deltaker: DeltakerResponse
  open: boolean
  forslag: Forslag | null
  onClose: () => void
  onSuccess: (oppdatertDeltaker: DeltakerResponse | null) => void
}

const sluttarsakSporsmalTekst = (statustype: DeltakerStatusType) => {
  if (statustype === DeltakerStatusType.IKKE_AKTUELL) {
    return 'Hva er årsaken til at deltakeren ikke er aktuell?'
  } else {
    return 'Hva er årsaken til avslutning?'
  }
}

export const EndreSluttarsakModal = ({
  deltaker,
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
      validerDeltakerKanEndres(deltaker)
      const nyArsakBeskrivelse = aarsak.beskrivelse ?? null
      if (
        aarsak.aarsak === deltaker.status.aarsak?.type &&
        nyArsakBeskrivelse === deltaker.status.aarsak?.beskrivelse
      ) {
        throw new Error(getFeilmeldingIngenEndring(forslag !== null))
      }
      if (!harStatusSomKanEndreSluttarsak(deltaker.status.type)) {
        throw new Error(
          `Kunne ikke lagre\nKan ikke endre sluttårsak for en deltaker som står som ${getDeltakerStatusDisplayText(deltaker.status.type)}.\nDu kan avvise forslaget eller vente med å lagre til deltakeren har sluttet.`
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
        deltakerId: deltaker.deltakerId,
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
      deltaker={deltaker}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseSluttarsak}
      validertRequest={validertRequest}
      forslag={forslag}
    >
      <AarsakRadioGroup
        legend={sluttarsakSporsmalTekst(deltaker.status.type)}
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
  statusType === DeltakerStatusType.IKKE_AKTUELL ||
  statusType === DeltakerStatusType.AVBRUTT
