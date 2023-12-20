import {Link} from 'react-router-dom'
import {APP, PAGE_1} from '../Routes.tsx'

export const Page2 = () => {
  return (
    <>
      <section>Page 2!</section>

      <Link to={PAGE_1}>Page 1</Link>
      <Link to={APP}>Main</Link>
    </>
  )
}
