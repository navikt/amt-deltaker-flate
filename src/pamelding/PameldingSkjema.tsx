import { Button, Checkbox, CheckboxGroup, HStack, Textarea, VStack } from '@navikt/ds-react'
import { Tiltakstype, type Mal } from '../api/data/pamelding'
import { useState } from 'react'
import { MeldPaDirekteModal } from './MeldPaDirekteModal'
import { BAKGRUNNSINFO_MAX_TEGN, BESKRIVELSE_MAX_TEGN, MAL_TYPE_ANNET } from '../utils'
import { Deltakelsesprosent } from './Deltakelsesprosent'

export interface PameldingSkjemaProps {
  tiltakstype: Tiltakstype
  mal: Array<Mal>
  bakgrunnsinformasjon?: string
  deltakelsesprosent?: number
  dagerPerUke?: number
}

export const PameldingSkjema = ({
  tiltakstype,
  mal,
  bakgrunnsinformasjon,
  deltakelsesprosent,
  dagerPerUke
}: PameldingSkjemaProps) => {
  const [beskrivelse, setBeskrivelse] = useState<string>(
    mal.find((e) => e.type === MAL_TYPE_ANNET)?.beskrivelse ?? ''
  )
  const [nyBakgrunnsinformasjon, settBakgrunnsinformasjon] = useState<string>(
    bakgrunnsinformasjon ?? ''
  )

  const [valgteMal, setValgteMal] = useState<Array<string>>(
    mal.filter((e) => e.valgt).map((e) => e.type)
  )
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  return (
    <VStack gap="8" as={'form'}>
      <CheckboxGroup
        legend="Hva er målet med deltakelsen?"
        onChange={setValgteMal}
        size="small"
        value={valgteMal}
        aria-required
      >
        {mal.map((e) => (
          <Checkbox key={e.type} value={e.type}>
            {e.visningstekst}
          </Checkbox>
        ))}
        {valgteMal.find((e) => e === MAL_TYPE_ANNET) && (
          <Textarea
            minRows={1}
            rows={1}
            size="small"
            label={null}
            value={beskrivelse}
            maxLength={BESKRIVELSE_MAX_TEGN}
            aria-label={MAL_TYPE_ANNET}
            onChange={(e) => setBeskrivelse(e.target.value)}
            aria-required
          />
        )}
      </CheckboxGroup>

      <Textarea
        label="Bakgrunnsinformasjon (valgfritt)"
        description="Hvis det er noe viktig med brukers livssituasjon som kommer til å påvirke deltakelsen på tiltaket kan du skrive dette her. Dette vises til bruker og tiltaksarrangør."
        value={nyBakgrunnsinformasjon}
        size="small"
        maxLength={BAKGRUNNSINFO_MAX_TEGN}
        minRows={1}
        rows={1}
        onChange={(e) => settBakgrunnsinformasjon(e.target.value)}
      />

      {(tiltakstype === Tiltakstype.VASV || tiltakstype === Tiltakstype.ARBFORB) && (
        <Deltakelsesprosent deltakelsesprosent={deltakelsesprosent} dagerPerUke={dagerPerUke} />
      )}

      <MeldPaDirekteModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <HStack gap="4">
        <Button size="small">Send som forslag</Button>
        <Button size="small" variant="secondary" onClick={() => setModalOpen(true)}>
          Meld på uten å sende forslag
        </Button>
      </HStack>
    </VStack>
  )
}
