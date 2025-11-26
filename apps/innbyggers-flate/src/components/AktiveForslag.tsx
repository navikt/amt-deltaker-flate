import { Forslag, AktivtForslagBox, ForslagInfo } from 'deltaker-flate-common'

interface Props {
  forslag: Forslag[]
  className?: string
}

export const AktiveForslag = ({ forslag, className }: Props) => {
  if (forslag.length === 0) return <></>
  return (
    <ForslagInfo className={className}>
      {forslag.map((f) => {
        return <AktivtForslagBox forslag={f} key={f.id} />
      })}
    </ForslagInfo>
  )
}
