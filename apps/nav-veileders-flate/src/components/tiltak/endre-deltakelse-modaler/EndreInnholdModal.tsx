import {
  BodyLong,
  Checkbox,
  CheckboxGroup,
  Detail,
  Textarea
} from '@navikt/ds-react'
import { EndreDeltakelseType, INNHOLD_TYPE_ANNET } from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext'
import { endreDeltakelseInnhold } from '../../../api/api'
import { PameldingResponse } from '../../../api/data/pamelding'
import {
  BESKRIVELSE_ANNET_MAX_TEGN,
  generateValgtInnholdKoder
} from '../../../model/PameldingFormValues'
import { generateInnholdFromResponse } from '../../../utils/pamelding-form-utils'
import { getEndrePameldingTekst } from '../../../utils/displayText.ts'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { EndreInnholdRequest } from '../../../api/data/endre-deltakelse-request.ts'

interface EndreInnholdModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const EndreInnholdModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: EndreInnholdModalProps) => {
  const innhold = pamelding.deltakelsesinnhold?.innhold ?? []
  const [valgteInnhold, setValgteInnhold] = useState<string[] | []>(
    generateValgtInnholdKoder(pamelding)
  )
  const [hasError, setHasError] = useState<boolean>(false)
  const { enhetId } = useAppContext()

  const [annetBeskrivelse, setAnnetBeskrivelse] = useState<
    string | null | undefined
  >(
    innhold
      .filter((i) => i.valgt)
      .find((i) => i.innholdskode === INNHOLD_TYPE_ANNET)?.beskrivelse
  )
  const harAnnetBeskrivelse = annetBeskrivelse && annetBeskrivelse.length > 0
  const erAnnetValgt =
    valgteInnhold.find((vi) => vi === INNHOLD_TYPE_ANNET) !== undefined

  const validertRequest = () => {
    const innholdFromResponse = generateInnholdFromResponse(
      pamelding,
      valgteInnhold,
      annetBeskrivelse
    )
    if (
      valgteInnhold.length > 0 &&
      (!erAnnetValgt || (erAnnetValgt && harAnnetBeskrivelse))
    ) {
      const endring: EndreInnholdRequest = {
        innhold: innholdFromResponse
      }
      return {
        deltakerId: pamelding.deltakerId,
        enhetId,
        body: endring
      }
    } else {
      setHasError(true)
      return null
    }
  }

  return (
    <Endringsmodal
      open={open}
      endringstype={EndreDeltakelseType.ENDRE_INNHOLD}
      digitalBruker={pamelding.digitalBruker}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseInnhold}
      validertRequest={validertRequest}
      forslag={null}
    >
      <section>
        <BodyLong size="small" className="mt-6">
          {pamelding.deltakelsesinnhold?.ledetekst ?? ''}
        </BodyLong>
      </section>

      <section className="mt-4">
        {innhold.length > 0 && (
          <CheckboxGroup
            defaultValue={valgteInnhold}
            legend="Hva mer skal tiltaket inneholde?"
            error={
              hasError &&
              !erAnnetValgt &&
              'Du må velge innhold før du kan fortsette.'
            }
            size="small"
            aria-required
            id="endreValgteInnhold"
            onChange={(value: string[]) => {
              setValgteInnhold(value)
              setHasError(false)
            }}
          >
            {pamelding.deltakerliste.tilgjengeligInnhold.map((e) => (
              <div key={e.innholdskode}>
                <Checkbox value={e.innholdskode}>{e.tekst}</Checkbox>
                {e.innholdskode === INNHOLD_TYPE_ANNET && erAnnetValgt && (
                  <Textarea
                    onChange={(e) => {
                      setAnnetBeskrivelse(e.target.value)
                      setHasError(false)
                    }}
                    label={null}
                    value={annetBeskrivelse ?? ''}
                    aria-label={'Beskrivelse av innhold "Annet"'}
                    aria-required
                    maxLength={BESKRIVELSE_ANNET_MAX_TEGN}
                    size="small"
                    id="innholdAnnetBeskrivelse"
                    error={
                      hasError &&
                      erAnnetValgt &&
                      'Du må fylle ut for beskrivelse for "annet" før du kan fortsette.'
                    }
                  />
                )}
              </div>
            ))}
          </CheckboxGroup>
        )}
      </section>
    </Endringsmodal>
  )
}
