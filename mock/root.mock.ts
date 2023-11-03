import {MockHandler} from 'vite-plugin-mock-server'

const mocks: MockHandler[] = [
  {
    pattern: '/api/endpoint',
    method: 'get',
    handle: (_, res) => {
      res.end({
        emoji: '😊 🎉',
      })
    }
  }
]

export default mocks
