import { BodyLong, Button, HStack, Modal, Radio, RadioGroup, Textarea } from '@navikt/ds-react'
import { useState } from 'react'
import { AvbrytUtkastRequest } from '../../api/data/avbryt-utkast-request.ts'
import { DeltakerStatusAarsakType } from '../../api/data/pamelding'
import { getDeltakerStatusAarsakTyperAsList } from '../../utils/utils'
import { getDeltakerStatusAarsakTypeText } from '../../utils/displayText'

interface Props {
  open: boolean
  onConfirm: (request: AvbrytUtkastRequest) => void
  onCancel: () => void
}

export const AvbrytUtkastDeltMedBrukerModal = ({ open, onConfirm, onCancel }: Props) => {
  const [aarsak, setAarsak] = useState<DeltakerStatusAarsakType | undefined>(undefined)
  const [annetTekst, setAnnetTekst] = useState<string | undefined>(undefined)
  const confirmDisabled = () => {
    if (aarsak === DeltakerStatusAarsakType.ANNET) {
      return !(annetTekst && annetTekst.length > 0)
    }
    if (aarsak !== undefined) {
      return false
    } else {
      return true
    }
  }

  return (
    <Modal open={open} header={{heading: 'Vil du avbryte utkastet?'}} onClose={onCancel}>
      <Modal.Body>
        <BodyLong className="mb-4" size="small">
          Når du avbryter utkastet så får personen beskjed. Aktiviteten i aktivitetsplanen blir
          flyttet til avbrutt.
        </BodyLong>

        <RadioGroup
          legend="Hva er årsaken til at brukeren ikke skal meldes på?"
          size="small"
          onChange={(value: DeltakerStatusAarsakType) => setAarsak(value)}
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
            onChange={(e) => setAnnetTekst(e.target.value)}
            maxLength={50}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <HStack gap="4">
          <Button variant="secondary" size="small" onClick={onCancel}>
            Nei, ikke avbryt utkastet
          </Button>
          <Button
            size="small"
            onClick={() => {
              if (!aarsak) throw new Error('Grunn kan ikke være undefined')
              const request: AvbrytUtkastRequest = {
                aarsak: {
                  type: aarsak,
                  beskrivelse: annetTekst ?? null
                }
              }
              onConfirm(request)
            }}
            disabled={confirmDisabled()}
          >
            Avbryt utkast
          </Button>
        </HStack>
      </Modal.Footer>
    </Modal>
  )
}
