import { DeltakerlisteDetaljer } from '../components/DeltakerlisteDetaljer'
import { DeltakerlisteTabell } from '../components/DeltakerlisteTabell'

export const DeltakerlistePage = () => {
  return (
    <div className="flex flex-row gap-8">
      <DeltakerlisteDetaljer />
      <DeltakerlisteTabell />
    </div>
  )
}
