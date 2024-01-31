import {MeldPaOrRedigerGuard} from './guards/MeldPaOrRedigerGuard.tsx'
import 'dayjs/locale/nb'
import dayjs from 'dayjs'

dayjs.locale('nb')

const App = () => {

  return <MeldPaOrRedigerGuard />
}

export default App
