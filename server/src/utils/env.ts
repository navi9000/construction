import { config } from "dotenv"

config()

export function env(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`No parameter ${name}`)
  }
  return value
}
