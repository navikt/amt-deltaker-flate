import { BodyLong, Modal, Radio, RadioGroup, Textarea } from '@navikt/ds-react'
import { useState } from 'react'
import { AvbrytUtkastRequest } from '../../api/data/avbryt-utkast-request.ts'
import { DeltakerStatusAarsakType } from '../../api/data/pamelding'
import { getDeltakerStatusAarsakTyperAsList } from '../../utils/utils'
import { getDeltakerStatusAarsakTypeText } from '../../utils/displayText'
import { ModalFooter } from '../ModalFooter.tsx'

interface Props {
  open: boolean
  onConfirm: (request: AvbrytUtkastRequest) => void
  onCancel: () => void
}

export const AvbrytUtkastDeltMedBrukerModal = ({ open, onConfirm, onCancel }: Props) => {
  const [aarsak, setAarsak] = useState<DeltakerStatusAarsakType | undefined>(undefined)
  const [annetTekst, setAnnetTekst] = useState<string | undefined>(undefined)
  const [hasError, setHasError] = useState<boolean>(false)

  const aarsakErAnnet = aarsak === DeltakerStatusAarsakType.ANNET
  const harAnnetText = annetTekst && annetTekst.length > 0

  const handleAvbrytUtkast = () => {
    if (aarsak) {
      if (!aarsakErAnnet || (aarsakErAnnet && harAnnetText)) {
        const request: AvbrytUtkastRequest = {
          aarsak: {
            type: aarsak,
            beskrivelse: annetTekst ?? null
          }
        }
        onConfirm(request)
      } else setHasError(true)
    } else setHasError(true)
  }

  return (
    <Modal open={open} header={{ heading: 'Vil du avbryte utkastet?' }} onClose={onCancel}>
      <Modal.Body>
        <BodyLong className="mb-4" size="small">
          Når du avbryter utkastet så får personen beskjed. Aktiviteten i aktivitetsplanen blir
          flyttet til avbrutt.
        </BodyLong>

        <RadioGroup
          legend="Hva er årsaken til at brukeren ikke skal meldes på?"
          size="small"
          onChange={(value: DeltakerStatusAarsakType) => {
            setAarsak(value)
            setHasError(false)
          }}
          error={hasError && !aarsakErAnnet && 'Du må velge en årsak før du kan fortsette.'}
        >
          {getDeltakerStatusAarsakTyperAsList().map((arsakType) => (
            <Radio value={arsakType} key={arsakType}>
              {getDeltakerStatusAarsakTypeText(arsakType)}
            </Radio>
          ))}
        </RadioGroup>

        {aarsak === DeltakerStatusAarsakType.ANNET && (
          <Textarea
            label={null}
            value={annetTekst}
            size="small"
            error={
              hasError && aarsakErAnnet && 'Du må fylle ut for årsak "annet" før du kan fortsette.'
            }
            onChange={(e) => {
              setAnnetTekst(e.target.value)
              setHasError(false)
            }}
            maxLength={50}
          />
        )}
      </Modal.Body>
      <ModalFooter
        confirmButtonText="Avbryt utkast"
        cancelButtonText="Nei, ikke avbryt utkastet"
        onConfirm={handleAvbrytUtkast}
        onCancel={onCancel}
      />
    </Modal>
  )
}
