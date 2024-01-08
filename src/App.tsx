import {MeldPaOrRedigerGuard} from './guards/MeldPaOrRedigerGuard.tsx'

const App = () => {

  return (
    <div>
      <MeldPaOrRedigerGuard/>

      {/*<Button variant="tertiary" size="small" className="my-2" onClick={avbrytPamelding}>*/}
      {/*  Avbryt påmelding*/}
      {/*</Button>*/}
      {/*<AppLink path={PAMELDING_PAGE}>Påmelding</AppLink>*/}
      {/*<AppLink path={DELTAKELSE_PAGE}>Deltakelse</AppLink>*/}
    </div>
  )
}

export default App
