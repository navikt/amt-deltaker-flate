import { ConfirmationPanel } from '@navikt/ds-react'
import dayjs from 'dayjs'
import {
  DeltakerStatusType,
  EndreDeltakelseType,
  Forslag,
  ForslagEndring,
  ForslagEndringType,
  SluttdatoForslag,
  getDateFromString,
  getDeltakerStatusDisplayText
} from 'deltaker-flate-common'
import { useMemo, useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseSluttdato } from '../../../api/api.ts'
import { EndreSluttdatoRequest } from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { getFeilmeldingIngenEndring } from '../../../utils/displayText.ts'
import { useSluttdatoInput } from '../../../utils/use-sluttdato.ts'
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
import { SimpleDatePicker } from '../SimpleDatePicker.tsx'
import { BegrunnelseInput, useBegrunnelse } from '../modal/BegrunnelseInput.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'

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
      validerDeltakerKanEndres(pamelding)
      if (!harStatusSomKanEndreSluttdato(pamelding.status.type)) {
        throw new Error(
          `Kunne ikke lagre\nKan ikke endre sluttdato for en deltaker som står som ${getDeltakerStatusDisplayText(pamelding.status.type)}.\nDu kan avvise forslaget eller vente med å lagre til deltakeren har sluttet.`
        )
      }
      if (dayjs(sluttdato.sluttdato).isSame(pamelding.sluttdato, 'day')) {
        throw new Error(getFeilmeldingIngenEndring(forslag !== null))
      }

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
      erUnderOppfolging={pamelding.erUnderOppfolging}
    >
      <SimpleDatePicker
        label="Ny sluttdato"
        error={sluttdato.error}
        fromDate={dateStrToNullableDate(pamelding.startdato) || undefined}
        toDate={getSisteGyldigeSluttDato(pamelding) || undefined}
        defaultDate={sluttdato.defaultDato}
        onValidate={sluttdato.validate}
        onChange={sluttdato.onChange}
        disabled={!pamelding.erUnderOppfolging}
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
        disabled={!pamelding.erUnderOppfolging}
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

const harStatusSomKanEndreSluttdato = (statusType: DeltakerStatusType) =>
  statusType === DeltakerStatusType.HAR_SLUTTET ||
  statusType === DeltakerStatusType.AVBRUTT ||
  statusType === DeltakerStatusType.FULLFORT
