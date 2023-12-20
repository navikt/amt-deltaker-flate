import {Link} from 'react-router-dom'

export const Page1 = () => {
  return (
    <>
      <section>Page 1!</section>
      <Link to="/page2">Page 2</Link>
      <Link to="/">Main</Link>
    </>
  )
}
