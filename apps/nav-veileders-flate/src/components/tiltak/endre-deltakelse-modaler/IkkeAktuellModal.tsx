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
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { BegrunnelseInput, useBegrunnelse } from '../modal/BegrunnelseInput.tsx'

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

  const begrunnelse = useBegrunnelse(true)

  const aarsakErAnnet = valgtArsak === DeltakerStatusAarsakType.ANNET

  const harAnnetBeskrivelse = beskrivelse && beskrivelse.length > 0
  const harForLangAnnetBeskrivelse =
    harAnnetBeskrivelse && beskrivelse.length > BESKRIVELSE_ARSAK_ANNET_MAX_TEGN

  const { enhetId } = useAppContext()

  const validertRequest = () => {
    let hasError = false
    if (!valgtArsak) {
      setErrorAarsak(true)
      hasError = true
    }

    if (!begrunnelse.valider()) {
      hasError = true
    }

    if (aarsakErAnnet && (!harAnnetBeskrivelse || harForLangAnnetBeskrivelse)) {
      setErrorAarsakAnnet(true)
      hasError = true
    }

    if (!hasError && valgtArsak !== null) {
      const endring: IkkeAktuellRequest = {
        aarsak: {
          type: valgtArsak!,
          beskrivelse: aarsakErAnnet ? beskrivelse : null
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
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseIkkeAktuell}
      validertRequest={validertRequest}
      begrunnelse="optional"
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
      <BegrunnelseInput
        valgfri
        onChange={begrunnelse.handleChange}
        error={begrunnelse.error}
      />
    </Endringsmodal>
  )
}
