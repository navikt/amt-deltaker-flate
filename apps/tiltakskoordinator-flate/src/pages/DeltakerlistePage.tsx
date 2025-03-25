import { DeltakerlisteDetaljer } from '../components/DeltakerlisteDetaljer'
import { DeltakerlisteTabell } from '../components/deltaker-liste-tabell/DeltakerlisteTabell'
import { HandlingContextProvider } from '../context-providers/HandlingContext'
import { useFocusPageLoad } from '../hooks/useFocusPageLoad'

export const DeltakerlistePage = () => {
  const { ref } = useFocusPageLoad('Deltakerliste')

  return (
    <div className="flex flex-col">
      <div
        className="flex md:flex-row flex-col gap-16 p-4 pt-0"
        data-testid="page_deltakerliste"
      >
        <h2 className="sr-only" tabIndex={-1} ref={ref}>
          Deltakerliste - detaljer
        </h2>
        <DeltakerlisteDetaljer />

        <h2 className="sr-only">Deltakerliste</h2>
        <HandlingContextProvider>
          <DeltakerlisteTabell />
        </HandlingContextProvider>
      </div>
    </div>
  )
}
