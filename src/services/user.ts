import { registerType, SigninType, SignupType } from "@/utils/types"

export const logIn = async ({ email, password }: SigninType) => {
  const response = await fetch(process.env.APP_URL + `/api/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const signUp = async ({
  email,
  password,
  name,
  retypePassword,
  companyId
}: SignupType) => {
  const response = await fetch(process.env.APP_URL + `/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name, retypePassword, companyId }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const register = async ({
  name,
  email,
  password,
  retypedPassword
}: registerType) => {
  const response = await fetch(process.env.APP_URL + `/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, retypedPassword, password }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}
