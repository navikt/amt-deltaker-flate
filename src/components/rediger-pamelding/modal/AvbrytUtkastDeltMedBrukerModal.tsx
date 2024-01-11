import {BodyLong, Button, HStack, Modal, Radio, RadioGroup, Textarea} from '@navikt/ds-react'
import {useState} from 'react'

export enum AvbrytUtkastGrunn {
    FATT_JOBB = 'FATT_JOBB',
    SYK = 'SYK',
    TRENGER_ANNEN_HJELP_STOTTE = 'TRENGER_ANNEN_HJELP_STOTTE',
    UTDANNING = 'UTDANNING',
    FEILREGISTRERT = 'FEILREGISTRERT',
    ANNET = 'ANNET'
}

interface Props {
    open: boolean
    onConfirm: (grunn: AvbrytUtkastGrunn, annetTekst: string | undefined) => void
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
    <Modal
      open={open}
      header={{heading: 'Vil du avbryte utkastet?'}}
      onClose={onCancel}
    >
      <Modal.Body>
        <BodyLong className="mb-4">
                    Når du avbryter utkastet så får personen beskjed. Aktiviteten i aktivitetsplanen blir flyttet til
                    avbrutt.
        </BodyLong>

        <RadioGroup
          legend="Hva er årsaken til at brukeren ikke skal meldes på?"
          onChange={(value: AvbrytUtkastGrunn) => setGrunn(value)}
        >
          <Radio value={AvbrytUtkastGrunn.FATT_JOBB}>Fått jobb</Radio>
          <Radio value={AvbrytUtkastGrunn.SYK}>Syk</Radio>
          <Radio value={AvbrytUtkastGrunn.TRENGER_ANNEN_HJELP_STOTTE}>Trenger annen hjelp og støtte</Radio>
          <Radio value={AvbrytUtkastGrunn.UTDANNING}>Utdanning</Radio>
          <Radio value={AvbrytUtkastGrunn.FEILREGISTRERT}>Feilregistrert</Radio>
          <Radio value={AvbrytUtkastGrunn.ANNET}>Annet - fyll ut</Radio>
        </RadioGroup>

        {grunn === AvbrytUtkastGrunn.ANNET && (
          <Textarea
            label={null}
            value={annetTekst}
            onChange={(e) => setAnnetTekst(e.target.value)}
            maxLength={50}
          />
        )}

      </Modal.Body>
      <Modal.Footer>
        <HStack gap="4">
          <Button type="button" variant="secondary" onClick={onCancel}>
                        Nei, ikke avbryt utkastet
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (!grunn) throw new Error('Grunn kan ikke være undefined')
              onConfirm(grunn, annetTekst)
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
