import {AppLink} from '../components/AppLink.tsx'

export const Page1 = () => {
  return (
    <>
      <section>Page 1!</section>
      <AppLink path="page2">Page 2</AppLink>
      <AppLink path="">Main</AppLink>
    </>
  )
}
