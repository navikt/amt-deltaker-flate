import {Link} from 'react-router-dom'

export const Page2 = () => {
  return (
    <>
      <section>Page 2!</section>
      <Link to="/page1">Page 1</Link>
      <Link to="/">Main</Link>
    </>
  )
}
