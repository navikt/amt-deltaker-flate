import {
  AktivtForslag,
  AktivtForslagBox,
  ForslagInfo
} from 'deltaker-flate-common'

interface Props {
  forslag: AktivtForslag[]
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
