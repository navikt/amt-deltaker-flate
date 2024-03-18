import { useParams } from 'react-router-dom'
import { useAppContext } from './AppContext.tsx'

const InngangSePaRediger = () => {
  const {deltakerId} = useParams()
  const {personident, enhetId} = useAppContext()

  return (
    <div>
      <h1>Inngang Se På/Rediger</h1>
      <div>Deltaker ID: {deltakerId}</div>
      <div>Personident: {personident}</div>
      <div>enhetId: {enhetId}</div>
    </div>
  )

  // if (deltakerId === undefined) {
  //   return (
  //     <Alert variant="error" className="mt-4 mb-4">
  //       <Heading size="small" spacing level="3">
  //                 Fant ikke deltakerens id i adressefeltet. Prøv å gå inn på nytt gjennom Modia.
  //       </Heading>
  //     </Alert>
  //   )
  // }
  //
  // const {
  //   data: pamelding,
  //   loading,
  //   error
  // } = useFetch(getPamelding, deltakerId!)
  //
  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <Loader size="3xlarge" title="Venter..."/>
  //     </div>
  //   )
  // }
  //
  // if (error || !pamelding) {
  //   return (
  //     <>
  //       {isEnvLocalDemoOrPr && <DemoBanner hasError/>}
  //       <Alert variant="error">
  //         <Heading spacing size="small" level="3">
  //                     Vi beklager, men noe gikk galt
  //         </Heading>
  //         {error}
  //       </Alert>
  //     </>
  //   )
  // }
  //
  // return (
  //   <PameldingContextProvider initialPamelding={pamelding}>
  //     {isEnvLocalDemoOrPr && <DemoBanner/>}
  //     <DeltakerGuard/>
  //   </PameldingContextProvider>
  // )

}

export default InngangSePaRediger
