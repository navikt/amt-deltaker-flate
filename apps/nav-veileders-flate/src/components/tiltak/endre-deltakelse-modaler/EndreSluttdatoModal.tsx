import { ConfirmationPanel } from '@navikt/ds-react'
import {
  Forslag,
  EndreDeltakelseType,
  ForslagEndring,
  ForslagEndringType,
  SluttdatoForslag,
  getDateFromString
} from 'deltaker-flate-common'
import { useMemo, useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseSluttdato } from '../../../api/api.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import {
  dateStrToNullableDate,
  formatDateToDtoStr
} from '../../../utils/utils.ts'
import {
  VARIGHET_BEKREFTELSE_FEILMELDING,
  getSisteGyldigeSluttDato,
  getSkalBekrefteVarighet,
  getSoftMaxVarighetBekreftelseText
} from '../../../utils/varighet.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { EndreSluttdatoRequest } from '../../../api/data/endre-deltakelse-request.ts'
import { BegrunnelseInput, useBegrunnelse } from '../modal/BegrunnelseInput.tsx'
import { useSluttdatoInput } from '../../../utils/use-sluttdato.ts'
import { SimpleDatePicker } from '../SimpleDatePicker.tsx'

interface EndreSluttdatoModalProps {
  pamelding: PameldingResponse
  forslag: Forslag | null
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const EndreSluttdatoModal = ({
  pamelding,
  forslag,
  open,
  onClose,
  onSuccess
}: EndreSluttdatoModalProps) => {
  const defaultSluttdato = getSluttdato(pamelding, forslag)
  const { enhetId } = useAppContext()
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const sluttdato = useSluttdatoInput({
    deltaker: pamelding,
    defaultDato: defaultSluttdato,
    startdato: useMemo(
      () => getDateFromString(pamelding.startdato),
      [pamelding.startdato]
    )
  })

  const valgfriBegrunnelse =
    forslag !== null &&
    defaultSluttdato?.getTime() === sluttdato.sluttdato?.getTime()

  const begrunnelse = useBegrunnelse(valgfriBegrunnelse)

  const skalBekrefteVarighet =
    sluttdato.sluttdato &&
    getSkalBekrefteVarighet(pamelding, sluttdato.sluttdato)

  const validertRequest = () => {
    if (skalBekrefteVarighet && !varighetBekreftelse) {
      setErrorVarighetConfirmation(VARIGHET_BEKREFTELSE_FEILMELDING)
      return null
    }
    if (!sluttdato.error && sluttdato.sluttdato && begrunnelse.valider()) {
      const endring: EndreSluttdatoRequest = {
        sluttdato: formatDateToDtoStr(sluttdato.sluttdato),
        forslagId: forslag?.id,
        begrunnelse: begrunnelse.begrunnelse || null
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
      endringstype={EndreDeltakelseType.ENDRE_SLUTTDATO}
      digitalBruker={pamelding.digitalBruker}
      harAdresse={pamelding.harAdresse}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseSluttdato}
      validertRequest={validertRequest}
      forslag={forslag}
    >
      <SimpleDatePicker
        label="Ny sluttdato"
        error={sluttdato.error}
        fromDate={dateStrToNullableDate(pamelding.startdato) || undefined}
        toDate={getSisteGyldigeSluttDato(pamelding) || undefined}
        defaultDate={sluttdato.defaultDato}
        onValidate={sluttdato.validate}
        onChange={sluttdato.onChange}
      />
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
        type={valgfriBegrunnelse ? 'valgfri' : 'obligatorisk'}
        onChange={begrunnelse.handleChange}
        error={begrunnelse.error}
      />
    </Endringsmodal>
  )
}

function isSluttdatoForslag(
  endring: ForslagEndring
): endring is SluttdatoForslag {
  return endring.type === ForslagEndringType.Sluttdato
}

function getSluttdato(deltaker: PameldingResponse, forslag: Forslag | null) {
  if (forslag === null) {
    return getDateFromString(deltaker.sluttdato)
  }
  if (isSluttdatoForslag(forslag.endring)) {
    return forslag.endring.sluttdato
  } else {
    throw new Error(
      `Kan ikke behandle forslag av type ${forslag.endring.type} som sluttdato`
    )
  }
}
