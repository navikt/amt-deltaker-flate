import {Link} from 'react-router-dom'
import {APP, PAGE_2} from '../Routes.tsx'

export const Page1 = () => {
  return (
    <>
      <section>Page 1!</section>
      <Link to={PAGE_2}>Page 2</Link>
      <Link to={APP}>Main</Link>
    </>
  )
}
