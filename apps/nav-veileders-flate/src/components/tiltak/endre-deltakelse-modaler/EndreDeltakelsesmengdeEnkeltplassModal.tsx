import {
  BegrunnelseInput,
  EndreDeltakelseType,
  useBegrunnelse
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelsesmengde } from '../../../api/api.ts'
import { EndreDeltakelsesmengdeRequest } from '../../../api/data/endre-deltakelse-request.ts'
import { getDagerPerUkeError } from '../../../utils/deltakelsesmengdeValidering.ts'
import { getFeilmeldingIngenEndring } from '../../../utils/displayText.ts'
import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'
import {
  EndrePrisValg,
  EndrePrisValgType,
  useEndrePrisValg
} from '../EndrePrisValg.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import {
  EndreDeltakelsesmengdeModalProps,
  getMengde,
  harEndringSidenSisteDeltakelsesmengde,
  lagFellesDeltakelsesmengdeBodyFelter
} from './EndreDeltakelsesmengdeFelles.ts'
import {
  DagerPerUkeField,
  GyldigFraField
} from './EndreDeltakelsesmengdeFelter.tsx'

export const EndreDeltakelsesmengdeEnkeltplassModal = ({
  deltaker,
  open,
  forslag,
  onClose,
  onSuccess
}: EndreDeltakelsesmengdeModalProps) => {
  const defaultMengde = getMengde(deltaker, forslag)
  const { enhetId } = useAppContext()

  const endrePrisValg = useEndrePrisValg()
  const [dagerPerUke, setDagerPerUke] = useState<number | null>(
    defaultMengde.dagerPerUke
  )
  const [gyldigFra, setGyldigFra] = useState<Date | undefined>(
    defaultMengde.gyldigFra
  )

  const [dagerPerUkeError, setDagerPerUkeError] = useState<string>()
  const [gyldigFraError, setGyldigFraError] = useState<string>()

  const erBegrunnelseValgfri =
    forslag !== null && defaultMengde.dagerPerUke === dagerPerUke

  const begrunnelse = useBegrunnelse(erBegrunnelseValgfri)

  const validerDagerPerUke = (antallDagerPerUke: number | null) => {
    const errorDager = getDagerPerUkeError({
      deltakelsesprosent: null,
      dagerPerUke: antallDagerPerUke,
      maxDagerPerUke: 7
    })
    setDagerPerUkeError(errorDager)
    return !errorDager
  }

  const validertRequest = () => {
    if (
      dagerPerUkeError ||
      gyldigFraError ||
      !validerDagerPerUke(dagerPerUke)
    ) {
      return null
    }

    if (!begrunnelse.valider()) {
      return null
    }

    if (gyldigFra === undefined) {
      return null
    }

    if (!endrePrisValg.valider()) {
      return null
    }

    if (
      !harEndringSidenSisteDeltakelsesmengde(
        deltaker,
        gyldigFra,
        (siste) => dagerPerUke !== siste.dagerPerUke
      )
    ) {
      throw new Error(getFeilmeldingIngenEndring(forslag !== null))
    }

    validerDeltakerKanEndres(deltaker)

    const body: EndreDeltakelsesmengdeRequest = {
      deltakelsesprosent: undefined,
      dagerPerUke: dagerPerUke ?? undefined,
      ...lagFellesDeltakelsesmengdeBodyFelter(
        gyldigFra,
        begrunnelse.begrunnelse,
        forslag?.id
      ),
      pavirkerPris: endrePrisValg.endrePrisValg === EndrePrisValgType.JA
    }

    return {
      deltakerId: deltaker.deltakerId,
      enhetId,
      body
    }
  }

  return (
    <Endringsmodal
      open={open}
      endringstype={EndreDeltakelseType.ENDRE_DELTAKELSESMENGDE}
      deltaker={deltaker}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelsesmengde}
      validertRequest={validertRequest}
      forslag={forslag}
    >
      <DagerPerUkeField
        label="Antall dager i uka som personen deltar (valgfritt)"
        description="Fyll ut hvis personen skal søke om tiltakspenger eller tilleggsstønader"
        dagerPerUke={dagerPerUke}
        dagerPerUkeError={dagerPerUkeError}
        disabled={!deltaker.erUnderOppfolging}
        onChange={(e) => {
          setDagerPerUke(e ?? null)
          validerDagerPerUke(e ?? null)
        }}
      />
      <GyldigFraField
        deltaker={deltaker}
        gyldigFra={gyldigFra}
        gyldigFraError={gyldigFraError}
        onValidate={setGyldigFraError}
        onChange={setGyldigFra}
      />
      <BegrunnelseInput
        onChange={begrunnelse.handleChange}
        type={erBegrunnelseValgfri ? 'valgfri' : 'obligatorisk'}
        error={begrunnelse.error}
        disabled={!deltaker.erUnderOppfolging}
      />

      <EndrePrisValg
        value={endrePrisValg.endrePrisValg}
        onChange={endrePrisValg.handleChange}
        error={endrePrisValg.error}
        className="mt-8"
      />
    </Endringsmodal>
  )
}
