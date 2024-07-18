import { BodyShort, ConfirmationPanel } from '@navikt/ds-react'
import { EndreDeltakelseType, getDateFromString } from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseForleng } from '../../../api/api.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import {
  dateStrToNullableDate,
  formatDateToDateInputStr,
  formatDateToString
} from '../../../utils/utils.ts'
import {
  getSisteGyldigeSluttDato,
  getSkalBekrefteVarighet,
  getSoftMaxVarighetBekreftelseText,
  useSluttdato,
  VARIGHET_BEKREFTELSE_FEILMELDING,
  VarighetValg
} from '../../../utils/varighet.tsx'
import { VarighetField } from '../VarighetField.tsx'
import { AktivtForslag, ForslagEndringType } from 'deltaker-flate-common'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { BegrunnelseInput, useBegrunnelse } from '../modal/BegrunnelseInput.tsx'

interface ForlengDeltakelseModalProps {
  pamelding: PameldingResponse
  forslag: AktivtForslag | null
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

const getSluttdatoFraForslag = (forslag: AktivtForslag | null) => {
  if (
    forslag &&
    forslag.endring.type === ForslagEndringType.ForlengDeltakelse
  ) {
    return forslag.endring.sluttdato
  } else {
    return null
  }
}

export const ForlengDeltakelseModal = ({
  pamelding,
  forslag,
  open,
  onClose,
  onSuccess
}: ForlengDeltakelseModalProps) => {
  const sluttdatoFraForslag = getSluttdatoFraForslag(forslag)
  const sluttdatoFraDeltaker = dateStrToNullableDate(pamelding.sluttdato)

  const [valgtVarighet, setValgtVarighet] = useState<VarighetValg | undefined>(
    forslag ? VarighetValg.ANNET : undefined
  )
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const sluttdato = useSluttdato(pamelding, valgtVarighet)

  const skalHaBegrunnelse =
    !sluttdatoFraForslag ||
    getDateFromString(sluttdatoFraForslag)?.getTime() !==
      sluttdato.sluttdato?.getTime()

  const begrunnelse = useBegrunnelse(!skalHaBegrunnelse)

  const tiltakstype = pamelding.deltakerliste.tiltakstype
  const { enhetId } = useAppContext()

  const skalBekrefteVarighet =
    sluttdato.sluttdato &&
    getSkalBekrefteVarighet(pamelding, sluttdato.sluttdato)

  const validertRequest = () => {
    let hasError = false
    if (skalBekrefteVarighet && !varighetBekreftelse) {
      setErrorVarighetConfirmation(VARIGHET_BEKREFTELSE_FEILMELDING)
      hasError = true
    }

    if (!sluttdato.valider()) {
      hasError = true
    }

    if (!begrunnelse.valider()) {
      hasError = true
    }

    if (!hasError && sluttdato.sluttdato) {
      return {
        deltakerId: pamelding.deltakerId,
        enhetId,
        body: {
          sluttdato: formatDateToDateInputStr(sluttdato.sluttdato),
          begrunnelse: begrunnelse.begrunnelse || null,
          forslagId: forslag ? forslag.id : null
        }
      }
    }
    return null
  }

  const handleChangeVarighet = (valg: VarighetValg) => {
    setValgtVarighet(valg)
  }

  return (
    <Endringsmodal
      open={open}
      endringstype={EndreDeltakelseType.FORLENG_DELTAKELSE}
      digitalBruker={pamelding.digitalBruker}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseForleng}
      validertRequest={validertRequest}
      forslag={forslag}
    >
      <VarighetField
        title="Hvor lenge skal deltakelsen forlenges?"
        tiltakstype={pamelding.deltakerliste.tiltakstype}
        startDato={sluttdatoFraDeltaker || undefined}
        sluttdato={getSisteGyldigeSluttDato(pamelding) || undefined}
        errorVarighet={sluttdato.error}
        errorSluttDato={null}
        defaultVarighet={forslag ? VarighetValg.ANNET : null}
        defaultSelectedDate={sluttdato.sluttdato}
        onChangeVarighet={handleChangeVarighet}
        onChangeSluttDato={sluttdato.handleChange}
        onValidateSluttDato={sluttdato.validerDato}
      />
      {sluttdato.sluttdato && (
        <BodyShort className="mt-2" size="small">
          Ny sluttdato: {formatDateToString(sluttdato.sluttdato)}
        </BodyShort>
      )}
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
          {getSoftMaxVarighetBekreftelseText(tiltakstype)}
        </ConfirmationPanel>
      )}
      <BegrunnelseInput
        type={skalHaBegrunnelse ? 'obligatorisk' : 'valgfri'}
        onChange={begrunnelse.handleChange}
        error={begrunnelse.error}
      />
    </Endringsmodal>
  )
}
