import {
  DeltakerStatusType,
  EndreDeltakelseType,
  Forslag
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
    if (pamelding.status.type === DeltakerStatusType.IKKE_AKTUELL) {
      return null
    }
    if (
      aarsak.valider() &&
      begrunnelse.valider() &&
      aarsak.aarsak !== undefined
    ) {
      if (
        pamelding.status.type === DeltakerStatusType.DELTAR &&
        forslag &&
        harDeltattFemtenDagerEllerMer(pamelding)
      ) {
        throw new Error(FEILMELDING_15_DAGER_SIDEN)
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
    >
      <AarsakRadioGroup
        legend="Hva er årsaken til at deltakeren ikke er aktuell?"
        aarsak={aarsak.aarsak}
        aarsakError={aarsak.aarsakError}
        beskrivelse={aarsak.beskrivelse}
        beskrivelseError={aarsak.beskrivelseError}
        onChange={aarsak.handleChange}
        onBeskrivelse={aarsak.handleBeskrivelse}
      />
      <BegrunnelseInput
        type="valgfri"
        onChange={begrunnelse.handleChange}
        error={begrunnelse.error}
      />
    </Endringsmodal>
  )
}

const harDeltattFemtenDagerEllerMer = (pamelding: PameldingResponse) => {
  const statusdato = pamelding.status.gyldigFra
  const femtenDagerSiden = dayjs().subtract(15, 'days')
  return dayjs(statusdato).isSameOrBefore(femtenDagerSiden, 'day')
}
