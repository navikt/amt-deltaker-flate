import {
  DELTAKELSESOVERSIKT_LINK,
  useModiaLink
} from '../hooks/useModiaLink.ts'

const RedirectToDeltakeroversikt = () => {
  const { doRedirect } = useModiaLink()

  doRedirect(DELTAKELSESOVERSIKT_LINK)

  return <></>
}

export default RedirectToDeltakeroversikt
