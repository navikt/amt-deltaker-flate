import { createAmtDeltakerBffBaseUrl } from 'deltaker-flate-common'

export const isPrEnv = import.meta.env.MODE === 'pull-request'
export const useMock = ['development', 'demo'].includes(import.meta.env.MODE)
export const isEnvLocalDemoOrPr = useMock || isPrEnv

export const DIALOG_URL = import.meta.env.VITE_DIALOG_URL
export const API_URL = createAmtDeltakerBffBaseUrl(import.meta.env.BASE_URL)
