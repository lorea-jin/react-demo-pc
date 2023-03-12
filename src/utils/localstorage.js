const TOKEN_KEY = 'yes-mola-token'

export function SetToken(token) {
  return localStorage.setItem(TOKEN_KEY, token)
}

export function GetToken(token) {
  return localStorage.getItem(TOKEN_KEY)
}

export function HasToken() {
  return !!GetToken()
}

export function RemoveToken() {
  localStorage.removeItem(TOKEN_KEY)
}
