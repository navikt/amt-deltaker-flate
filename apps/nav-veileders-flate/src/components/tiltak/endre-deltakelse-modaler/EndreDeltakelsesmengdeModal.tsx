import { EndreDeltakelseType } from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelsesmengde } from '../../../api/api.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { dagerPerUkeFeilmelding } from '../../../model/PameldingFormValues.ts'
import { NumberTextField } from '../../NumberTextField.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'

interface EndreDeltakelsesmengdeModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const EndreDeltakelsesmengdeModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: EndreDeltakelsesmengdeModalProps) => {
  const [deltakelsesprosent, setDeltakelsesprosent] = useState<number | null>(
    pamelding.deltakelsesprosent ?? 100
  )
  const [dagerPerUke, setDagerPerUke] = useState<number | null>(
    pamelding.dagerPerUke
  )
  const [hasErrorDeltakelsesprosent, setHasErrorDeltakelsesprosent] =
    useState<boolean>(false)
  const [hasErrorDagerPerUke, setHasErrorDagerPerUke] = useState<boolean>(false)

  const gyldigDeltakelsesprosent =
    deltakelsesprosent && 0 < deltakelsesprosent && deltakelsesprosent <= 100
  const gyldigDagerPerUke =
    !dagerPerUke || (0 < dagerPerUke && dagerPerUke <= 5)

  const { enhetId } = useAppContext()

  const validertRequest = () => {
    if (gyldigDeltakelsesprosent) {
      if (gyldigDagerPerUke) {
        return {
          deltakerId: pamelding.deltakerId,
          enhetId,
          body: {
            deltakelsesprosent: deltakelsesprosent,
            dagerPerUke:
              dagerPerUke != null && deltakelsesprosent !== 100
                ? dagerPerUke
                : undefined
          }
        }
      } else {
        setHasErrorDagerPerUke(true)
        return null
      }
    }
    setHasErrorDeltakelsesprosent(true)
    return null
  }

  return (
    <Endringsmodal
      open={open}
      endringstype={EndreDeltakelseType.ENDRE_DELTAKELSESMENGDE}
      digitalBruker={pamelding.digitalBruker}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelsesmengde}
      validertRequest={validertRequest}
      forslag={null}
    >
      <NumberTextField
        label="Hva er ny deltakelsesprosent?"
        disabled={false}
        value={deltakelsesprosent || undefined}
        onChange={(e) => {
          setDeltakelsesprosent(e || null)
          setHasErrorDeltakelsesprosent(false)
        }}
        error={
          hasErrorDeltakelsesprosent &&
          !gyldigDeltakelsesprosent &&
          'Deltakelsesprosent må være et helt tall fra 1 til 100'
        }
        required
        id="deltakelsesprosent"
        className="[&>input]:w-16 mt-4"
      />
      {deltakelsesprosent && deltakelsesprosent != 100 && (
        <NumberTextField
          label="Hvor mange dager i uka? (valgfritt)"
          disabled={false}
          value={dagerPerUke || undefined}
          onChange={(e) => {
            setDagerPerUke(e || null)
            setHasErrorDagerPerUke(false)
          }}
          error={
            hasErrorDagerPerUke && !gyldigDagerPerUke && dagerPerUkeFeilmelding
          }
          className="[&>input]:w-16 mt-4"
          id="dagerPerUke"
        />
      )}
    </Endringsmodal>
  )
}
