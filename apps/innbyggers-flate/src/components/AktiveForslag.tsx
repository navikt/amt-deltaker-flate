import { Forslag, AktivtForslagBox, ForslagInfo } from 'deltaker-flate-common'

interface Props {
  forslag: Forslag[]
}

export const AktiveForslag = ({ forslag }: Props) => {
  if (forslag.length === 0) return <></>
  return (
    <ForslagInfo>
      {forslag.map((f) => {
        return <AktivtForslagBox forslag={f} key={f.id} />
      })}
    </ForslagInfo>
  )
}
