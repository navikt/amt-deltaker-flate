export const isPrEvn = import.meta.env.MODE === 'pull-request'

export const useMock = ['development', 'demo'].includes(import.meta.env.MODE)

export const DIALOG_URL = import.meta.env.VITE_DIALOG_URL
export const AKTIVITETSPLAN_URL = import.meta.env.VITE_AKTIVITETSPLAN_URL
export const PERSONOPPLYSNINGER_URL = import.meta.env
  .VITE_PERSONOPPLYSNINGER_URL
export const API_URL = `${import.meta.env.BASE_URL}amt-deltaker-bff`
