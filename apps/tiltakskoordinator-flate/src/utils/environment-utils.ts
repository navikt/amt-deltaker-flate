export const isPrEnv = import.meta.env.MODE === 'pull-request'
export const useMock = ['development', 'demo'].includes(import.meta.env.MODE)
export const isEnvLocalDemoOrPr = useMock || isPrEnv

export const API_URL = `${import.meta.env.BASE_URL}amt-deltaker-bff`
