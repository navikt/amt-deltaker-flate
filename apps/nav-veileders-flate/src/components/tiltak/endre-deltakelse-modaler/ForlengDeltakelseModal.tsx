import { BodyShort, ConfirmationPanel } from '@navikt/ds-react'
import dayjs from 'dayjs'
import {
  BegrunnelseInput,
  DeltakerStatusType,
  EndreDeltakelseType,
  Forslag,
  ForslagEndringType,
  getDateFromString,
  getDeltakerStatusDisplayText,
  useBegrunnelse
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseForleng } from '../../../api/api.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { getFeilmeldingIngenEndring } from '../../../utils/displayText.ts'
import { useSluttdato } from '../../../utils/use-sluttdato.ts'
import {
  dateStrToNullableDate,
  formatDateToDtoStr,
  formatDateToString
} from '../../../utils/utils.ts'
import {
  finnValgtVarighet,
  getSisteGyldigeSluttDato,
  getSkalBekrefteVarighet,
  getSoftMaxVarighetBekreftelseText,
  VARIGHET_BEKREFTELSE_FEILMELDING,
  VarighetValg
} from '../../../utils/varighet.tsx'
import { VarighetField } from '../VarighetField.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'

interface ForlengDeltakelseModalProps {
  pamelding: PameldingResponse
  forslag: Forslag | null
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

const getSluttdatoFraForslag = (forslag: Forslag | null) => {
  if (
    forslag &&
    forslag.endring.type === ForslagEndringType.ForlengDeltakelse
  ) {
    return dayjs(forslag.endring.sluttdato).toDate()
  } else {
    return undefined
  }
}

export const ForlengDeltakelseModal = ({
  pamelding,
  forslag,
  open,
  onClose,
  onSuccess
}: ForlengDeltakelseModalProps) => {
  const sluttdatoFraDeltaker = dateStrToNullableDate(pamelding.sluttdato)
  const sluttdatoFraForslag = getSluttdatoFraForslag(forslag)

  const [valgtVarighet, setValgtVarighet] = useState<VarighetValg | undefined>(
    finnValgtVarighet(
      sluttdatoFraDeltaker,
      sluttdatoFraForslag,
      pamelding.deltakerliste.tiltakstype
    )
  )
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const sluttdato = useSluttdato({
    deltaker: pamelding,
    valgtVarighet: valgtVarighet,
    defaultAnnetDato:
      sluttdatoFraForslag || getDateFromString(pamelding.sluttdato),
    erForleng: true
  })

  const skalHaBegrunnelse =
    !sluttdatoFraForslag ||
    sluttdatoFraForslag?.getTime() !== sluttdato.sluttdato?.getTime()

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
      validerDeltakerKanEndres(pamelding)
      if (!harStatusSomKanForlengeDeltakelse(pamelding.status.type)) {
        throw new Error(
          `Kan ikke forlenge deltakelse for deltaker med status ${getDeltakerStatusDisplayText(pamelding.status.type)}.`
        )
      }
      if (dayjs(sluttdato.sluttdato).isSame(pamelding.sluttdato, 'day')) {
        throw new Error(getFeilmeldingIngenEndring(forslag !== null))
      }

      return {
        deltakerId: pamelding.deltakerId,
        enhetId,
        body: {
          sluttdato: formatDateToDtoStr(sluttdato.sluttdato),
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
      deltaker={pamelding}
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
        defaultVarighet={valgtVarighet}
        defaultAnnetDato={
          sluttdatoFraForslag || getDateFromString(pamelding.sluttdato)
        }
        onChangeVarighet={handleChangeVarighet}
        onChangeSluttDato={sluttdato.handleChange}
        onValidateSluttDato={sluttdato.validerDato}
        disabled={!pamelding.erUnderOppfolging}
      />
      {sluttdato.sluttdato && valgtVarighet !== VarighetValg.ANNET && (
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
        disabled={!pamelding.erUnderOppfolging}
      />
    </Endringsmodal>
  )
}

const harStatusSomKanForlengeDeltakelse = (statusType: DeltakerStatusType) =>
  statusType === DeltakerStatusType.DELTAR ||
  statusType === DeltakerStatusType.HAR_SLUTTET ||
  statusType === DeltakerStatusType.FULLFORT ||
  statusType === DeltakerStatusType.AVBRUTT
