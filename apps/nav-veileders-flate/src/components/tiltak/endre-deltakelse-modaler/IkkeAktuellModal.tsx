import { Radio, RadioGroup, Textarea } from '@navikt/ds-react'
import {
  AktivtForslag,
  DeltakerStatusAarsakType,
  EndreDeltakelseType,
  ForslagEndringType,
  getDeltakerStatusAarsak
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseIkkeAktuell } from '../../../api/api.ts'
import {
  BESKRIVELSE_ARSAK_ANNET_MAX_TEGN,
  IkkeAktuellRequest
} from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { getDeltakerStatusAarsakTypeText } from '../../../utils/displayText.ts'
import { getDeltakerStatusAarsakTyperAsList } from '../../../utils/utils.ts'
import { BEGRUNNELSE_MAKS_TEGN } from '../../../model/PameldingFormValues.ts'
import { Endringsmodal } from '../../modal/Endringsmodal.tsx'

interface IkkeAktuellModalProps {
  pamelding: PameldingResponse
  forslag: AktivtForslag | null
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

const getSluttaarsakFraForslag = (forslag: AktivtForslag | null) => {
  if (forslag && forslag.endring.type === ForslagEndringType.IkkeAktuell) {
    return forslag.endring.aarsak
  } else {
    return null
  }
}

export const IkkeAktuellModal = ({
  pamelding,
  forslag,
  open,
  onClose,
  onSuccess
}: IkkeAktuellModalProps) => {
  const sluttaarsakFraForslag = getSluttaarsakFraForslag(forslag)
  const initValgtArsak = sluttaarsakFraForslag
    ? getDeltakerStatusAarsak(sluttaarsakFraForslag)
    : null
  const [valgtArsak, setValgtArsak] = useState<DeltakerStatusAarsakType | null>(
    initValgtArsak ?? null
  )
  const [beskrivelse, setBeskrivelse] = useState<string | null>(null)
  const [errorAarsak, setErrorAarsak] = useState<boolean>(false)
  const [errorAarsakAnnet, setErrorAarsakAnnet] = useState<boolean>(false)

  const [begrunnelse, setBegrunnelse] = useState<string | null>()
  const [errorBegrunnelse, setErrorBegrunnelse] = useState<string | null>(null)

  const aarsakErAnnet = valgtArsak === DeltakerStatusAarsakType.ANNET
  const harAnnetBeskrivelse = beskrivelse && beskrivelse.length > 0
  const harForLangAnnetBeskrivelse =
    harAnnetBeskrivelse && beskrivelse.length > BESKRIVELSE_ARSAK_ANNET_MAX_TEGN
  const harForLangBegrunnelse =
    begrunnelse && begrunnelse.length > BEGRUNNELSE_MAKS_TEGN
  const { enhetId } = useAppContext()

  const validertRequest = () => {
    let hasError = false
    if (!valgtArsak) {
      setErrorAarsak(true)
      hasError = true
    }

    if (aarsakErAnnet && (!harAnnetBeskrivelse || harForLangAnnetBeskrivelse)) {
      setErrorAarsakAnnet(true)
      hasError = true
    }

    if (harForLangBegrunnelse) {
      setErrorBegrunnelse(
        `Begrunnelsen kan ikke være mer enn ${BEGRUNNELSE_MAKS_TEGN} tegn`
      )
      hasError = true
    }
    if (!hasError && valgtArsak !== null) {
      const endring: IkkeAktuellRequest = {
        aarsak: {
          type: valgtArsak!,
          beskrivelse: aarsakErAnnet ? beskrivelse : null
        },
        begrunnelse: begrunnelse || null,
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
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseIkkeAktuell}
      validertRequest={validertRequest}
      forslag={forslag}
    >
      <RadioGroup
        className="mt-6"
        legend="Hva er årsaken til at deltakeren ikke er aktuell?"
        size="small"
        error={errorAarsak && 'Du må velge en årsak før du kan fortsette.'}
        onChange={(value: DeltakerStatusAarsakType) => {
          setValgtArsak(value)
          setErrorAarsak(false)
          setErrorAarsakAnnet(false)
        }}
        value={valgtArsak}
      >
        <>
          {getDeltakerStatusAarsakTyperAsList().map((arsakType) => (
            <Radio value={arsakType} key={arsakType}>
              {getDeltakerStatusAarsakTypeText(arsakType)}
            </Radio>
          ))}
          {valgtArsak === DeltakerStatusAarsakType.ANNET && (
            <Textarea
              onChange={(e) => {
                setBeskrivelse(e.target.value)
                setErrorAarsakAnnet(false)
              }}
              value={beskrivelse ?? ''}
              minRows={1}
              rows={1}
              size="small"
              label={null}
              error={
                (errorAarsakAnnet &&
                  !harForLangAnnetBeskrivelse &&
                  'Du må fylle ut for årsak "annet" før du kan fortsette.') ||
                (harForLangAnnetBeskrivelse &&
                  `Beskrivelsen kan ikke være mer enn ${BESKRIVELSE_ARSAK_ANNET_MAX_TEGN} tegn`)
              }
              maxLength={BESKRIVELSE_ARSAK_ANNET_MAX_TEGN}
              aria-label={'Beskrivelse for Annet'}
            />
          )}
        </>
      </RadioGroup>
      <Textarea
        onChange={(e) => {
          setBegrunnelse(e.target.value)
          setErrorBegrunnelse(null)
        }}
        error={errorBegrunnelse}
        className="mt-6"
        label="Begrunnelse for at deltakeren ikke er aktuell (valgfri)"
        description="Beskriv kort hvorfor endringen er riktig for personen."
        value={begrunnelse ?? ''}
        maxLength={BEGRUNNELSE_MAKS_TEGN}
        id="begrunnelse"
        size="small"
        aria-label={'Begrunnelse'}
      />
    </Endringsmodal>
  )
}
