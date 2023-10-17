import useSWRImmutable from "swr/immutable";
import { fetcher } from "./api/api";
import { apiUrl } from "./api/urls";

const Mikrofrontend = () => {
    const { data } = useSWRImmutable(apiUrl, fetcher);

  return (
    <>
      <h1>Påmelding {data && data?.emoji}</h1>
    </>
  )
}

export default Mikrofrontend
