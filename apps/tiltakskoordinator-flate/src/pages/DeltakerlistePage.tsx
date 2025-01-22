import { DeltakerlisteDetaljer } from '../components/DeltakerlisteDetaljer'
import { DeltakerlisteTabell } from '../components/DeltakerlisteTabell'

export const DeltakerlistePage = () => {
  return (
    <div className="flex flex-row gap-16 p-4" data-testid="page_deltakerliste">
      <DeltakerlisteDetaljer />
      <DeltakerlisteTabell />
    </div>
  )
}
