import { env } from "../utils/env"

export const DB_NAME = env("DB_NAME")
export const DB_USER = env("DB_USER")
export const DB_PASS = env("DB_PASS")
export const DB_HOST = env("DB_HOST")
export const DB_PORT = +env("DB_PORT")
export const SERVER_PORT = +env("SERVER_PORT")
