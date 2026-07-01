import { BodyShort, ConfirmationPanel } from '@navikt/ds-react'
import dayjs from 'dayjs'
import {
  BegrunnelseInput,
  DeltakerStatusType,
  EndreDeltakelseType,
  Forslag,
  ForslagEndringType,
  getDeltakerStatusDisplayText,
  useBegrunnelse
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseForleng } from '../../../api/api.ts'
import { DeltakerResponse } from '../../../api/data/deltaker.ts'
import { getFeilmeldingIngenEndring } from '../../../utils/displayText.ts'
import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'
import { useSluttdato } from '../../../utils/use-sluttdato.ts'
import { formatDateToDtoStr, formatDateToString } from '../../../utils/utils.ts'
import {
  finnValgtVarighetForTiltakskode,
  getSisteGyldigeSluttDato,
  getSkalBekrefteVarighet,
  getSoftMaxVarighetBekreftelseText,
  VARIGHET_BEKREFTELSE_FEILMELDING,
  VarighetValg
} from '../../../utils/varighet.tsx'
import { VarighetField } from '../VarighetField.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'

interface ForlengDeltakelseModalProps {
  deltaker: DeltakerResponse
  forslag: Forslag | null
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertDeltaker: DeltakerResponse | null) => void
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
  deltaker,
  forslag,
  open,
  onClose,
  onSuccess
}: ForlengDeltakelseModalProps) => {
  const sluttdatoFraDeltaker = deltaker.sluttdato
  const sluttdatoFraForslag = getSluttdatoFraForslag(forslag)

  const [valgtVarighet, setValgtVarighet] = useState<VarighetValg | undefined>(
    finnValgtVarighetForTiltakskode(
      sluttdatoFraDeltaker,
      sluttdatoFraForslag,
      deltaker.deltakerliste.tiltakskode
    )
  )
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const sluttdato = useSluttdato({
    deltaker: deltaker,
    valgtVarighet: valgtVarighet,
    defaultAnnetDato: sluttdatoFraForslag || deltaker.sluttdato || undefined,
    erForleng: true
  })

  const skalHaBegrunnelse =
    !sluttdatoFraForslag ||
    sluttdatoFraForslag?.getTime() !== sluttdato.sluttdato?.getTime()

  const begrunnelse = useBegrunnelse(!skalHaBegrunnelse)

  const tiltakskode = deltaker.deltakerliste.tiltakskode
  const { enhetId } = useAppContext()

  const skalBekrefteVarighet =
    sluttdato.sluttdato &&
    getSkalBekrefteVarighet(deltaker, sluttdato.sluttdato)

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
      validerDeltakerKanEndres(deltaker)
      if (!harStatusSomKanForlengeDeltakelse(deltaker.status.type)) {
        throw new Error(
          `Kan ikke forlenge deltakelse for deltaker med status ${getDeltakerStatusDisplayText(deltaker.status.type)}.`
        )
      }
      if (dayjs(sluttdato.sluttdato).isSame(deltaker.sluttdato, 'day')) {
        throw new Error(getFeilmeldingIngenEndring(forslag !== null))
      }

      return {
        deltakerId: deltaker.deltakerId,
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
      deltaker={deltaker}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseForleng}
      validertRequest={validertRequest}
      forslag={forslag}
    >
      <VarighetField
        title="Hvor lenge skal deltakelsen forlenges?"
        tiltakskode={deltaker.deltakerliste.tiltakskode}
        startDato={sluttdatoFraDeltaker || undefined}
        sluttdato={getSisteGyldigeSluttDato(deltaker) || undefined}
        errorVarighet={sluttdato.varighetError}
        errorSluttDato={sluttdato.annetError}
        defaultVarighet={valgtVarighet}
        defaultAnnetDato={sluttdatoFraForslag || deltaker.sluttdato}
        onChangeVarighet={handleChangeVarighet}
        onChangeSluttDato={sluttdato.handleChange}
        onValidateSluttDato={sluttdato.validerDato}
        disabled={!deltaker.erUnderOppfolging}
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
          {getSoftMaxVarighetBekreftelseText(tiltakskode)}
        </ConfirmationPanel>
      )}
      <BegrunnelseInput
        type={skalHaBegrunnelse ? 'obligatorisk' : 'valgfri'}
        onChange={begrunnelse.handleChange}
        error={begrunnelse.error}
        disabled={!deltaker.erUnderOppfolging}
      />
    </Endringsmodal>
  )
}

const harStatusSomKanForlengeDeltakelse = (statusType: DeltakerStatusType) =>
  statusType === DeltakerStatusType.DELTAR ||
  statusType === DeltakerStatusType.HAR_SLUTTET ||
  statusType === DeltakerStatusType.FULLFORT ||
  statusType === DeltakerStatusType.AVBRUTT
