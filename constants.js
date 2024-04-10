import fs from 'fs'

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
export const AUTHTOKEN = 'x-auth-token'
export const PROJECT_NAME = 'envoix'
export const CONFIG_FILE = 'env-config.json'
export const SERVER_URL = config.SERVER_URL
export const ORIGIN = 'envoix-cli'
