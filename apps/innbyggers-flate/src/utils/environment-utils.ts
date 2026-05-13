export const isPrEvn = import.meta.env.MODE === 'pull-request'
export const useMock = false //['development', 'demo'].includes(import.meta.env.MODE)
export const isLocal = import.meta.env.DEV

export const DIALOG_URL = import.meta.env.VITE_DIALOG_URL
export const AKTIVITETSPLAN_URL = import.meta.env.VITE_AKTIVITETSPLAN_URL
export const API_URL = 'http://127.0.0.1:8080'
//export const API_URL = `${import.meta.env.BASE_URL}amt-deltaker-bff`
