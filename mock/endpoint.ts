import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/endpoint',
    method: 'get',
    response: () => {
      return {
        emoji: '😊 🎉'
      }
    }
  }
] as MockMethod[]
