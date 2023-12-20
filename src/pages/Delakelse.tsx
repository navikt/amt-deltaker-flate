import {AppLink} from '../components/AppLink.tsx'
import {PAMELDING_PAGE} from '../Routes.tsx'

export const Delakelse = () => {
  return (
    <>
      <div>Deltakelse Page</div>

      <AppLink path={PAMELDING_PAGE}>Påmelding</AppLink>
      <AppLink path="">Main</AppLink>
    </>
  )
}
