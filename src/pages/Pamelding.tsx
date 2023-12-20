import {AppLink} from '../components/AppLink.tsx'
import {DELTAKELSE_PAGE} from '../Routes.tsx'

export const Pamelding = () => {
  return (
    <>
      <div>Påmelding Page</div>
      <AppLink path={DELTAKELSE_PAGE}>Deltakelse</AppLink>
      <AppLink path="">Main</AppLink>
    </>
  )
}
