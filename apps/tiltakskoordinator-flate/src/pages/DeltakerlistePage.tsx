import { DeltakerlisteDetaljer } from '../components/DeltakerlisteDetaljer'
import { DeltakerlisteTabell } from '../components/deltaker-liste-tabell/DeltakerlisteTabell'
import { HandlingerKnapp } from '../components/HandlingerKnapp'
import { useFocusPageLoad } from '../hooks/useFocusPageLoad'

export const DeltakerlistePage = () => {
  const { ref } = useFocusPageLoad('Deltakerliste')

  return (
    <div className="flex flex-col">
      <HandlingerKnapp className="place-self-end mr-4 mt-2 mb-2" />
      <div
        className="flex md:flex-row flex-col gap-16 p-4 pt-0"
        data-testid="page_deltakerliste"
      >
        <h2 className="sr-only" tabIndex={-1} ref={ref}>
          Deltakerliste - detaljer
        </h2>
        <DeltakerlisteDetaljer />
        <h2 className="sr-only">Deltakerliste</h2>
        <DeltakerlisteTabell />
      </div>
    </div>
  )
}
