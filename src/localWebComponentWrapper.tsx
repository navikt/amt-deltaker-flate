import React, {useState} from 'react'
import {APPLICATION_WEB_COMPONENT_NAME} from './constants.ts'
import {Button, TextField} from '@navikt/ds-react'

const webComponent = (personident: string, deltakerlisteId: string) => {
  return React.createElement(APPLICATION_WEB_COMPONENT_NAME, {
    personident: personident,
    deltakerlisteId: deltakerlisteId
  })
}

interface WebComponentInputHandlerProps {
    personidentHandler: (newPersonident: string) => void,
    deltakerlisteIdHandler: (newDeltakerlisteId: string) => void,
}

const WebComponentInputHandler = ({personidentHandler, deltakerlisteIdHandler}: WebComponentInputHandlerProps) => {
  const [personident, setPersonident] = useState<string>('')
  const [deltakerlisteId, setDeltakerlisteId] = useState<string>('')
  const changehandler = () => {
    personidentHandler('12345678910')
    deltakerlisteIdHandler('6b6578eb-eae0-4ad7-8a69-79db3cea4f64')
  }

  return (
    <div className="flex h-screen">
      <div className="m-auto flex-col">
        <section className="border-2 p-6 space-y-4">
          <h1 className="font-bold text-2xl">Dette er en testside for amt-deltaker-flate.</h1>
          <TextField
            label="Personident"
            description="Legg inn en personident (fødselsnummer etc)"
            type="number"
            value={personident}
            onChange={e => setPersonident(e.target.value)}
          />

          <TextField
            label="Deltakerliste id"
            description="Legg inn en deltakerlisteid (uuid)"
            value={deltakerlisteId}
            onChange={e => setDeltakerlisteId(e.target.value)}
          />

          <Button
            className="justify-self-end border-2"
            onClick={changehandler}
            disabled={personident === '' || deltakerlisteId === ''}
          >Gå til deltaker</Button>
        </section>
      </div>
    </div>
  )
}

const LocalWebComponentWrapper = () => {
  const [personident, setPersonident] = useState<string | undefined>(undefined)
  const [deltakerlisteId, setDeltakerlisteId] = useState<string | undefined>(undefined)

  return (
    <>
      {(!personident || !deltakerlisteId) &&
                <WebComponentInputHandler
                  personidentHandler={setPersonident}
                  deltakerlisteIdHandler={setDeltakerlisteId}/>
      }

      {(personident && deltakerlisteId) && webComponent(personident, deltakerlisteId)}
    </>
  )
}

export default LocalWebComponentWrapper
