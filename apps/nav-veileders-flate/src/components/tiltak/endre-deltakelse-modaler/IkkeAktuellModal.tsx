import {
  DeltakerStatusType,
  EndreDeltakelseType,
  Forslag,
  getDeltakerStatusDisplayText
} from 'deltaker-flate-common'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseIkkeAktuell } from '../../../api/api.ts'
import { IkkeAktuellRequest } from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { AarsakRadioGroup, useAarsak } from '../modal/AarsakRadioGroup.tsx'
import { BegrunnelseInput, useBegrunnelse } from '../modal/BegrunnelseInput.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { FEILMELDING_15_DAGER_SIDEN } from '../../../utils/displayText.ts'
import dayjs from 'dayjs'
import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'

interface IkkeAktuellModalProps {
  pamelding: PameldingResponse
  forslag: Forslag | null
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const IkkeAktuellModal = ({
  pamelding,
  forslag,
  open,
  onClose,
  onSuccess
}: IkkeAktuellModalProps) => {
  const aarsak = useAarsak(forslag)
  const begrunnelse = useBegrunnelse(true)

  const { enhetId } = useAppContext()

  const validertRequest = () => {
    if (
      aarsak.valider() &&
      begrunnelse.valider() &&
      aarsak.aarsak !== undefined
    ) {
      validerDeltakerKanEndres(pamelding)
      if (!harStatusSomKanSetteTilIkkeAktuell(pamelding.status.type)) {
        throw new Error(
          `Kan ikke sette deltakelse til "Ikke aktuell" for deltaker med status ${getDeltakerStatusDisplayText(pamelding.status.type)}.`
        )
      }
      if (pamelding.status.type === DeltakerStatusType.DELTAR) {
        if (harDeltattFemtenDagerEllerMer(pamelding)) {
          throw new Error(FEILMELDING_15_DAGER_SIDEN)
        }
        if (!forslag) {
          throw new Error(
            'Kan bare sette deltaker som deltar til ikke aktuell hvis det foreligger et forslag.'
          )
        }
      }

      const endring: IkkeAktuellRequest = {
        aarsak: {
          type: aarsak.aarsak,
          beskrivelse: aarsak.beskrivelse ?? null
        },
        begrunnelse: begrunnelse.begrunnelse || null,
        forslagId: forslag ? forslag.id : null
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
      endringstype={EndreDeltakelseType.IKKE_AKTUELL}
      digitalBruker={pamelding.digitalBruker}
      harAdresse={pamelding.harAdresse}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseIkkeAktuell}
      validertRequest={validertRequest}
      forslag={forslag}
      erUnderOppfolging={true}
    >
      <AarsakRadioGroup
        legend="Hva er årsaken til at deltakeren ikke er aktuell?"
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

const harDeltattFemtenDagerEllerMer = (pamelding: PameldingResponse) => {
  const statusdato = pamelding.status.gyldigFra
  const femtenDagerSiden = dayjs().subtract(15, 'days')
  return dayjs(statusdato).isSameOrBefore(femtenDagerSiden, 'day')
}

const harStatusSomKanSetteTilIkkeAktuell = (statusType: DeltakerStatusType) =>
  statusType === DeltakerStatusType.VENTER_PA_OPPSTART ||
  statusType === DeltakerStatusType.DELTAR ||
  statusType === DeltakerStatusType.IKKE_AKTUELL
