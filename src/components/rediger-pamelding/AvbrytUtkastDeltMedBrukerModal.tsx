import { BodyLong, Button, HStack, Modal, Radio, RadioGroup, Textarea } from '@navikt/ds-react'
import { useState } from 'react'
import { AvbrytUtkastGrunn, AvbrytUtkastRequest } from '../../api/data/avbryt-utkast-request.ts'
import { IkkeAktuellRequest } from '../../api/data/endre-deltakelse-request.ts'

interface Props {
  open: boolean
  onConfirm: (request: AvbrytUtkastRequest) => void
  onCancel: () => void
}

export const AvbrytUtkastDeltMedBrukerModal = (
  {open, onConfirm, onCancel}: Props
) => {
  const [grunn, setGrunn] = useState<AvbrytUtkastGrunn | undefined>(undefined)
  const [annetTekst, setAnnetTekst] = useState<string | undefined>(undefined)
  const confirmDisabled = () => {
    if (grunn === AvbrytUtkastGrunn.ANNET) {
      return !(annetTekst && annetTekst.length > 0)
    }
    if (grunn !== undefined) {
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
          onChange={(value: AvbrytUtkastGrunn) => setGrunn(value)}
        >
          <Radio value={AvbrytUtkastGrunn.FATT_JOBB}>Fått jobb</Radio>
          <Radio value={AvbrytUtkastGrunn.SYK}>Syk</Radio>
          <Radio value={AvbrytUtkastGrunn.TRENGER_ANNEN_HJELP_STOTTE}>
            Trenger annen hjelp og støtte
          </Radio>
          <Radio value={AvbrytUtkastGrunn.UTDANNING}>Utdanning</Radio>
          <Radio value={AvbrytUtkastGrunn.FEILREGISTRERT}>Feilregistrert</Radio>
          <Radio value={AvbrytUtkastGrunn.ANNET}>Annet - fyll ut</Radio>
        </RadioGroup>

        {grunn === AvbrytUtkastGrunn.ANNET && (
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
              if (!grunn) throw new Error('Grunn kan ikke være undefined')
              const request: IkkeAktuellRequest = {
                aarsak: {
                  type: grunn,
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
