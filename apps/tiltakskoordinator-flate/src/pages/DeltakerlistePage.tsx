import { DeltakerlisteDetaljer } from '../components/DeltakerlisteDetaljer'
import { DeltakerlisteTabell } from '../components/DeltakerlisteTabell'
import { useFocusPageLoad } from '../hooks/useFocusPageLoad'

export const DeltakerlistePage = () => {
  const { ref } = useFocusPageLoad('Deltakerliste')

  return (
    <div className="flex flex-row gap-16 p-4" data-testid="page_deltakerliste">
      <h2 className="sr-only" tabIndex={-1} ref={ref}>
        Deltakerliste - detaljer
      </h2>
      <DeltakerlisteDetaljer />
      <h2 className="sr-only">Deltakerliste</h2>
      <DeltakerlisteTabell />
    </div>
  )
}
