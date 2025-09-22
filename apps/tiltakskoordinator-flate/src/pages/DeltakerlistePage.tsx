import { DeltakerlisteDetaljer } from '../components/DeltakerlisteDetaljer'
import { DeltakerlisteTabell } from '../components/deltaker-liste-tabell/DeltakerlisteTabell'
import { FilterDeltakerliste } from '../components/filter-deltakerliste/FilterDeltakerliste'
import { useFocusPageLoad } from '../hooks/useFocusPageLoad'

export const DeltakerlistePage = () => {
  const { ref } = useFocusPageLoad('Deltakerliste')

  return (
    <div className="flex flex-wrap p-4 pt-0" data-testid="page_deltakerliste">
      <div className="flex flex-col max-w-[20rem] md:max-w-[15rem] mr-0 md:mr-8">
        <h2 className="sr-only" tabIndex={-1} ref={ref}>
          Deltakerliste - detaljer
        </h2>
        <DeltakerlisteDetaljer />
        <FilterDeltakerliste className="mt-6 min-w-[15rem]" />
      </div>

      <div>
        <h2 className="sr-only">Deltakerliste</h2>
        <DeltakerlisteTabell />
      </div>
    </div>
  )
}
