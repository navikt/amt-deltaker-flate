import { useParams } from 'react-router-dom'
import { useAppContext } from './AppContext.tsx'

const InngangMeldPa = () => {
  const {deltakerListeId} = useParams()
  const {personident, enhetId} = useAppContext()

  return (
    <div>
      <h1>Inngang Meld på</h1>
      <div>Deltakerliste ID: {deltakerListeId}</div>
      <div>Personident: {personident}</div>
      <div>enhetId: {enhetId}</div>
    </div>
  )
}

export default InngangMeldPa
