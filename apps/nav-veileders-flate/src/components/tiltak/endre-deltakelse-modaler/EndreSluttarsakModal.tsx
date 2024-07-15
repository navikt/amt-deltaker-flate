import { Modal, Radio, RadioGroup, Textarea } from '@navikt/ds-react'
import {
  DeferredFetchState,
  DeltakerStatusAarsakType,
  DeltakerStatusType,
  EndreDeltakelseType,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseSluttarsak } from '../../../api/api.ts'
import {
  BESKRIVELSE_ARSAK_ANNET_MAX_TEGN,
  EndreSluttarsakRequest
} from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { ErrorPage } from '../../../pages/ErrorPage.tsx'
import { getDeltakerStatusAarsakTypeText } from '../../../utils/displayText.ts'
import { getDeltakerStatusAarsakTyperAsList } from '../../../utils/utils.ts'
import { ModalFooter } from '../../ModalFooter.tsx'
import { EndringTypeIkon } from 'deltaker-flate-common'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { AarsakRadioGroup, useAarsak } from '../modal/AarsakRadioGroup.tsx'

interface EndreSluttarsakModalProps {
  pamelding: PameldingResponse
  open: boolean
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
  onClose,
  onSuccess
}: EndreSluttarsakModalProps) => {
  const aarsak = useAarsak(null)
  const { enhetId } = useAppContext()

  const validertRequest = () => {
    if (aarsak.valider() && aarsak.aarsak !== undefined) {
      const endring: EndreSluttarsakRequest = {
        aarsak: {
          type: aarsak.aarsak,
          beskrivelse: aarsak.beskrivelse ?? null
        }
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
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseSluttarsak}
      validertRequest={validertRequest}
      forslag={null}
    >
      <AarsakRadioGroup
        legend={sluttarsakSporsmalTekst(pamelding.status.type)}
        aarsak={aarsak.aarsak}
        aarsakError={aarsak.aarsakError}
        beskrivelse={aarsak.beskrivelse}
        beskrivelseError={aarsak.beskrivelseError}
        onChange={aarsak.handleChange}
        onBeskrivelse={aarsak.handleBeskrivelse}
      />
    </Endringsmodal>
  )
}
