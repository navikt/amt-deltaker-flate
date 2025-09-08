import { Heading } from '@navikt/ds-react'
import {
  AktivtForslagBox,
  EndringerWrapper,
  Forslag
} from 'deltaker-flate-common'
import { ReactNode, useState } from 'react'
import type { UlestHendelse } from '../../api/data/ulestHendelse'
import { UlestHendelseBox } from './UlestHendelse'

interface Props {
  forslag: Forslag[]
  ulesteHendelser: UlestHendelse[]
  children?: ReactNode
}
export function DeltakerEndringer({
  forslag,
  ulesteHendelser: initialUlesteHendelser,
  children
}: Props) {
  const [ulesteHendelser, setUlesteHendelser] = useState(initialUlesteHendelser)

  if (ulesteHendelser.length <= 0 && forslag.length <= 0) {
    return <></>
  }

  return (
    <EndringerWrapper className="mt-4 flex flex-col gap-4">
      {forslag.length > 0 && (
        <div>
          <Heading level="2" size="small" className="mb-2">
            Arrangør foreslår en endring:
          </Heading>
          {forslag.map((f) => {
            return <AktivtForslagBox forslag={f} key={f.id} />
          })}
        </div>
      )}

      {ulesteHendelser.length > 0 && (
        <div>
          <Heading level="2" size="small" className="mb-2">
            Oppdateringer fra nav:
          </Heading>
          <div className="flex flex-col gap-4">
            {ulesteHendelser.map((ulestHendelse) => (
              <UlestHendelseBox
                key={ulestHendelse.id}
                ulestHendelse={ulestHendelse}
                onMarkerSomLestUtfort={() => {
                  setUlesteHendelser((prev) =>
                    prev.filter((h) => h.id !== ulestHendelse.id)
                  )
                }}
              />
            ))}
          </div>
        </div>
      )}

      {children}
    </EndringerWrapper>
  )
}
