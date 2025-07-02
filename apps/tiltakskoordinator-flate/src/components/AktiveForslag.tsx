import { AktivtForslagBox, Forslag, ForslagInfo } from 'deltaker-flate-common'

interface Props {
  forslag: Forslag[]
}

export const AktiveForslag = ({ forslag }: Props) => {
  if (forslag.length === 0) return <></>
  return (
    <div className="mb-4">
      <ForslagInfo>
        {forslag.map((f) => {
          return <AktivtForslagBox forslag={f} key={f.id} />
        })}
      </ForslagInfo>
    </div>
  )
}
