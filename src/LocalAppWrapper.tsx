import ReactDOM from 'react-dom/client'
import React, {useState} from 'react'
import {APPLICATION_WEB_COMPONENT_NAME} from './constants.ts'
import {Button, TextField} from '@navikt/ds-react'
import {getCurrentMode} from './utils/environment-utils.ts'
import '@navikt/ds-css'
import './tailwind.css'
import './index.css'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'

const renderWebComponent = (personident: string, deltakerlisteId: string, enhetId: string) => {
  return React.createElement(APPLICATION_WEB_COMPONENT_NAME, {
    'data-personident': personident,
    'data-deltakerlisteId': deltakerlisteId,
    'data-enhetId': enhetId
  })
}

interface WebComponentInputHandlerProps {
    personidentHandler: (newPersonident: string) => void
    deltakerlisteIdHandler: (newDeltakerlisteId: string) => void
    enhetIdHandler: (newEnhetId: string) => void
}

const LocalAppWapperRoutes = ({
  personidentHandler,
  deltakerlisteIdHandler,
  enhetIdHandler
}: WebComponentInputHandlerProps) => {
  return (
    <Routes>
      <Route path={'/'}
        element={<WebComponentInputHandler personidentHandler={personidentHandler}
          deltakerlisteIdHandler={deltakerlisteIdHandler}
          enhetIdHandler={enhetIdHandler}/>}/>
      <Route path={'*'} element={<Navigate replace to={'/'}/>}/>
    </Routes>
  )
}

const WebComponentInputHandler = ({
  personidentHandler,
  deltakerlisteIdHandler,
  enhetIdHandler
}: WebComponentInputHandlerProps) => {

  const [personident, setPersonident] = useState<string>('29418716256')
  const [deltakerlisteId, setDeltakerlisteId] = useState<string>(
    '3fcac2a6-68cf-464e-8dd1-62ccec5933df'
  )
  const [enhetId, setEnhetId] = useState<string>('Enhet1')

  const changehandler = () => {
    personidentHandler(personident)
    deltakerlisteIdHandler(deltakerlisteId)
    enhetIdHandler(enhetId)
  }

  return (
    <div className="flex h-screen">
      <div className="m-auto flex-col">
        <section className="border-2 p-6 space-y-4">
          <h1 className="font-bold text-2xl">Dette er en testside for amt-deltaker-flate.</h1>
          <p>Denne versjonen kjører i {getCurrentMode()} modus</p>
          <TextField
            label="Personident"
            description="Legg inn en personident (fødselsnummer etc)"
            type="number"
            value={personident}
            onChange={(e) => setPersonident(e.target.value)}
          />

          <TextField
            label="Deltakerliste id"
            description="Legg inn en deltakerlisteid (uuid)"
            value={deltakerlisteId}
            onChange={(e) => setDeltakerlisteId(e.target.value)}
          />

          <TextField
            label="Enhet id"
            description="Legg inn enhetsid"
            value={enhetId}
            onChange={(e) => setEnhetId(e.target.value)}
          />

          <Button
            className="justify-self-end border-2"
            onClick={changehandler}
            disabled={personident === '' || deltakerlisteId === ''}
          >
                        Gå til deltaker
          </Button>
        </section>
      </div>
    </div>
  )
}

const LocalAppWrapper = () => {
  const [personident, setPersonident] = useState<string | undefined>(undefined)
  const [deltakerlisteId, setDeltakerlisteId] = useState<string | undefined>(undefined)
  const [enhetId, setEnhetId] = useState<string | undefined>(undefined)

  return (
    <>
      {(!personident || !deltakerlisteId || !enhetId) && (
        <BrowserRouter>
          <LocalAppWapperRoutes
            personidentHandler={setPersonident}
            deltakerlisteIdHandler={setDeltakerlisteId}
            enhetIdHandler={setEnhetId}/>
        </BrowserRouter>
      )}

      {personident &&
                deltakerlisteId &&
                enhetId &&
                renderWebComponent(personident, deltakerlisteId, enhetId)}
    </>
  )
}

export const renderAsReactRoot = (appElement: HTMLElement) => {
  const rootElement = ReactDOM.createRoot(appElement)

  rootElement.render(<LocalAppWrapper/>)
}
