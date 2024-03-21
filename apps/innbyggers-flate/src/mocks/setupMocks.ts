import { setupWorker } from 'msw/browser'
import { delay, http } from 'msw'
import { MockHandler } from './MockHandler.ts'
import { DeltakerStatusType } from '../api/data/deltaker.ts'

const handler = new MockHandler()

export const worker = setupWorker(
  http.post('mock/setup/status/:status', async ({ params }) => {
    const { status } = params

    const response = handler.setStatus(status as DeltakerStatusType)
    return response
  }),
  http.get('mock/innbygger/:deltakerId', async () => {
    await delay(1000)
    return handler.getDeltaker()
  })
)
